importScripts("/qiankun/child/vue2-mobile/precache-manifest.cd821e9187c05d58434de99d1aca5580.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

/* eslint-disable no-console */
//注册Service Worker
//SW可以用于消息推送，缓存管理、后台同步、拦截和处理网络请求等
import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  console.log(5555);
  // register(`${process.env.BASE_URL}service-worker.js`, {
  //   ready() {
  //     console.log(
  //       'App is being served from cache by a service worker.\n' +
  //       'For more details, visit https://goo.gl/AFskqB'
  //     )
  //   },
  //   registered() {
  //     console.log('Service worker has been registered.')
  //   },
  //   cached() {
  //     console.log('Content has been cached for offline use.')
  //   },
  //   updatefound() {
  //     console.log('New content is downloading.')
  //   },
  //   updated() {
  //     console.log('New content is available; please refresh.')
  //   },
  //   offline() {
  //     console.log('No internet connection found. App is running in offline mode.')
  //   },
  //   error(error) {
  //     console.error('Error during service worker registration:', error)
  //   }
  // })
}

