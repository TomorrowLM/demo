/**
 * 核心常量与通用辅助函数（供 Vue CLI / Webpack / Vite 等适配器复用）
 * 注意：此文件不应包含与具体打包器强耦合的逻辑，只提供通用常量/方法。
 */
import {
  BuildMode,
  HashStrategy,
  OutputOptions,
  DEFAULT_OUTPUT,
  DEFAULT_ALIASES,
  DEFAULT_DEV_SERVER,
  DEFAULT_FILENAME_PATTERN,
  DEFAULT_CHUNK_FILENAME_PATTERN,
  DEFAULT_CONTENTHASH_FILENAME_PATTERN,
  DEFAULT_CONTENTHASH_CHUNK_FILENAME_PATTERN,
} from './schema';

/**
 * 默认哈希策略
 * - 开发环境建议使用 hash
 * - 生产环境建议使用 contenthash（通过 getFilenamePatterns 按需切换）
 */
export const DEFAULT_HASH_STRATEGY: HashStrategy = 'hash';

/**
 * 运行时标识
 * - isNode: 是否处于 Node 环境
 */
export const RUNTIME_FLAGS = {
  isNode: typeof process !== 'undefined' && !!(process.versions && process.versions.node),
};

/**
 * 已知环境变量键（用于文档/提示或白名单筛选）
 * - 兼容你现有工程中的 VUE_APP_* 变量
 */
export const KNOWN_ENV_KEYS: string[] = [
  'APP_ENV',
  'NODE_ENV',
  'APP_NAME',
  'PUBLIC_PATH',
  'OUTPUT_DIR',
  'PORT',
  'QIANKUN',
  'QIANKUN_MASTER',
  'QIANKUN_SLAVE',
  'ANALYZE',
  'LEGACY',
  'BASE_URL',
  // 兼容历史 Vue CLI 变量
  'VUE_APP_IS_QIANKUN',
  'VUE_APP_PORT',
  'VUE_APP_Build_Qiankun_Path',
  'VUE_APP_Build_Path',
  'VUE_APP_OUTPUTDIR',
  'VUE_APP_PROXY_API',
  'VUE_APP_API_HOST',
];

/**
 * 按模式与哈希策略返回文件名模板
 * - development 模式通常使用 hash
 * - production 模式通常使用 contenthash
 */
export function getFilenamePatterns(
  mode: BuildMode,
  strategy?: HashStrategy
): { filename: string; chunkFilename: string } {
  const s: HashStrategy =
    strategy ?? (mode === 'production' ? 'contenthash' : DEFAULT_HASH_STRATEGY);

  if (s === 'none') {
    return {
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js',
    };
  }
  if (s === 'contenthash') {
    return {
      filename: DEFAULT_CONTENTHASH_FILENAME_PATTERN,
      chunkFilename: DEFAULT_CONTENTHASH_CHUNK_FILENAME_PATTERN,
    };
  }
  // 默认 hash
  return {
    filename: DEFAULT_FILENAME_PATTERN,
    chunkFilename: DEFAULT_CHUNK_FILENAME_PATTERN,
  };
}

/**
 * 结合模式/哈希策略生成输出配置默认值
 * - 可用于快速生成 output 的初始模板
 */
export function createOutputDefaults(
  mode: BuildMode,
  hashStrategy?: HashStrategy,
  base?: Partial<OutputOptions>
): OutputOptions {
  const patterns = getFilenamePatterns(mode, hashStrategy);
  return {
    ...DEFAULT_OUTPUT,
    filenamePattern: patterns.filename,
    chunkFilenamePattern: patterns.chunkFilename,
    ...(base || {}),
  };
}

/**
 * 共享默认值（适配器可直接引用）
 * - aliases: 默认别名（@ -> src）
 * - devServer: 默认开发服务器配置（轻量）
 * - output: 默认输出目录/资源目录/清理策略
 * - hashStrategy: 默认哈希策略
 */
export const SHARED_DEFAULTS = {
  aliases: DEFAULT_ALIASES,
  devServer: DEFAULT_DEV_SERVER,
  output: DEFAULT_OUTPUT,
  hashStrategy: DEFAULT_HASH_STRATEGY as HashStrategy,
};