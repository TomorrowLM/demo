import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import SurveyList from '@/components/SurveyList'
import Agreement from '@/components/Agreement'
import Introduction from '@/components/Introduction'
import LoginPage from '@/components/LoginPage'
import UserPage from '@/components/UserPage'
import QuestionPage from '@/components/QuestionPage'
import BeforeAnswerPage from '@/components/BeforeAnswerPage'
import UnqualifiedPage from '@/components/UnqualifiedPage'
import OpenPacket from '@/components/OpenPacket'
import ErrorPage from '@/components/ErrorPage'
import WxjumpPage from '@/components/WxjumpPage'
import ReanswerDated from '@/components/ReanswerDated'
import Sclution from '@/components/Sclution'
import UserInfoTips from '@/components/UserInfoTips'
import SclutionDataYibai from '@/components/SclutionDataYibai'


Vue.use(Router)

export default new Router({
  routes: [
    // { path: '/', redirect: { name: 'HomePage' }},
    {//首页
      path: '/jump',
      name: 'WxjumpPage',
      component: WxjumpPage
    },
    {//首页
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {//列表页
      path: '/surveyList',
      name: 'SurveyList',
      component: SurveyList
    },
    {//合同页
      path: '/agreement',
      name: 'Agreement',
      component: Agreement
    },
    {//合同页
      path: '/introduction',
      name: 'Introduction',
      component: Introduction
    },
    {//隐私页
      path: '/sclution',
      name: 'Sclution',
      component: Sclution
    },
    {//数字一百隐私页
      path: '/sclutionDataYibai',
      name: 'SclutionDataYibai',
      component: SclutionDataYibai
    },
    {//登录页
      path: '/loginpage',
      name: 'LoginPage',
      component: LoginPage
    },
    {//用户详情页
      path: '/userpage',
      name: 'UserPage',
      component: UserPage
    },
    {//问题介绍页面
      path: '/questionpage/:surveyId',
      name: 'QuestionPage',
      component: QuestionPage
    },
    {//前置问卷页面
      path: '/beforeanswerpage/:surveyId',
      name: 'BeforeAnswerPage',
      component: BeforeAnswerPage
    },
    // {//答题页面
    //   path: '/answerpage/:surveyUrl',
    //   name: 'AnswerPage',
    //   component: AnswerPage
    // },
    {//不符合条件的页面
      path: '/unqualifiedpage/:msg',
      name: 'UnqualifiedPage',
      component: UnqualifiedPage
    },
    {//拆红包页面
      path: '/open',
      name: 'OpenPacket',
      component: OpenPacket
    },
    {//第一此答题有红包  第二次答题  展示重复答题 及已经得到的金币数
      path: '/reanswer/:surveyId/:answerTime/:finalGold/:status/:taidu8Id',
      name: 'ReanswerDated',
      component: ReanswerDated
    },
    // {//第一此答题被甄别  第二次选择的是通过的条件  展示警告页面
    //   path: '/reanswer/:surveyId',
    //   name: 'Reanswer',
    //   component: Reanswer
    // },
    {//错误页面
      path: '/errorpage',
      name: 'ErrorPage',
      component: ErrorPage
    },
  ]
})
