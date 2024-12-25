"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlFirst = exports.getUrl = void 0;
/**
 * 获取url参数
 * @return obj
 */
function getUrl(href = '') {
    var url = decodeURIComponent(href || window.location.href); //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.lastIndexOf("?") != -1) {
        var str = url.substring(url.lastIndexOf("?") + 1, url.length);
        const strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
exports.getUrl = getUrl;
/**
 * 获取url参数
 * @return obj
 */
function getUrlFirst(href = '') {
    var url = decodeURIComponent(href || window.location.href); //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.lastIndexOf("?") != -1) {
        var str = url.substring(url.indexOf("?") + 1, url.length);
        const strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
exports.getUrlFirst = getUrlFirst;
