<template>
  <div id="app">
    <sport></sport>
  </div>
</template>

<script>
import "./common/normalize.css";
import Sport from "./components/sport.vue";

export default {
  name: "App",
  components: {
    Sport,
  },
};
</script>
