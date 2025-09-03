// 全局环境变量配置 - TypeScript 版本
// 支持在线编辑和多个项目共用
export type ProjectNameProps = 'react' | 'vue' | 'angular';
export type EnvProps = 'development' | 'production' | 'test';
export type EnvProjectProps = Record<EnvProps, Partial<Record<ProjectNameProps, Partial<AppConfig>>>>;


export interface AppConfig {
  // 应用信息
  APP_NAME: string;
  APP_VERSION: string;

  // 环境标识
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
  IS_TEST: boolean;

  // 构建信息
  BUILD_TIME: string;
  GIT_COMMIT: string;
  GIT_BRANCH: string;

  // API 配置  
  PROXY_PATH: string;
  API_BASE_URL: string;
  WS_BASE_URL: string;
  CDN_BASE_URL: string;

  // 调试配置
  DEBUG: boolean;

  // 环境
  ENV: string;
}