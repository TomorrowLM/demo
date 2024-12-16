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
import './style.scss';

let instance: any = null
function render(props: any = {}) {
  const { container } = props
  instance = createApp(App)
  instance.use(createPinia())
  instance.use(router)
  instance.use(router)
  instance.mount(container ? container.querySelector('#vue3-page') : '#vue3-page');
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
      instance.unmount(document.querySelector('#vue3-page'))
      instance._container.innerHTML = ''
      history.destroy() // 不卸载  router 会导致其他应用路由失败
      instance = null
    },
    update: function (props: QiankunProps): void | Promise<void> {
      throw new Error('Function not implemented.')
    }
  })
}
