/**
 * 随机生成字符串
 * @param  len 字符串长度
 * @create by zqm on 2018-11-1
 */
//  export function nonce_str(len) {
//   len = len || 32;
//   const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /*易混淆的字符oOLl,9gq,Vv,Uu,I1*/
//   const maxPos = $chars.length;
//   let pwd = '';
//   for (var i = 0; i < len; i++) {
//     pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
//   }
//   return pwd;
// }
/**
 * md5加密
 * @param  obj 需要md5的内容
 * @return  sign 签名
 * @create by zqm on 2018-11-1
 */
// import md5 from 'js-md5'
// export function exchangeMD5(obj) {
//   var newkey = Object.keys(obj).sort();
//   var newObj = {};
//   for (var i = 0; i < newkey.length; i++) {
//     newObj[newkey[i]] = obj[newkey[i]];
//   }
//   var str = '';
//   for (var key in newObj) {
//     str = str + key + '=' + newObj[key] + "&"
//   }
//   str = str.substr(0, str.length - 1)

//   var stringSignTemp = str + "&key=951d4c42326611e8a17f6c92bf3bb67f"
//   var sign = md5(stringSignTemp).toUpperCase()
//   return sign;
// }


/**
 * 获取url参数
 * @return obj
 */
export function getUrl(href = '') {
  var url =decodeURIComponent(href || window.location.href); //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.lastIndexOf("?") != -1) {
    var str =url.substring(url.lastIndexOf("?") + 1, url.length);
    const strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}
/**
 * 获取url参数
 * @return obj
 */
 export function getUrlFirst(href = '') {
  var url =decodeURIComponent(href || window.location.href); //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.lastIndexOf("?") != -1) {
    var str =url.substring(url.indexOf("?") + 1, url.length);
    const strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}
/**
 * 禁止浏览器后退
 * @return null
 */
export function banBack() {
  pushHistory();
  window.addEventListener("popstate", function () {
    pushHistory();
  }, false);
  function pushHistory() {
    var state = {
      title: "title",
      url: "#"
    };
    window.history.pushState(state, "title", "#");
  }
}
// 判断手机是否有下面的小黑条
export function  isIPhoneX() {
  var u = navigator.userAgent;
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isIOS) {
    if ((window.screen.height == 812 && window.screen.width == 375) || (window.screen.width === 414 && window.screen.height === 896)) {//有底部小黑条
      //是iphoneX(375*812) iphoneXR(414*896) iphoneXS max(414*896)  iphone11(414*896) iphone pro max(414*896)
      return true
    } else {//没有底部小黑条
      return false
    }
  } else {
    return false
  }
}
