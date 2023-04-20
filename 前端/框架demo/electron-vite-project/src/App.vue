<script setup lang="ts">
import SiderBar from "@/components/Layout/SiderBar.vue";
import Header from "@/components/Layout/Header.vue";
</script>

<template>
  <div class="app">
    <Header></Header>
    <el-container>
      <el-aside width="200px">
        <sider-bar></sider-bar>
      </el-aside>
      <el-container>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.app {
  height: 100vh;
}

.el-container {
  height: 100%;
}
</style>
