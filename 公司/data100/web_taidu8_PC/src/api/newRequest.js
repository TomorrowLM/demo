/**
 * 封装异步请求
 */
import axios from 'axios'
import urls from './url'
import methods from './methods'
import URLSearchParams from 'url-search-params'
// 浏览器兼容性问题、需添加到window上
window.URLSearchParams = URLSearchParams
    // 设置请求响应时间
axios.defaults.timeout = 5000
    // 配置程序基础路径
axios.defaults.baseURL = urls.base
    // 基于表单
axios.defaults.headers['Content-Type'] = 'application/json';
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    return config;
}, (error) => {
    return Promise.reject(error);
});
//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
    return res;
}, (error) => {
    // $toast.show("shibai")
    return Promise.reject(error);
});
/**
 *  提示错误信息
 */
function toastErrorMessage(msg) {
    setTimeout(() => {
        $toast.show(msg)
    }, 300)
}
//返回一个Promise(发送post请求)
export default function request(url, params) {
    // console.log(url, params, "请求地址和参数")
    if (params.sign) {
        delete params.sign
    }
    // console.log(params,"处理参数")
    var newParams = params
    if (url === urls.phoneLogin || url == urls.respondSurvey || url === urls.smsCode) { //不需要token的接口:如登录

    } else { //使用token的接口
        if (localStorage.getItem("userInfo") && JSON.parse(localStorage.getItem("userInfo")).token) {
            newParams.token = JSON.parse(localStorage.getItem("userInfo")).token
        } else {
            window.location.href = urls.basePage + "/pc/#/loginpage"

        }
    }
    newParams.terminalCode = "3" //终端来源(1 公众号；2 Android；3 PC；4 iOS；5 小程序；6 分享；7 WeSurvey_Android；8 WeSurvey_iOS)
    newParams.sign = methods.exchangeMD5(Object.assign(newParams, { nonce_str: methods.nonce_str() }))
    var method = 'post'
    $loading.show()

    return new Promise((resolve, reject) => {
        axios[method](url, newParams)
            .then(response => {
                $loading.hide()
                if (response.data.code == 500 && response.data.msg == "用户token不能为空") {
                    setTimeout(() => {
                        window.location.href = urls.basePage + "/pc/#/loginpage"
                    }, 1000)
                }
                // 根据全局的报文规范、统一返回报文需要的主题内容
                if (response.data.code == 1 || (response.data.code == 0 && url == urls.smsCode)) { //0代表验证码请求限制
                    resolve(response.data);
                } else if (response.data.code == 0 && url == urls.queryNeteaseInfo) { //IM即时通讯手机号未注册
                    $toast.show(response.data.msg)
                } else if (response.data.code == -1) { //-1代表token失效
                    $toast.show(response.data.msg + "请重新登录")
                    localStorage.clear()
                    setTimeout(() => {
                        window.location.href = urls.basePage + "/pc/#/loginpage"
                    }, 1000)
                } else if (response.data.code == -2) { //-2其他端登录
                    $toast.show(response.data.msg + "请重新登录")
                    localStorage.clear()
                    setTimeout(() => {
                        window.location.href = urls.basePage + "/pc/#/loginpage"
                    }, 1000)
                } else {
                    reject(response.data.msg)
                    if (response.data.msg == "用户token不能为空") {
                        toastErrorMessage("请登录")
                    } else {
                        toastErrorMessage(response.data.msg)
                    }
                }
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}