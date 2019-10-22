var program = require('commander')
var fs = require('fs')
var path = './'

program
  .version('0.0.1')
  .description('a test cli program')

program
  .command('rename <format>') // 设置指令
  .option('-n, --number <number>', '设置rename数字，默认从1开始', 1) // 设置参数
  .option('-a, --after', '将fomat字符固定在数字后，默认在前')
  .action(function (format, opts) { // 执行操作
    const files = fs.readdirSync(path)
    files.map(function(filename) {
      var extname = getExtname(filename)
      if (isImage(extname)) {
        var newname = getNewName(format, opts, extname)
        fs.rename(filename, newname, function(err) {
          console.log(filename + ' --> ' + newname)
        })
      }
    })
  })

function isImage (extname) {
  var imageTypes = ['webp', 'png', 'svg', 'gif', 'jpg', 'jpeg', 'bmp']
  return imageTypes.includes(extname)
}

function getExtname (filename) {
  var filenameWithoutSuffix = filename.split(/#|\?/)[0]
  return (/[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0]
}

function getNewName (format, opts, extname) {
  return opts.after
         ? (opts.number ++) + format + '.' + extname
         : format + (opts.number ++) + '.' + extname
}