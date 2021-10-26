//公用方法及接口
import request from './request.js'
import url from './url'


const common = {
    /**
     * 
     * @param {*} phone 隐藏手机号中间四位
     */
    formatPhone(phone) {
        phone += '';
        return phone.replace(/(\d{3})\d*(\d{4})/g, '$1****$2')
    },
    GetRequest() {
        var url = decodeURIComponent(window.location.href); //获取url中"?"符后的字串

        var theRequest = new Object();
        if (url.indexOf("?") > -1) {
            var str = url.substring(url.indexOf("?") + 1, url.length)
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    /**
    * 将url参数转换为json对象格式
    */
    getParams(url) {
        if (url.indexOf("?") > -1) {
            var paramsStr = url.substring(url.indexOf("?") + 1, url.length);
            var paramsArr = paramsStr.split("&");
            var params = {}
            paramsArr.forEach(function (value, index) {
                params[value.split("=")[0]] = value.split("=")[1];
            });
            return params
        } else {
            return {}
        }
    },
    /*
  * 问卷列表
  * @param {String} limit  当前分页的条数
  * @param {String} page   当前分页的页码
  * @param {String} surveyChannelCode  问卷渠道(0 项目问卷 1 GMO 3 DataSpring 4 SSI 5 Borderless 6 Cint 7 Lucid)
  * @param {String} type  问卷类型(0 一区 1 二区 2 PC 3 历史问卷)
  */
    partition_survey(surveyChannelCode, type, page, limit) {
        return request(url.partition_survey, {
            surveyChannelCode,
            type,
            page,
            limit,
            token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : '',
        }).then(result => {
            return result
        })
    },
    /*
    * 二区渠道列表
    */
    survey_api_channel() {
        return request(url.survey_api_channel, {
            token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : '',
        }).then(result => {
            return result
        })
    },
    /*
    * 判断用户是否可答题
    * @param {String} surveyId  问卷id
    */
    is_can_answer(surveyId) {
        return request(url.is_can_answer, {
            surveyId,
            token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : '',

        }).then(result => {
            return result
        })
    },
    /*
   * 获奖名单
   * @param {String} surveyId  问卷id
   */
    completed_survey_award(surveyId, token) {
        return request(url.completed_survey_award, {
            surveyId,
            token: token ? token : JSON.parse(localStorage.getItem("userInfo")).token
        }).then(result => {
            return result
        })
    },
    /*
   * 常见问题
   */
    help_list() {
        return request(url.help_list, {
            token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : '',
        }).then(result => {
            return result
        })
    },
    /*
   * 提交前置问卷
   * @param {String} age  年龄
   * @param {String} city  城市
   * @param {String} gender 性别
   * @param {String} surveyId  问卷id
   */
    commit_before_question(age, city, gender, surveyId) {
        return request(url.commit_before_question, {
            age, city, gender, surveyId,
            token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : '',
        }).then(result => {
            return result
        })
    },
    /*
  * 城市选择
  */
    city_drop_down() {
        return request(url.city_drop_down, {
            token: JSON.parse(localStorage.getItem("userInfo")).token
        }).then(result => {
            return result
        })
    },
    /*
     * 拆红包
     */
    respondSurvey(params) {
        return request(url.respondSurvey, params).then(result => {
            return result
        })
    },
    /*
    * 手机登录
    *mobile (string, optional): 手机号 ,
    *smsCode (string, optional): 短信验证码
    */
    phoneLogin(mobile, smsCode) {
        return request(url.phoneLogin, {
            mobile,
            smsCode
        }).then(result => {
            return result
        })
    },
    /*
    * 验证码
    *mobile (string, optional): 手机号 ,
    */
    smsCode(params) {
        return request(url.smsCode, params).then(result => {
            return result
        })
    },
    /*
    * 收入明细
    *limit (string, optional): 当前分页的条数 ,
    *page (string, optional): 当前分页的页码
    */
    getUserIncome(page, limit) {
        return request(url.getUserIncome, {
            page,
            limit,
            token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : '',
        }).then(result => {
            return result
        })
    },
    /*
    * 转出明细
    *limit (string, optional): 当前分页的条数 ,
    *page (string, optional): 当前分页的页码
    */
    getUserWithdraw(page, limit) {
        return request(url.getUserWithdraw, {
            page,
            limit,
            token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : '',
        }).then(result => {
            return result
        })
    },
    /*
   * 金币收入明细
   *limit (string, optional): 当前分页的条数 ,
   *page (string, optional): 当前分页的页码
   */
    getUserGoldIncomeRecord(page, limit) {
        return request(url.getUserGoldIncomeRecord, {
            page,
            limit,
            token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : '',
        }).then(result => {
            return result
        })
    },
    /*
    * 金币转出明细
    *limit (string, optional): 当前分页的条数 ,
    *page (string, optional): 当前分页的页码
    */
    getUserGoldExpensesRecord(page, limit) {
        return request(url.getUserGoldExpensesRecord, {
            page,
            limit,
            token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : '',
        }).then(result => {
            return result
        })
    },
    /*
   * 用户积分
   *limit (string, optional): 当前分页的条数 ,
   *page (string, optional): 当前分页的页码
   */
    getUserIntegral(page, limit) {
        return request(url.getUserIntegral, {
            page,
            limit,
            token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : '',
        }).then(result => {
            return result
        })
    },
    /*
    * 个人信息
    */
    getUserInfo(token) {
        return request(url.getUserInfo, {
            token: token ? token : JSON.parse(localStorage.getItem("userInfo")).token,
        }).then(result => {
            return result
        })
    },
    /*
    * 基本信息
    */
    getUserFullInfo() {
        return request(url.getUserFullInfo, {
            token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : '',
        }).then(result => {
            return result
        })
    },
     /*
    * 基本信息
    */
    getRegistrationInfo() {
        return request(url.surveyGetRegistrationInfo, {
            token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : '',
        }).then(result => {
            return result
        })
    },
    /*
    * 完善基本信息
    */
    editUserFullInfo(params) {
        return request(url.editUserFullInfo, params).then(result => {
            return result
        })
    },
    /*
    * 是否完善基本信息完善基本信息
    */
    isHaveBasicInfo() {
        return request(url.isHaveBasicInfo, {
            token: JSON.parse(localStorage.getItem("userInfo")).token,
        }).then(result => {
            return result
        })
    },
    activeClick(way, token) {
        return request(url.activeClick, {
            way,
            token,
            terminalCode: "3"//终端标志
        })
    },
    add_surveychannel_record(surveyChannelCode) {
        return request(url.add_surveychannel_record, {
            surveyChannelCode,
            token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : ''
        })
    },
    cardTicket(userId) {
        return request(url.cardTicket, {
            // token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : '',
            userId,
        })
    },
    surveyCard(userId, cardId, surveyId) {
        return request(url.surveyCard, {
            // token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : '',
            userId,
            cardId,
            surveyId
        })
    },
    isHaveTickets(userId, surveyId) {
        return request(url.isHaveTickets, {
            // token: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).token : '',
            userId,
            surveyId
        })
    },
    verifyPhoneBind(params) {
        return request(url.verifyPhoneBind, params)
    },
}
export default common
