import './public-path'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { history } from './router'
import {
  renderWithQiankun,
  qiankunWindow,
  type QiankunProps
} from 'vite-plugin-qiankun/dist/helper'
import ElementPlus from 'element-plus';
// import 'element-plus/theme-chalk/index.css';
import './utils/element-default-config';
import './style.scss';
// import { AppInit } from '@lm/shared'
// AppInit()
console.log(GLOBAL_INFO,123)

let instance: any = null
function render(props: any = {}) {
  const { container, appCommuicate } = props
  console.log('bootstrap render', props);
  instance = createApp(App)
  instance.use(createPinia())
  instance.use(ElementPlus)
  instance.use(router)
  // 将 appCommuicate 注入到全局属性中
  if (appCommuicate) {
    instance.config.globalProperties.$appCommuicate = appCommuicate;
    console.log('appCommuicate', instance.config.globalProperties.$appCommuicate);
  }
  // qiankun 环境下直接挂载到传入的 container；独立运行时挂载到 index.html 的 #vue3-page
  instance.mount(container || '#vue3-page');
  document.documentElement.setAttribute('theme', window.localStorage.getItem('skin') || 'light')

}

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
} else {
  renderWithQiankun({
    mount(props) {
      console.log('viteapp mount')
      render(props)
    },
    bootstrap() {
      console.log('bootstrap')
    },
    unmount(props) {
      console.log('vite被卸载了')
      // instance.unmount(document.querySelector('#vue3-page'))
      instance._container.innerHTML = ''
      history.destroy() // 不卸载  router 会导致其他应用路由失败
      instance = null
    },
    update: function (props: QiankunProps): void | Promise<void> {
      throw new Error('Function not implemented.')
    }
  })
}
