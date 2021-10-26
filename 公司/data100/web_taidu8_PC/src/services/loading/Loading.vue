<template>
  <div von-loading class="loadTips">
    <p class="tips" v-html="tips"></p>
  </div>
</template>
<script>
import { removeElement } from "../utils";

export default {
  name: "scroll",
  data() {
    return {
      tips: ""
    };
  },
  methods: {
    show(tips) {
      this.tips = tips;
      console.log("tips", tips);
    },

    hide() {
      setTimeout(() => {
        this.$destroy();
      });
    }
  },

  destroyed() {
    removeElement("von-loading");
  }
};
</script>
<style lang="scss" scoped>
@keyframes loader-tips {
  from {
    top: -60px;
  }
  to {
    top: 0;
  }
}
.loadTips {
  z-index: 50;
  position: fixed;
  top: 0;
  left: 35%;
  width: 30%;
  padding-top: 30px;
  min-height: 60px;
  background: #fff;
  color: #7575f9;
  text-align: center;
  font-size: 16px;
  animation: loader-tips 0.3s;
  box-shadow: 1px 1px 1px #aaa;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>