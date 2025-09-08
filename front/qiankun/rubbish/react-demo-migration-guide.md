# React Demo项目迁移指南

本文档详细说明了如何修改`packages/react-demo`项目，使其使用从`npm/shared`包中引入的webpack配置。

## 迁移步骤

### 1. 确保依赖关系

首先，确保`packages/react-demo`项目已经正确依赖了`@lm/shared`包：

```json
// packages/react-demo/package.json
{
  "dependencies": {
    "@lm/shared": "workspace:*",
    // 其他依赖...
  }
}
```

同时，确保安装了所有webpack相关的依赖（这些依赖在`@lm/shared`包中被声明为peerDependencies）：

```json
// packages/react-demo/package.json
{
  "devDependencies": {
    "webpack": "^5.65.0",
    "webpack-merge": "^5.8.0",
    "html-webpack-plugin": "^5.6.3",
    "mini-css-extract-plugin": "^2.3.0",
    "css-minimizer-webpack-plugin": "^3.1.1",
    "node-polyfill-webpack-plugin": "^4.1.0",
    "webpackbar": "^5.0.0-3",
    "webpack-bundle-analyzer": "^4.4.2",
    "clean-webpack-plugin": "^4.10.0",
    // 其他依赖...
  }
}
```

### 2. 修改webpack.base.js

将原有的webpack.base.js文件修改为使用`@lm/shared`包中的配置：

```javascript
// packages/react-demo/webpack.base.js
const path = require("path");
const { getBaseConfig } = require("@lm/shared").config.reactConfig;

// 读取 package.json 信息
const packageJson = require("./package.json");

// 获取基础配置
module.exports = getBaseConfig({
  // 入口文件
  entry: {
    app: path.resolve(__dirname, "./src/index.js"),
  },
  // 输出配置
  outputPath: path.resolve(__dirname, "./dist"),
  filename: "js/bundle.[hash].js",
  // HTML模板
  htmlTemplate: path.resolve(__dirname, "./src/index.html"),
  htmlFilename: "index.html",
  title: "react app",
  // 包信息
  packageInfo: packageJson,
  // 别名配置
  alias: {
    '@': path.resolve(__dirname, 'src/'),
  },
  // 其他配置...
});
```

### 3. 修改webpack.dev.js

将原有的webpack.dev.js文件修改为使用`@lm/shared`包中的配置：

```javascript
// packages/react-demo/webpack.dev.js
const { getDevConfig } = require("@lm/shared").config.reactConfig;
const { name } = require("./package.json");

// 获取开发环境配置
module.exports = getDevConfig({
  // 输出库配置
  output: {
    library: `${name}-[name]`,
    libraryTarget: 'umd',
    chunkLoadingGlobal: `webpackJsonp_${name}`,
  },
  // 开发服务器配置
  port: 8004,
  open: true,
  static: "./src",
  hot: true,
  // 开发工具
  devtool: "eval-cheap-module-source-map",
  // 包信息
  packageInfo: { name },
  // 其他配置...
});
```

### 4. 修改webpack.prod.js

将原有的webpack.prod.js文件修改为使用`@lm/shared`包中的配置：

```javascript
// packages/react-demo/webpack.prod.js
const { getProdConfig } = require("@lm/shared").config.reactConfig;

// 获取生产环境配置
module.exports = getProdConfig({
  // 是否生成sourceMap
  sourceMap: true,
  // 是否启用代码分割
  splitChunks: false,
  // 清理配置
  clean: { 
    path: "./dist" 
  },
  // 其他配置...
});
```

### 5. 更新npm脚本

确保`packages/react-demo/package.json`中的npm脚本正确引用了webpack配置文件：

```json
// packages/react-demo/package.json
{
  "scripts": {
    "serve": "cross-env NODE_ENV=development webpack-dev-server --config webpack.dev.js --profile",
    "serve:qiankun": "cross-env NODE_ENV=development PORT=8004 webpack-dev-server --config webpack.dev.js --profile",
    "build": "cross-env NODE_ENV=production webpack --config webpack.prod.js",
    "build:qiankun": "cross-env NODE_ENV=production webpack --config webpack.prod.js"
  }
}
```

## 迁移注意事项

### 1. 配置参数

确保在调用`getBaseConfig`、`getDevConfig`和`getProdConfig`函数时，传入了所有必要的参数。如果有自定义的配置，也可以通过参数传入。

### 2. 路径解析

注意路径解析的变化。在原始配置中，路径是相对于配置文件所在目录解析的，而在新的配置中，路径是相对于项目根目录解析的。确保所有路径都正确指向了预期的文件。

### 3. 插件和loader

如果有自定义的插件或loader配置，可以通过参数传入，或者在获取配置后进行修改：

```javascript
const baseConfig = getBaseConfig({/*...*/});

// 添加自定义插件
baseConfig.plugins.push(new MyCustomPlugin());

// 修改loader配置
baseConfig.module.rules.push({
  test: /\.custom$/,
  use: 'custom-loader'
});

module.exports = baseConfig;
```

### 4. 环境变量

确保环境变量的使用方式与新的配置兼容。如果有自定义的环境变量，可以通过参数传入：

```javascript
const baseConfig = getBaseConfig({
  env: {
    APP_NAME: JSON.stringify(packageJson.name),
    APP_VERSION: JSON.stringify(packageJson.version),
    // 其他环境变量...
  }
});
```

### 5. 调试

如果在迁移过程中遇到问题，可以通过以下方式进行调试：

1. 打印配置对象：
```javascript
const config = getBaseConfig({/*...*/});
console.log(JSON.stringify(config, null, 2));
```

2. 使用webpack的`--display-error-details`选项查看详细错误信息：
```json
{
  "scripts": {
    "debug": "cross-env NODE_ENV=development webpack --config webpack.dev.js --display-error-details"
  }
}
```

## 迁移后的验证

完成迁移后，应该验证以下功能是否正常工作：

1. 开发服务器是否能正常启动
2. 热更新是否正常工作
3. 构建是否能正常完成
4. 构建后的应用是否能正常运行
5. 所有资源（JS、CSS、图片、字体等）是否能正确加载
6. 是否有任何控制台错误或警告

如果发现任何问题，可以通过比较原始配置和新配置的差异来定位问题。