/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/sls-console/': {
      target: 'http://10.0.75.187:8211',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    // 如果要替换某个后端开发的本地开发环境，需要配置的，
    // '/api/center-data-clean/': {
    //   target: 'http://172.16.0.213:8082',//'https://datacentertest.data100.cn',
    //   changeOrigin: true,
    //   pathRewrite: { '/api/center-data-clean': '' ,},
    // },
    '/api/': {
      target: 'https://datacentertest.data100.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/sls-console/': {
      target: 'https://sls.taidu8.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
