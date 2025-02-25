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
  console.log('configAsset')
  // config.module.rule('fonts').use('url-loader').loader('url-loader').options({}).end();
  // config.module.rule('images').use('url-loader').loader('url-loader').options({}).end();
  const publicPath = process.env.NODE_ENV === 'production' ? 'https://production.com/activeRule/' : `http://localhost:8002/`;
  console.log('publicPath', publicPath)
  const fontRule = config.module.rule('fonts')
  fontRule.uses.clear() // 先清除 vue 默认的配置，不然会有问题
  fontRule
    .use('url-loader')
    .loader('url-loader')
    .options({
      name: 'fonts/[name].[hash:7].[ext]',
      publicPath
    })
    .end()
}

module.exports = {
  qiankunConfigFn,
  configAsset
}
