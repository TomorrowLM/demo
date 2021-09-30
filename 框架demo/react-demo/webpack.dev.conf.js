const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "./src/main.js"),
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "bundle.js",
  },
  //   devServer:{
  //     //配置dev-server命令参数的第二种形式
  //     // "dev": "webpack-dev-server --open --port 3000 --contentBase src --hot"
  //     open:true,//自动打开浏览器
  //     port:3500,W
  //     contentBase:'src',//指定托管的根目录
  //     hot:true,//启动热更新
  //     inline: true
  // },
  plugins: [
    // 插件
    new htmlWebpackPlugin({
      template: path.join(__dirname, "./src/index.html"),
      filename: "index.html",
      title: "tom",
    }),
  ],
  module: {
    rules: [
      { test: /\.css$/, use: ["style-loader", "css-loader"] }, // 如果想要启用 CSS 模块化，可以为 css-loader 添加 modules 参数即可
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader?modules&localIdentName=[name]_[local]-[hash:5]",
          "sass-loader",
        ],
      },
      { test: /\.(png|gif|bmp|jpg)$/, use: "url-loader?limit=5000" },
      { test: /\.jsx?$/, use: "babel-loader", exclude: /node_modules/ },
      // {test:/\.js$/,use:'babel-loader',exclude:/node_modules/}
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
