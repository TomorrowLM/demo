/**
 * 金币商城路由配置
 */
export default [
  {
    path: '/basicinformation',
    name: 'BasicInformation',
    component: () => import(/* webpackChunkName: "basicinformation" */ '@/views/user/ChannelRegister.vue'),
  },
  {
    path: '/channelRegister',
    name: 'ChannelRegister',
    component: () => import(/* webpackChunkName: "channelRegister" */  '@/views/user/ChannelRegister.vue'),
  },
  {
    path: '/bindPhone',
    name: 'BindPhone',
    component: () => import(/* webpackChunkName: "bindPhone" */ '@/views/user/BindPhone.vue'),
  },
  {
    path: '/perfect',
    name: 'PerfectInfo',
    component: () => import(/* webpackChunkName: "perfectInfo" */ '@/views/user/PerfectInfo.vue'),
  },
  {
    path: '/setPassword',
    name: 'SetPassword',
    component: () => import(/* webpackChunkName: "perfectInfo" */ '@/views/user/SetPassword.vue'),
  },
  {
    path: '/invitationCenter',
    name: 'InvitationCenter',
    component: () => import(/* webpackChunkName: "perfectInfo" */ '@/views/user/InvitationCenter.vue'),
  },
  {
    path: '/userInfoTips',
    name: 'UserInfoTips',
    component: () => import(/* webpackChunkName: "perfectInfo" */ '@/views/user/UserInfoTips.vue'),
  },
]