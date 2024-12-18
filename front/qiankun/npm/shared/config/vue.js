// import $utils from '../utils/index';
// const $utils = require('../utils/index');
const webpack = require("webpack");
const path = require("path");

const commonPlugin = [
  // 自动加载模块，而不必到处 import 或 require ，在这里加载模块之后，组件内部就不用inport引入了
  new webpack.ProvidePlugin({
    $: [path.resolve(__dirname, "../utils/index")], 
  }),
];

module.exports = {
  commonPlugin,
};

