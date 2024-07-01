<template>
  <div class="content d-center">
    <div class="box d-center m-12" @click="jump(1)">3D</div>
    <div class="box d-center m-12" @click="jump(2)">editor</div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const jump = (e) => {
  if (e === 1) {
    router.push('/3D')
  } else if (e === 2) {
    router.push('/editor')
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: calc(100% - 48px);
  .box {
    width: 20%;
    height: 20%;
    background-color: $box-bg;
    color: $text;
    font-size: 24px;
  }
  @media (max-width: 1024px) {
    .box {
      width: 100px;
      height: 100px;
      background-color: $box-bg;
      color: #fff;
    }
  }
}
</style>
