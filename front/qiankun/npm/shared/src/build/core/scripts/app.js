/**
 * 项目相关的辅助方法
 */
const { appRoot } = require("./paths")

// 中文解释：尝试通过间接调用 require 来加载模块，避免被打包工具静态分析
function tryRequire(name) {
  try {
    // Use an indirect require via Function to avoid static analysis by bundlers
    return Function('return require')(name);
  } catch (e) {
    return null;
  }
}

// 获取 createRequire 方法，用于动态加载模块
function getCreateRequire() {
  const mod = tryRequire('module');
  return mod && (mod.createRequire || mod.createRequireFromPath) ? (mod.createRequire || mod.createRequireFromPath) : null;
}

// 获取依赖项，优先从项目根目录加载，如果失败则尝试本地 require
function getDependency(type, options = {}) {
  if (options && options[type]) return options[type];

  // Try to require from consumer project root using module.createRequire if available
  const createReq = getCreateRequire();
  if (createReq) {
    try {
      const path = tryRequire('path');
      const requireFromProject = createReq(path.resolve(appRoot, 'noop'));
      return requireFromProject(type);
    } catch (e) {
      // fallthrough to local require
    }
  }

  // fallback to local require
  try {
    return tryRequire(type) || require(type);
  } catch (err) {
    // not available: print unified warning to help consumer troubleshoot
    console.warn(`[shared] dependency "${type}" not found. ` +
      `Please ensure the consumer project has "${type}" installed or pass it explicitly via options.${type} when creating the builder.`);
    return null;
  }
}

/**
 * 获取项目的 package.json 内容
 * @returns {object|null} package.json 的内容，如果读取失败则返回 null
 */
function getProjectPackageJson() {
  try {
    // 使用 appRoot 获取当前工作目录，即引入 shared 包的项目根目录
    const path = tryRequire('path') || require('path');
    const fs = tryRequire('fs') || require('fs');
    const packageJsonPath = path.resolve(appRoot, 'package.json');

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
function getProjectInfo(defaultName = 'unknown-project') {
  const packageJson = getProjectPackageJson();
  return {
    name: (packageJson && packageJson.name) || defaultName,
    version: (packageJson && packageJson.version) || 'unknown-version'
  };
}

// 获取项目路径
function getProjectPath() {
  const fs = tryRequire('fs') || require('fs');
  const path = tryRequire('path') || require('path');

  let dir = process.cwd();
  const root = path.parse(dir).root;

  while (true) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        // 如果是 shared 包自己，继续向上查找；否则返回项目 info
        if (pkg.name !== '@lm/shared') {
          return { root: dir, name: pkg.name || '', packageJson: pkg };
        }
      } catch (e) {
        // 忽略 package.json 解析错误，继续向上查找
      }
    }

    if (dir === root) break;
    dir = path.dirname(dir);
  }
  return null;
}

module.exports = {
  getDependency,
  getProjectPackageJson,
  getProjectInfo,
  getProjectPath
};