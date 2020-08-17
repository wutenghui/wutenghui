// 实现这个项目的构建任务
// registry=https://registry.npm.taobao.org/
// 导入 gulp API
/*
  gulp 的 API
    src 读取
    dest 写入
    parallel 同步执行
    series 异步执行
    watch 自动监视文件路径的通配符，并通过文件变化决定是否去重新执行某任务
*/
const { src, dest, parallel, series, watch } = require('gulp')
// 导入 sass 插件
// const sass = require('gulp-sass')
// 脚本编译开发依赖
// const babel = require('gulp-babel')
// 页面模板编译
// const swig = require('gulp-swig')
// 图片转换
// const imagemin = require('gulp-imagemin')

const del = require('del')

// 引用开发服务器
const browserSync = require('browser-sync')
// 定义变量 自动创建一个开发服务器，定义到代码中
const bs = browserSync.create()


/*
  自动加载插件
    yarn add gulp-load-plugins --dev

  可以吧最初下载加载插件自动加载
  使用时 在原命名前加上定义的  plugins 对象
*/

// 导出的是一个方法
const loadplugins = require('gulp-load-plugins')
// 通过 loadplugins 方法 得到 plugins 对象
const plugins = loadplugins()

/*
  自动清除插件模块  单独插件
    yarn add del --dev
*/
const clean = () => {
  return del(['dist', 'temp']) // 临时文件放到 temp 中
}
/*****************************************************/

// 样式编译
const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' }) // 读取文件  base 选项参数 准换时的基准路径 会把除src 后边的文件保存下载
    // sass 工作中会把(下划线开头的样式文件) _.文件名.sass的文件作为 都是我们在主文件当中依赖的文件，不会被转换被忽略到
    .pipe(plugins.sass({ outputStyle: 'expanded' }))  // 进行编译sass样式 转换为 css 样式 ,  { outputStyle: 'expanded' } 完全展开的格式
    .pipe(dest('temp'))  // 文件写入 临时放入 temp 中
    .pipe(bs.reload({ stream: true })) // 把信息推送到浏览器
}

/*****************************************************/

// 脚本编译
/*
    安装脚本编译开发依赖  yarn add gulp-babel --dev
    安装转换模块 
        yarn add @babel/core @babel/preset-env --dev
    实际转换是 babel 里的插件  @babel/preset-env是整体的打包

*/
const script = () => {
  return src('src/assets/scripts/*.js', { base: 'src' }) // 读取文件
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] })) // 编译
    .pipe(dest('temp'))  // 文件写入 临时放入 temp 中
    .pipe(bs.reload({ stream: true })) // 把信息推送到浏览器
}

/*****************************************************/

// 页面模板编译
// 设置html读取内容
const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}
/*
  yarn add gulp-swig --dev
*/
const page = () => {
  return src('src/*.html', { base: 'src' })  //  读取 src 文件下html文件
    .pipe(plugins.swig({ data }))     // 编译
    .pipe(dest('temp'))  // 文件写入 临时放入 temp 中
    .pipe(bs.reload({ stream: true })) // 把信息推送到浏览器
}
/*****************************************************/

// 图片与字体文件的转换

/*
    安装图片转换插件  yarn add gulp-imagemin --dev
*/
const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

/*****************************************************/

// 其他文件及文件清除
const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}

/*****************************************************/

// 开发服务器
const server = () => {
  // watch  监视路径
  // 样式文件监视
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  watch('src/*.html', page)

  // 图片文字的监视可以在 baseDir 原文件进行构建
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload)

  bs.init({
    // server 中需要去指定网站的根目录
    server: {
      // baseDir: 'dist',
      // 一步一步去找 先找临时文件
      baseDir: ['temp', 'src', 'public '],
      // 指定配置 相对路径  路由映射
      routes: {
        '/node_modules': 'node_modules'
      }
    },
    // 关闭提示
    notify: false,

    // browser-sync的端口 选项
    port: 2000,

    // 浏览器是否自动打开
    // open: false,

    // 这个参数可以指定一个字符串，用来去被 browser-sync 启动过后的监听的路径通配符
    // files: 'dist/**' 
    // Cache: false  swig 模块殷勤缓存机制有可能导致页面不会变化 修改 cache为false 
  }) // 初始化 web服务器的相关配置

}

/*
  useref 文件引用处理
    useref 插件 自动处理html中的一些构建注释
    安装插件  yarn add gulp-useref --dev
    原理：  主要是 css 和 js  
      将开始标签和结束标签中间引入的文件最终打包到一个文件当中  assets/styles/vendor.css
      <!-- build:css assets/styles/vendor.css -->
      <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css">
      <!-- endbuild -->
      转换之后为
      <link rel="stylesheet" href="assets/styles/vendor.css">
      把多个文件合并到一个里
*/
const useref = () => {
  return src('temp/*.html',{ base: 'temp'})
    .pipe(plugins.useref({ searchPath: ['temp', '.'] })) // 把构建注释 转换
    /*
      html js css 压缩
      gulp-htmlmin 压缩html
      gulp-uglify 压缩js
      gulp-clean-css 压缩css
          安装插件 yarn add gulp-htmlmin gulp-uglify gulp-clean-css --dev
      判断是什么文件进行什么操作
        安装插件 yarn add gulp-if --dev
    */
    .pipe(plugins.if(/\.js$/, plugins.uglify()))  // 正则表达式 标识是否已.js结尾$   /\.js$/
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))  // css
    .pipe(plugins.if(/\.html$/, plugins.htmlmin( 
      { 
        collapseWhitespace: true,  // 自动压缩空白字符和换行符 
        minifyCSS: true, // 自动压缩css
        minifyJS: true  // 自动压缩js
      }   
      )))  // html   
    .pipe(dest('dist'))
}





// 组合任务 同步执行
const compile = parallel(style, script, page)
// 组合任务 顺序执行  上线之前执行的任务
const build = series(
  clean, 
  parallel(
    series(compile,useref), 
    image, 
    font, 
    extra
  )
)

// 按照顺序执行 
const develop = series(compile, server)

// 私有任务导出 临时导出，测试用
module.exports = {
  // 放在 package.js 中 更容易理解
      clean,
      build,
      develop

  // clean,
  // compile,
  // // style, script, page, image, font,
  // build,
  // develop,
  // useref
}



/*
  开发服务器
    安装模块  这个模块会提供一个开发服务器
      yarn add browser-sync --dev
    引用模块

*/