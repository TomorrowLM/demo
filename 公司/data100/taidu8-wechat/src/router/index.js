import Vue from 'vue'
import VueRouter from 'vue-router'
import { shareLink, getWechatOauth } from "@/api/survey.js";
import weixin from "../utils/share.js";
import { getUrl } from "../utils/base";

Vue.use(VueRouter)

let routes = []
const isProd = process.env.NODE_ENV === 'production'
const routerContext = require.context('./', true, /index\.js$/)

routerContext.keys().forEach(route => {
  // 如果是跟目录的index不做处理
  if (route.startsWith('./index')) {
    return
  }
  const routerModule = routerContext(route)
  routes = [...routes, ...(routerModule.default || routerModule)]
  console.log(routes)
});

console.log(process.env.BASE_URL)

const router = new VueRouter({
  mode: 'history',
  base: isProd && process.env.VUE_APP_PREVIEW !== 'true' ? '/wechatpub/' : process.env.BASE_URL,
  routes
})
// 分享功能
router.beforeEach((to, from, next) => {
  let params = {}
  if (['SurveyLanding', 'ResSurvey'].includes(to.name)) {
    params = {
      flag: 0,
      shareChannel: 1,
      type: 1,
      id: getUrl().surveyId
    }
  } else if (['SurveyDetail', 'SurveyUnqualified', 'RedPacket', 'ShareGuide'].includes(to.name)) {
    params = {
      flag: 0,
      shareChannel: 1,
      type: 1,
      id: to.name === 'SurveyDetail' ? to.params.surveyId : JSON.parse(decodeURIComponent(to.params.data)).surveyId
    }
  } else if (to.name === 'Reanswer') {
    params = {
      flag: 0,
      shareChannel: 1,
      type: 1,
      id: to.params.surveyId
    }
  } else if (['BeforeQuestion', 'BasicInformation', 'BindPhone'].includes(to.name)) {
    // 完善信息和绑定手机号页面可能是从问卷流程过来的 也可能不是
    params = {
      flag: 0,
      shareChannel: 1,
      type: 1,
    }
    if (to.query.surveyId) {
      params.id = to.query.surveyId
    } else if (to.params.surveyId) {
      params.id = to.params.surveyId
    } else {
      params.type = 3
    }

  } else {
    params = {
      flag: 0,
      shareChannel: 1,
      type: 3,
    }
    if (to.name == "tabs" && to.query.tabIndex) {
      if (to.query.token) {
        Vue.ls.set("token", to.query.token)
      } else {
        if (to.query.tabIndex === "user" && !Vue.ls.get("token")) {//进个人中心页面 未登录授权的
          getWechatOauth("?type=2");//2:个人中心
          return
        }else{
          if(to.query.survey_name &&to.query.survey_name === "history" && !Vue.ls.get("token") ){
            getWechatOauth("?type=3");//3:跳转分享赚金币
            sessionStorage.setItem("survey_name", "history");
            return
          }
        }
      }
      if(to.query.survey_name){
        sessionStorage.setItem("survey_name", to.query.survey_name);
      }
      sessionStorage.setItem("tabIndex", to.query.tabIndex)
      location.replace(window.location.origin + "/wechatpub/surveyOne")
      // location.replace(process.env.VUE_APP_PAGE_BASE_URL + "/wechatpub/surveyOne")
    }
  }
  if ((to.name === 'RedPacket' && to.query.type === 'common')||(['BeforeQuestion','SurveyDetail'].includes(to.name)&&to.query.channelAnswer)||['ChannelEnd','GuideAttention'].includes(to.name)) {
    console.log('禁止分享')
  } else {
    shareLink(params).then(data => {
      weixin(data.data,to.name);
    });
  }
  next()
})

export default router
