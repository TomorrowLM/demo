
export const basicParameters = {
  // 基础条件
  searchType: '1', // 查询主类型
  registeredStartTime: '', // 注册开始时间
  registeredEndTime: '', // 注册结束时间
  loginStartTime: '', // 最后登录开始时间
  loginEndTime: '', // 最后登录结束时间
  surveyAnswerStartTime: '', // 最后答题开始时间
  surveyAnswerEndTime: '', // 最后答题结束时间
  userIdStr: '', // 用户id集合 使用换行符\n链接
  phoneStr: '', // 手机号集合 使用换行符\n链接
  surveyIdStr: '', // 问卷id集合 使用换行符\n链接
  showPhone: '1', // 手机号码是否带入 0 带入 1 不带入
  surveyStat: '', // 问卷完成状态 1:成功 ；2:被筛选 ；3:配额满 ；4:其它
  // 来源渠道
  appSourcehannel: [], // 来源渠道 渠道名称 使用英文,链接
  // 问卷信息
  answerStartTime: '', // 答题开始时间
  answerEndTime: '', // 答题结束时间
  participateAllSurveyNum: '', // 参与问卷（全部问卷）次数
  participateInternalSurveyNum: '', // 参与问卷（内投问卷）次数
  participateBusinessSurveyNum: '', // 参与问卷（商业问卷）次数
  participateApiSurveyNum: '', // 参与问卷（API问卷）次数
  participateGoldType: '1', // 参与问卷 问卷奖励限制 0是 1否
  participateGold: '', // 参与问卷 问卷奖励限制金币数
  participateTerminal: [], // 参与问卷 终端答题 数字使用,链接
  participateApiClient: [], // 参与问卷 API客户 数字使用,链接

  completeAllSurveyNum: '', // 完成问卷（全部问卷）次数
  completeInternalSurveyNum: '', // 完成问卷（内投问卷）次数
  completeBusinessSurveyNum: '', // 完成问卷（商业问卷）次数
  completeApiSurveyNum: '', // 完成问卷（API问卷）次数
  completeShareType: '3', // 分享问卷  0是 1否 3全部
  
  completeGoldType: '1', // 完成问卷 问卷奖励限制 0是 1否
  completeGold: '', // 完成问卷 问卷奖励限制金币数
  completeTerminal: [], // 完成问卷 终端答题 数字使用,链接
  completeApiClient: [], // 完成问卷 API客户 数字使用,链接
  
  // 监测数据
  monitorAppName: [], // APP名称 使用,链接
  appStartTime: '', // APP使用开始时间
  appEndTime: '', // APP使用结束时间
  openDayType: '1', // 监测任务开启天数类型 0是 1否
  openDay: '', // 监测任务开启天数
  // 设备信息
  mobileType: [], // 手机品牌 使用英文,链接
  deviceNum: '1', // 设备识别号 0是 1否
  appOpenId: '1', // appOpenId 0是 1否
  wechatOpenId: '1', // wechatOpenId 0是 1否
  changePhone: '1', // 换机信息 0是 1否
  // 金币信息
  totalGoldType: '1', // 当前金币余额 0是 1否
  historyTotalGoldType: '1', // 获取金币总额 0是 1否
  withdrawNum: '1', // 提现次数 0是 1否
  withdrawGold: '1', // 提现总额 0是 1否
}

export const queryTypeOptions: Array<any> = [
  {
    label: '按时间查询',
    value: '1'
  },
  {
    label: '按UID查询',
    value: '2'
  },
  {
    label: '按手机号查询',
    value: '3'
  },
  {
    label: '按问卷ID查询',
    value: '4'
  }
]

export const phoneTypeOptions: Array<any> = [
  {
    label: '不带入',
    value: '1'
  },
  {
    label: '带入',
    value: '0'
  }
]

export const questionStatusOptions: Array<any> = [
  {
    label: '成功',
    value: '1'
  },
  {
    label: '甄别',
    value: '2'
  },
  {
    label: '配额满',
    value: '3'
  },
  {
    label: '其他',
    value: '4'
  }
]

export const whetherOptions: Array<any> = [
  {
    label: '否',
    value: '1'
  },
  {
    label: '是',
    value: '0'
  }
]

export const completeShareTypeOptions: Array<any> = [
  {
    label: '全部',
    value: '-1'
  },
  {
    label: '否',
    value: '1'
  },
  {
    label: '是',
    value: '0'
  }
]