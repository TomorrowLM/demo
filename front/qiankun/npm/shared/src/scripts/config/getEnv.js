import { getProjectPath } from './getProjectPath';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

// ...existing code...
const tryLoad = (filePath) => {
  try {
    // 优先使用 require（大多数项目环境可用）
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(filePath);
    return mod && mod.__esModule && 'default' in mod ? mod.default : mod;
  } catch (e) {
    // 回退：解析 ES module 中的 `export default ...` 对象/字面量
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const m = content.match(/export\s+default\s+([\s\S]*?);?\s*$/);
      if (m && m[1]) {
        const code = 'module.exports = ' + m[1];
        const sandbox = { module: {}, exports: {} };
        vm.createContext(sandbox);
        vm.runInContext(code, sandbox);
        return sandbox.module.exports;
      }
    } catch (e2) {
      // 忽略解析错误
    }
  }
  return undefined;
};

const normalizeKey = (filename) => filename.replace(/^\./, '').replace(/\.[^.]+$/, '');

// 获取项目环境配置
const getEnv = () => {
  console.log('getEnv：', getProjectPath());
  console.log('process.env：', process.env.APP_ENV);
  const projectPath = getProjectPath();
  if (!projectPath) return {};

  // projectPath 可能是项目根、$lm-config 或 env 目录，按需解析到 env 目录
  let envDir;
  const base = path.basename(projectPath.root);
  console.log('base', base);
  envDir = path.join(projectPath.root, '$lm-config', 'env');
  console.log('envDir', envDir);

  if (!fs.existsSync(envDir) || !fs.statSync(envDir).isDirectory()) {
    return {};
  }

  const result = {};
  const files = fs.readdirSync(envDir);
  files.forEach((file) => {
    if (!/\.js$/i.test(file)) return;
    const key = normalizeKey(file); // ".dev.qiankun.js" -> "dev.qiankun"
    const filePath = path.join(envDir, file);
    const value = tryLoad(filePath);
    if (value !== undefined) result[key] = value;
  });

  return result;
};

export default getEnv;
// ...existing code...