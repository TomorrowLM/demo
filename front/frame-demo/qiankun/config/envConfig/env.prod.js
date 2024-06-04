const modifyVars = require('../config/modifyVars');

const getGlobalConstants = {
  PRIMARY_COLOR: modifyVars['primary-color'], // 主题色
  PUBLIC_CDN_URL: "https://cdn.cempro.cn/cem-web", // 静态资源域名
  PUBLIC_DOMAIN_NAME: "https://www.cempro.cn", // 访问域名
  PUBLIC_UPLOAD_MODE: 'OSS', // 默认为OSS上传，如果为空使用后端接口上传
}

module.exports = getGlobalConstants;