import apis from "../api";
import { getMap } from "@package/dingTalk/ddApi/ddApiUtils";
import judgedPlatForms, {
  judgedEnv,
} from "@package/components/dt-navigation/utils.js";
import { Toast } from "vant";

//模板组件
export default {
  data() {
    return {
      iswx: false,
      address: "",
      latitude: "",
      longitude: "",
      isOver: false, // 位置获取结束状态
    };
  },
  methods: {
    // 定位
    async geolocation() {
      // return;
      let status = await judgedPlatForms();
      this.iswx = status;
      console.log("iswx1===>>>", this.iswx);

      let isDingtalk = /DingTalk/.test(navigator.userAgent);

      try {
        if (!isDingtalk || dd.pc) {
          if (sessionStorage.getItem("wxCode") || this.iswx) {
            console.log("wxCode===>>>", sessionStorage.getItem("wxCode"));
            await this.initWx();
          } else {
            console.log("navigator.geolocation=====>", navigator.geolocation);
            if (navigator.geolocation) {
              console.log('navigator.geolocation', navigator.geolocation)
              navigator.geolocation.getCurrentPosition(
                this.getLocationSuccess,
                this.getLocationError
              );
              this.isOver = true;
            } else {
              console.log("Geolocation is not supported by this browser.");
              this.isOver = true;
            }
          }
        } else {
          getMap(
            200,
            1,
            true,
            (result) => {
              this.address = result.address;
              this.latitude = result.latitude;
              this.longitude = result.longitude;
              this.isOver = true;
            },
            (err) => {
              if (err.errorCode == 445 || err.errorCode == 4) {
                this.$toast("请开启定位功能");
              }
              this.isOver = true;
            }
          );
        }
      } catch (err) {
        console.log('err', err)
        this.isOver = true;
      }
    },
    async getLocationSuccess(position) {
      this.latitude = position.coords.latitude.toFixed(6);
      this.longitude = position.coords.longitude.toFixed(6);
      this.getNowAddress(this.longitude, this.latitude);
    },
    async initWx() {
      const host = window.location.host;
      // 丁税宝测试小程序原始id
      this.username = "gh_2cf375eda8c4";
      // 易企服务公众号appId
      this.appId = "wx8ff075269fccc068";
      if (host.indexOf("pre") >= 0) {
        // 山东济南小程序原始id
        this.username = "gh_6e946b8d41c6";
        // 孚嘉科技公众号appId
        this.appId = "wx2f729bd6634301ab";
      }
      if (/app\.dingtax\.cn/.test(host) || /zjtjj\.dingtax\.cn/.test(host)) {
        // 山东济南小程序原始id
        this.username = "gh_6e946b8d41c6";
        // 孚嘉科技公众号appId
        this.appId = "wx2f729bd6634301ab";
      }
      console.log('this.appId', this.appId)
      this.getWxSignature();
    },
    async getWxSignature() {
      let code = sessionStorage.getItem("wxCode");
      let signUrl = window.location.href.split("#")[0] || "";
      // signUrl = encodeURIComponent(signUrl)
      // signUrl = "https://app-test.dingtax.cn/dsb/eqa/?corpId=XNZZ-11512-70&env=dd"
      console.log('signUrl11111111111', signUrl)
      console.log('signUrl11111111111', window.location.href)
      let params = {
        appId: this.appId,
        signUrl,
      };
      console.log('params>>>>>>>> ', params)
      await judgedEnv().then(async (res) => {
        // 2 微信小程序 3 企业微信
        let data = "";
        if (res == 2) {
          data = await apis.getJsconfig(params);
        } else if (res == 3) {
          data = await apis.getJsconfigQw({ code, signUrl });
        }
        await this.config(data);
      });
    },
    async config(config) {
      let _this = this;
      // debug: true, // 调试时可开启
      // openTagList: ['wx-open-launch-weapp'], // 填入打开小程序的开放标签名
      const data = {
        appId: config.data.appId, // <!-- replace Has been replaced -->
        timestamp: config.data.timeStamp, // 必填，填任意数字即可
        nonceStr: config.data.nonceStr, // 必填，填任意非空字符串即可
        signature: config.data.signature, // 必填，填任意非空字符串即可
        jsApiList: ["getLocation"], // 必填，随意一个接口即可
      }
      console.log('data', data)
      wx.config(data);
      wx.ready(async function () {
        //执行你的业务逻辑代码
        try {
          const location = await _this.getLocationPromise();
          _this.latitude = location.latitude;
          _this.longitude = location.longitude;
          _this.getNowAddress(location.longitude, location.latitude);
          _this.isOver = true;
        } catch (err) {
          Toast(`获取位置失败 ${JSON.stringify(err)}`);
          console.info("ready getLocation fail=" + JSON.stringify(err));
          _this.isOver = true;
        }
        // try {
        //   const setting = await _this.getSettingPromise();
        //   console.log('setting', setting);
        //   _this.isOver = true;
        // } catch (err) {
        //   console.info("ready getSetting fail=" + JSON.stringify(err));
        //   _this.isOver = true;
        // }
      });
      wx.error(function (res) {
        console.log("wx-err", res);
        _this.isOver = true;
        // window.location.reload();
      });
    },
    async getNowAddress(longitude, latitude) {
      let params = {
        longitude: longitude,
        latitude: latitude,
      };
      apis
        .getNowLocation(params)
        .then((res) => {
          console.log("getNowLocation===========>", res);
          if (res.respCode == "0") {
            this.address = res.datas.formattedAddress;
            console.log(this.address);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getLocationPromise() {
      return new Promise((resolve, reject) => {
        const _this = this;
        wx.getLocation({
          type: "gcj02",
          success: function (res) {
            resolve(res);
          },
          fail: function (err) {
            reject(err);
          },
          complete: function (res) {
            _this.isOver = true;
          },
          cancel: function (res) {
            _this.isOver = true;
          }
        });
      });
    },
    getSettingPromise() {
      return new Promise((resolve, reject) => {
        wx.getSetting({
          success: function (res) {
            resolve(res);
          },
          fail: function (err) {
            reject(err);
          }
        });
      });
    },
    getLocationError(error) {
      console.error("Error getting your location:", error);
    },
  },
};
