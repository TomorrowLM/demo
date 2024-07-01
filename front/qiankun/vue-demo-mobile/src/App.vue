<template>
  <transition v-if="aa" name="slide-left" mode="out-in">
    <router-view></router-view>
  </transition>
</template>

<script>
import { userInfo } from "@/api";
export default {
  name: "App",
  data() {
    return {
      aa: false,
    };
  },
  created() {
    // this.axios("user");
    userInfo()
      .then((res) => {
        // console.log(res);
      })
      .catch((res) => {
        this.$router.push("/login");
      });
  },
  mounted() {
    this.aa = true;
  },
};
</script>
<style lang="less">
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
