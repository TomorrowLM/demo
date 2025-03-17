const env = process.env.NODE_ENV;
const config = {
  development: {
    apiPath: '/api',
    api: 'http://0.0.0.0:3600'
  },
  production: {
    apiPath: '/api',
    api: 'http://121.40.61.99:3600'
  }
};
module.exports = config[env];