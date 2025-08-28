// const axios = require('axios');
// const qs = require('qs');
// const md5 = require('js-md5');

import qs from "qs";
import { md5 } from 'js-md5';
import axios from 'axios';

type RequestInfo = {
  config: any;
  triggerTime: number;
  data?: any;
  cancel?: Function;
}

// 防重复请求处理类
class RepeatHandle {
  private requestMap: Map<string, RequestInfo>;

  constructor() {
    this.requestMap = new Map();
  }

  // 生成请求的唯一key
  private generateReqKey(config: any): string {
    const { method, url, params, data } = config;
    return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
  }

  // 添加请求到Map
  public addRequest(requestInfo: RequestInfo): void {
    const reqKey = this.generateReqKey(requestInfo.config);
    this.requestMap.set(reqKey, requestInfo);
  }

  // 检查是否存在重复请求
  public checkRepeatRequest(config: any): boolean {
    const reqKey = this.generateReqKey(config);
    return this.requestMap.has(reqKey);
  }

  // 获取请求信息
  public getRequestMapInfo(config: any): RequestInfo {
    const reqKey = this.generateReqKey(config);
    return this.requestMap.get(reqKey) || {
      config: {},
      triggerTime: 0
    };
  }

  // 删除请求信息
  public deleteRequest(config: any): void {
    const reqKey = this.generateReqKey(config);
    this.requestMap.delete(reqKey);
  }
}

// 导出 repeatHandle 对象（新名称）
export const repeatHandle = new RepeatHandle();