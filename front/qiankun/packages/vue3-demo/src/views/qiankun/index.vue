<template>
  <div class="qiankun-vue3-page">
    <h1>我是qiankun-vue3子页面</h1>
    <h2>demo1:样式隔离</h2>
    <p class="vue3-app-color">这里我应用了当前应用的class</p>
    <p class="base-app-color">这里我应用了主应用的class</p>
    <ElButton type="primary">修改el前缀</ElButton>
    <h2>demo2:通信</h2>
    <div>localStorage：{{ appCommuicate }}</div>
    <div>props: {{ proxy.$appCommuicate.mes }}</div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance } from 'vue'
const { proxy }: any = getCurrentInstance()

const appCommuicate = localStorage.getItem('appCommuicate')
console.log('app1中打印app-commuicate：', appCommuicate, proxy.$appCommuicate)
</script>

<style lang="scss" scoped>
.vue3-app-color {
  color: blue;
}
</style>
