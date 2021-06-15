import Vue from 'vue'
import App from './App'
import animated from '@/common/animate/animate.min.css'
// 省略部分代码
// Vue.use(animated)
// Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
