<template>
  <div
    von-load
    class="loading-container"
    :class="{'visible': state == 1, 'visible active': state == 2}"
  >
    <div class="loading" :class="{'landscape':landscape}">
      <div v-if="showSpinner" class="spinner spinner-ios">
        <!-- <div class="loader-inner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>-->

        <!-- <svg viewBox="0 0 64 64">
          <g stroke-width="4" stroke-linecap="round">
            <line y1="17" y2="29" transform="translate(32,32) rotate(180)">
              <animate
                attributeName="stroke-opacity"
                dur="750ms"
                values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1"
                repeatCount="indefinite"
              />
            </line>
            <line y1="17" y2="29" transform="translate(32,32) rotate(210)">
              <animate
                attributeName="stroke-opacity"
                dur="750ms"
                values="0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0"
                repeatCount="indefinite"
              />
            </line>
            <line y1="17" y2="29" transform="translate(32,32) rotate(240)">
              <animate
                attributeName="stroke-opacity"
                dur="750ms"
                values=".1;0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1"
                repeatCount="indefinite"
              />
            </line>
            <line y1="17" y2="29" transform="translate(32,32) rotate(270)">
              <animate
                attributeName="stroke-opacity"
                dur="750ms"
                values=".15;.1;0;1;.85;.7;.65;.55;.45;.35;.25;.15"
                repeatCount="indefinite"
              />
            </line>
            <line y1="17" y2="29" transform="translate(32,32) rotate(300)">
              <animate
                attributeName="stroke-opacity"
                dur="750ms"
                values=".25;.15;.1;0;1;.85;.7;.65;.55;.45;.35;.25"
                repeatCount="indefinite"
              />
            </line>
            <line y1="17" y2="29" transform="translate(32,32) rotate(330)">
              <animate
                attributeName="stroke-opacity"
                dur="750ms"
                values=".35;.25;.15;.1;0;1;.85;.7;.65;.55;.45;.35"
                repeatCount="indefinite"
              />
            </line>
            <line y1="17" y2="29" transform="translate(32,32) rotate(0)">
              <animate
                attributeName="stroke-opacity"
                dur="750ms"
                values=".45;.35;.25;.15;.1;0;1;.85;.7;.65;.55;.45"
                repeatCount="indefinite"
              />
            </line>
            <line y1="17" y2="29" transform="translate(32,32) rotate(30)">
              <animate
                attributeName="stroke-opacity"
                dur="750ms"
                values=".55;.45;.35;.25;.15;.1;0;1;.85;.7;.65;.55"
                repeatCount="indefinite"
              />
            </line>
            <line y1="17" y2="29" transform="translate(32,32) rotate(60)">
              <animate
                attributeName="stroke-opacity"
                dur="750ms"
                values=".65;.55;.45;.35;.25;.15;.1;0;1;.85;.7;.65"
                repeatCount="indefinite"
              />
            </line>
            <line y1="17" y2="29" transform="translate(32,32) rotate(90)">
              <animate
                attributeName="stroke-opacity"
                dur="750ms"
                values=".7;.65;.55;.45;.35;.25;.15;.1;0;1;.85;.7"
                repeatCount="indefinite"
              />
            </line>
            <line y1="17" y2="29" transform="translate(32,32) rotate(120)">
              <animate
                attributeName="stroke-opacity"
                dur="750ms"
                values=".85;.7;.65;.55;.45;.35;.25;.15;.1;0;1;.85"
                repeatCount="indefinite"
              />
            </line>
            <line y1="17" y2="29" transform="translate(32,32) rotate(150)">
              <animate
                attributeName="stroke-opacity"
                dur="750ms"
                values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1"
                repeatCount="indefinite"
              />
            </line>
          </g>
        </svg>-->
      </div>

      <span v-if="tips" class="tips" v-html="tips"></span>
    </div>
  </div>
</template>
<script>
import { removeElement } from "../utils";

function preventDefault(e) {
  e.preventDefault();
}

export default {
  data() {
    return {
      state: 0,
      tips: "",
      showSpinner: true,
      // 是否横屏
      landscape: false
    };
  },

  destroyed() {
    console.log("[Vonic] Loading _vm destroyed");
    removeElement("von-load");
  },

  methods: {
    show(options) {
      this.tips = options.tips;
      this.showSpinner = !!options.showSpinner;

      this.state = 1;
      if (document.getElementById("enter-page")) {
        this.landscape =
          document.getElementById("enter-page").style.transform != "";
      }
      setTimeout(() => {
        this.state = 2;
      });

      document.body.addEventListener("touchmove", preventDefault);
    },

    hide() {
      this.state = 1;
      setTimeout(() => {
        this.state = 0;
        setTimeout(() => {
          this.$destroy();
        });
      }, 300);

      document.body.removeEventListener("touchmove", preventDefault);
    },

    update(options) {
      if (document.getElementById("enter-page")) {
        this.landscape =
          document.getElementById("enter-page").style.transform != "";
      }
      this.tips = options.tips;
      this.showSpinner = !!options.showSpinner;
    },

    getState() {
      return this.state;
    }
  }
};
</script>
<style lang="scss" scoped>
.loading-container:not(.visible) .icon,
.loading-container:not(.visible) .spinner {
  display: none;
}

.loading-container.visible {
  visibility: visible;
}

.loading-container.active {
  opacity: 1;
  background: rgba(0, 0, 0, 0);
}

.loading-container .loading {
  // padding: 20px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  text-align: center;
  text-overflow: ellipsis;
  font-size: 15px;
  &.landscape {
    transform: rotateZ(90deg);
  }
}

.loading-container .loading h1,
.loading-container .loading h2,
.loading-container .loading h3,
.loading-container .loading h4,
.loading-container .loading h5,
.loading-container .loading h6 {
  color: #fff;
}

.loading-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 5000;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -moz-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  -moz-align-items: center;
  align-items: center;
  -webkit-transition: 0.2s opacity linear;
  transition: 0.2s opacity linear;
  visibility: hidden;
  opacity: 0;
  // .loading {
  //   margin-top: -300px;
  //   max-width: 70%;
  //   padding: 15px;
  //   background-color: rgba(0, 0, 0, 0.8);
  // }

  .spinner svg {
    width: 28px;
    height: 28px;
    stroke: #fff;
    fill: #fff;
  }

  .tips {
    font-size: 14px;
    line-height: 14px;
  }
}
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
</style>
