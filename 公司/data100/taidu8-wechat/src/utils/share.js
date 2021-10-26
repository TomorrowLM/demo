import { axios } from '@/utils/request'
import urls from "../api/index"
import wx from "weixin-js-sdk"
const request = (url, params = {}, method = 'post') => {
    return ['post', 'put'].includes(method) ? axios({ url, method, data: params }) : axios({ url, method, params })
}

export default function weixin(params, pageName) {
    // params:分享的标题内容等所需参数
    //type:1 问卷 2 小任务 3 邀请 4 首页 5 提现 6 Banner 7商品, 8:社区文章,9:徽章10徽章墙
    // isStatistics:是否走分享统计接口 undefined：否  ：是  
    var locationUrl = window.location.href
    var reqUrl = locationUrl;
    // if (locationUrl.slice(0, 5) == "http:") {
    //     locationUrl.replace("http", "https")
    // }
    if (locationUrl.indexOf('#') > -1) {
        reqUrl = locationUrl.split('#')[0]
    }

    request(urls.getConfig, {
        url: reqUrl,//https协议  同域名 不能是短链接  #之前的字符串
    }).then(newdata => {
        console.log('微信', newdata)
        wx.config({
            debug: false,
            appId: newdata.data.appId,
            timestamp: newdata.data.timestamp,
            nonceStr: newdata.data.nonceStr,
            signature: newdata.data.signature,
            jsApiList: [
                'onMenuShareAppMessage',//分享给好友功能
                'hideMenuItems',//隐藏菜单功能
                'onMenuShareTimeline',
                // 'onMenuShareQQ',
                // "onMenuShareWeibo",
                // 'onMenuShareQZone'
            ]
        });
    })
    console.log(params.title, params.desc, params.link, params.imgUrl)
    wx.ready(function () {
        if (pageName === 'SurveyFront') {
            wx.hideMenuItems({
                menuList: locationUrl.indexOf("wwwtest") > -1 || locationUrl.indexOf("wwwpre") > -1 ? ["menuItem:share:email", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:facebook", "menuItem:share:QZone","menuItem:share:appMessage", "menuItem:share:timeline","menuItem:share:brand"] : ["menuItem:share:email", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:facebook", "menuItem:share:QZone", "menuItem:copyUrl", "menuItem:openWithQQBrowser","menuItem:share:appMessage", "menuItem:share:timeline","menuItem:share:brand"] // 要隐藏的菜单 
            });
        } else {
            wx.hideMenuItems({
                menuList: locationUrl.indexOf("wwwtest") > -1 || locationUrl.indexOf("wwwpre") > -1 ? ["menuItem:share:email", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:facebook", "menuItem:share:QZone", "menuItem:openWithSafari"] : ["menuItem:share:email", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:facebook", "menuItem:share:QZone", "menuItem:copyUrl", "menuItem:openWithSafari", "menuItem:openWithQQBrowser"] // 要隐藏的菜单
            });
        }

        // 2. 分享接口
        // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareAppMessage({
            title: params.title,
            desc: params.desc,
            link: params.link,
            imgUrl: params.imgUrl,
            success: function () {// 设置成功

            },

        });
        // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareTimeline({
            title: params.title,
            link: params.link,
            imgUrl: params.imgUrl,
            success: function () {// 设置成功

            },
        });
    });
}
