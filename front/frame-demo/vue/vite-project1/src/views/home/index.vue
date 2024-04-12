<template>
  <header
    class="h100 flex-center"
    style="display: flex; align-items: center; justify-content: space-around"
  >
    <div class="box flex-center" @click="jump(1)">3D</div>
    <div class="box flex-center" @click="jump(2)">editor</div>
  </header>
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

<style scoped>
.box {
  width: 20%;
  height: 20%;
  background-color: #3f8e50;
  color: #fff;
}
@media (max-width: 1024px) {
  .box {
    width: 100px;
    height: 100px;
    background-color: #3f8e50;
    color: #fff;
  }
}
</style>
