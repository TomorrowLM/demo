const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const common = require('./webpack.config.common')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    publicPath: 'http://127.0.0.1:8080/',
  },
  devServer: {
    contentBase: path.resolve(process.cwd(), 'dist'),
    host: '127.0.0.1',
    hot: true,
    https: false,
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
})
