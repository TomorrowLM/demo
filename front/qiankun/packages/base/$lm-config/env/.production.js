import baseConfig from './.env.js';

export default {
  ...baseConfig,
  NODE_ENV: 'production',
  VUE_APP_API_HOST: 'http://121.40.61.99:3600',
};
