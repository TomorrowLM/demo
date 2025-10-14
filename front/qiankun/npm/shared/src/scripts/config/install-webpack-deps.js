#!/usr/bin/env node

/**
 * 此脚本用于帮助用户安装 webpack 相关依赖
 * 使用方法：
 * npm run install-webpack-deps -- [group]
 * 
 * 可选的 group 参数：
 * - all: 安装所有 webpack 相关依赖
 * - base: 安装基础依赖 (webpack, webpack-cli)
 * - plugins: 安装插件依赖
 * - loaders: 安装加载器依赖
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 依赖分组
const dependencies = {
  base: [
    'webpack@^5.0.0',
    'webpack-cli@^4.0.0',
  ],
  plugins: [
    'webpackbar@^5.0.0',
    'html-webpack-plugin@^5.0.0',
    'mini-css-extract-plugin@^2.0.0',
    'css-minimizer-webpack-plugin@^4.0.0',
    'node-polyfill-webpack-plugin@^2.0.0',
    'webpack-bundle-analyzer@^4.0.0',
  ],
  loaders: [
    'style-loader@^3.0.0',
    'css-loader@^6.0.0',
    'less@^4.0.0',
    'less-loader@^11.0.0',
    'babel-loader@^9.0.0',
    '@babel/core@^7.0.0',
  ],
};

// 检测包管理器
function detectPackageManager() {
  // 检查是否有 yarn.lock
  if (fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'))) {
    return 'yarn';
  }
  
  // 检查是否有 pnpm-lock.yaml
  if (fs.existsSync(path.resolve(process.cwd(), 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  
  // 默认使用 npm
  return 'npm';
}

// 获取安装命令
function getInstallCommand(packageManager, deps) {
  switch (packageManager) {
    case 'yarn':
      return `yarn add ${deps.join(' ')} --dev`;
    case 'pnpm':
      return `pnpm add ${deps.join(' ')} --save-dev`;
    default:
      return `npm install ${deps.join(' ')} --save-dev`;
  }
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const group = args[0] || 'all';
  
  let depsToInstall = [];
  
  if (group === 'all') {
    depsToInstall = [
      ...dependencies.base,
      ...dependencies.plugins,
      ...dependencies.loaders,
    ];
  } else if (dependencies[group]) {
    depsToInstall = dependencies[group];
  } else {
    console.error(`未知的依赖组: ${group}`);
    console.error('可用的组: all, base, plugins, loaders');
    process.exit(1);
  }
  
  if (depsToInstall.length === 0) {
    console.log('没有依赖需要安装');
    process.exit(0);
  }
  
  const packageManager = detectPackageManager();
  const command = getInstallCommand(packageManager, depsToInstall);
  
  console.log(`使用 ${packageManager} 安装依赖...`);
  console.log(command);
  
  try {
    execSync(command, { stdio: 'inherit' });
    console.log('依赖安装成功！');
  } catch (error) {
    console.error('依赖安装失败:', error.message);
    process.exit(1);
  }
}

main();