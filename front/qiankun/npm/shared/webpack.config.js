// const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// module.exports = {
//   entry: './index.ts',
//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'lib')
//   },
//   module: {
//     rules: [
//       {
//         test: /\.css$/,
//         use: [MiniCssExtractPlugin.loader, 'css-loader']
//       },
//       // {
//       //   test: /\.ts$/,
//       //   use: 'ts-loader',
//       //   exclude: /node_modules/
//       // }
//     ]
//   },
//   resolve: {
//     extensions: ['.ts', '.js']
//   },
//   plugins: [
//     new MiniCssExtractPlugin({
//       filename: 'src/styles/[name].css'
//     })
//   ]
// };