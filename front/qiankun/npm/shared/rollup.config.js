/**
 * Rollup 配置文件
 * 该配置文件用于构建同时支持浏览器和 Node.js 环境的库
 * 生成两种格式：ESM（浏览器）和 CommonJS（Node.js）
 */
// 导入 Rollup 插件
const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
const resolve = require('@rollup/plugin-node-resolve')
const alias = require('@rollup/plugin-alias')
const path = require('path')
const typescript = require('@rollup/plugin-typescript')
const replace = require('@rollup/plugin-replace')

/**
 * 外部依赖配置
 * 这些依赖不会被打包到最终产物中，而是作为外部依赖引用
 * 可以减小打包体积，避免重复打包常用库
 */
// 明确 external 列表，避免把 webpack 及其插件打包进来
const external = [
  'axios',
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
const createPlugins = (isBrowser) => {
  const plugins = [
    // 先处理路径别名
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: './utils', replacement: path.resolve(__dirname, 'src/utils') }
      ].concat(isBrowser ? [
        // 在浏览器构建中排除 server/build 脚本，重定向到空 shim
        { find: path.resolve(__dirname, 'src/config/build'), replacement: path.resolve(__dirname, 'src/shims/browser-build-shim') },
        { find: './config/build', replacement: path.resolve(__dirname, 'src/shims/browser-build-shim') }
      ] : [])
    }),
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
      ignoreDynamicRequires: true
      // 不要排除所有 JSON 文件，否则 json 插件无法处理 webpack 的 JSON schema
      // exclude: ['**/*.json'] // <-- 删除这一行
    }),
    // TypeScript 编译配置
    typescript({
      tsconfig: isBrowser ? './tsconfig.esm.json' : './tsconfig.cjs.json'
    }),
    // 替换环境变量
    replace({
      preventAssignment: true,
      values: {
        'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV || 'development'),
        'process.env.VUE_APP_IS_QIANKUN': JSON.stringify(process.env.VUE_APP_IS_QIANKUN || 'false'),
        // 添加环境检测
        'typeof window': isBrowser ? '"object"' : '"undefined"',
        'typeof process': isBrowser ? '"undefined"' : '"object"'
      }
    })
  ];
  return plugins;
}

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
  // // external 使用函数，统一判断各种情况（builtins / regex / commonjs-external / node_modules）
  external: ['axios', 'js-md5', 'lodash', 'qs', 'tslib']
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
    // 使用 preserveModules 将按源文件结构输出 ESM 模块，便于按需加载。
    // preserveModulesRoot 用于移除输出路径中的根目录前缀（通常为 'src'），
    // entryFileNames/chunkFileNames 可自定义输出文件名格式。
    preserveModules: true,
    preserveModulesRoot: 'src',
    entryFileNames: '[name].js',
    chunkFileNames: '_chunks/[name]-[hash].js',
    exports: 'auto',                   // 自动检测模块的导出类型
  }, true),                 // 指定为浏览器环境

  // Node.js CommonJS 构建（仅为 build 相关脚本生成 CJS 输出）
  createConfig('src/config/build/index.js', { // 仅打包 build 目录为 CJS
    dir: 'lib/cjs',                    // 输出目录
    format: 'cjs',                     // 输出格式：CommonJS
    preserveModules: false,
    exports: 'auto',               // 自动检测模块的导出类型
    interop: 'auto'        // 自动处理默认导出的互操作
  }),
]

// 导出配置数组，Rollup 将处理每个配置项
module.exports = configs
