<template>
  <div class="qiankun-vue3-page">
    <h1>我是qiankun-vue3子页面</h1>
    <p class="vue3-app-color">这里我应用了当前应用的class</p>
    <p class="base-app-color">这里我应用了主应用的class</p>
    <ElButton type="primary">按钮</ElButton>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.vue3-app-color {
  color: blue;
}
</style>
