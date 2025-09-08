# Webpack配置NPM包化计划

## 概述

本文档详细描述了将`packages/react-demo`目录下的webpack配置文件（webpack.base.js, webpack.dev.js, webpack.prod.js）提取为npm包的计划。这些配置文件将被重构为模块化、可配置的形式，并放置在`npm/shared/src/config/webpack`目录中。

## 目录结构

```
npm/shared/src/config/webpack/
├── index.ts         # 主入口文件，导出所有配置
├── base.ts          # 基础配置
├── dev.ts           # 开发环境配置
├── prod.ts          # 生产环境配置
├── plugins.ts       # 插件配置
├── loaders.ts       # loader配置
└── utils.ts         # 工具函数
```

## 文件内容

### index.ts

```typescript
/**
 * Webpack配置入口文件
 * 导出所有webpack配置
 */
import { getBaseConfig } from './base';
import { getDevConfig } from './dev';
import { getProdConfig } from './prod';
import * as plugins from './plugins';
import * as loaders from './loaders';
import * as utils from './utils';

export {
  getBaseConfig,
  getDevConfig,
  getProdConfig,
  plugins,
  loaders,
  utils
};

// 默认导出
export default {
  getBaseConfig,
  getDevConfig,
  getProdConfig,
  plugins,
  loaders,
  utils
};
```

### base.ts

```typescript
/**
 * 基础webpack配置
 */
import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import WebpackBar from 'webpackbar';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { getPlugins } from './plugins';
import { getCssLoaders, getLessLoaders, getJsLoaders, getImageLoaders, getFontLoaders } from './loaders';
import { resolvePath } from './utils';

export interface BaseConfigOptions {
  // 入口文件路径
  entry?: string | Record<string, string>;
  // 输出目录
  outputPath?: string;
  // 输出文件名格式
  filename?: string;
  // HTML模板路径
  htmlTemplate?: string;
  // HTML文件名
  htmlFilename?: string;
  // 页面标题
  title?: string;
  // 是否启用bundle分析
  bundleAnalyzer?: boolean;
  // 别名配置
  alias?: Record<string, string>;
  // 项目根目录
  projectRoot?: string;
  // 包信息
  packageInfo?: {
    name: string;
    version: string;
  };
  // 其他webpack配置
  [key: string]: any;
}

/**
 * 获取基础webpack配置
 * @param options 配置选项
 * @returns webpack配置对象
 */
export function getBaseConfig(options: BaseConfigOptions = {}) {
  const {
    entry = './src/index.js',
    outputPath = './dist',
    filename = 'js/bundle.[hash].js',
    htmlTemplate = './src/index.html',
    htmlFilename = 'index.html',
    title = 'React App',
    bundleAnalyzer = false,
    alias = {},
    projectRoot = process.cwd(),
    packageInfo = { name: 'app', version: '1.0.0' },
    ...rest
  } = options;

  const resolve = (relativePath: string) => path.resolve(projectRoot, relativePath);

  const config: webpack.Configuration = {
    entry: typeof entry === 'string' ? { app: resolve(entry) } : Object.entries(entry).reduce((acc, [key, value]) => {
      acc[key] = resolve(value);
      return acc;
    }, {} as Record<string, string>),
    
    output: {
      path: resolve(outputPath),
      filename,
    },
    
    resolve: {
      modules: [path.resolve(projectRoot, 'node_modules')],
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      alias: {
        '@': resolve('src'),
        ...alias
      },
    },
    
    module: {
      rules: [
        getCssLoaders(),
        ...getLessLoaders(),
        ...getImageLoaders(),
        ...getFontLoaders(),
        getJsLoaders(),
      ],
    },
    
    plugins: getPlugins({
      htmlTemplate: resolve(htmlTemplate),
      htmlFilename,
      title,
      bundleAnalyzer,
      packageInfo,
    }),
    
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    },
    
    ...rest
  };

  return config;
}
```

### dev.ts

```typescript
/**
 * 开发环境webpack配置
 */
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';
import { getBaseConfig, BaseConfigOptions } from './base';

export interface DevConfigOptions extends BaseConfigOptions {
  // 端口号
  port?: number;
  // 是否自动打开浏览器
  open?: boolean;
  // 静态资源目录
  static?: string;
  // 是否启用热更新
  hot?: boolean;
  // 其他devServer配置
  devServer?: Record<string, any>;
}

/**
 * 获取开发环境webpack配置
 * @param options 配置选项
 * @returns webpack配置对象
 */
export function getDevConfig(options: DevConfigOptions = {}) {
  const {
    port = 8004,
    open = true,
    static = './src',
    hot = true,
    devServer = {},
    ...baseOptions
  } = options;

  const baseConfig = getBaseConfig(baseOptions);
  const packageName = baseOptions.packageInfo?.name || 'app';

  return merge(baseConfig, {
    output: {
      library: `${packageName}-[name]`,
      libraryTarget: 'umd',
      chunkLoadingGlobal: `webpackJsonp_${packageName}`,
    },
    
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      historyApiFallback: true,
      open,
      port,
      static,
      hot,
      ...devServer
    },
    
    plugins: [
      // webpack.HotModuleReplacementPlugin() 在 webpack 5 中不再需要手动添加
      // 当 devServer.hot: true 时会自动启用
    ],
  });
}
```

### prod.ts

```typescript
/**
 * 生产环境webpack配置
 */
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { getBaseConfig, BaseConfigOptions } from './base';

export interface ProdConfigOptions extends BaseConfigOptions {
  // 是否生成sourceMap
  sourceMap?: boolean;
  // 是否启用代码分割
  splitChunks?: boolean;
  // 清理配置
  clean?: {
    path?: string;
    options?: Record<string, any>;
  };
}

/**
 * 获取生产环境webpack配置
 * @param options 配置选项
 * @returns webpack配置对象
 */
export function getProdConfig(options: ProdConfigOptions = {}) {
  const {
    sourceMap = false,
    splitChunks = false,
    clean = { path: './dist' },
    ...baseOptions
  } = options;

  const baseConfig = getBaseConfig(baseOptions);

  const config: webpack.Configuration = {
    mode: 'production',
    devtool: sourceMap ? 'source-map' : false,
    
    plugins: [
      new webpack.DefinePlugin({
        DEV: JSON.stringify('production'),
      }),
      new CleanWebpackPlugin({
        ...clean.options,
        path: clean.path,
      }),
    ],
  };

  if (splitChunks) {
    config.optimization = {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          }
        }
      }
    };
  }

  return merge(baseConfig, config);
}
```

### plugins.ts

```typescript
/**
 * webpack插件配置
 */
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import WebpackBar from 'webpackbar';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export interface PluginsOptions {
  // HTML模板路径
  htmlTemplate?: string;
  // HTML文件名
  htmlFilename?: string;
  // 页面标题
  title?: string;
  // 是否启用bundle分析
  bundleAnalyzer?: boolean;
  // 包信息
  packageInfo?: {
    name: string;
    version: string;
  };
}

/**
 * 获取webpack插件配置
 * @param options 插件配置选项
 * @returns webpack插件数组
 */
export function getPlugins(options: PluginsOptions = {}) {
  const {
    htmlTemplate = './src/index.html',
    htmlFilename = 'index.html',
    title = 'React App',
    bundleAnalyzer = false,
    packageInfo = { name: 'app', version: '1.0.0' },
  } = options;

  const plugins: webpack.WebpackPluginInstance[] = [
    new WebpackBar(),
    
    new HtmlWebpackPlugin({
      template: htmlTemplate,
      filename: htmlFilename,
      title,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      hash: true,
    }),
    
    new MiniCssExtractPlugin({
      filename: `css/[name]-[hash].css`,
      ignoreOrder: true,
    }),
    
    new CssMinimizerWebpackPlugin(),
    
    new webpack.DefinePlugin({
      'process.env.APP_NAME': JSON.stringify(packageInfo.name),
      'process.env.APP_VERSION': JSON.stringify(packageInfo.version),
    }),
    
    new webpack.ProvidePlugin({
      $lm: ['@lm/shared', 'default'],
    }),
    
    new NodePolyfillPlugin()
  ];

  if (bundleAnalyzer) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return plugins;
}

/**
 * 获取HTML插件配置
 * @param options 配置选项
 * @returns HtmlWebpackPlugin实例
 */
export function getHtmlPlugin(options: {
  template: string;
  filename?: string;
  title?: string;
  minify?: boolean | Record<string, any>;
}) {
  const {
    template,
    filename = 'index.html',
    title = 'React App',
    minify = true,
  } = options;

  return new HtmlWebpackPlugin({
    template,
    filename,
    title,
    minify: minify === true ? {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
    } : minify,
    hash: true,
  });
}

/**
 * 获取CSS提取插件配置
 * @param options 配置选项
 * @returns MiniCssExtractPlugin实例
 */
export function getCssExtractPlugin(options: {
  filename?: string;
  ignoreOrder?: boolean;
}) {
  const {
    filename = `css/[name]-[hash].css`,
    ignoreOrder = true,
  } = options;

  return new MiniCssExtractPlugin({
    filename,
    ignoreOrder,
  });
}
```

### loaders.ts

```typescript
/**
 * webpack loader配置
 */
import * as webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/**
 * 获取CSS loader配置
 * @param options 配置选项
 * @returns webpack loader配置
 */
export function getCssLoaders(options: {
  extract?: boolean;
  sourceMap?: boolean;
} = {}) {
  const {
    extract = true,
    sourceMap = false,
  } = options;

  return {
    test: /\.css$/,
    use: [
      extract ? MiniCssExtractPlugin.loader : 'style-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap,
        },
      },
    ],
  };
}

/**
 * 获取Less loader配置
 * @param options 配置选项
 * @returns webpack loader配置数组
 */
export function getLessLoaders(options: {
  extract?: boolean;
  sourceMap?: boolean;
  modules?: boolean;
} = {}) {
  const {
    extract = true,
    sourceMap = false,
    modules = true,
  } = options;

  const lessRegex = /\.less$/;
  const lessModuleRegex = /\.module\.less$/;

  const loaders = [];

  // 普通less文件
  loaders.push({
    test: lessRegex,
    exclude: lessModuleRegex,
    use: [
      extract ? MiniCssExtractPlugin.loader : 'style-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap,
        },
      },
      {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    ],
  });

  // less模块文件
  if (modules) {
    loaders.push({
      test: lessModuleRegex,
      use: [
        extract ? MiniCssExtractPlugin.loader : 'style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap,
            modules: {
              localIdentName: '[local]___[hash:base64:5]',
            },
          },
        },
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
          },
        },
      ],
    });
  }

  return loaders;
}

/**
 * 获取JS/TS loader配置
 * @param options 配置选项
 * @returns webpack loader配置
 */
export function getJsLoaders(options: {
  exclude?: RegExp | RegExp[];
  babelOptions?: Record<string, any>;
} = {}) {
  const {
    exclude = /node_modules/,
    babelOptions = {},
  } = options;

  return {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude,
    use: {
      loader: 'babel-loader?cacheDirectory',
      options: {
        ...babelOptions,
      },
    },
  };
}

/**
 * 获取图片loader配置
 * @param options 配置选项
 * @returns webpack loader配置数组
 */
export function getImageLoaders(options: {
  limit?: number;
} = {}) {
  const {
    limit = 8 * 1024,
  } = options;

  return [{
    test: /\.(png|svg|jpeg|jpg|gif)$/i,
    type: 'asset/resource',
    parser: {
      dataUrlCondition: {
        maxSize: limit,
      },
    },
  }];
}

/**
 * 获取字体loader配置
 * @param options 配置选项
 * @returns webpack loader配置数组
 */
export function getFontLoaders() {
  return [{
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
    type: 'asset/resource',
    generator: {
      filename: 'font/[name].[hash:4][ext]',
    },
  }];
}
```

### utils.ts

```typescript
/**
 * webpack配置工具函数
 */
import * as path from 'path';

/**
 * 解析路径
 * @param dir 相对路径
 * @param root 根目录，默认为当前工作目录
 * @returns 绝对路径
 */
export function resolvePath(dir: string, root: string = process.cwd()) {
  return path.resolve(root, dir);
}

/**
 * 获取环境变量
 * @param name 环境变量名
 * @param defaultValue 默认值
 * @returns 环境变量值
 */
export function getEnv(name: string, defaultValue: string = '') {
  return process.env[name] || defaultValue;
}

/**
 * 判断是否为生产环境
 * @returns 是否为生产环境
 */
export function isProd() {
  return process.env.NODE_ENV === 'production';
}

/**
 * 获取公共路径
 * @param isProd 是否为生产环境
 * @param isQiankun 是否为微前端项目
 * @param qiankunPath 微前端路径
 * @param buildPath 构建路径
 * @returns 公共路径
 */
export function getPublicPath(isProd: boolean, isQiankun: boolean, qiankunPath?: string, buildPath?: string) {
  return isProd ? (isQiankun ? qiankunPath || '/' : buildPath || '/') : '/';
}
```

## 使用方式

在`npm/shared/src/config/index.ts`中导出webpack配置：

```typescript
import vueConfig from './vue';
import webpackConfig from './webpack';

const config = {
  vueConfig,
  reactConfig: webpackConfig,
};

export default config;
```

在React项目中使用：

```javascript
// webpack.base.js
const { getBaseConfig } = require('@lm/shared').config.reactConfig;

module.exports = getBaseConfig({
  entry: path.resolve(__dirname, './src/index.js'),
  outputPath: path.resolve(__dirname, './dist'),
  htmlTemplate: path.resolve(__dirname, './src/index.html'),
  packageInfo: require('./package.json'),
});

// webpack.dev.js
const { getDevConfig } = require('@lm/shared').config.reactConfig;
const { name } = require('./package.json');

module.exports = getDevConfig({
  port: 8004,
  packageInfo: { name },
});

// webpack.prod.js
const { getProdConfig } = require('@lm/shared').config.reactConfig;

module.exports = getProdConfig({
  sourceMap: true,
  splitChunks: true,
  clean: { path: './dist' },
});
```

## 注意事项

1. 所有配置函数都提供了默认值，用户可以根据需要覆盖这些默认值。
2. 配置函数采用了TypeScript，提供了类型检查和代码提示。
3. 配置文件之间的依赖关系清晰，便于维护和扩展。
4. 提供了灵活的API，用户可以根据需要组合使用不同的配置函数。