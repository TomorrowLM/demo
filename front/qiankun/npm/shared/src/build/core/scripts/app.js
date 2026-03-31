/**
 * 项目相关的辅助方法
 */
const APP_PATH = process.cwd()

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
      const requireFromProject = createReq(path.resolve(APP_PATH, 'noop'));
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
    // 使用 APP_PATH 获取当前工作目录，即引入 shared 包的项目根目录
    const path = tryRequire('path') || require('path');
    const fs = tryRequire('fs') || require('fs');
    const packageJsonPath = path.resolve(APP_PATH, 'package.json');

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
 * 获取项目信息，包括名称、版本和路径
 * @returns {string} 项目名称，如果无法获取则返回默认值
 */
function getProjectInfo(defaultName = 'unknown-project') {
  const packageJson = getProjectPackageJson();
  return {
    APP_NAME: (packageJson && packageJson.name) || defaultName,
    APP_VERSION: (packageJson && packageJson.version) || 'unknown-version',
    APP_PATH
  };
}

// 创建构建配置文件的工具函数
function createBuildConfigFile(config) {
  function isPlainObject(value) {
    if (!value || Object.prototype.toString.call(value) !== '[object Object]') {
      return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  function serializeBuildConfig(value, seen = new WeakSet()) {
    if (value === undefined) {
      return '[undefined]';
    }

    if (value === null || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'function') {
      return `[Function ${value.name || 'anonymous'}]`;
    }

    if (value instanceof RegExp) {
      return value.toString();
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Buffer.isBuffer(value)) {
      return `[Buffer length=${value.length}]`;
    }

    if (seen.has(value)) {
      return '[Circular]';
    }

    if (Array.isArray(value)) {
      seen.add(value);
      return value.map(item => serializeBuildConfig(item, seen));
    }

    if (!isPlainObject(value)) {
      seen.add(value);
      const serialized = {
        __type: value.constructor && value.constructor.name ? value.constructor.name : 'Object'
      };

      Object.keys(value).forEach((key) => {
        serialized[key] = serializeBuildConfig(value[key], seen);
      });

      return serialized;
    }

    seen.add(value);
    return Object.keys(value).reduce((result, key) => {
      result[key] = serializeBuildConfig(value[key], seen);
      return result;
    }, {});
  }
  const fs = tryRequire('fs') || require('fs');
  const path = tryRequire('path') || require('path');
  const configDir = path.resolve(APP_PATH, '$lm-config');
  const buildConfigPath = path.resolve(configDir, 'buildConfig.js');
  const projectInfo = getProjectInfo();
  const serializedConfig = serializeBuildConfig(config);

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const fileContent = [
    '/**',
    ' * 自动生成的构建配置快照，请勿手动修改。',
    ` * 生成时间: ${new Date().toISOString()}`,
    ` * 项目名称: ${projectInfo.APP_NAME}`,
    ` * 项目版本: ${projectInfo.APP_VERSION}`,
    ' */',
    '',
    'module.exports = ' + JSON.stringify(serializedConfig, null, 2) + ';',
    ''
  ].join('\n');

  fs.writeFileSync(buildConfigPath, fileContent, 'utf8');
  console.log(`[shared] 构建配置文件已创建: ${buildConfigPath}`);

  return buildConfigPath;
}

module.exports = {
  getDependency,
  getProjectPackageJson,
  getProjectInfo,
  createBuildConfigFile
};