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
    console.log("app启动");
    this.$store.dispatch("GetUserCoreInfo").catch((res) => {
      this.$router.push("login");
    });
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
