import utils from "./utils";

// 浏览器环境配置 - 不包含Node.js特定的代码
const browserConfig = {
  // 只包含浏览器可用的配置
  apiConfig: {
    timeout: 6000,
    headers: {
      'Content-Type': 'application/json',
    }
  }
};

const sharedConfig = {
  config: browserConfig,
  utils
};

export default sharedConfig;