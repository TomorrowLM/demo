<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import {axios} from "@/utils/request";
export default {
  name: "App",
  created() {
    axios.get("token").then((res) => {
      console.log(res);
    });
  },
};
</script>
<style lang="less">
#app{

}
</style>
