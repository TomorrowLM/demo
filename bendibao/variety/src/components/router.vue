<template>
  <div id="app">
    <router-link to="/restrictions">restrictions</router-link>
  </div>
</template>
<script>
export default {
  methods: {
    goRestrictions() {
      this.$router.push("/restrictions");
    },
  },
};
</script>
