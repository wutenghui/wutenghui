// 此文件做为 Generator 的核心入口
// 需要到处一个继承自 Yeoman Generator 的类型
// Yeoman Generator 在工作时会自动调用我们在此类型中定义的一些生命周期方法
// 我们在这些方法中可以通过调用父类提供的一些工具方法功能，例如文件写入

const Generator = require('yeoman-generator')
module.exports = class extends Generator{
    prompting (){
        // Yeoman 在询问用户环节会自动调用此方法
        // 在此方法中可以调用父类的 prompt() 方法发出对用户的命令询问
        return this.prompt([
            {
                type: 'input' ,  // 类型：通过输入的方式
                name: 'name' ,   // 最终得到结果的一个键
                message: 'Your project name' ,  // 提示
                default: this.appname // appname 为项目生成目录名称
            }

        ])
        .then(answers => {
            // answers => { name: 'user input value' }
            this.answers = answers
        })
    }

    writing (){
        // 模板文件路径
        const tmpl = this.templatePath('bar.html')
        // 输出目标路径
        const output = this.destinationPath('bar.html')
        // 模板数据上下文
        const context = this.answers
        this.fs.copyTpl(tmpl, output, context)    
    }

}


// // 导出类型继承 Generator
// module.exports = class extends Generator{

//     prompting (){
//         // Yeoman 在询问用户环节会自动调用此方法
//         // 在此方法中可以调用父类的 prompt() 方法发出对用户的命令询问
//         return this.prompt([
//             {
//                 type: 'input' , 
//                 name: 'name' ,
//                 message: 'Your project name' ,
//                 default: this.appname // appname 为项目生成目录名称
//             }

//         ])
//         .then(answers => {
//             // answers => { name: 'user input value' }
//             this.answers = answers
//         })


//     }

//     writing (){
//     // Yeoman 自动在生成文件阶段调用此方法
//     // 我们这里尝试往项目目录中写入文件
//         // .write() 两个参数，一个是写入文件的绝对路径，一个是写入文件的内容
//        /*
//         this.fs.write(
//             // 自动获取对应下的文件路径
//             this.destinationPath('temp.txt') , 
//             // 生成一个随机数代替 文件内容
//             Math.random().toString()
//         )
// */


//     // 此模板方式写入文件到目标目录

//     // // 模板文件路径
//     // const tmpl = this.templatePath('foo.txt')
//     // // 输出目标路径
//     // const output = this.destinationPath('foo.txt')
//     // // 模板数据上下文
//     // const context = { title: 'Hello WTH..' , success: false }
    
//     // this.fs.copyTpl(tmpl, output, context)

// //----------------------------------------

//     // 模板文件路径
//     const tmpl = this.templatePath('bar.html')
//     // 输出目标路径
//     const output = this.destinationPath('bar.html')
//     // 模板数据上下文
//     const context = this.answers
    
//     this.fs.copyTpl(tmpl, output, context)
//     }
// }

// // yarn link 命令 
