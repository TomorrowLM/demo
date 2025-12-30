const { getEnvConfig } = require("../scripts/env.js");
const { getProjectInfo } = require("../scripts/app.js");
module.exports = function provideDefines() {
  const env = getEnvConfig(process.env.NODE_ENV);
  const appInfo = getProjectInfo();
  return {
    GLOBAL_INFO:JSON.stringify(Object.assign({}, env, appInfo))
  };
}