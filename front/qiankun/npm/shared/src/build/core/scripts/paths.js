/**
 * 路径相关脚本
 */

import * as path from 'path';

/**
 * 项目根目录（以当前进程工作目录为准）
 */
export const appRoot = process.cwd();

/**
 * 从项目根目录解析绝对路径
 * 示例：resolveApp('src', 'main.ts') => d:/project/src/main.ts
 */
export function resolveApp(...segments) {
  return path.resolve(appRoot, ...segments);
}

/**
 * 从项目根目录进行路径拼接（非规范化）
 * 示例：joinApp('src', 'assets') => d:/project/src/assets
 */
export function joinApp(...segments) {
  return path.join(appRoot, ...segments);
}

/**
 * 统一处理路径的末尾斜杠
 * - needsSlash = true 时，确保以 / 结尾
 * - needsSlash = false 时，确保不以 / 结尾
 */
export function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) return inputPath.slice(0, -1);
  if (!hasSlash && needsSlash) return inputPath + '/';
  return inputPath;
}

/**
 * 获取标准化后的 publicPath（默认带尾斜杠）
 * 优先级：入参 fromEnv > 环境变量 PUBLIC_PATH > fallback
 */
export function getPublicPath(fromEnv, fallback = '/') {
  const value = fromEnv ?? process.env.PUBLIC_PATH ?? fallback;
  return ensureSlash(value, true);
}

/**
 * 解析 src 目录的绝对路径
 */
export function resolveSrcDir() {
  return resolveApp('src');
}

/**
 * 基于任意 base 目录创建一个解析器
 * - 适用于 monorepo 子包场景（如子项目有自己单独的根目录）
 */
export function createBaseResolver(baseDir) {
  const based = path.isAbsolute(baseDir) ? baseDir : resolveApp(baseDir);
  return {
    base: based,
    resolve: (...segments) => path.resolve(based, ...segments),
    join: (...segments) => path.join(based, ...segments),
  };
}

export default {
  appRoot,
  resolveApp,
  joinApp,
  ensureSlash,
  getPublicPath,
  resolveSrcDir,
  createBaseResolver,
};