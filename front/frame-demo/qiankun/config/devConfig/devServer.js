const devProxy = require('./devProxy');

const getDevServer = (port) => ({
  port,
  hot: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  proxy: devProxy
})

module.exports = {
  getDevServer
};