# Webpack配置导出指南

本文档详细说明了如何在npm/shared包中导出webpack配置，以便其他项目（如react-demo）可以使用。

## 导出策略

为了使webpack配置能够被其他项目引用，我们需要在npm/shared包中正确导出这些配置。以下是导出策略：

### 1. 在webpack目录中导出配置

首先，在`npm/shared/src/config/webpack/index.ts`文件中导出所有webpack配置：

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

### 2. 在config目录中导出webpack配置

接下来，在`npm/shared/src/config/index.ts`文件中导出webpack配置：

```typescript
import vueConfig from './vue';
import webpackConfig from './webpack';

const config = {
  vueConfig,
  reactConfig: webpackConfig,
};

export default config;
```

这样，webpack配置就可以通过`@lm/shared`包的`config.reactConfig`属性访问。

### 3. 在主入口文件中导出config

确保在`npm/shared/src/index.ts`文件中导出config：

```typescript
import utils from "./utils";
import config from './config';

const sharedConfig = {
  config,
  utils
};

export default sharedConfig;
```

## 类型定义

为了提供更好的TypeScript支持，我们应该为webpack配置添加类型定义：

### 1. 创建类型定义文件

在`npm/shared/src/config/webpack/types.ts`文件中定义类型：

```typescript
import * as webpack from 'webpack';

// 基础配置选项
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

// 开发环境配置选项
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

// 生产环境配置选项
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

// 插件配置选项
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

// 导出类型
export {
  webpack
};
```

### 2. 在各配置文件中使用类型

在各配置文件中导入并使用这些类型：

```typescript
// base.ts
import { BaseConfigOptions } from './types';

export function getBaseConfig(options: BaseConfigOptions = {}) {
  // ...
}

// dev.ts
import { DevConfigOptions } from './types';

export function getDevConfig(options: DevConfigOptions = {}) {
  // ...
}

// prod.ts
import { ProdConfigOptions } from './types';

export function getProdConfig(options: ProdConfigOptions = {}) {
  // ...
}
```

## 导出d.ts类型声明文件

为了确保TypeScript能够正确识别导出的类型，我们需要确保在构建过程中生成正确的类型声明文件。

在`npm/shared/tsconfig.esm.json`和`npm/shared/tsconfig.cjs.json`文件中，确保包含以下配置：

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "./lib/esm/types", // 或 "./lib/cjs/types"
    // 其他配置...
  }
}
```

## 使用示例

在其他项目中，可以这样使用导出的webpack配置：

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

1. **版本兼容性**：确保npm/shared包的版本与使用它的项目兼容。
2. **依赖管理**：按照之前的依赖管理策略，将webpack相关依赖声明为peerDependencies。
3. **动态引入**：在配置函数中动态引入依赖，避免在模块顶部引入。
4. **路径解析**：使用相对路径和`process.cwd()`，而不是硬编码的绝对路径。
5. **配置覆盖**：提供合理的默认值，同时允许用户覆盖这些默认值。