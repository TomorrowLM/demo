const devProxy = {
  '/icloud': {
    target: 'https://dev.cempro.cn',
    // target: 'http://172.16.0.88:8010',
    changeOrigin: true,
    // secure: false,
    xfwd: false,
    // pathRewrite: {
    //   '^/icloud': ''
    // }
  }
}

module.exports = devProxy;