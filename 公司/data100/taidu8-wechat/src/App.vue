<template>
  <div id="app">
    <!-- <transition name="van-fade"> -->
    <router-view />
    <!-- </transition> -->
  </div>
</template>

<style lang="scss">
@import url("./assets/styles/global.scss");
@import url("./assets/styles/common.scss");
@import url("./assets/styles/mobileSelect.scss");
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
