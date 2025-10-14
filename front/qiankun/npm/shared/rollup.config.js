/**
 * Rollup 配置文件
 * 该配置文件用于构建同时支持浏览器和 Node.js 环境的库
 * 生成两种格式：ESM（浏览器）和 CommonJS（Node.js）
 */
// 导入 Rollup 插件
const commonjs = require('@rollup/plugin-commonjs')       // 将 CommonJS 模块转换为 ES 模块
const json = require('@rollup/plugin-json')              // 允许导入 JSON 文件
const resolve = require('@rollup/plugin-node-resolve')   // 解析 node_modules 中的依赖
const typescript = require('@rollup/plugin-typescript') // TypeScript 编译支持
// const nodePolyfills = require('rollup-plugin-node-polyfills') // 提供 Node.js 核心模块的浏览器 polyfills
const replace = require('@rollup/plugin-replace')        // 用于替换代码中的变量，如环境变量
// const esbuild = require('rollup-plugin-esbuild').default;
/**
 * 外部依赖配置
 * 这些依赖不会被打包到最终产物中，而是作为外部依赖引用
 * 可以减小打包体积，避免重复打包常用库
 */
// 外部依赖配置
const external = [
  // 'axios', 
  'js-md5', 'lodash', 'qs', 'tslib', 'vue', 'webpack', 'path', 'fs',
  'autoprefixer', 'postcss-pxtorem', 'tapable', 'webpack-sources',
  'glob-to-regexp', 'schema-utils', 'acorn', '@webassemblyjs/ast',
  '@webassemblyjs/wasm-parser', '@webassemblyjs/wasm-edit',
  'querystring-es3', 'punycode/', 'css-minimizer-webpack-plugin', '@parcel/css',
  'url', '@swc/core',
  // 添加所有 webpack 相关的依赖
  'webpackbar', 'html-webpack-plugin', 'mini-css-extract-plugin',
  'css-minimizer-webpack-plugin', 'node-polyfill-webpack-plugin',
  'webpack-bundle-analyzer', 'css-loader', 'style-loader', 'less-loader',
  'less', 'babel-loader', '@babel/core',
]

/**
 * 创建插件配置函数
 * @param {boolean} isBrowser - 是否为浏览器环境构建
 * @returns {Array} - 插件配置数组
 */
const createPlugins = (isBrowser) => [
  // 解析模块路径和第三方依赖
  resolve({
    browser: isBrowser,
    preferBuiltins: !isBrowser,
    extensions: ['.js', '.ts', '.json'],
    alias: {
      '@': './src',
      './utils': './src/utils'
    }
  }),

  // 支持导入 JSON 文件 - 必须在 commonjs 之前
  json({
    preferConst: true,
    compact: true,
    namedExports: false
  }),

  // 将 CommonJS 模块转换为 ES 模块
  commonjs({
    extensions: ['.js', '.ts'],
    transformMixedEsModules: true,
    sourceMap: false,
    ignoreDynamicRequires: true,
    // 排除 JSON 文件，让 json 插件处理
    exclude: ['**/*.json']
  }),

  // TypeScript 编译配置
  typescript({
    tsconfig: isBrowser ? './tsconfig.esm.json' : './tsconfig.cjs.json'
  }),

  // 替换环境变量
  replace({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_APP_IS_QIANKUN': JSON.stringify(process.env.VUE_APP_IS_QIANKUN || 'false'),
      // 添加环境检测
      'typeof window': isBrowser ? '"object"' : '"undefined"',
      'typeof process': isBrowser ? '"undefined"' : '"object"'
    }
  })
]

/**
 * 创建 Rollup 配置对象
 * @param {string} input - 入口文件路径
 * @param {Object} output - 输出配置
 * @param {boolean} isBrowser - 是否为浏览器环境构建
 * @returns {Object} - Rollup 配置对象
 */
const createConfig = (input, output, isBrowser = false) => ({
  input,                              // 入口文件
  output,                             // 输出配置
  plugins: createPlugins(isBrowser),  // 根据环境创建插件配置
  external: isBrowser ? ['js-md5', 'lodash', 'qs', 'tslib'] : external.filter(dep => dep !== 'axios') // 外部依赖配置，移除 axios
  // 浏览器环境只排除基本依赖，Node.js 环境排除所有 external 数组中的依赖
})

/**
 * Rollup 配置数组
 * 包含两种构建配置：浏览器 ESM 和 Node.js CommonJS
 */
const configs = [
  // 浏览器 ESM 构建配置
  createConfig('src/index.ts', {       // 入口文件
    dir: 'lib/esm',                    // 输出目录
    format: 'esm',                     // 输出格式：ES 模块
    preserveModules: true,             // 保持模块结构，不合并模块
    preserveModulesRoot: 'src',        // 模块根目录，输出路径会从这里开始
    exports: 'auto',                   // 自动检测模块的导出类型
  }, true),                            // 指定为浏览器环境

  // Node.js CommonJS 构建配置
  createConfig('src/index.ts', {       // 入口文件
    dir: 'lib/cjs',                    // 输出目录
    format: 'cjs',                     // 输出格式：CommonJS
    preserveModules: true,             // 保持模块结构，不合并模块
    preserveModulesRoot: 'src',        // 模块根目录
    exports: 'auto'                    // 自动检测模块的导出类型
  }),                                  // 默认为 Node.js 环境
]

// 导出配置数组，Rollup 将处理每个配置项
module.exports = configs
