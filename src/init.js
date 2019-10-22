var program = require('commander')
var ora = require('ora') //ora 一个命令行loading效果
var inquirer = require('inquirer') // 命令行交互
var download = require('download-git-repo') // github api用来下载github的模板
var fs = require('fs')

program
  .command('init [projectName]') // 设置指令
  .description('init project')
  .action(function (projectName, opts) { // 执行操作
    var loading = ora('fetching template......')
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'projectName',
          message: '项目名称',
          default: projectName || 'template'
        },
        {
          type: 'input',
          name: 'author',
          message: '作者'
        },
        {
          type: 'input',
          name: 'version',
          message: '版本',
          default: '0.1.0'
        }
      ])
      .then(function (answers) {
        var repository = 'Yx1aoq1/vue-template'
        var project = answers.projectName
        loading.start()
        download(repository, project, function (err) {
          if (err) {
            console.log(err)
            return
          }
          var path = process.cwd() + '\/' + project
          edit(answers, path)
          console.log(path)
          loading.succeed()
        })
      })
  })

function edit (info, path) {
  fs.readFile(path + '/package.json', function (err, data) {
    if (err) {
      console.log(err)
      return
    }
    var data = JSON.parse(data)
    data.name = info.projectName
    data.author = info.author
    data.version = info.version
    var replaceData = JSON.stringify(data, null, 4)
    fs.writeFile(path + '/package.json', replaceData, function (err) {
      if (err) {
        console.log(err)
      }
    })
  })
}