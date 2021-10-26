/**
 * 接口地址集合
 */
const api = {
  getWechatOauth: 'wechatpub/user/getWechatOauth',//授权接口
  // partition_survey: 'wechatpub/survey/partition_survey',//一区问卷列表 旧版
  partition_survey: 'survey/inspect/partition_survey',//一区问卷列表 新版整合
  // survey_api_channel: 'wechatpub/survey/survey_api_channel',// 二区渠道列表 旧版
  survey_api_channel: 'survey/inspect/survey_api_channel',// 二区渠道列表 新版整合
  // is_can_answer: 'wechatpub/survey/is_can_answer',// 开始答题 旧版
  is_can_answer: 'survey/inspect/is_can_answer',// 开始答题 新版
  // commit_before_question: 'wechatpub/survey/commit_before_question',// 前置问卷提交
  commit_before_question: 'survey/inspect/commit_before_question',// 前置问卷提交5.1新版
  city_drop_down: 'wechatpub/common/city_drop_down', // 城市选择
 
  surveyMarkedWordsCommon: '/survey/inspect/surveyMarkedWords',
  


  editUserFullInfo: 'wechatpub/user/editUserFullInfo',// 完善基本信息
  getPhoneCode: 'wechatpub/user/getPhoneCode',// 获取验证码
  verifyPhoneBind: 'wechatpub/user/verifyPhoneBind',// 获取验证码前的逻辑判断 5.1版本
  editPhone: 'wechatpub/user/editPhone',//绑定手机号

  respondSurvey: 'common/respond/respondSurvey',// 完成问卷之后接口
  surveyMarkedWords: 'wechatpub/survey/surveyMarkedWords',// 分享赚金币的提示语
  publicWelfarEelements: 'common/respond/public_welfare/tip',//公益活动期间，问卷结尾页，增加公益元素展示信息
  isShowPublicWelfar: 'common/respond/public_welfare/exist',//判断问卷结尾页是否展示公益模块
  // 金币使用卡券翻倍
  cardTicket: 'common/respond/CardTicket',
  CardTicketV5: 'common/respond/CardTicketV5',
  surveyCard: 'common/respond/surveyCard',
  isHaveTickets: 'common/respond/isHave',

  // 分享流程
  getConfig: "/wechatpub/config/getConfig",//分享权限配置
  shareLink: "/wechatpub/share/shareLink",//分享内容
  is_can_answer_share: '/common/survey/is_can_answer',//分享流程中的答问卷
  // 通过渠道推广答问卷
  getSurveyShareInfo: '/common/share/surveyShareInfo',
  channelRegister: '/common/channel/register',
  welcome: '/common/channel/welcome',
  channel_before_question: '/common/channel/commit_before_question',
  joinGroupWechatGroup: '/common/joinGroup/wechatGroup',

  isHaveBasicInfo: '/wechatpub/user/isHaveBasicInfo', //是否完善基本信息
}
export default api
