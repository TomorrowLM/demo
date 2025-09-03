// import store from '@/store'; // 注释掉，避免构建时的依赖问题
class WebsocketObj {
  ws: any;
  returnFn: any;
  pingPong = 'ping'; //ping:连接尚未建立
  pingInterval: any;
  pongInterval: any;
  status: string | null;
  dUid = Date.now();
  uid = [this.dUid];

  constructor(fn: Function) {
    console.log(fn);
    this.status = null;
    this.ws = null;
    this.returnFn = fn;
  }

  private guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
  // 初始化websocket
  initWebsocket() {
    // const API = `ws://platform.rgzngc.cisdigital.cn/auth-pend/api/webSocket`;
    console.log(
      2,
      `ws://` +
        document.referrer.split('://')[1].split('/')[0] +
        '/auth-pend/api/webSocket'
    );
    const API =
      `ws://` +
      document.referrer.split('://')[1].split('/')[0] +
      '/auth-pend/api/webSocket';
    console.log(2, API);
    this.ws = new WebSocket(API);
    //连接成功建立的回调方法
    this.ws.onopen = () => {
      console.log('Websocket通道建立成功', this.ws);
      this.status = 'open';
      // store().wsStore.setWsStatus(this.status); // 注释掉，避免构建时的依赖问题
      //添加onmessage回调函数
      this.onmessage();
      // this.heartCheck();
    };
    // this.ws.onclose = () => {
    //   setTimeout(() => {
    //     this.closeHandle();
    //   }, 1000);
    // };
    this.ws.onerror = err => {
      console.log(2, 'onerror', err);
      setTimeout(() => {
        this.closeHandle();
      }, 1000);
    };

    //在刷新前，执行disconnect
    window.addEventListener('beforeunload', e => {
      this.disconnect();
    });
  }

  send(res, text?: string) {
    if (text !== 'disconnect') {
      this.uid = [...this.uid, res.uid];
      if (this.ws?.readyState === 1) {
        this.ws.send(JSON.stringify(res));
      }
    } else {
      if (this.ws?.readyState === 1) {
        this.ws.send(JSON.stringify(res));
      }
    }
  }

  onmessage() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.ws.onmessage = res => {
      if (res.data === 'keep alive success！') {
        that.pingPong = 'pong'; //连接成功建立, 改为pong
      }
      console.log('Received Message: ', res.data);
      console.log(res, 123);
      if (res.data === 'refresh') {
        this.returnFn('refresh');
      } else {
        const { data = '', code } = JSON.parse(res.data);
        //判断通信的数据
        switch (code) {
          default:
            break;
        }
      }
    };
  }

  async disconnect() {
    this.ws.onclose = function (e) {
      console.log(
        'websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean
      );
    };
    this.closeWs();
    clearInterval(this.pingInterval);
    clearInterval(this.pongInterval);
    this.status = 'close';
    console.log('断开连接');
  }

  heartCheck() {
    this.uid.map(val => {
      this.ws.send(JSON.stringify({ uid: val }));
    });
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === 1) {
        // 检查ws为链接状态 才可发送
        this.ws.send(JSON.stringify({ uid: this.dUid })); // 客户端发送ping
      }
    }, 100000);
    this.pongInterval = setInterval(() => {
      console.log(this.pingPong);
      if (this.pingPong !== 'pong') {
        this.pingPong = 'ping'; //连接没成功建立
        this.closeHandle('pingPong没有改变为pong'); // 没有返回pong 重启webSocket
      }
    }, 200000);
  }

  closeHandle(e = 'err') {
    // 因为webSocket并不稳定，规定只能手动关闭(调closeMyself方法)，否则就重连
    this.closeWs();
    if (this.status !== 'close') {
      console.log(`断开，重连websocket`, e);
      if (this.pingInterval !== undefined && this.pongInterval !== undefined) {
        // 清除定时器
        clearInterval(this.pingInterval);
        clearInterval(this.pongInterval);
      }
      this.initWebsocket(); // 重连
    } else {
      console.log(`websocket手动关闭,或者正在连接`);
    }
  }

  closeWs() {
    // this.uid.map(val => {
    //   this.send({ cid: val }, 'disconnect');
    // });
    this.ws.close();
  }
}
// const ws = new WebsocketObj();
export default WebsocketObj;
