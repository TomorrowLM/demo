const commonjs = require('@rollup/plugin-commonjs')        // 将 CommonJS 模块转换为 ES 模块
const json = require('@rollup/plugin-json')               // 支持导入 JSON 文件
const resolve = require('@rollup/plugin-node-resolve')    // 解析第三方依赖
const typescript = require('@rollup/plugin-typescript')   // 编译 TypeScript 文件
const nodePolyfills = require('rollup-plugin-node-polyfills') // 提供 Node.js 核心模块的浏览器 polyfills
const copy = require('rollup-plugin-copy')                // 复制文件和文件夹
const postcss = require('rollup-plugin-postcss')          // 处理 CSS 文件


// 共用插件配置 - 可以在 ESM 和 CJS 构建中共同使用的插件
const basePlugins = [];

// ESM专用插件配置 - 用于生成 ES 模块格式的输出
const esmPlugins = [
  resolve({
    browser: true,                      // 优先使用为浏览器环境准备的版本
    extensions: ['.js', '.ts', '.json'], // 自动解析这些扩展名的文件
    mainFields: ['module', 'main'],     // 按优先级从 package.json 中查找入口字段
    preferBuiltins: false,              // 不优先使用 Node.js 内置模块
    alias: {                            // 路径别名配置
      '@': './src',                     // 将 @/ 映射到 ./src 目录
      './utils': './src/utils'          // 将 ./utils 映射到 ./src/utils 目录
    }
  }),
  commonjs({
    extensions: ['.js', '.ts'],         // 处理这些扩展名的文件
    transformMixedEsModules: true,      // 转换混合的 ES 模块
    sourceMap: false,                   // 不生成 sourceMap
    ignoreDynamicRequires: true         // 忽略动态 require 语句
  }),
  nodePolyfills(),                      // 提供 Node.js 核心模块的浏览器 polyfills
  json(),                               // 支持导入 JSON 文件
  // copy({
  //   targets: [
  //     // 复制 utils 目录下的非 js/ts 文件
  //     {
  //       src: 'src/utils/**/*',        // 源路径：utils 目录下的所有文件和子目录
  //       dest: 'lib/esm',              // 目标路径：ESM 输出目录
  //       filter: (path) => !path.endsWith('.ts') && !path.endsWith('.js') // 只复制非 js/ts 文件
  //     },

  //     // 复制其他文件
  //     {
  //       src: ['src/**/*', '!src/utils/**/*'], // 源路径：src 目录下除 utils 外的所有文件
  //       dest: 'lib/esm',                      // 目标路径：ESM 输出目录
  //       rename: (name, extension, fullPath) => {
  //         return fullPath.replace(/^src\//, ''); // 移除路径中的 src/ 前缀
  //       }
  //     },
  //   ]
  // }),
  typescript({                          // TypeScript 配置
    tsconfig: './tsconfig.esm.json',    // ESM 专用的 TypeScript 配置文件
    declaration: true,                  // 生成 .d.ts 类型声明文件
  }),
];

// CJS专用插件配置 - 用于生成 CommonJS 格式的输出
const cjsPlugins = [
  resolve({
    browser: true,                      // 优先使用为浏览器环境准备的版本
    extensions: ['.js', '.ts', '.json'], // 自动解析这些扩展名的文件
    mainFields: ['main', 'module'],     // 按优先级从 package.json 中查找入口字段（注意与 ESM 的顺序相反）
    preferBuiltins: false,              // 不优先使用 Node.js 内置模块
    alias: {                            // 路径别名配置
      '@': './src',                     // 将 @/ 映射到 ./src 目录
      './utils': './src/utils'          // 将 ./utils 映射到 ./src/utils 目录
    }
  }),
  postcss({                             // 处理 CSS 文件
    extract: false,                     // 不将 CSS 提取到单独的文件
    modules: false,                     // 不启用 CSS 模块
    inject: false                       // 不自动注入 CSS
  }),
  nodePolyfills(),                      // 提供 Node.js 核心模块的浏览器 polyfills
  json(),                               // 支持导入 JSON 文件
  // copy({
  //   targets: [
  //     // 复制 utils 目录下的非 js/ts 文件
  //     {
  //       src: 'src/utils/**/*',        // 源路径：utils 目录下的所有文件和子目录
  //       dest: 'lib/cjs',              // 目标路径：CJS 输出目录
  //       filter: (path) => !path.endsWith('.ts') && !path.endsWith('.js') // 只复制非 js/ts 文件
  //     },
  //     // 复制其他文件
  //     {
  //       src: ['src/**/*', '!src/utils/**/*'], // 源路径：src 目录下除 utils 外的所有文件
  //       dest: 'lib/cjs',                      // 目标路径：CJS 输出目录
  //       rename: (name, extension, fullPath) => {
  //         return fullPath.replace(/^src\//, ''); // 移除路径中的 src/ 前缀
  //       }
  //     }
  //   ]
  // })
  typescript({
    tsconfig: './tsconfig.cjs.json',    // CJS 专用的 TypeScript 配置文件
    declaration: true,                  // 生成 .d.ts 类型声明文件
  }),
];

module.exports = [
  {
    input: 'src/index.ts',              // 入口文件
    output: {
      dir: 'lib/esm',                  // 输出目录
      format: 'esm',                    // 输出格式为 ES 模块
      preserveModules: true,            // 保持模块结构
      preserveModulesRoot: 'src',       // 模块根目录
      entryFileNames: '[name].js',      // 确保输出 .js 文件
      hoistTransitiveImports: false     // 禁用传递性导入提升，避免副作用问题
    },
    plugins: esmPlugins,                // 使用 ESM 专用插件
    external: ['@/store', 'axios', 'js-md5', 'lodash', 'tslib', 'vue'] // 标记为外部依赖，不会被打包
  },
  {
    // CJS 构建配置
    input: 'src/index.ts',              // 入口文件
    output: {
      dir: 'lib/cjs',                  // 输出目录
      format: 'cjs',                    // 输出格式为 CommonJS
      preserveModules: true,            // 保持模块结构
      preserveModulesRoot: 'src',       // 模块根目录
      exports: 'named'                  // 使用命名导出
    },
    plugins: cjsPlugins,                // 使用 CJS 专用插件
    external: ['@/store', 'axios', 'js-md5', 'lodash'] // 标记为外部依赖，不会被打包
  }
];
