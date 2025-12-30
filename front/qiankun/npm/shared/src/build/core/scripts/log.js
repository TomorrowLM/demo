const { getEnvConfig } = require('./env');
const { getProjectInfo, getProjectPackageJson, getDependency } = require('./app');

/**
 * 打印环境信息（用于调试）
 */
function logInfo() {
  const envConfig = getEnvConfig()[process.env.NODE_ENV];
  const projectInfo = getProjectInfo();
  const projectPackageJson = getProjectPackageJson();
  const dependency = getDependency();
  console.log('=== 应用环境信息 ===');
  console.log(envConfig, process.env.NODE_ENV);
  console.log('=== APP项目信息 ===');
  console.log(projectInfo);
  // console.log('项目信息:', projectInfo);
  // console.log('项目信息:', projectPackageJson);
  // console.log('项目依赖:', dependency);
  console.log('========================');
  // console.log('getEnv：当前环境', process.env.NODE_ENV);
  // console.log('getEnv：当前运行项目', base);
  // console.log('getEnv：当前环境配置目录地址', envDir);
  // console.log('=== 应用环境信息 ===');
  // console.log('应用名称:', AppConfig.APP_NAME);
  // console.log('版本:', AppConfig.APP_VERSION);
  // console.log('环境:', AppConfig.ENV);
  // console.log('API 地址:', AppConfig.API_BASE_URL);
  // console.log('构建时间:', AppConfig.BUILD_TIME);
  // console.log('Git Commit:', AppConfig.GIT_COMMIT);
  // console.log('是否是开发环境:', AppConfig.IS_DEVELOPMENT);
  // console.log('调试模式:', AppConfig.DEBUG);
  // console.log('========================');


}

module.exports = {
  logInfo
};