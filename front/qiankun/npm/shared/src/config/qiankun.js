function qiankunConfigFn({ projectName, config }) {
  console.log('qiankunConfig')
  console.log(config.output)
  if (projectName === 'web1') {
    Object.assign(config.output,
      {
        library: `${projectName}-[name]`, // 把子应用打包成 umd 库格式
        libraryTarget: 'umd', // 把微应用打包成 umd 库格式
        jsonpFunction: `webpackJsonp_${projectName}` // webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
      }
    );
  }
  if (projectName === 'web2') {
    Object.assign(config.output,
      {
        library: `${projectName}-[name]`, // 把子应用打包成 umd 库格式
        libraryTarget: 'umd', // 把微应用打包成 umd 库格式
        chunkLoadingGlobal: `webpackJsonp_${projectName}` // webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
      }
    );
  }
}

function configAsset(config) {
  console.log('configAsset', process.env.VUE_APP_IS_QIANKUN)
  const publicPath = process.env.NODE_ENV === 'production' ? '' : `fonts/`;
  console.log('publicPath', publicPath)
  const fontRule = config.module.rule('fonts')
  fontRule.uses.clear() // 先清除 vue 默认的配置，不然会有问题
  fontRule
    .use('file-loader')
    .loader('file-loader')
    .options({
      name: '[name].[hash:7].[ext]',
      publicPath
    })
    .end()
}

module.exports = {
  qiankunConfigFn,
  configAsset
}
