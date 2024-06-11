<template>
  <div class="header">
    <p>LM-WEB-PC</p>
    <div class="d-flex align-items-center">
      <a-input placeholder="搜索"></a-input>
      <div class="d-flex">
        <a-icon class="mr-md" type="question-circle" />
        <a-icon class="mr-md" type="bell" />
        <a-icon class="mr-md" type="setting" />
      </div>
      <div>
        <a-avatar icon="user" />
      </div>
      <span>{{ userInfo.name ? userInfo.name : 'liming' }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator';

@Component
export default class Sidebar extends Vue {
  @PropSync('collapse') isCollapse!: boolean;
  // 定义计算属性的 getter
  get userInfo() {
    return this.$store.getters.userInfo;
  }
}
</script>

<style scoped>
.header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>
