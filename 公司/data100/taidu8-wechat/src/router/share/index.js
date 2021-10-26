/**
 * 金币商城路由配置
 */
export default [
 
  {//分享流程中的绑定手机号页面
    path: '/bindPhoneShare',
    name: 'BindPhoneShare',
    component: () => import(/* webpackChunkName: "bindPhone" */ '@/views/share/BindPhoneShare.vue'),
  },
  {
    path: '/redpacketShare',
    name: 'RedpacketShare',
    component: () => import(/* webpackChunkName: "perfectInfo" */ '@/views/share/Redpacket.vue'),
  },
  {
    path: '/resSurveyShare',
    name: 'ResSurveyShare',
    component: () => import(/* webpackChunkName: "survey" */ '@/views/share/ResSurveyShare.vue'),
  },
  {//信息流推广
    path: '/channelSpread',
    name: 'ChannelSpread',
    component: () => import(/* webpackChunkName: "survey" */ '@/views/share/ChannelSpread.vue'),
  },
  {//邀请流程分享 新用户注册
    path: '/inviteUser',
    name: 'InviteUser',
    component: () => import(/* webpackChunkName: "survey" */ '@/views/share/InviteUser.vue'),
  },
  {//邀请流程分享 新用户注册
    path: '/inviteUserWechat',
    name: 'InviteUserWechat',
    component: () => import(/* webpackChunkName: "survey" */ '@/views/share/InviteUserWechat.vue'),
  },
  {//公益活动分享页面
    path: '/publicWelfare',
    name: 'publicWelfare',
    component: () => import(/* webpackChunkName: "survey" */ '@/views/share/publicWelfare.vue'),
  },
]