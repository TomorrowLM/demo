import { getDeviceEnv } from "./getDeviceEnv";
// import { getJsconfig, getJsconfigQw } from "@/services/weixin";
import axios from "axios";
interface LocationInfo {
  coords: {
    latitude: number; // 纬度
    longitude: number; // 经度
    accuracy?: number; // 精度（米）
    altitude?: number | null; // 海拔（米）
    province?: string; // 省份
    city?: string; // 城市
    district?: string; // 行政区划
    formattedAddress?: string; // 格式化地址
    [key: string]: any; // 为了兼容不同来源的位置信息
  };
  [key: string]: any;
}

// IP定位方法
async function getIPLocation(): Promise<LocationInfo> {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return {
      coords: {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: 500, // IP 定位精度较低
        source: "ip",
      },
    };
  } catch (error) {
    throw new Error("IP 定位也失败了");
  }
}
//逆地理编码
function getNowLocation(params: any) {
  return new Promise((resolve, reject) => {
    console.log("逆地理编码");
    axios({
      method: "get",
      url: "https://api-cx.dingtax.cn/cx/api-uaa/map/location",
      params,
    }).then((res) => {
      resolve(res.data.datas);
    });
  });
}
export default class LocationService {
  deviceEnv: any; // 设备环境
  username: string;
  appId: string; // 公众号id
  locationInfo: {
    latitude: string | number; // 纬度
    longitude: string | number; // 经度
    accuracy?: string | number; // 精度（米）
    [key: string]: any; // 允许添加其他属性
  };

  constructor() {
    this.deviceEnv = {}; // 设备环境信息对象，用于存储设备相关的环境数据
    this.appId = "wx8ff075269fccc068"; // 公众号id，用于标识微信公众号的唯一标识符
    this.username = ""; // 小程序原始id
    this.locationInfo = {
      latitude: "",
      longitude: "",
      accuracy: "",
    };
    this.init();
  }

  // // 等待位置获取完成
  // async waitForLocation(): Promise<void> {
  //   console.log("等待位置获取完成");
  //   await this.getLocation();
  // }
  async init() {
    this.deviceEnv = await getDeviceEnv();
    const host = window.location.host;
    if (host.indexOf("pre") >= 0) {
      // 山东济南小程序原始id
      this.username = "gh_6e946b8d41c6";
      // 孚嘉科技公众号appId
      this.appId = "wx2f729bd6634301ab";
    }
    if (
      /app\.17an\.com/.test(host) ||
      /app\.dingtax\.cn/.test(host) ||
      /zjtjj\.dingtax\.cn/.test(host)
    ) {
      // 山东济南小程序原始id
      this.username = "gh_6e946b8d41c6";
      // 孚嘉科技公众号appId
      this.appId = "wx2f729bd6634301ab";
    }
    console.log("init", this.deviceEnv, "deviceEnv");
  }
  async getLocation() {
    let position: LocationInfo | null = null;
    console.log(
      "getLocation",
      this.deviceEnv,
      "deviceEnv",
      this.deviceEnv.isWx
    );
    const basic = async () => {
      try {
        position = await this.geolocation();
        console.log("geolocation 获取成功");
      } catch {
        console.log("geolocation 获取失败");
        try {
          position = await getIPLocation(); // 尝试使用IP定位
          console.log("IP定位成功");
        } catch (e) {
          console.log("IP定位也失败了");
        }
      }
    };
    const filnal = async () => {
      console.log("finally", position);
      if (position) {
        console.log(position, "position");
        this.locationInfo.latitude = position.coords.latitude; // 纬度
        this.locationInfo.longitude = position.coords.longitude; // 经度
        this.locationInfo.accuracy = position.coords.accuracy; // 精度（米）
        console.log(
          `纬度: ${this.locationInfo.latitude}, 经度: ${this.locationInfo.longitude}, 精度: ${this.locationInfo.accuracy}`
        );
        const data: any = await getNowLocation({
          latitude: this.locationInfo.latitude,
          longitude: this.locationInfo.longitude,
        });
        this.locationInfo = {
          ...this.locationInfo,
          ...data,
        };
        console.log(this.locationInfo, "this.locationInfo");
      }
    };
    if (this.deviceEnv.isWx) {
      try {
        position = await this.wxLocation();
        console.log("wxLocation 获取成功");
      } catch {
        console.log("wxLocation 获取失败");
        await basic();
      } finally {
        await filnal();
      }
    } else {
      try {
        await basic();
      } finally {
        await filnal();
      }
    }
  }
  // google定位
  async geolocation(): Promise<LocationInfo> {
    // 检查浏览器是否支持
    if ("geolocation" in navigator) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
              },
            });
          },
          async (error) => {
            console.error("位置获取失败:", error);
            switch (error.code) {
              case error.PERMISSION_DENIED:
                console.log("用户拒绝位置访问");
                break;
              case error.POSITION_UNAVAILABLE:
                console.log("位置信息不可用");
                break;
              case error.TIMEOUT:
                console.log("请求超时");
                break;
            }
            reject();
          },
          {
            enableHighAccuracy: true, // 高精度模式
            timeout: 1500, // 超时时间（毫秒）
            maximumAge: 60000, // 缓存位置的最大年龄
          }
        );
      });
    } else {
      console.log("浏览器不支持地理位置功能");
      return Promise.reject();
    }
  }
  async wxLocation(): Promise<LocationInfo> {
    console.log("wxLocation");
    const config: any = await this.getWxSignature();
    console.log("config", config);
    const data = {
      appId: config.appId, // <!-- replace Has been replaced -->
      timestamp: config.timeStamp, // 必填，填任意数字即可
      nonceStr: config.nonceStr, // 必填，填任意非空字符串即可
      signature: config.signature, // 必填，填任意非空字符串即可
      jsApiList: ["getLocation"], // 必填，随意一个接口即可
    };
    return new Promise((resolve, reject) => {
      console.log("data", data);
      wx.config(data);
      wx.ready(async () => {
        //执行你的业务逻辑代码
        try {
          wx.getLocation({
            type: "gcj02",
            success: async (location) => {
              resolve({ coords: location });
            },
            fail: function (err) {
              reject(err);
            },
            // complete: function (res) {
            //   _this.isOver = true;
            // },
            // cancel: function (res) {
            //   _this.isOver = true;
            // },
          });
        } catch (err) {
          console.info(`获取位置失败 ${JSON.stringify(err)}`);
          reject(err);
        }
      });
      wx.error(function (res) {
        console.log("wx-err", res);
        reject(res);
      });
    });
  }
  // 微信验签
  async getWxSignature() {
    const code = sessionStorage.getItem("wxCode");
    const signUrl = window.location.href.split("#")[0] || "";
    const params = {
      appId: this.appId,
      signUrl,
    };
    console.log("params>>>>>>>> ", params);
    let data: any = "";
    // 2 微信小程序 3 企业微信
    if (this.deviceEnv.isWx) {
      console.log("微信小程序");
      // data = await getJsconfig(params);
    } else if (this.deviceEnv.isQyWx) {
      console.log("企业微信");
      // data = await getJsconfigQw({ code, signUrl });
    }
    return data;
  }
}
