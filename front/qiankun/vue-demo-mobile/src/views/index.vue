<template>
  <div v-bind:style="{ height: '100vh' }">
    <el-container>
      <el-header>
        <menu></menu>
      </el-header>
      <el-main v-bind:style="{ height: '90vh' }">
        <transition name="slide-left">
          <router-view></router-view>
        </transition>
      </el-main>
      <el-footer v-bind:style="{ height: '10vh' }">
        <van-tabbar>
          <van-tabbar-item icon="home-o"><router-link to="/learn">学习笔记</router-link></van-tabbar-item>
          <!-- <van-tabbar-item icon="search">个人中心</van-tabbar-item>
            <van-tabbar-item icon="friends-o">标签</van-tabbar-item> -->
          <van-tabbar-item icon="setting-o"><router-link to="/user">个人中心</router-link></van-tabbar-item>
        </van-tabbar>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import menu from '@/components/menu.vue'
export default {
  data() {
    return {};
  },
  components:[menu]
};
</script>
<style lang="less"></style>
