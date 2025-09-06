# @lm/shared

一个共享工具库，提供了常用的工具函数和配置。

## 特性

- 按需引入的 webpack 配置
- 模块化的插件和加载器
- 依赖检查和安装提示
- 简单易用的 API

## 安装

```bash
npm install @lm/shared --save
```

## 使用方法

### Webpack 配置

@lm/shared 提供了一个模块化的 webpack 配置系统，允许你按需引入插件和加载器。

#### 安装依赖

在使用 webpack 配置之前，你需要安装相关依赖。@lm/shared 提供了一些脚本来帮助你安装依赖：

```bash
# 安装所有 webpack 相关依赖
npm run install-webpack-all

# 或者只安装基础依赖
npm run install-webpack-base

# 或者只安装插件依赖
npm run install-webpack-plugins

# 或者只安装加载器依赖
npm run install-webpack-loaders
```

#### 使用配置构建器

```javascript
// webpack.config.js
const { configBuilder } = require('@lm/shared/webpack');

const webpackConfig = configBuilder
  .addPlugin('WebpackBar')
  .addPlugin('HtmlWebpackPlugin', {
    template: './public/index.html',
    title: '我的应用',
  })
  .addPlugin('MiniCssExtractPlugin')
  .addPlugin('DefinePlugin')
  .addLoader('css')
  .addLoader('less')
  .addLoader('babel')
  .addLoader('images', { maxSize: 8 * 1024 }) // 8KB
  .getConfig();

module.exports = webpackConfig;
```

#### 直接使用插件和加载器

```javascript
// webpack.config.js
const { plugins, loaders } = require('@lm/shared/webpack');

module.exports = {
  // ... 其他配置
  plugins: [
    plugins.WebpackBar,
    plugins.HtmlWebpackPlugin,
    plugins.MiniCssExtractPlugin,
  ],
  module: {
    rules: [
      loaders.css,
      loaders.less,
      loaders.babel,
    ]
  }
};
```

#### 使用默认配置

```javascript
// webpack.config.js
const { createDefaultConfig } = require('@lm/shared/webpack');

// 获取默认配置
const webpackConfig = createDefaultConfig();

// 可以在这里进一步修改配置
webpackConfig.entry = './src/main.js';

module.exports = webpackConfig;
```

### 可用的插件

- `WebpackBar`: 在终端显示编译进度条
- `HtmlWebpackPlugin`: 生成 HTML 文件
- `MiniCssExtractPlugin`: 提取 CSS 到单独的文件
- `CssMinimizerWebpackPlugin`: 压缩 CSS
- `DefinePlugin`: 定义环境变量
- `ProvidePlugin`: 自动加载模块
- `NodePolyfillPlugin`: Node.js polyfill
- `BundleAnalyzerPlugin`: 分析打包结果

### 可用的加载器

- `css`: CSS 加载器
- `less`: Less 加载器
- `babel`: Babel 加载器
- `images`: 图片加载器
- `fonts`: 字体加载器

## 许可证

MIT