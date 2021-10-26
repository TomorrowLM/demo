const { BASE_URL, BASE_PAGE, LOGIN_BASE_PAGE, WX_LOGIN_REDIRECT_URI } = process.env

export default {
	base: BASE_URL, //接口
	basePage: BASE_PAGE, // 页面地址
	loginBasePage: LOGIN_BASE_PAGE, //异常跳转登录页
	wxLogin_redirect_uri: WX_LOGIN_REDIRECT_URI,

	// partition_survey: '/pc/survey/partition_survey', //旧版
	// survey_api_channel: '/pc/survey/survey_api_channel',//旧版
	// is_can_answer: '/pc/survey/is_can_answer',//旧版
	// commit_before_question: '/pc/survey/commit_before_question',//旧版
	partition_survey: '/survey/inspect/partition_survey', //5.1版本更新
	survey_api_channel: '/survey/inspect/survey_api_channel',//5.1版本更新
	is_can_answer: '/survey/inspect/is_can_answer',//5.1版本更新
	commit_before_question: '/survey/inspect/commit_before_question',//5.1版本更新


	completed_survey_award: '/pc/survey/completed_survey_award',
	city_drop_down: '/pc/user/center/city_drop_down',
	respondSurvey: '/common/respond/respondSurvey', //拆红包
	phoneLogin: '/pc/user/login/phoneLogin', //手机登录
	smsCode: '/pc/user/login/smsCode', //验证码
	verifyPhoneBind: '/pc/user/login/verifyPhoneBind', //验证码--滑块前，校验手机号是否绑定(滑块验证)
	getUserIncome: '/pc/user/center/getUserIncome', //收入明细
	getUserWithdraw: '/pc/user/center/getUserWithdraw', //转出明细
	getUserGoldIncomeRecord: '/pc/user/center/getUserGoldIncomeRecord', //金币收入明细
	getUserGoldExpensesRecord: '/pc/user/center/getUserGoldExpensesRecord', //金币转出明细
	help_list: '/pc/survey/help_list', //常见问题
	getUserIntegral: '/pc/user/center/getUserIntegral', //用户积分
	getUserInfo: '/pc/user/center/getUserInfo', //个人信息
	getUserFullInfo: '/pc/user/center/getUserFullInfo', //基本信息
	editUserInfo: '/pc/user/center/editUserInfo', //修改昵称
	editUserFullInfo: '/pc/user/center/editUserFullInfo', //完善基本信息
	isHaveBasicInfo: '/pc/user/center/isHaveBasicInfo', //是否完善基本信息
	activeClick: "/pc/user/active/click", //记录活跃日志
	add_surveychannel_record: "/pc/survey/add_surveychannel_record", //问英雄问卷渠道用户点击记录
	surveyGetRegistrationInfo: "/survey/inspect/surveyGetRegistrationInfo", //二区问卷获取用户信息

	wechatLogin: "/pc/user/login/wechatLogin", //微信扫码登录

	// 卡券翻倍
	cardTicket: 'common/respond/CardTicket',
	surveyCard: 'common/respond/surveyCard',
	isHaveTickets: 'common/respond/isHave',
	//     const url = 'https://apitest.pinrenwu.cn/common/'
	// const resSurvey = url + 'respond/respondSurvey'
	// const resSurveyApi = url + 'respond/respondAPISurvey'
	// const cardTicket_url = url + 'respond/CardTicket'
	// const surveyCard_url = url + 'respond/surveyCard'

	// IM即时通讯
	queryNeteaseInfo: "/pc/symposium/queryNeteaseInfo", //问英雄问卷渠道用户点击记录
}