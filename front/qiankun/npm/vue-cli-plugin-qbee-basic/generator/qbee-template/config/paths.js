/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const tarName = process.env.npm_package_name;
const buildPath = 'build/' + tarName;

const suffix = tarName.split('-').slice(2);
const shortName = suffix.join('/');
const mfName = suffix.join('');

module.exports = {
  name: tarName,
  buildPath: buildPath, // 应用到 vue.config.js中 outputDir
  dotenv: resolveApp('.env'),
  appBuild: resolveApp(buildPath), // 打包输出路径
  publicUrl: `/${shortName}/`, // 应用到 vue.config.js中 publicPath 
  mfName: `${mfName}` // 项目导出名 应用于微前端 在基座项目中引用
};
