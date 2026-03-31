const alias = require('./alias');
const devServer = require('./devServer');
const createHtmlWebpackPlugin = require('./plugin-html-webpack');
const createMiniCssExtractPlugin = require('./plugin-mini-css-extract');
const provideDefines = require('./provideDefines');
const createBundleAnalyzerPlugin = require('./plugin-analyzer');
module.exports = {
  alias,
  devServer,
  createHtmlWebpackPlugin,
  createMiniCssExtractPlugin,
  provideDefines,
  createBundleAnalyzerPlugin
}