const { BannerPlugin } = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const merge = require('webpack-merge')
const { version } = require('../package.json')
const common = require('./webpack.config.common')

const banner = `BundleB2B v${version}
Copyright (c) bundleb2b.com
`

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
          compress: {
            drop_console: true,
          },
        },
        extractComments: false,
      }),
      new BannerPlugin(banner),
    ],
  },
})
