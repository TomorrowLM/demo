const Deploy = require('taidu8-utils/scripts/deploy')
const envfile = process.env.NODE_ENV === 'production' ? 0 : 1;
const CONFIG_LIST = [
  {
    path: '/data/wwwroot/www.pinrenwu.cn/pc', // 发布至静态服务器的项目路径
  },{
    path: '/data/wwwroot/wwwtest.pinrenwu.cn/pc' // 发布至静态服务器的项目路径
  }
];

Deploy.Upload(CONFIG_LIST[envfile])