<template>
  <div id="app">
    <router-link to="/"></router-link>
    <router-view></router-view>
  </div>
</template>

<script>
import "./common/rem";
export default {
  name: "App",
  components: {},
};
</script>

<style>
@import "./common/normalize.css";
</style>
