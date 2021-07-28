<template>
  <div id="app">
    <router-link to="/"></router-link>
    <router-view> </router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
@import url("../common/normalize.css");
@import url("../common/common.css");
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 20px;
  margin-top: 60px;
}
a {
  text-decoration: none;
}
</style>
