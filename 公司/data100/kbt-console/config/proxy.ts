/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/adconsole/': {
      target: 'http://10.0.75.187:8211',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/adconsole/': {
      target: 'https://apitest.pinrenwu.cn',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/adconsole/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
