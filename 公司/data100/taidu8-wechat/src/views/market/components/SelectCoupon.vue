<template>
  <div class='select_coupon_popup'>
    <van-popup
      v-model="visible"
      round
      position="bottom"
      style="height: 90%; overflow: hidden;"
      :close-on-click-overlay="false"
    >
      <div class="coupon_list">
        <h3 class="coupon_title van-hairline--bottom">选择卡券</h3>
        <div class="list">
          <dl v-for="(item, index) in coupons" :key="index" :class="{ 'dis': item.status === -1, 'use': item.status === 0 }">
            <dt>
              <h2>{{ item.discount }}</h2>
              <van-button v-show="chosenCoupon !== item.id" class="coupon_button" plain hairline type="primary" size="small" @click="selectCoupon(item)">选择</van-button>
              <van-button v-show="chosenCoupon === item.id" class="select_coupon_button" plain hairline type="primary" size="small" @click="selectCoupon(item)"><i class="select">选中</i></van-button>
            </dt>
            <dd>
              <h3>{{ item.name }}</h3>
              <p v-text="item.descStr"></p>
            </dd>
          </dl>
        </div>
        <div class="confirm_box">
          <van-button class="exchange_button" block round type="primary" @click="confirm">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'SelectCoupon',
  props: {
    coupons: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    },
    chosenCoupon: {
      type: Number,
      default: -1
    }
  },
  methods: {
    selectCoupon (item) {
      this.$emit('on-select-coupon', item)
    },
    confirm () {
      const data = this.coupons.find(item => item.id === this.chosenCoupon)
      this.$emit('on-confirm', data)
    }
  },
}
</script>

<style lang='less' scoped>
//@import url()
.select_coupon_popup{
  .coupon_list{
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .coupon_title{
      font-size: 32px;
      color: @title-gray1;
      padding: 35px 0;
      text-align: center;
    }
    .confirm_box{
      width: 100%;
      height: 180px;
      position: absolute;
      padding: 0 30px;
      bottom: 0px;
      background: @white;
      display: flex;
      align-items: center;
    }
    .list{
      padding: 0 30px 180px 30px;
      flex: 1 0;
      overflow: auto;
    }
    dl{
      width: 100%;
      height: 207px;
      background: url('../../../assets/images/market/my_coupon_bg1.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      margin-top: 30px;
      dt{
        width: 220px;
        text-align: center;
        h2{
          color: @orange;
          font-family: PingFangSC-Medium;
          font-size: 46px;
          margin-bottom: 20px;
          font-weight: bold;
        }
        p{
          color: @orange-dark;
          font-size: 24px;
        }
        .coupon_button, .select_coupon_button{
          width: 140px;
          height: 56px;
          background-color: transparent;
          position: relative;
          color: @orange;
          &::after, &::before{
            border-radius: 60px;
            border-color: @orange;
          }
          .select{
            width: 36px;
            height: 24px;
            font-size: 0;
            background: url('../../../assets/images/market/my_coupon_btn_icsel@2x.png') no-repeat;
            background-size: cover;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: 10;
            margin: auto;
          }
        }
        .select_coupon_button{
          &::after{
            background: @orange;
          }
        }
      }
      dd{
        flex: 1 0;
        padding-left: 40px;
        h3{
          color: @orange;
          font-size: 28px;
          margin-bottom: 10px;
        }
        p{
          color: @orange-dark;
          font-size: 20px;
          transform: scale(0.83);
          position: relative;
          right: 35px;
          line-height: 28px;
          white-space: pre-wrap;
        }
      }
    }
    .dis{
      background: url('../../../assets/images/market/my_coupon_bg_dis@2x.png') no-repeat;
      background-size: 100% 100%;
      dt{
        h2{
          color: @title-gray2;
        }
        p{
          color: #ccc;
        }
      }
      dd{
        h3, p{
          color: #ccc;
        }
      }
    }
    .use{
      background: url('../../../assets/images/market/my_coupon_bg2@2x.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>