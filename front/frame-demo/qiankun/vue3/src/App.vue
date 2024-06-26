<template>
  <RouterView />
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const jump = () => {
  router.push('/3D')
}
</script>

<style scoped></style>
