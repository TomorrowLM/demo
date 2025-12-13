import $lm from '@lm/shared';
import { Message, Loading } from 'element-ui'
// import type { Request } from '@lm/shared/lib/esm/types/utils/request/index';
// const request = $lm.utils.request as Request;
const request = $lm.utils.request;
console.log(request, 212);

class MessageClass {
  messageInstances: any;
  constructor() {
    this.messageInstances = {
    };
  }

  add({ text, type, key }: { text: string; type: 'success' | 'error' | 'info'; key: string }) {
    if (type === 'success') {
      this.messageInstances[key] = Message.success(text);
    }
  }
  remove({ key }: any) {
    this.messageInstances[key].close();
  }

  clear() {
    this.messageInstances.forEach((item: any) => {
      item.close();
    });
    this.messageInstances = [];
  }
}

class LoadingClass {
  loadingInstances: any;
  constructor() {
    this.loadingInstances = [];
  }

  add() {
    let loadingInstance = Loading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    this.loadingInstances.push(loadingInstance);
  }

  remove(target: any) {

  }

  clear() {

  }
}

// 注册 message 和 loading 提供者到 shared 请求工具
// 传入类构造器, 由 shared 内部进行实例化与管理
try {
  request.setMessageProvider(MessageClass);
  (request as any).setLoadingProvider(LoadingClass);
} catch (err) {
  // 在某些环境下 element-ui 可能不可用，忽略注册错误
}

export default request;