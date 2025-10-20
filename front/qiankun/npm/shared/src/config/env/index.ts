// import type { AppConfig } from '../types'; // 类型导入，仅编译期有效
import getEnv from '@/scripts/config/getEnv'; // 获取环境变量
const env = process.env.NODE_ENV || 'development';
console.log('当前环境：', env, getEnv(), process.env.APP_ENV);
const LM_ENV_CONFIG = getEnv()

module.exports = LM_ENV_CONFIG[process.env.APP_ENV] || {};