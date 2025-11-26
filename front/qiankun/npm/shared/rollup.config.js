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

// // 插件：在 CJS 输出中把 exports.__require 的懒加载导出替换为直接执行并导出真实对象
// function cjsDirectExportPlugin(wrapperOnly = false) {
//   return {
//     name: 'cjs-direct-export',
//     generateBundle(options, bundle) {
//       Object.keys(bundle).forEach((fileName) => {
//         const chunk = bundle[fileName];
//         if (chunk.type !== 'chunk' || !chunk.code) return;
//         // 只处理 CJS 输出（包含 exports.__require 的文件）
//         if (!/exports\.__require\s*=/.test(chunk.code)) return;
//         // 用正则找到所有 exports.__require = <id>; 并在后面追加 module.exports = <id>(); exports.default = module.exports;
//         const newCode = chunk.code.replace(/exports\.__require\s*=\s*([^;\n]+);/g, (m, id) => {
//           // 保留原始赋值，再追加直接执行导出逻辑
//           return m + '\ntry { if (typeof ' + id + ' === "function") { module.exports = ' + id + '(); exports.default = module.exports; } else if (' + id + ' && ' + id + '.default) { module.exports = ' + id + '.default; exports.default = module.exports; } } catch(e) { /* ignore */ }';
//         });
//         chunk.code = newCode;
//         // update bundle entry
//         bundle[fileName] = chunk;
//       });
//     }
//   }
// }

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

// // 新增：支持 Node 内置模块及 ?commonjs-external 后缀的判断
// const nodeBuiltins = (() => {
//   try {
//     return require('module').builtinModules || []
//   } catch (e) {
//     return []
//   }
// })()

// const externalRegexps = [
//   /^webpack($|[-/])/,
//   /^html-webpack-plugin($|[-/])/,
//   /^mini-css-extract-plugin($|[-/])/,
//   /^webpack-bundle-analyzer($|[-/])/,
//   /^webpackbar($|[-/])/
// ]

// const isExternalId = id => {
//   if (!id) return false
//   // 完全匹配字符串列表
//   if (external.includes(id)) return true
//   // 正则列表匹配
//   if (externalRegexps.some(r => r.test(id))) return true
//   // 匹配 node 内置模块或其子路径
//   if (nodeBuiltins.some(b => id === b || id.startsWith(b + '/'))) return true
//   // 处理 commonjs plugin 生成的虚拟 id，如 fs?commonjs-external
//   if (/\?commonjs-external$/.test(id)) return true
//   // node_modules 中的大模块路径也视为 external（避免把依赖打包进来）
//   if (/\bnode_modules\b/.test(id)) return true
//   return false
// }

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
      ]
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

  // // 仅在 Node/CJS 输出时添加后处理插件，自动把 __require 懒加载导出替换为直接执行的 module.exports
  // if (!isBrowser) {
  //   plugins.push(cjsDirectExportPlugin());
  // }

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
  // external: id => {
  //   if (isBrowser) {
  //     // 浏览器构建仍把常用依赖视为 external
  //     if (['axios', 'js-md5', 'lodash', 'qs', 'tslib'].includes(id)) return true
  //   }
  //   return isExternalId(id)
  // }
  // 浏览器环境和 Node.js 环境都将 axios 作为外部依赖
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
    preserveModules: true,             // 保持模块结构，不合并模块。会导致为了处理模块内部的依赖顺序、循环依赖或 preserveModules 输出，生成了只导出懒函数 exports.__require = requireIndex_builder 的模块。
    preserveModulesRoot: 'src',        // 模块根目录，输出路径会从这里开始
    exports: 'auto',                   // 自动检测模块的导出类型
  }, true),                 // 指定为浏览器环境

  // // Node.js CommonJS 构建配置
  createConfig('src/index.ts', {       // 入口文件
    dir: 'lib/cjs',                    // 输出目录
    format: 'cjs',                     // 输出格式：CommonJS
    preserveModules: true,             // 保持模块结构，不合并模块
    preserveModulesRoot: 'src',        // 模块根目录
    exports: 'auto',               // 自动检测模块的导出类型
    interop: 'auto'        // 自动处理默认导出的互操作
  }),                                  // 默认为 Node.js 环境
]

// 导出配置数组，Rollup 将处理每个配置项
module.exports = configs
