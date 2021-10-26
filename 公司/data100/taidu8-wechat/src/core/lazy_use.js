import Vue from 'vue'
import VueStorage from 'vue-ls'
// 复制到粘贴板
import VueClipboard from 'vue-clipboard2'

import config from '@/config/defaultSettings'

// base library
import '@/core/lazy_lib/components_use'

// ext library
import './directives/action'

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.use(VueStorage, config.storageOptions)

process.env.NODE_ENV !== 'production' && console.warn('[antd-pro] NOTICE: Antd use lazy-load.')
