import { AppConfig, EnvProjectProps } from '../types';
const env = process.env.NODE_ENV || 'development';
const devApiBaseApi = 'http://0.0.0.0:3600'
const testApiBaseApi = 'http://121.40.61.99:3600'
const proApiBaseApi = testApiBaseApi

// 环境特定配置
const envConfig: EnvProjectProps = {
  development: {
    'react-app': {
      PROXY_PATH: '/react-app',
      API_BASE_URL: devApiBaseApi,
    },
  },
  test: {
    'react-app': {
      PROXY_PATH: '/react-app',
      API_BASE_URL: testApiBaseApi,
    },
  },
  production: {
    'react-app': {
      PROXY_PATH: '/react-app',
      API_BASE_URL: proApiBaseApi,
    },
  },
};
// 合并配置
const __APP_CONFIG__ = {
  envConfig,
};
// 浏览器全局变量（用于非模块化环境）
if (typeof window !== 'undefined') {
  (window as any).__APP_CONFIG__ = __APP_CONFIG__;
}

// 导出配置
export default __APP_CONFIG__;