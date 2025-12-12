// 获取微信小程序环境
const getWxXcXEnv = () => {
  const promise = new Promise((resolve) => {
    if ((!wx || !wx.miniProgram) && (!parent.wx || !parent.wx.miniProgram)) {
      return resolve(false);
    }
    if (parent.wx) {
      parent.wx.miniProgram.getEnv((res) => {
        resolve(!!res.miniprogram);
      });
    }
    if (wx) {
      wx.miniProgram.getEnv((res) => {
        resolve(!!res.miniprogram);
      });
    }
  });
  return promise;
};
// 获取设备环境
export const getDeviceEnv = async () => {
  const ua = navigator.userAgent;
  const isWindowsPhone = /(?:Windows Phone)/.test(ua);
  const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone;
  const isAndroid = /(?:Android)/.test(ua);
  const isFireFox = /(?:Firefox)/.test(ua);
  const isChrome = /(?:Chrome|CriOS)/.test(ua);
  const isTablet =
    /(?:iPad|PlayBook)/.test(ua) ||
    (isAndroid && !/(?:Mobile)/.test(ua)) ||
    (isFireFox && /(?:Tablet)/.test(ua));
  const isIPhone = /(?:iPhone)/.test(ua) && !isTablet;
  const isPc = !isIPhone && !isAndroid && !isSymbian;
  const isWx = /micromessenger/i.test(ua);
  const isDingTalk = /DingTalk/.test(ua);
  let isQyWx = false;
  let isWxXcx = false;
  let isWxLlq = false;
  if (isWx) {
    isWxLlq = true;
    if (/wxwork/i.test(ua)) {
      isQyWx = true;
    } else {
      isWxXcx = await getWxXcXEnv();
    }
  }
  console.log("isWxXcx======>", isWxXcx);
  return {
    isChrome,
    isTablet,
    isIPhone,
    isAndroid,
    isPc,
    isWx,
    isQyWx,
    isWxXcx,
    isWxLlq,
    isDingTalk,
  };
};