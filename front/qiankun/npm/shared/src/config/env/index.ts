import type { AppConfig, EnvProjectProps } from '../types';

const env = process.env.NODE_ENV || 'development';
// 基础配置
const baseConfig: Partial<AppConfig> = {
  // 应用信息 - 从环境变量获取或使用默认值
  APP_NAME: process.env.APP_NAME || 'React Demo App',
  APP_VERSION: process.env.APP_VERSION || process.env.npm_package_version || '1.0.0',

  // 环境标识
  IS_DEVELOPMENT: env === 'development',
  IS_PRODUCTION: env === 'production',
  IS_TEST: env === 'test',

  // 构建时间
  BUILD_TIME: new Date().toISOString(),

  // Git 信息（可在构建时注入）
  GIT_COMMIT: process.env.GIT_COMMIT || 'unknown',
  GIT_BRANCH: process.env.GIT_BRANCH || 'unknown',
};
// export const ENV_CONFIG = {
//   development: {
//     API_BASE_URL: "http://127.0.0.1:3600"
//   },
//   production: {
//     API_BASE_URL: "http://121.40.61.99:3600"
//   }
// }
// 环境特定配置
const envConfigs: Record<string, Partial<AppConfig>> = {
  development: {
    PROXY_PATH: '',
    API_BASE_URL: 'http://localhost:3000/api',
    WS_BASE_URL: 'ws://localhost:3000',
    CDN_BASE_URL: 'http://localhost:8080',
    DEBUG: true,
  },
  production: {
    PROXY_PATH: '',
    API_BASE_URL: 'https://api.example.com/api',
    WS_BASE_URL: 'wss://api.example.com',
    CDN_BASE_URL: 'https://cdn.example.com',
    DEBUG: false,
  },
  test: {
    PROXY_PATH: '',
    API_BASE_URL: 'https://test-api.example.com/api',
    WS_BASE_URL: 'wss://test-api.example.com',
    CDN_BASE_URL: 'https://test-cdn.example.com',
    DEBUG: true,
  },
};

// 合并配置
const config: AppConfig = {
  ...baseConfig,
  ...envConfigs[env],
  ENV: env,
} as AppConfig;

// 导出配置
export default config;

// 浏览器全局变量（用于非模块化环境）
if (typeof window !== 'undefined') {
  (window as any).__APP_CONFIG__ = config;
}

const config11 = {
  development: {
    apiPath: '/api',
    api: 'http://0.0.0.0:3600'
  },
  production: {
    apiPath: '/api',
    api: 'http://121.40.61.99:3600'
  }
};
