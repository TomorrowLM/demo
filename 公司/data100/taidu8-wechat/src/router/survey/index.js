
/**
 * 金币商城路由配置
 */
export default [
  {
    path: '/surveytwo_detail/:channelCode',
    name: 'SurveyTwoDetail',
    component: () => import(/* webpackChunkName: "survey" */ '@/views/survey/SurveyTwoDetail.vue'),
  },
  {
    path: '/survey_detail/:surveyId',
    name: 'SurveyDetail',
    component: () => import(/* webpackChunkName: "survey" */ '@/views/survey/SurveyDetail.vue'),
  },
  {
    path: '/beforeQuestion/:surveyId',
    name: 'BeforeQuestion',
    component: () => import(/* webpackChunkName: "survey" */ '@/views/survey/BeforeQuestion.vue'),
  },
  {
    path: '/survey_unqualified/:data',
    name: 'SurveyUnqualified',
    component: () => import(/* webpackChunkName: "survey" */ '@/views/survey/SurveyUnqualified.vue'),
  },
  {
    path: '/redPacket/:data',
    name: 'RedPacket',
    component: () => import(/* webpackChunkName: "survey" */ '@/views/survey/RedPacket.vue'),
  },
  {
    path: '/resSurvey',
    name: 'ResSurvey',
    component: () => import(/* webpackChunkName: "survey" */ '@/views/survey/ResSurvey.vue'),
  },
  {
    path: '/reanswer',
    name: 'Reanswer',
    component: () => import(/* webpackChunkName: "survey" */ '@/views/survey/Reanswer.vue'),
  },
  {
    path: '/shareGuide/:data',
    name: 'ShareGuide',
    component: () => import(/* webpackChunkName: "survey" */ '@/views/survey/ShareGuide.vue'),
  },
  {
    path: '/surveyLanding',
    name: 'SurveyLanding',
    component: () => import(/* webpackChunkName: "survey" */ '@/views/survey/SurveyLanding.vue'),
  },
  {
    path: '/channelEnd',
    name: 'ChannelEnd',
    component: () => import(/* webpackChunkName: "ChannelEnd" */ '@/views/survey/ChannelEnd.vue'),
  },
  {
    path: '/surveyFront',
    name: 'SurveyFront',
    component: () => import(/* webpackChunkName: "SurveyFront" */ '@/views/survey/SurveyFront.vue'),
  },
  {
    path: '/guideAttention',
    name: 'GuideAttention',
    component: () => import(/* webpackChunkName: "GuideAttention" */ '@/views/survey/GuideAttention.vue'),
  },
  {
    path: '/guideGroup',
    name: 'GuideGroup',
    component: () => import(/* webpackChunkName: "GuideGroup" */ '@/views/survey/GuideGroup.vue'),
  },
  {
    path: '/surveyTips',
    name: 'SurveyTips',
    component: () => import(/* webpackChunkName: "SurveyTips" */ '@/views/survey/SurveyTips.vue'),
  },
]