const fs = require("fs");
const path = require("path");

function cleanFiles(api) {
  // 清空 src/view
  removeDir(api.resolve("./src/views"));
  removeDir(api.resolve("./src/mock/target.json"));
}

function removeDir(dir) {
  try {
    let files = fs.readdirSync(dir);
    for (var i = 0; i < files.length; i++) {
      let newPath = path.join(dir, files[i]);
      let stat = fs.statSync(newPath);
      if (stat.isDirectory()) {
        //如果是文件夹就递归下去
        removeDir(newPath);
      } else {
        //删除文件
        fs.unlinkSync(newPath);
      }
    }
    fs.rmdirSync(dir); //如果文件夹是空的，就将自己删除掉
  } catch (error) {
    //console.log("cleanFiles error", error);
  }
}

module.exports = {
  cleanFiles,
};
