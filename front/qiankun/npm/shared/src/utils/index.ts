import location from "./location";
import request from "./request";

export { request, location };

// 保留默认导出以兼容旧用法
export default {
  request,
  location,
};
