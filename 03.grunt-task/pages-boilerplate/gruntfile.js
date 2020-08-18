// Grunt 的入口文件
// 用户定义一些需要 Grunt 自动执行的任务
// 需要导出一个函数
// 次函数接收一个 grunt 的形参，内部提供一些创建任务时可以用到的 API
/*
    grunt --help 可以获取grunt的帮助信息
*/

// css转换
const sass = require('sass')

const loadGruntTasks = require('load-grunt-tasks')


// 
module.exports = grunt => {

    /*
        编译scss文件转换为css
            grunt-sass 需要一个模块支持 sass官方
            安装插件  yarn add grunt-sass sass --dev
        grunt-sass 是一个多目标任务
    */
    grunt.initConfig({
        // sass: {
        //     options: {
        //         // sourceMap: true , 
        //         implementation: sass ,
        //         /*
        //             嵌套输出方式 nested
        //             展开输出方式 expanded 
        //             紧凑输出方式 compact 
        //             压缩输出方式 compressed
        //         */
        //         outputStyle: 'compressed' // 压缩输出
        //     },
        //     main: { // main 中需要去指定 sass 的 输入文件和 输出的css文件目标路径
        //         files: {
        //             'dist/assets/styles/main.css': 'src/assets/styles/main.scss'
        //         }
        //     }

        // },
        sass: {
            options: {
                // sourceMap: true , 
                implementation: sass ,
                /*
                    嵌套输出方式 nested
                    展开输出方式 expanded 
                    紧凑输出方式 compact 
                    压缩输出方式 compressed
                */
                outputStyle: 'compressed' // 压缩输出
            },
            main: {
            // 'dist/assets/styles/main.css': 'src/assets/styles/main.scss'
            expand: true,// 如果设为true，就表示下面文件名的占位符（即*号）都要扩展成具体的文件名。
            cwd: 'src/assets/styles', // 读取文件的文件夹
            src: '*.scss', // 读取的文件
            dest: 'dist/assets/styles', // 输出的文件目标路径
            ext: '.css'  // 输出的文件名称
              
            }
        },
        babel:  {
            options: {
                presets: ['@babel/preset-env'], // ES6代码转换为ES5
            } ,
            main: {
                    // 'dist/assets/scripts/main.js': 'src/assets/scripts/main.js'
                    expand: true,// 如果设为true，就表示下面文件名的占位符（即*号）都要扩展成具体的文件名。
                    cwd: 'src/assets/scripts', // 读取文件的文件夹
                    src: '*.js', // 读取的文件
                    dest: 'dist/assets/scripts', // 输出的文件目标路径
                    ext: '.js'  // 输出的文件名称     
            }
        },
        // html 插件 yarn add grunt-contrib-htmlmin --dev
        // 安装编译插件 
         // 编译html  yarn add grunt-swigtemplates --dev
    swigtemplates: {
        options: {
        //   defaultContext: require('./data'),
          templatesDir: 'src',
        },
        build: {
          src: ['src/**/*.html'],
          dest: 'temp/',
        },
      },
      htmlmin: {
            options: {
                removeComments: true, //移除注释
                removeCommentsFromCDATA: true,//移除来自字符数据的注释
                collapseWhitespace: true,//无用空格
                collapseBooleanAttributes: true,//失败的布尔属性
                removeAttributeQuotes: true,//移除属性引号      有些属性不可移走引号
                removeRedundantAttributes: true,//移除多余的属性
                useShortDoctype: true,//使用短的跟元素
                removeEmptyAttributes: true,//移除空的属性
                removeOptionalTags: true//移除可选附加标签
              },
              main: {
                expand: true,// 如果设为true，就表示下面文件名的占位符（即*号）都要扩展成具体的文件名。
                cwd: 'temp/', // 读取文件的文件夹
                src: '**/*.html', // 读取的文件
                dest: 'dist', // 输出的文件目标路径
                ext: '.html'  // 输出的文件名称 
              }
        },
          /*
            图片和文字
                安装插件：  yarn add grunt-contrib-imagemin --dev
                cnpm install grunt-contrib-imagemin --save-dev
            
        */ 
       imagemin: {
        main: {
            expand: true,// 如果设为true，就表示下面文件名的占位符（即*号）都要扩展成具体的文件名。
            cwd: 'src/assets/images', // 读取文件的文件夹
            src: '**/*', // 读取的文件
            dest: 'dist/assets/images', // 输出的文件目标路径
        } ,
         mainfont: {
            expand: true,// 如果设为true，就表示下面文件名的占位符（即*号）都要扩展成具体的文件名。
            cwd: 'src/assets/fonts', // 读取文件的文件夹
            src: '**', // 读取的文件
            dest: 'dist/assets/fonts', // 输出的文件目标路径
        }

   },



//        imagemin: {
//         mainimg: {
//             expand: true,// 如果设为true，就表示下面文件名的占位符（即*号）都要扩展成具体的文件名。
//             cwd: 'src/assets/images', // 读取文件的文件夹
//             src: '**', // 读取的文件
//             dest: 'dist/assets/images', // 输出的文件目标路径
//         },
//         mainfont: {
//             expand: true,// 如果设为true，就表示下面文件名的占位符（即*号）都要扩展成具体的文件名。
//             cwd: 'src/assets/fonts', // 读取文件的文件夹
//             src: '**', // 读取的文件
//             dest: 'dist/assets/fonts', // 输出的文件目标路径
//         }

//    },

   // 复制文件拷贝   插件  yarn add grunt-contrib-copy --dev
   copy: {
        main: {
            expand: true,// 如果设为true，就表示下面文件名的占位符（即*号）都要扩展成具体的文件名。
            cwd: 'public', // 读取文件的文件夹
            src: '**', // 读取的文件
            dest: 'dist' // 输出的文件目标路径
        }
   },

        watch: { // 监视修改文件, 当文件修改会做执行
            js: { // 监视js 文件
                files: ['src/assets/scripts/*.js'], // 修改的路径
                tasks: ['babel']  // 文件发生改变执行什么任务
            },
            css: { // 监视sass 文件
                files: ['src/assets/styles/*.scss'], // 修改的路径
                tasks: ['sass']  // 文件发生改变执行什么任务
            },
            html: { // 监视html 文件
                files: ['src/**/*.html'], // 修改的路径
                tasks: ['html']  // 文件发生改变执行什么任务
            },
        },

        /*
        删除插件   yarn add grunt-contrib-clean --dev
          */
        clean: {
            build: {
                src: ['temp', 'dist']
            }
                
        },
        // 浏览器同步测试
        /*
            安装开发服务器插件
                yarn add browser-sync --dev
                 cnpm install browser-sync --save-dev
        */
        browserSync: {
            bs: {
                open: true,
                notify: false,  // 系统消息通知
                bsFiles: {
                    src: ['dist', 'src', 'public']
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: ['dist', 'src', 'public'],
                        routes: {
                            "/node_modules": "node_modules"
                        }
                    }
                }

            }
        }
       

    })

    

    /*
        修改完成后自动编译插件
            yarn add grunt-contrib-watch --dev
    */


    /*
        脚本文件编译
            安装插件和模块   yarn add grunt-babel @babel/core @babel/preset-env --dev
    */
        /*  
        减少 loadNpmTasks 的使用
        安装模块  yarn add load-grunt-tasks --dev
    */

    // 载入 grunt-sass 提供的任务
    // grunt.loadNpmTasks('grunt-sass')

    loadGruntTasks(grunt)  // 自动加载所有的 grunt 插件任务
    // grunt.registerTask('sh','clean') // 删除指定文件
    grunt.registerTask('html', ['swigtemplates', 'htmlmin'])
    // 图片文字  拷贝
    grunt.registerTask('ic', ['imagemin','copy'])
    // 样式
    grunt.registerTask('ys', ['sass', 'babel'])
    // watch 映射  先编译在做实时监测
    grunt.registerTask('default', ['clean', 'ys', 'html', 'ic', 'browserSync', 'watch'])

    
}