/**
 * 为qiankun微前端应用配置webpack输出选项
 * @param {Object} param0 配置参数
 * @param {string} param0.projectName 项目名称
 * @param {Object} param0.config webpack配置对象
 */
// 确保这个路径指向正确的位置
const { getProjectName } = require('../../scripts/getProjectPackageJson');

function qiankunConfigFn({ projectName, config }) {
  console.log('qiankunConfig',getProjectName());
  console.log(config.output);
  
  // 如果没有提供项目名称，尝试从 package.json 获取
  const actualProjectName = projectName || getProjectName();
  
  // 根据项目名称配置输出选项
  if (actualProjectName === 'web1') {
    Object.assign(config.output,
      {
        library: `${actualProjectName}-[name]`, // 把子应用打包成 umd 库格式
        libraryTarget: 'umd', // 把微应用打包成 umd 库格式
        jsonpFunction: `webpackJsonp_${actualProjectName}` // webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
      }
    );
  }
  if (actualProjectName === 'web2') {
    Object.assign(config.output,
      {
        library: `${actualProjectName}-[name]`, // 把子应用打包成 umd 库格式
        libraryTarget: 'umd', // 把微应用打包成 umd 库格式
        chunkLoadingGlobal: `webpackJsonp_${actualProjectName}` // webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
      }
    );
  }


}

function configAsset(config) {
  console.log('configAsset', process.env.VUE_APP_IS_QIANKUN);
  const publicPath = process.env.NODE_ENV === 'production' ? '' : `fonts/`;
  console.log('publicPath', publicPath);
  const fontRule = config.module.rule('fonts');
  fontRule.uses.clear(); // 先清除 vue 默认的配置，不然会有问题
  fontRule
    .use('file-loader')
    .loader('file-loader')
    .options({
      name: '[name].[hash:7].[ext]',
      publicPath
    })
    .end();
}

/**
 * 获取qiankun微前端应用的webpack输出配置
 * @param {string} name 应用名称
 * @returns {Object} webpack输出配置对象
 */
function getQiankunConfig(name) {
  // 如果没有提供名称，尝试从 package.json 获取
  const actualName = name || getProjectName();
  
  return {
    library: `${actualName}-[name]`,
    libraryTarget: 'umd',
    chunkLoadingGlobal: `webpackJsonp_${actualName}`
  };
}

module.exports = {
  qiankunConfigFn,
  configAsset,
  getQiankunConfig
};
