const fs = require("fs");
const path = require("path");

// 复制文件夹
var copyFolder = (srcDir, tarDir, cb) => {
  var isExit = fs.existsSync(tarDir);
  if (!isExit) {
    fs.mkdirSync(tarDir);
  }
  fs.readdir(srcDir, function (err, files) {
    if (err) {
      return;
    }
    files.forEach((file) => {
      var srcPath = path.join(srcDir, file);
      var tarPath = path.join(tarDir, file);

      fs.stat(srcPath, (err, stats) => {
        if (stats.isDirectory()) {
          fs.existsSync(tarPath)
            ? copyFolder(srcPath, tarPath)
            : fs.mkdirSync(tarPath) && copyFolder(srcPath, tarPath);
        } else {
          copyFile(srcPath, tarPath);
        }
      });
    });

    //为空时直接回调
    files.length === 0 && cb && cb();
  });
};

var copyFile = function (srcPath, tarPath, cb) {
  var rs = fs.createReadStream(srcPath);
  rs.on("error", function (err) {
    if (err) {
      console.log("read error", srcPath);
    }
    cb && cb(err);
  });

  var ws = fs.createWriteStream(tarPath);
  ws.on("error", function (err) {
    if (err) {
      console.log("write error", tarPath);
    }
    cb && cb(err);
  });
  ws.on("close", function (ex) {
    cb && cb(ex);
  });

  rs.pipe(ws);
};

module.exports = { copyFolder };
