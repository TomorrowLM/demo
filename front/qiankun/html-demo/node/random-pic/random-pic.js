const fs = require('fs')
const args = process.argv.splice(2);
const fileDirectory = args[0] || './';

// 判断路径是否存在
if (fs.existsSync(fileDirectory)) {
  // 读取目录的内容
  const files = fs.readdirSync(fileDirectory)
  files.forEach((file) => {
    const filePath = fileDirectory + file
    let isDirectory
    let files1
    new Promise((resolve) => {
      // 判断文件是否是文件夹
      fs.stat(filePath, (_err, data) => {
        isDirectory = data.isDirectory()
        resolve()
      })
    }).then(() => {
      if (isDirectory) {
        // 读取目录的内容
        files1 = fs.readdirSync(filePath)
      }
      for (let i = 0; i < files1.length; i++) {
        if (/\.png$/.test(files1[i])) {
          // 随机生成6位数
          const randomWord = () => {
            let code = ''
            for (let i = 0; i < 6; i++) {
              const type = getRandom(1, 3)
              switch (type) {
                case 1:
                  code += String.fromCharCode(getRandom(48, 57))// 数字
                  break
                case 2:
                  code += String.fromCharCode(getRandom(65, 90))// 大写字母
                  break
                case 3:
                  code += String.fromCharCode(getRandom(97, 122))// 小写字母
                  break
              }
            }
            return code
          }
          function getRandom (min, max) {
            return Math.round(Math.random() * (max - min) + min)
          }
          // 保存之前的文件信息
          const old = files1[i]
          files1[i] = `${randomWord()}.png`
          fs.rename(`${filePath}/${old}`, `${filePath}/${files1[i]}`, (err) => {
            if (err) throw err
            console.log(' ok~')
          })
        }
      }
    })
    // console.log(filePath)
  })
} else {
  console.log(`${fileDirectory}  Not Found!`)
}
