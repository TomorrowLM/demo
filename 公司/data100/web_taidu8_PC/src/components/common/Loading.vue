<template>
  <div class="surverListLoder">
    <div class="loader-inner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "loading"
};
</script>
<style lang="scss" scoped>
@keyframes loader-inner {
  50% {
    opacity: 0.3;
    -webkit-transform: scale(0.4);
    transform: scale(0.4);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.surverListLoder {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  margin: auto;
  .loader-inner {
    position: relative;
    top: 40px;
    left: 40px;
    div {
      background-color: rgba(117, 117, 249, 0.69);
      width: 15px;
      height: 15px;
      border-radius: 50%;
      margin: 2px;
      box-sizing: border-box;
      display: inline-block;
      position: absolute;
      &:nth-child(1) {
        top: 25px;
        left: 0;
        animation: loader-inner 1s -0.96s infinite linear;
      }
      &:nth-child(2) {
        top: 17px;
        left: 17px;
        animation: loader-inner 1s -0.84s infinite linear;
      }
      &:nth-child(3) {
        top: 0;
        left: 25px;
        animation: loader-inner 1s -0.72s infinite linear;
      }
      &:nth-child(4) {
        top: -17px;
        left: 17px;
        animation: loader-inner 1s -0.6s infinite linear;
      }
      &:nth-child(5) {
        top: -25px;
        left: 0;
        animation: loader-inner 1s -0.48s infinite linear;
      }
      &:nth-child(6) {
        top: -17px;
        left: -17px;
        animation: loader-inner 1s -0.36s infinite linear;
      }
      &:nth-child(7) {
        top: 0;
        left: -25px;
        animation: loader-inner 1s -0.24s infinite linear;
      }
      &:nth-child(8) {
        top: 17px;
        left: -17px;
        animation: loader-inner 1s -0.12s infinite linear;
      }
    }
  }
}
</style>