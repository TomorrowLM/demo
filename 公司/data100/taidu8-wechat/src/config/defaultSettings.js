/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 */

export default {
  primaryColor: '#52C41A', // primary color of ant design
  production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true',
  // vue-ls options
  storageOptions: {
    namespace: 'taidu8__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  },
  appPageUrl: `${process.env.VUE_APP_API_BASE_URL}wechatpub/share/downloadAPPURL`
}
