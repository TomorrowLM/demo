// 包信息注入工具
const fs = require('fs');
const path = require('path');

/**
 * 获取项目的 package.json 信息
 * @param {string} projectRoot - 项目根目录
 * @returns {object} 包含 name 和 version 的对象
 */
function getPackageInfo(projectRoot) {
  try {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageJsonContent);
      return {
        name: packageJson.name || 'Unknown App',
        version: packageJson.version || '1.0.0'
      };
    }
  } catch (error) {
    console.warn('无法读取 package.json:', error.message);
  }

  return {
    name: 'Unknown App',
    version: '1.0.0'
  };
}

/**
 * 为 Webpack 创建 DefinePlugin 配置
 * @param {string} projectRoot - 项目根目录
 * @returns {object} DefinePlugin 配置对象
 */
function createWebpackDefineConfig(projectRoot) {
  const packageInfo = getPackageInfo(projectRoot);

  return {
    'process.env.PACKAGE_NAME': JSON.stringify(packageInfo.name),
    'process.env.PACKAGE_VERSION': JSON.stringify(packageInfo.version),
    'process.env.APP_NAME': JSON.stringify(packageInfo.name),
    'process.env.APP_VERSION': JSON.stringify(packageInfo.version),
    // 兼容原有的环境变量
    'process.env.npm_package_name': JSON.stringify(packageInfo.name),
    'process.env.npm_package_version': JSON.stringify(packageInfo.version)
  };
}

/**
 * 为 Vue CLI 创建环境变量配置
 * @param {string} projectRoot - 项目根目录
 * @returns {object} 环境变量配置对象
 */
function createVueDefineConfig(projectRoot) {
  const packageInfo = getPackageInfo(projectRoot);

  return {
    'process.env.VUE_APP_PACKAGE_NAME': JSON.stringify(packageInfo.name),
    'process.env.VUE_APP_PACKAGE_VERSION': JSON.stringify(packageInfo.version),
    'process.env.VUE_APP_NAME': JSON.stringify(packageInfo.name),
    'process.env.VUE_APP_VERSION': JSON.stringify(packageInfo.version)
  };
}

module.exports = {
  getPackageInfo,
  createWebpackDefineConfig,
  createVueDefineConfig
};
