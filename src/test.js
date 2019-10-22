var inquirer = require('inquirer') // 命令行交互

inquirer
  .prompt([
    {
      type: 'input', // 交互方式，input、confirm等
      name: 'projectName', // 用来存输入结果的字段名
      message: 'project name:', // 提示输入信息
      default: 'template' // 默认值
    }
  ])
  .then((answers) => {
    console.log(answers) // {projectName: 'template'}
  })