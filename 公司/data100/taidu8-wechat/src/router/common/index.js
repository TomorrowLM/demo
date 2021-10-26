/**
 * 金币商城路由配置
 */
export default [
  {//数字一百隐私保护指引
    path: '/sclution',
    name: 'Sclution',
    component: () => import(/* webpackChunkName: "common" */ '@/views/common/Sclution.vue'),
  },
  {//涉及收集用户个人信息的第三方 SDK目录
    path: '/prwSclutionSdk',
    name: 'PrwSclutionSdk',
    component: () => import(/* webpackChunkName: "common" */ '@/views/common/PrwSclutionSdk.vue'),
  },
  {//手拉手对接的渠道开红包结束页，微信扫二维码领红包
    path: '/answerEndReward',
    name: 'answerEndReward',
    component: () => import(/* webpackChunkName: "common" */ '@/views/common/AnswerEndReward.vue'),
  },
   {//手拉手对接的渠道开红包结束页，微信扫二维码领红包
    path: '/answerEndFail',
    name: 'answerEndFail',
    component: () => import(/* webpackChunkName: "common" */ '@/views/common/AnswerEnd_fail.vue'),
  },
   {//手拉手对接的渠道开红包结束页，微信扫二维码领红包
    path: '/rewardError',
    name: 'rewardError',
    component: () => import(/* webpackChunkName: "common" */ '@/views/common/RewardError.vue'),
  },
   {//手拉手对接的渠道开红包结束页，微信扫二维码领红包
    path: '/rewardSucess',
    name: 'rewardSucess',
    component: () => import(/* webpackChunkName: "common" */ '@/views/common/RewardSucess.vue'),
  },
]