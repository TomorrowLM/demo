(window["webpackJsonp_vue2-mobile"]=window["webpackJsonp_vue2-mobile"]||[]).push([["chunk-88af22b0"],{"01a1":function(n,e,t){(function(e,t){n.exports=t()})(0,(function(){"use strict";function n(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}function e(n,e){for(var t=0;t<e.length;t++){var o=e[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(n,o.key,o)}}function t(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}function o(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function i(){return i=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(n[o]=t[o])}return n},i.apply(this,arguments)}var a,c,r,u=navigator.userAgent||"",p=function(n,e){for(var t=window,o=t.isNaN,i=n.split("."),a=e.split("."),c=0;c<3;c++){var r=Number(i[c]),u=Number(a[c]);if(r>u)return 1;if(u>r)return-1;if(!o(r)&&o(u))return 1;if(o(r)&&!o(u))return-1}return 0},s=function(){var n=navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);return Number.parseInt(n[1],10)},f=function(){var n=navigator.appVersion.match(/micromessenger\/(\d+\.\d+\.\d+)/i);return n[1]},d=/android/i.test(u),l=/iphone|ipad|ipod/i.test(u),h=/micromessenger\/([\d.]+)/i.test(u),m=/(weibo).*weibo__([\d.]+)/i.test(u),v=/(baiduboxapp)\/([\d.]+)/i.test(u),y=/qq\/([\d.]+)/i.test(u),b=/(qqbrowser)\/([\d.]+)/i.test(u),g=/qzone\/.*_qz_([\d.]+)/i.test(u),k=/chrome\/[\d.]+ mobile safari\/[\d.]+/i.test(u)&&d&&u.indexOf("Version")<0;function w(n){var e="undefined"!==typeof n?Object.keys(n).map((function(e){return"".concat(e,"=").concat(n[e])})).join("&"):"";return e?"?".concat(e):""}function q(n,e){var t=n.path,o=n.param,i=e.scheme,a=e.buildScheme;if("undefined"!==typeof a)return a(n,e);var c=i.host,r=i.port,u=i.protocol,p=r?":".concat(r):"",s=c?"".concat(c).concat(p,"/"):"",f=w(o);return"".concat(u,"://").concat(s).concat(t).concat(f)}function _(n,e){var t=e.outChain,o=q(n,e);if("undefined"!==typeof t&&t){var i=t.protocol,a=t.path,c=t.key;o="".concat(i,"://").concat(a,"?").concat(c,"=").concat(encodeURIComponent(o))}return o}function O(n,e){var t=e.outChain,o=e.intent,i=e.fallback;if("undefined"===typeof o)return"";var a=Object.keys(o),c=a.map((function(n){return"".concat(n,"=").concat(o[n],";")})).join(""),r="#Intent;".concat(c,"S.browser_fallback_url=").concat(encodeURIComponent(i),";end;"),u=q(n,e);if("undefined"!==typeof t&&t){var p=t.path,s=t.key;return"intent://".concat(p,"?").concat(s,"=").concat(encodeURIComponent(u)).concat(r)}return u=u.slice(u.indexOf("//")+2),"intent://".concat(u).concat(r)}function T(n,e){var t=e.universal;if("undefined"===typeof t)return"";var o=t.host,i=t.pathKey,a=n.path,c=n.param,r=w(c),u="https://".concat(o,"/").concat(a).concat(r),p="https://".concat(o,"?").concat(i,"=").concat(a).concat(r.replace("?","&"));return i?p:u}function j(n,e){var t=_(n,e);return"".concat(e.yingyongbao,"&android_schema=").concat(encodeURIComponent(t))}function C(){"undefined"!==typeof document&&("undefined"!==typeof document.hidden?(a="hidden",c="visibilitychange"):"undefined"!==typeof document.msHidden?(a="msHidden",c="msvisibilitychange"):"undefined"!==typeof document.webkitHidden&&(a="webkitHidden",c="webkitvisibilitychange"))}function x(){return"undefined"!==typeof a&&document[a]}function A(n){window.top.location.href=n}function I(n){var e=document.createElement("a");e.setAttribute("href",n),e.style.display="none",document.body.appendChild(e),e.click()}function P(n){r||(r=document.createElement("iframe"),r.style.cssText="display:none;border:0;width:0;height:0;",document.body.append(r)),r.src=n}function U(n,e){var t=setTimeout((function(){var e=x();e||n()}),e);"undefined"!==typeof c?document.addEventListener(c,(function(){clearTimeout(t)})):window.addEventListener("pagehide",(function(){clearTimeout(t)}))}C();var S=function(){function e(t){n(this,e),o(this,"options",void 0);var a={timeout:2e3};this.options=i(a,t)}return t(e,[{key:"generateScheme",value:function(n){return _(n,this.options)}},{key:"generateIntent",value:function(n){return O(n,this.options)}},{key:"generateUniversalLink",value:function(n){return T(n,this.options)}},{key:"generateYingYongBao",value:function(n){return j(n,this.options)}},{key:"checkOpen",value:function(n){var e=this.options,t=e.logFunc,o=e.timeout;return U((function(){"undefined"!==typeof t&&t("failure"),n()}),o)}},{key:"fallToAppStore",value:function(){var n=this;this.checkOpen((function(){A(n.options.appstore)}))}},{key:"fallToFbUrl",value:function(){var n=this;this.checkOpen((function(){A(n.options.fallback)}))}},{key:"fallToCustomCb",value:function(n){this.checkOpen((function(){n()}))}},{key:"open",value:function(n){var e,t=this.options,o=t.universal,i=t.appstore,a=t.logFunc,c=t.intent,r=n.callback,u="undefined"!==typeof o,d=this.generateScheme(n);"undefined"!==typeof a&&a("pending"),l?h&&-1===p(f(),"7.0.5")||m?A(i):s()<9?(P(d),e=this.fallToAppStore):!u||y||b||g?(I(d),e=this.fallToAppStore):A(this.generateUniversalLink(n)):h&&"undefined"!==typeof this.options.yingyongbao?A(this.generateYingYongBao(n)):k?"undefined"!==typeof c?A(this.generateIntent(n)):(A(d),e=this.fallToFbUrl):h||v||m||g?A(this.options.fallback):(P(d),e=this.fallToFbUrl),"undefined"===typeof r?e&&e.call(this):this.fallToCustomCb(r)}}]),e}();return S}))},"276c":function(n,e,t){"use strict";t.r(e);var o=function(){var n=this,e=n._self._c;return e("div",[e("button",{on:{click:n.openApp}},[n._v("立即打开")])])},i=[],a=t("2241"),c=t("01a1"),r=t.n(c),u={name:"open-app",data(){return{types:null,urls:null,commodityIds:null}},created(){},mounted(){},methods:{openApp(){a["a"].confirm({title:"提示",message:"您是否已经安装APP?",confirmButtonText:"下载APP",cancelButtonText:"有APP，打开"}).then(()=>{const n=escape("pinrenwu://pinrenwu?index=1&url="+this.urls),e=escape("pinrenwu://pinrenwu?index=1&url="+this.urls),t=`https://a.app.qq.com/o/simple.jsp?pkgname=com.tencent.mobileqq&g_f=1000047&android_schema=${n}&ios_scheme=${e}`;window.location.href=t}).catch(()=>{const n={scheme:{protocol:"mqq"},intent:{package:"net.pinrenwu.pinrenwu",scheme:"pinrenwu"},universal:{host:"acz-jump.youku.com/wow/ykpage/act/ulink",pathKey:"action"},appstore:"https://itunes.apple.com/cn/app/id336141475",yingyongbao:"https://a.app.qq.com/o/simple.jsp?pkgname=com.tencent.mobileqq&g_f=1000047",fallback:"https://a.app.qq.com/o/simple.jsp??pkgname=com.tencent.mobileqq&g_f=1000047",timeout:1e3},e=new r.a(n);e.open({param:"",path:""});const t="mqq://";window.location.href=t})}}},p=u,s=t("2877"),f=Object(s["a"])(p,o,i,!1,null,null,null);e["default"]=f.exports}}]);