<template>
  <div class="header-container d-flex justify-content-between ">
    <i class="el-icon-s-unfold" @click="show = true" />
    <div>{{ currentRoute.name }}</div>
    <!-- <div>{{ currentRoute.name.replace(/-\w+/,'') }}</div> -->
    <div />
    <el-drawer title="菜单" :visible.sync="show" direction="ltr" size="1.4rem" custom-class="menu">
      <van-sidebar v-model="activeKey">
        <van-sidebar-item v-for="item in menuRoutes" :key="item.name" :title="item.name" :to="{ name: item.children ? item.children[0].name : item.name }" @click="show = false" />
      </van-sidebar>
    </el-drawer>
  </div>
</template>

<script>
import { menuRoutes } from '@/router'
export default {
  name: 'HeaderCom',
  props: {},
  data() {
    return {
      activeKey: 0,
      show: false,
      menuRoutes: [],
      currentRoute: []
    }
  },
  watch: {
    $route() {
      console.log(this.$route, menuRoutes, 2222) // 监听路由变化
      this.$route.matched.forEach(item => {
        if (this.$route.name.includes(item.name)) {
          if (item.children) {
            this.currentRoute = item.children
          } else {
            this.currentRoute = item
          }
        }
      })
    }
  },
  mounted() {
    this.menuRoutes = menuRoutes
    this.$route.matched.forEach((item) => {
      if (item.name === this.$route.name) {
        if (item.children) {
          this.currentRoute = item.children
        } else {
          this.currentRoute = item
        }
      }
    })
  },
  beforeCreate() {
    console.log('beforeCreate', 123)
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.header-container {
  height: 100%;
  display: flex;
  align-items: center;
}

::v-deep(.menu) {

  //height: 3rem;
  .el-drawer__header {
    padding: 0.08rem 0.12rem;
    margin-bottom: 0.08rem;
    font-size: 0.16rem;
    @extend .flex, .flex-center;
  }

  .el-drawer__body {
    padding: 0;

    .van-sidebar {
      width: 100%;
    }
  }
}
</style>
