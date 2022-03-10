<template>
  <div id="app">
    <template>
      <div v-bind:style="{ height: '100vh' }">
        <el-container>
          <el-main v-bind:style="{ height: '90vh' }"
            ><transition name="slide-left">
              <router-view></router-view>
            </transition>
          </el-main>
          <el-footer v-bind:style="{ height: '10vh' }"
            ><van-tabbar v-model="active">
              <van-tabbar-item icon="home-o"><router-link to="/learn">学习笔记</router-link></van-tabbar-item>
              <!-- <van-tabbar-item icon="search">个人中心</van-tabbar-item>
            <van-tabbar-item icon="friends-o">标签</van-tabbar-item> -->
              <van-tabbar-item icon="setting-o"><router-link to="/user">个人中心</router-link></van-tabbar-item>
            </van-tabbar></el-footer
          >
        </el-container>
      </div>
    </template>
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    },
  };
</script>
<style lang="less">
  .slide-left-enter {
    opacity: 0;
    -webkit-transform: translate(1130px, 0);
    transform: translate(1130px, 0);
  }
  .slide-left-enter-active {
    transition: all 0.5s ease;
  }
  .slide-left-leave-to {
    opacity: 0;
    -webkit-transform: translate(-30px, 0);
    transform: translate(-30px, 0);
  }
  .slide-left-leave-active {
    transition: all 0.5s ease;
  }
</style>
