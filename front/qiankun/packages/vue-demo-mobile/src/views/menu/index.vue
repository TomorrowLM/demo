<template>
  <div class="">
    <van-tabs v-model="active" class="pb-8">
      <van-tab v-for="(item, index) in currentRoute" :title="item.name" :key="index" />
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
  data() {
    return {
      active: 0,
      currentRoute: [],
    }
  },
  mounted() {
    console.log(this.$route, menuRoutes, 2222)
    menuRoutes.forEach(item => {
      console.log(item, 333)
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
