const fs = require("fs");
const path = require("path");
const { EOL } = require("os");

function handleTemplateRewrite(api) {
  // 重写App.vue
  rewriteAppVue(api);
  // 重写Main.ts
  rewriteMainTS(api);
  // 重写router/index.ts
  rewriteRouterIndex(api);
}

/**
 * 重写router/index.ts
 * @param {*} api
 */
function rewriteRouterIndex(api) {
  if (fs.existsSync(api.resolve("./src/router/index.ts"))) {
    const qbeeRouterIndexContent = fs.readFileSync(
      path.join(__dirname, "/qbee-template/qbeeRouter.txt"),
      {
        encoding: "utf-8",
      }
    );
    fs.writeFileSync(
      api.resolve("./src/router/index.ts"),
      qbeeRouterIndexContent,
      {
        encoding: "utf-8",
      }
    );
  }
}

/**
 * 重写Main.ts
 * @param {*} api
 */
function rewriteMainTS(api) {
  const mainPath = api.resolve("./src/main.ts");
  const qbeeMainContent = fs.readFileSync(
    path.join(__dirname, "/qbee-template/qbeeMain.txt"),
    {
      encoding: "utf-8",
    }
  );
  fs.writeFileSync(mainPath, qbeeMainContent, { encoding: "utf-8" });
}

/**
 * 重写App.vue
 * @param {*} api
 */
function rewriteAppVue(api) {
  let qbeeAppVueContent = fs.readFileSync(
    path.join(__dirname, "/qbee-template/qbeeAppVue.txt"),
    {
      encoding: "utf-8",
    }
  );
  const packageContent = fs.readFileSync(api.resolve("./package.json"), {
    encoding: "utf-8",
  });
  const packageObj = JSON.parse(packageContent);
  const microName = packageObj.name.split("-").slice(2).join("");
  qbeeAppVueContent = qbeeAppVueContent
    .replace(/{APP_NAME}/g, packageObj.name)
    .replace(/{MICRO_NAME}/g, microName);
  fs.writeFileSync(api.resolve("./src/App.vue"), qbeeAppVueContent, {
    encoding: "utf-8",
  });
}

module.exports = {
  handleTemplateRewrite,
};
