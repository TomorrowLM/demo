<template>
  <div class="app h100">
    <header class="d-l-center d-r-end">
      <span @click="goHome" class="float-right point">回到首页</span>
    </header>
    <RouterView />
  </div>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const jump = () => {
  router.push('/3D')
}
let theme = window.localStorage.getItem('skin') || 'light'
// if (theme === 'light') {
//   theme = 'dark'
//   window.localStorage.setItem('skin', 'dark')
// } else {
//   theme = 'light'
//   window.localStorage.setItem('skin', 'light')
// }
onBeforeMount(() => {
  // console.log(jquery('#vue3-page'))
  console.log($('#vue3-page'))
  // document.documentElement.setAttribute('theme', window.localStorage.getItem('skin') || 'light')
})
const goHome = () => {
  console.log(router)
  router.push({
    name: 'home'
  })
}
console.log(56)
</script>

<style lang="scss">
#__qiankun_microapp_wrapper_for_vue_3__,
#vue3-page {
  height: 100%;
}
header {
  color: $text;
  background: $header-bg;
  height: 48px;
  padding: 16px;
  box-sizing: border-box;
  border-bottom: 1px solid $text;
  box-shadow: 1px 1px 5px $shadow;
}
// .point {
//   border-bottom: 1px solid $text;
// }
</style>
