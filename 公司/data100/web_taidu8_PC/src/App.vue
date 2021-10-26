<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import common from "./api/common";
export default {
  name: "App",
  created() {
    if (localStorage.getItem("userInfo")) {
      common.activeClick(
        "5",
        JSON.parse(localStorage.getItem("userInfo")).token
      );
    }
  },
  methods: {}
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
