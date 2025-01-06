<template>
  <transition name="slide-left" mode="out-in">
    <router-view />
  </transition>
</template>

<script>
import { userInfo } from '@/api'
export default {
  name: 'App',
  data() {
    return {
    }
  },
  async created() {
    userInfo()
      .then((res) => {
        // console.log(res);
      })
      .catch((res) => {
        this.$router.push('/login')
      })
  },
  mounted() {
  }
}
</script>
<style lang="scss">
.slide-left-enter {
  opacity: 0;
  -webkit-transform: translate(30px, 0);
  transform: translate(30px, 0);
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
