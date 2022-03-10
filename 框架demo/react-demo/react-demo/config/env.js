const env = process.env.NODE_ENV;
const config = {
  development: {
    api: 'www.baidu.com'
  },
  production: {
    api: 'www.jd.com'
  }
};
module.exports = config[env];