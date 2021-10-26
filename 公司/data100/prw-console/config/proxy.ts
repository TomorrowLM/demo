/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/prw-console/': {
      target: 'http://172.16.1.142:8061',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/prw-console/': {
      target: 'https://consolecs.pinrenwu.cn',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/taidu8/': {
      target: 'https://apitest.taidu8.com',
      changeOrigin: true,
      pathRewrite: { '^/taidu8/': '/' },
    },
  },
  pre: {
    '/prw-console/': {
      target: 'https://consolepre.pinrenwu.cn',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
