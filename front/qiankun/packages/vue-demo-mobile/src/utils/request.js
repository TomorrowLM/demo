import { request } from '@lm/shared';
import { Toast } from 'vant';

class MessageClass {
  constructor() {
    this.messageInstances = {};
  }

  add({ text, type, key }) {
    let fn = Toast;
    if (type === 'success') {
      fn = Toast.success;
    } else if (type === 'error') {
      fn = Toast.fail;
    }
    this.messageInstances[key] = fn(text);
  }

  remove({ key }) {
    const inst = this.messageInstances[key];
    if (inst && typeof inst.clear === 'function') {
      inst.clear();
    }
    delete this.messageInstances[key];
  }

  clear() {
    Object.keys(this.messageInstances).forEach((key) => {
      const inst = this.messageInstances[key];
      if (inst && typeof inst.clear === 'function') {
        inst.clear();
      }
    });
    this.messageInstances = {};
  }
}

class LoadingClass {
  constructor() {
    this.loadingInstances = [];
  }

  add() {
    const inst = Toast.loading({
      duration: 0,
      forbidClick: true,
      message: '加载中...',
    });
    this.loadingInstances.push(inst);
  }

  remove() {
    const inst = this.loadingInstances.pop();
    if (inst && typeof inst.clear === 'function') {
      inst.clear();
    }
  }

  clear() {
    this.loadingInstances.forEach((inst) => {
      if (inst && typeof inst.clear === 'function') {
        inst.clear();
      }
    });
    this.loadingInstances = [];
  }
}

try {
  request.setMessageProvider(MessageClass);
  request.setLoadingProvider(LoadingClass);
} catch (err) {
  // 某些环境下可能没有正确注册 Vant，无需中断
}

export default request;
