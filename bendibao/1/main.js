import Vue from 'vue'
import App from './App'

import '@/common/swiper-bundle.min.css'
import '@/common/swiper-bundle.min.js'
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
