<template>
  <div id="app">
    <router-link to="/"></router-link>
    <register msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import register from "./components/register.vue";
import "./common/rem";
export default {
  name: "App",
  components: {
    register,
  },
};
</script>

<style>
@import "./common/normalize.css";
</style>
