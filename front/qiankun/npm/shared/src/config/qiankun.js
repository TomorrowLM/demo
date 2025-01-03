const packageName = require('./package.json').name;
config.output = {
  library: `${packageName}-[name]`,
  libraryTarget: 'umd', // 把微应用打包成 umd 库格式
  jsonpFunction: `webpackJsonp_${packageName}` // webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
};