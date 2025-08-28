const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
const resolve = require('@rollup/plugin-node-resolve')
const typescript = require('@rollup/plugin-typescript')
const nodePolyfills = require('rollup-plugin-node-polyfills')
const copy = require('rollup-plugin-copy')
const postcss = require('rollup-plugin-postcss')


// 共用插件配置
const basePlugins = [];

// ESM专用插件配置
const esmPlugins = [
  resolve({
    browser: true,
    extensions: ['.js', '.ts', '.json'],
    mainFields: ['module', 'main'],
    preferBuiltins: false,
    alias: {
      '@': './src',
      './utils': './src/utils'
    }
  }),
  commonjs({
    extensions: ['.js', '.ts'],
    transformMixedEsModules: true,
    sourceMap: false,
    ignoreDynamicRequires: true
  }),
  nodePolyfills(), // 提供 Node.js 核心模块的浏览器 polyfills
  json(), // 支持导入 JSON 文件
  // copy({
  //   targets: [
  //     // 复制 utils 目录下的非 js/ts 文件
  //     {
  //       src: 'src/utils/**/*',
  //       dest: 'lib/esm',
  //       filter: (path) => !path.endsWith('.ts') && !path.endsWith('.js')
  //     },

  //     // 复制其他文件
  //     {
  //       src: ['src/**/*', '!src/utils/**/*'],
  //       dest: 'lib/esm',
  //       rename: (name, extension, fullPath) => {
  //         return fullPath.replace(/^src\//, '');
  //       }
  //     },
  //   ]
  // }),
  typescript({                  // TypeScript 配置
    tsconfig: './tsconfig.esm.json',
    declaration: true,          // 生成 .d.ts 文件
  }),
];

// CJS专用插件配置
const cjsPlugins = [
  resolve({
    browser: true,
    extensions: ['.js', '.ts', '.json'],
    mainFields: ['main', 'module'],
    preferBuiltins: false,
    alias: {
      '@': './src',
      './utils': './src/utils'
    }
  }),
  postcss({
    extract: false,
    modules: false,
    inject: false
  }),
  nodePolyfills(),
  json(),
  // copy({
  //   targets: [
  //     // 复制 utils 目录下的非 js/ts 文件
  //     {
  //       src: 'src/utils/**/*',
  //       dest: 'lib/cjs',
  //       filter: (path) => !path.endsWith('.ts') && !path.endsWith('.js')
  //     },
  //     // 复制其他文件
  //     {
  //       src: ['src/**/*', '!src/utils/**/*'],
  //       dest: 'lib/cjs',
  //       rename: (name, extension, fullPath) => {
  //         return fullPath.replace(/^src\//, '');
  //       }
  //     }
  //   ]
  // })
  typescript({
    tsconfig: './tsconfig.cjs.json',
    declaration: true,          // 生成 .d.ts 文件
  }),
];

module.exports = [
  {
    input: 'src/index.ts',
    output: {
      dir: 'lib/esm',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: '[name].js', // 确保输出 .js 文件
      hoistTransitiveImports: false // 禁用传递性导入提升
    },
    plugins: esmPlugins,
    external: ['@/store', 'axios', 'js-md5', 'lodash', 'tslib', 'vue'] // 标记为外部依赖
  },
  {
    // CJS 构建配置
    input: 'src/index.ts', // 修改为主入口
    output: {
      dir: 'lib/cjs',
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named'
    },
    plugins: cjsPlugins,
    external: ['@/store', 'axios', 'js-md5', 'lodash']
  }
];
