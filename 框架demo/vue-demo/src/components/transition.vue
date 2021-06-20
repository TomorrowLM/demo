<template>
  <div>
    <!--  动画过渡-->
    <div id="demo">
      <button v-on:click="show = !show">Toggle</button>
      <transition name="fade">
        <p v-if="show">hello</p>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      show: true,
    };
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
