//将styles文件复制到lib下
const fs = require('fs');
const path = require('path');
function copyDir(source, destination, callback) {
  // 确保目标文件夹存在
  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) {
      callback(err);
      return;
    }

    fs.readdir(source, (err, files) => {
      if (err) {
        callback(err);
        return;
      }

      let count = files.length;
      let copyFileErr = null;

      if (count === 0) {
        return callback(null);
      }

      files.forEach((file) => {
        const srcFile = path.join(source, file);
        const destFile = path.join(destination, file);

        fs.stat(srcFile, (err, stats) => {
          if (err) {
            copyFileErr = err;
            return callback(copyFileErr);
          }

          if (stats.isDirectory()) {
            copyDir(srcFile, destFile, (err) => {
              if (err) {
                copyFileErr = err;
              }
              next();
            });
          } else {
            console.log(srcFile, destFile)
            copyFile(srcFile, destFile, (err) => {
              if (err) {
                copyFileErr = err;
              }
              next();
            });
          }
        });
      });

      function next() {
        if (--count === 0) {
          callback(copyFileErr);
        }
      }
    });
  });
}

function copyFile(source, destination, callback) {
  const readStream = fs.createReadStream(source);
  const writeStream = fs.createWriteStream(destination);

  readStream.on('error', callback);
  writeStream.on('error', callback);

  writeStream.on('close', () => {
    callback(null);
  });

  readStream.pipe(writeStream);
}

// 使用示例
const sourcePath = path.join(__dirname, '../styles');
const destinationPath = path.join(__dirname, 'destinationFolder', '../../../lib/src/styles');

copyDir(sourcePath, destinationPath, (err) => {
  if (err) {
    console.error('An error occurred:', err);
    return;
  }
  console.log('Directory copied successfully.');
});

// 创建目录
const stylesDir = path.resolve(__dirname, '../styles');
if (!fs.existsSync(stylesDir)) {
  fs.mkdirSync(stylesDir);
}

// 空实现，如果没有样式文件可以忽略
console.log('Styles build completed');