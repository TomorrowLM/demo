/**
 * 获取项目的 package.json 内容
 * 此脚本用于在 qiankun 配置中获取引入 shared 包的项目的 package.json
 */
const fs = require('fs');
const path = require('path');

/**
 * 获取项目的 package.json 内容
 * @returns {object|null} package.json 的内容，如果读取失败则返回 null
 */
function getProjectPackageJson() {
  try {
    // 使用 process.cwd() 获取当前工作目录，即引入 shared 包的项目根目录
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    
    // 检查文件是否存在
    if (!fs.existsSync(packageJsonPath)) {
      console.warn(`找不到 package.json 文件: ${packageJsonPath}`);
      return null;
    }
    
    // 同步读取文件内容
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    
    // 解析 JSON 内容
    return JSON.parse(packageJsonContent);
  } catch (error) {
    console.error(`读取 package.json 时出错: ${error.message}`);
    return null;
  }
}

/**
 * 获取项目名称
 * @returns {string} 项目名称，如果无法获取则返回默认值
 */
function getProjectName(defaultName = 'unknown-project') {
  const packageJson = getProjectPackageJson();
  return packageJson?.name || defaultName;
}

// 导出函数
module.exports = {
  getProjectPackageJson,
  getProjectName
};