<template>
  <div class="">
    <van-tabs
      v-model="active"
      class="pb-8"
    >
      <van-tab
        v-for="(item, index) in currentRoute"
        :key="index"
        :title="item.name"
      />
    </van-tabs>
    <router-view />
  </div>
</template>

<script>
import { menuRoutes } from '@/router'

export default {
  name: 'MENU',
  props: {

  },
  data () {
    return {
      active: 0,
      currentRoute: []
    }
  },
  watch: {
    $route () {
      console.log(this.$route, menuRoutes, 2222) // 监听路由变化
      menuRoutes.forEach(item => {
        if (this.$route.name.includes(item.name)) {
          this.currentRoute = item.children
        }
      })
    }
  },
  mounted () {
    console.log(this.$route, menuRoutes, 2222)
    menuRoutes.forEach(item => {
      if (this.$route.name.includes(item.name)) {
        this.currentRoute = item.children
      }
    })
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped></style>
