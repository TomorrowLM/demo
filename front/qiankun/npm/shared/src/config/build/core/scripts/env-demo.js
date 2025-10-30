// 演示如何使用全局环境变量

/**
 * 使用共享的环境配置
 * 这些变量是通过 webpack DefinePlugin 注入的全局变量
 */

// 使用共享的环境配置
export function useAppConfig() {
  // 这些是全局变量，通过 webpack DefinePlugin 注入
  return {
    appName: AppConfig.APP_NAME,
    appVersion: AppConfig.APP_VERSION,
    apiBaseUrl: AppConfig.API_BASE_URL,
    isDevelopment: AppConfig.IS_DEVELOPMENT,
    isProduction: AppConfig.IS_PRODUCTION,
    buildTime: AppConfig.BUILD_TIME,
    gitCommit: AppConfig.GIT_COMMIT,
    env: AppConfig.ENV,
    debug: AppConfig.DEBUG,
  };
}

// 使用原有的环境配置
export function useEnvConfig() {
  return {
    apiPath: LM_ENV_CONFIG.apiPath,
    api: LM_ENV_CONFIG.api,
  };
}

// 打印环境信息（用于调试）
export function logEnvironmentInfo() {
  console.log('=== 应用环境信息 ===');
  console.log('应用名称:', AppConfig.APP_NAME);
  console.log('版本:', AppConfig.APP_VERSION);
  console.log('环境:', AppConfig.ENV);
  console.log('API 地址:', AppConfig.API_BASE_URL);
  console.log('构建时间:', AppConfig.BUILD_TIME);
  console.log('Git Commit:', AppConfig.GIT_COMMIT);
  console.log('是否是开发环境:', AppConfig.IS_DEVELOPMENT);
  console.log('调试模式:', AppConfig.DEBUG);
  console.log('========================');
}

// 根据环境获取配置
export function getConfigByEnvironment() {
  if (AppConfig.IS_DEVELOPMENT) {
    return {
      apiUrl: AppConfig.API_BASE_URL,
      debug: true,
      features: {
        hotReload: true,
        devTools: true,
      }
    };
  } else if (AppConfig.IS_PRODUCTION) {
    return {
      apiUrl: AppConfig.API_BASE_URL,
      debug: false,
      features: {
        hotReload: false,
        devTools: false,
      }
    };
  }
  
  return {
    apiUrl: AppConfig.API_BASE_URL,
    debug: AppConfig.DEBUG,
  };
}
