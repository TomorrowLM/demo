import baseConfig from './.env.js';
export default {
  ...baseConfig,
  APP_BASE_API: 'http://0.0.0.0:3600/',
  NODE_ENV: "local.dev",
}