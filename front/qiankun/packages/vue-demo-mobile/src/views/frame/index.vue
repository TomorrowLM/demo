<template>
  <div
    class="container"
    :style="{ height: '100vh' }"
  >
    <el-container>
      <el-header>
        <header-com />
      </el-header>
      <el-main :style="{ height: 'calc(100vh - 0.82rem)' }">
        <transition name="slide-left">
          <router-view />
        </transition>
      </el-main>
      <el-footer :style="{ height: '0.5rem' }">
        <van-tabbar>
          <van-tabbar-item icon="home-o">
            <router-link to="/home">
              首页
            </router-link>
          </van-tabbar-item>
          <!-- <van-tabbar-item icon="search">个人中心</van-tabbar-item>
            <van-tabbar-item icon="friends-o">标签</van-tabbar-item> -->
          <van-tabbar-item icon="setting-o">
            <router-link to="/user">
              个人中心
            </router-link>
          </van-tabbar-item>
        </van-tabbar>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import headerCom from './header.vue'
export default {
  name: 'Home',
  components: { headerCom },
  data () {
    return {};
  }
};
</script>
<style lang="scss">
.el-header {
  height: 0.32rem !important;
}
</style>
