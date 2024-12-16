const modifyVars = require('../config/modifyVars');

/**
 * 此配置生效与私有化部署版本
 */
const getGlobalConstants = {
  PRIMARY_COLOR: modifyVars['primary-color'], // 主题色
  PUBLIC_CDN_URL: "", // 静态资源域名
  PUBLIC_DOMAIN_NAME: "", // 访问域名
  PUBLIC_UPLOAD_MODE: 'LOCAL', // 本地接口上传
}

module.exports = getGlobalConstants;