const program = require('commander')
const ora = require('ora') //ora 一个命令行loading效果
const inquirer = require('inquirer') // 命令行交互
const download = require('download-git-repo') // github api用来下载github的模板
const fs = require('fs')
const path = require("path")
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const rm = require('rimraf').sync

program
  .command('init [projectName]') // 设置指令
  .description('init project')
  .action(projectName => { // 执行操作
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'project name:',
          default: projectName || 'template'
        },
        {
          type: 'input',
          name: 'author',
          message: 'author:'
        },
        {
          type: 'input',
          name: 'version',
          message: 'version:',
          default: '0.1.0'
        }
      ])
      .then(answers => {
        const project = answers.projectName
        downloadTemp(project)
          .then(src => {
            generator(answers, src, project)
              .then(() => {
                console.log('init success :)')
              })
              .catch(err => {
                console.error(`init fail: ${err.message}`)
              })
          })
          .catch(err => {
            console.error(`init fail: ${err.message}`)
          })
      })
  })
  
function downloadTemp (project) {
  project = path.join(project || '.', '.download-temp')
  return new Promise((res, rej) => {
    const repository = 'github:Yx1aoq1/vue-template'
    const spinner = ora('fetching template......')
    spinner.start()
    download(repository, project, { clone: true }, err => {
      if (err) {
        spinner.fail()
        rej(err)
      }
      else {
        spinner.succeed()
        res(project)
      }
    })
  })
}

function generator (metadata = {}, src, dest = '.') {
  if (!src) {
    return Promise.reject(new Error(`无效的source：${src}`))
  }
  return new Promise((resolve, reject) => {
    Metalsmith(process.cwd()) // process.cwd() 获得当前执行node命令时候的文件夹目录名
      .metadata(metadata) // metadata为用户输入的内容
      .clean(false) //
      .source(src) // 模板文件位置
      .destination(dest) // 编译后的文件位置
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata()
        Object.keys(files).forEach(fileName => {
          if (['js', 'json', 'html'].includes(getExtname(fileName))) { // 图片文件和字体文件Handlebar编译会报错
            const fileContentsString = files[fileName].contents.toString() // Handlebar compile 前需要转换为字符
            files[fileName].contents = Buffer.from(Handlebars.compile(fileContentsString)(meta)) // 将编译结果重新变成二进制文件
          }
        })
        done()
      })
      .build(err => {
      	rm(src) // 删除模板
      	err ? reject(err) : resolve()
      })
  })
}

function getExtname (filename) {
  var filenameWithoutSuffix = filename.split(/#|\?/)[0]
  return (/[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0]
}
