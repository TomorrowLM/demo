const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const { version } = require('../package.json')

module.exports = {
  entry: {
    bundleb2b: './src/index.js',
    checkout: './src/views/special/checkout.js',
    'order-confirmations': './src/views/special/order-confirmation.js',
  },
  output: {
    filename: `[name].${version}.js`,
    path: path.resolve(process.cwd(), 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: resourcePath => {
                  if (/global.s[ac]ss/i.test(resourcePath)) {
                    return 'global'
                  }
                  return 'local'
                },
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'handlebars-loader',
            options: {
              helperDirs: path.join(__dirname, '../src/hbs/helpers'),
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|woff2?|eot|ttf|otf|svg)$/i,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL),
      'process.env.APP_CLIENT_ID': JSON.stringify(process.env.APP_CLIENT_ID)
    }),
  ],
}
