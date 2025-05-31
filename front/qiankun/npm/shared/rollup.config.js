import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json'; // 引入 JSON 插件
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'lib/cjs/index.js', // 输入 CJS 文件
  output: {
    dir: 'lib/esm',
    format: 'esm'
  },
  plugins: [
    resolve({ browser: true }), // 添加这一行以支持浏览器环境
    commonjs(),
    typescript(), // 添加这一行以支持 .ts 文件
    nodePolyfills(), // 添加这一行以支持 zlib ://d:\work\demo\front\qiankun\npm\shared\rollup.config.js#L9-L12
    json() // 添加 JSON 插件
  ]
}
