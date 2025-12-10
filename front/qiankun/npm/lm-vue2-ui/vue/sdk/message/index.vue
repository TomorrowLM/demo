<template>
  <div v-if="show" :class="{ 'pop-up': true, 'show': show, 'mes-sdk': true }">
    <div class="popup-mask" v-if="hasMark"></div>
    <transition name="fade">
      <div class="modal-dialog  bottom">
        <div class="modal-content">
          <div v-if="title" class="modal-title">
            {{ title }}
          </div>
          <p class="modal-title hasTitle">
            <span class="msg" v-html="msg"></span>
          </p>
          <!-- <div class="btn-wrapper" v-if="type == 'alert'" @click.stop="alertClick">
            <span class="btn btn-block yes-btn">{{ alertBtnText }}</span>
          </div> -->

          <div class="modal-footer" v-if="type == 'confirm'">
            <div class="split-line-top"></div>
            <span @touchstart.prevent="noClick" class="btn-cancel">{{ footer.noBtnText }}</span>
            <div class="split-line-center"></div>
            <span @touchstart.prevent="yesClick" class="btn-confirm">{{ footer.yesBtnText }}
            </span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '提示'
    },
    msg: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'alert'
    },
    alertBtnText: {
      type: String,
      default: '我知道了'
    },
    footer: {
      yesBtnText: {
        type: String,
        default: '确定'
      },
      noBtnText: {
        type: String,
        default: '取消'
      },
    },
    hasMark: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      promiseStatus: null,
      show: false
    }
  },
  watch: {
    show: function (val) {
      setTimeout(() => {
        this.show = false
      }, 2000)
    }
  },
  methods: {
    confirm() {
      let _this = this;
      this.show = true;
      return new Promise(function (resolve, reject) {
        _this.promiseStatus = { resolve, reject };
      });
    },
    noClick() {
      this.show = false;
      this.promiseStatus && this.promiseStatus.reject();

    },
    yesClick() {
      this.show = false;
      this.promiseStatus && this.promiseStatus.resolve();
    },
    alertClick() {
      this.show = false;
      this.promiseStatus && this.promiseStatus.resolve();
    }
  }
}
</script>


<style lang='scss'>
.mes-sdk {

  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  z-index: 999;
  transform: translateZ(9999px);
  letter-spacing: 0;
  background: rgba(0, 0, 0, 0.3);

  .modal-dialog {
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .modal-content {
      position: absolute;
      top: 40%;
      left: 50%;
      z-index: 1000;
      width: 300px;
      transform: translate(-50%, -50%);
      box-sizing: border-box;
      background: #fff;
      border-radius: 4px;
      font-size: 16px;
      color: #5e5f64;
      padding: 16px 24px 24px 24px;

      .modal-title {
        // padding: 24px 28px 0 28px;
        font-size: 18px;
        line-height: 25px;
        color: #030303;
      }
    }
  }

  .modal-right {
    padding-right: 10px;
    width: 36px;
    background: #f2f2f2;
    color: rgba(0, 16, 38, 0.3);
    font-size: 12px;
    border-radius: 0 4px 4px 0;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
  }

  .split-line-top {
    height: 1px;
    transform: scale(1, 0.5);
    background: #e8eaef;
    margin-top: 16px;
  }

  .modal-footer {
    width: 100%;
    display: flex;
    align-items: center;
    height: 32px;
    font-size: 16px;
    line-height: 52px;
    text-align: center;

    .btn-cancel {
      flex: 1;
      color: #696d76;
      height: 100%;
    }

    .split-line-center {
      width: 1px;
      height: 100%;
      transform: scale(0.5, 1);
      background: #e8eaef;
    }

    .btn-confirm {
      position: relative;
      flex: 1;
      color: #409eff;
      height: 100%;
    }
  }





}
</style>
