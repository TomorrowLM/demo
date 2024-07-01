// import store from '@/store';
// class WebsocketObj {
//   ws = null;
//   pingPong = 'ping';
//   pingInterval;
//   pongInterval;
//   status;
//   dUid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//     const r = (Math.random() * 16) | 0,
//       v = c == 'x' ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
//   uid = [this.dUid];
//   constructor() {
//     this.status = null;
//     this.ws = null;
//   }

//   initWebsocket() {
//     // console.log(process.env.NODE_ENV, window.location.origin);
//     if (process.env.NODE_ENV == 'local') {
//       this.ws = new WebSocket('ws://192.168.43.60:7071/slabwms');
//     } else if (process.env.NODE_ENV == 'development') {
//       this.ws = new WebSocket('ws://113.249.91.10:18080/slabwms/ws');
//       // this.ws = new WebSocket('ws://172.20.10.9:18080/coilwms/ws');
//     } else if (process.env.NODE_ENV == 'production1') {
//       this.ws = new WebSocket('ws://172.17.95.50:18080/slabwms/ws');
//     } else {
//       this.ws = new WebSocket('ws://10.108.89.135:18080/slabwms/ws');
//     }
//     //连接成功建立的回调方法
//     const that = this;
//     this.ws.onopen = function() {
//       console.log('Websocket通道建立成功', that.ws);
//       this.status = 'open';
//       store.commit('setWsStatus', this.status);
//       that.onmessage();
//       that.heartCheck();
//     };
//     this.ws.onclose = function() {
//       // console.log("websocket close");
//       setTimeout(() => {
//         that.closeHandle();
//       }, 1000);
//     };
//     this.ws.onerror = function() {
//       // console.log("websocket error");
//     };

//     //在刷新前，执行disconnect
//     window.addEventListener('beforeunload', e => {
//       // console.log('beforeunload');
//       that.disconnect();
//     });
//     // window.addEventListener('load', e => {
//     //   console.log('load');
//     //   that.ws.initWebsocket();
//     //   console.log('刷新页面');
//     // });
//   }

//   send(res, text?: string) {
//     if (text !== 'disconnect') {
//       this.uid = [...this.uid, res.uid];
//       if (this.ws?.readyState === 1) {
//         this.ws.send(JSON.stringify(res));
//       }
//     } else {
//       if (this.ws?.readyState === 1) {
//         this.ws.send(JSON.stringify(res));
//       }
//     }
//   }

//   onmessage() {
//     const that = this;
//     this.ws.onmessage = function(res) {
//       if (res.data === 'keep alive success！') {
//         that.pingPong = 'pong';
//       }
//       if (!/^{/.test(res.data)) {
//         console.log('Received Message: ', res.data);
//         return;
//       }
//       // console.log('ws onmessage ===> res.data: ', res.data);
//       const { data = {} || '', code, packet = {} } = JSON.parse(res.data);
//       //coil
//       if (code === 'C1L203') {
//         //行车终端-》封锁状态
//         store.commit('setCoilCarTerminalData', data);
//       }
//       if (code === 'SVSW01') {
//         // 轨道出入库
//         store.commit('setRollerManger', packet);
//       } 
//     };
//   }

//   async disconnect() {
//     this.ws.onclose = function(e) {
//       console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean);
//       // console.log(e);
//     };
//     this.closeWs();
//     clearInterval(this.pingInterval);
//     clearInterval(this.pongInterval);
//     this.status = 'close';
//     console.log('断开连接');
//   }

//   heartCheck() {
//     this.uid.map(val => {
//       this.ws.send(JSON.stringify({ uid: val }));
//     });
//     this.pingInterval = setInterval(() => {
//       if (this.ws?.readyState === 1) {
//         // 检查ws为链接状态 才可发送
//         this.ws.send(JSON.stringify({ uid: this.dUid })); // 客户端发送ping
//       }
//     }, 100000);
//     this.pongInterval = setInterval(() => {
//       console.log(this.pingPong);
//       if (this.pingPong !== 'pong') {
//         this.pingPong = 'ping';
//         this.closeHandle('pingPong没有改变为pong'); // 没有返回pong 重启webSocket
//       }
//     }, 200000);
//   }

//   closeHandle(e = 'err') {
//     // 因为webSocket并不稳定，规定只能手动关闭(调closeMyself方法)，否则就重连
//     if (this.status !== 'close') {
//       console.log(`断开，重连websocket`, e);
//       if (this.pingInterval !== undefined && this.pongInterval !== undefined) {
//         // 清除定时器
//         clearInterval(this.pingInterval);
//         clearInterval(this.pongInterval);
//       }
//       this.initWebsocket(); // 重连
//     } else {
//       console.log(`websocket手动关闭,或者正在连接`);
//     }
//   }

//   closeWs() {
//     this.uid.map(val => {
//       this.send({ cid: val }, 'disconnect');
//     });
//     this.ws.close();
//   }
// }
// const ws = new WebsocketObj();
// export default ws;
