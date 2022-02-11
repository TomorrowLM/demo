<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { axios } from "@/utils/request";
export default {
  name: "App",
  created() {
    axios
      .get("users")
      .then((res) => {
        console.log(res);
      })
      .catch((res) => {
        this.$router.push("/login");
      });
  },
};
</script>
<style lang="less">
#app {
}
</style>
