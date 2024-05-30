<template>
  <div>
    <button @click="openApp">立即打开</button>
  </div>
</template>
 <script>
import { Dialog } from "vant";
import CallApp from "callapp-lib";
export default {
  name: "open-app",
  data() {
    return {
      types: null,
      urls: null,
      commodityIds: null,
    };
  },
  created() {},
  mounted() {},
  methods: {
    openApp() {
      //判断不是苹果终端且不是微信环境
      // if (
      //   !window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) &&
      //   window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
      //     "micromessenger"
      // ) {
      //   return;
      // }
      Dialog.confirm({
        title: "提示",
        message: "您是否已经安装APP?",
        confirmButtonText: "下载APP",
        cancelButtonText: "有APP，打开",
      })
        .then(() => {
          //在 JavaScript 1.5 版中，不推荐使用 escape() 函数。请使用 encodeURI() 或 encodeURIComponent() 代替。
          //escape() 函数对字符串进行编码。
          const android_schema = escape(
            `pinrenwu://pinrenwu?index=1&url=${this.urls}`
          );
          const ios_scheme = escape(
            `pinrenwu://pinrenwu?index=1&url=${this.urls}`
          );
          //应用商城：应用宝
          //配置android_schema，应用宝可以直接打开 APP 的某个功能
          const url = `https://a.app.qq.com/o/simple.jsp?pkgname=com.tencent.mobileqq&g_f=1000047&android_schema=${android_schema}&ios_scheme=${ios_scheme}`;
          window.location.href = url;
        })
        .catch(() => {
          const options = {
            scheme: {
              protocol: "mqq",
            },
            intent: {
              package: "net.pinrenwu.pinrenwu",
              scheme: "pinrenwu",
            },
            universal: {
              host: "acz-jump.youku.com/wow/ykpage/act/ulink",
              pathKey: "action",
            },
            appstore: "https://itunes.apple.com/cn/app/id336141475",
            yingyongbao: `https://a.app.qq.com/o/simple.jsp?pkgname=com.tencent.mobileqq&g_f=1000047`,
            fallback: `https://a.app.qq.com/o/simple.jsp??pkgname=com.tencent.mobileqq&g_f=1000047`,
            timeout: 1000,
          };
          const callLib = new CallApp(options);
          callLib.open({
            param: "",
            path: "",
          });
          const qq = `mqq://`;
          window.location.href = qq;
          //CallApp原理
          //安卓app的scheme协议
          // const android_schema = escape(`pinrenwu://pinrenwu`);
          // const ios_scheme = escape(`pinrenwu://pinrenwu`);
          // const weixin = `weixin://`;
          // const taobao = `taobao://`;
          // const qq = `mqq://`;
          // window.location.href = android_schema;
          //如果3秒后还没有唤醒 app，那么就认为该设备上没有安装app，即跳转到应用市场。
          // setTimeout(function () {
          //   //判断用户离开页面
          //   let hidden =
          //     window.document.hidden ||
          //     window.document.mozHidden ||
          //     window.document.msHidden ||
          //     window.document.webkitHidden;
          //   if (typeof hidden == "undefined" || hidden == false) {
          //     //小米下载地址
          //     window.location.href =
          //       "https://app.mi.com/details?id=com.tencent.tmgp.sgame";
          //   }
          // }, 2000);
          // setTimeout(() => {
          //   Dialog.alert({
          //     title: "提示",
          //     message: "哎呀，失败了！请前往拼任务APP直接打开",
          //     confirmButtonText: "知道了",
          //   });
          // }, 3000);
        });
    },
  },
};
</script>