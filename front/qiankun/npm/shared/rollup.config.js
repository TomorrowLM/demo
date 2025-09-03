const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
const resolve = require('@rollup/plugin-node-resolve')
const typescript = require('@rollup/plugin-typescript')

// 所有需要标记为外部依赖的包
const external = [
  'axios',
  'js-md5',
  'lodash',
  'qs',
  'tslib',
  'vue',
  'webpack',
  'path',
  'autoprefixer',
  'postcss-pxtorem',
  'tapable',
  'webpack-sources',
  'glob-to-regexp',
  'schema-utils',
  'acorn',
  '@webassemblyjs/ast',
  '@webassemblyjs/wasm-parser',
  '@webassemblyjs/wasm-edit',
  'querystring-es3',
  'punycode/'
]

module.exports = [
  // 浏览器 ESM 构建 - 使用browser.ts入口
  {
    input: 'src/browser.ts',
    output: {
      file: 'lib/esm/index.js',
      format: 'esm',
      exports: 'default'
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
        extensions: ['.js', '.ts', '.json']
      }),
      commonjs({
        extensions: ['.js', '.ts']
      }),
      json(),
      typescript({
        tsconfig: false,
        target: 'es2015',
        module: 'esnext',
        declaration: false,
        sourceMap: false
      })
    ],
    external: ['axios', 'js-md5', 'lodash', 'qs', 'tslib'] // 只保留必要的外部依赖
  },
  // Node.js CommonJS 构建 - 使用完整的index.ts入口
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/cjs/index.js',
      format: 'cjs',
      exports: 'default'
    },
    plugins: [
      resolve({
        browser: false,
        preferBuiltins: true,
        extensions: ['.js', '.ts', '.json']
      }),
      commonjs({
        extensions: ['.js', '.ts']
      }),
      json(),
      typescript({
        tsconfig: false,
        target: 'es5',
        module: 'esnext',
        declaration: false,
        sourceMap: false
      })
    ],
    external: ['axios', 'js-md5', 'lodash', 'qs', 'tslib'] // 只保留必要的外部依赖
  }
]
