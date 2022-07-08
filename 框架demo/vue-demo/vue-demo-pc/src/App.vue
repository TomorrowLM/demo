<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
@Component
export default class App extends Vue {
  created() {
    console.log("app");
    this.$store.dispatch("GetUserCoreInfo").catch((res) => {
      console.log(res, "res");
    });
    console.log(this.$store.getters.userInfo, "userInfo");
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
