<template>
  <div id="app">
    <transition name="slide-left" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { userInfo } from "@/api";
export default {
  name: "App",
  created() {
    this.axios("user");
    userInfo()
      .then((res) => {
        // console.log(res);
      })
      .catch((res) => {
        this.$router.push("/login");
      });
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
