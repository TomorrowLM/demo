const { handleTemplateRewrite } = require("./rewriteer");
const { cleanFiles } = require("./fileCleaner");
const { copyFolder } = require("./fileCopy");
const qbeeDependence = require("./qbeeDependencied");

module.exports = (api, option, preset) => {
  // 修改文件
  api.postProcessFiles((files) => {
    for (const file in files) {
      if (file.endsWith("index.js") && file.indexOf("mock") === -1) {
        const newFile = file.replace(/\.js$/, ".ts");
        files[newFile] = files[file];
        delete files[file];
      }
    }
  });
  // 注入import
  api.onCreateComplete(() => {
    // 创建完成后，文件落盘，重写部文件
    handleTemplateRewrite(api);
    // 复制mock
    const path = require("path");
    copyFolder(
      path.join(__dirname, "/qbee-template/mock"),
      api.resolve("./src/mock")
    );
    // 复制config.js
    copyFolder(
      path.join(__dirname, "/qbee-template/config"),
      path.join(api.resolve("./src"), "../", "config")
    );
    // 清空vue-cli自带模板创建的文件
    cleanFiles(api);
  });

  // 渲染模版
  const MOCK_PORT = parseInt(Math.random() * 10000);
  const DEV_SERVE_PORT = parseInt(Math.random() * 10000);
  api.render("./template", { MOCK_PORT, DEV_SERVE_PORT });
  // 修改packageJson
  api.extendPackage(qbeeDependence);
  // 添加单独启动mock能力
  api.extendPackage({
    scripts: {
      mockStart: "vue-cli-service qbeemock",
    },
  });
};
