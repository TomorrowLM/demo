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

module.exports = {
  qiankunConfigFn
}
