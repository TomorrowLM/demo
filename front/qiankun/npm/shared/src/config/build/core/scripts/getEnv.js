// import { getProjectPath } from '@/scripts/getProjectPath';
// import fs from 'fs';
// import path from 'path';
// import vm from 'vm';
const { getProjectPath } = require('./getProjectPath');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const tryLoad = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log('读取文件内容:', filePath);

    // 检查文件内容是否包含 ESM 语法
    if (content.includes('export default') || content.includes('export const') || content.includes('export function')) {
      // 获取文件所在目录，用于解析相对路径
      const fileDir = path.dirname(filePath);
      // 创建一个自定义的 require 函数，用于在沙箱中解析相对路径
      const customRequire = (modulePath) => {
        console.log('自定义 require:', modulePath)
        // 如果是相对路径，则相对于当前文件解析
        if (modulePath.startsWith('./') || modulePath.startsWith('../')) {
          const absolutePath = path.resolve(fileDir, modulePath);
          return tryLoad(absolutePath);
        }
        // 否则使用 Node.js 的 require
        return require(modulePath);
      };

      // 使用 vm 模块执行文件内容
      const sandbox = {
        exports: {},
        module: { exports: {} },
        require: customRequire,
        console: console,
        process: process
      };

      // 将 ESM 转换为 CommonJS 格式
      const transformedContent = content
        .replace(/export\s+default\s+/, 'module.exports = ')
        .replace(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g, 'const $1 = require("$2")');

      vm.runInNewContext(`(function(exports, module, require) { ${transformedContent} })(exports, module, require)`, sandbox);

      return sandbox.module.exports;
    } else {
      // 如果不是 ESM，尝试直接 require
      return require(filePath);
    }
  } catch (error) {
    console.error('加载文件出错:', error);
    return null;
  }
};

const normalizeKey = (filename) => filename.replace(/^\./, '').replace(/\.[^.]+$/, '');

// 获取项目环境配置
const getEnvConfig = (env) => {
  const projectPath = getProjectPath();
  if (!projectPath) return {};
  let envDir;
  const base = path.basename(projectPath.root);
  envDir = path.join(projectPath.root, '$lm-config', 'env');
  if (!fs.existsSync(envDir) || !fs.statSync(envDir).isDirectory()) {
    return {};
  }
  const result = {};
  const files = fs.readdirSync(envDir);
  // 使用同步方式处理文件，确保结果在返回前已完成
  for (const file of files) {
    if (!/\.js$/i.test(file)) continue;
    const key = normalizeKey(file);
    const filePath = path.join(envDir, file);
    const value = tryLoad(filePath); // 同步获取值
    if (value !== undefined) result[key] = value;
  }
  console.log(result, 'result')
  console.log('getEnv：当前环境', process.env.NODE_ENV);
  console.log('getEnv：当前运行项目', base);
  console.log('getEnv：当前环境配置目录地址', envDir);
  return result;
};

module.exports = { getEnvConfig }