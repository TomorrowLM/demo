"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIPhoneX = void 0;
// 判断手机是否有下面的小黑条
function isIPhoneX() {
    var u = navigator.userAgent;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isIOS) {
        if ((window.screen.height == 812 && window.screen.width == 375) || (window.screen.width === 414 && window.screen.height === 896)) { //有底部小黑条
            //是iphoneX(375*812) iphoneXR(414*896) iphoneXS max(414*896)  iphone11(414*896) iphone pro max(414*896)
            return true;
        }
        else { //没有底部小黑条
            return false;
        }
    }
    else {
        return false;
    }
}
exports.isIPhoneX = isIPhoneX;
