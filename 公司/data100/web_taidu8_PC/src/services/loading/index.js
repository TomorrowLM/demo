import Vue from 'vue'
import Loading from './Loading'

import {
    createElement
} from '../utils'

function VonicLoading() {
    var vm = undefined
    function showToast(tips, duration) {
        createElement('von-loading')
        vm = new Vue(Loading).$mount('[von-loading]')
        vm.show(tips)
        setTimeout(() => {
            vm.hide()
        }, duration || 2000)
    }

    function hide() {
        if (vm) vm.hide()
    }

    return {
        showToast,
        hide
    }
}

var loading = new VonicLoading()
window.$toast = {
    show: loading.showToast,
    hide: loading.hide
}

