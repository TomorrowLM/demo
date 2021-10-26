<template>
  <div class='withdrawal_box'>
    <div class="withdrawal_info">
      <div class="withdrawal_gold_coin" v-show="cashExchangeMsg.gold">
        <h3>{{ cashExchangeMsg.gold }}</h3>
        <p>{{ basicData.withdrawalGoldCoinText }}</p>
      </div>
      <div class="withdrawal_exchange_bg"></div>
      <div class="withdrawal_cash" v-show="cashExchangeMsg.money">
        <h3>{{ cashExchangeMsg.money }}</h3>
        <p>{{ basicData.withdrawalCashText }}</p>
      </div>
    </div>
    <div class="withdrawal_operation">
      <h4 class="title">{{ basicData.withdrawalOperationTitle }}</h4>
      <div class="select_withdrawal_mode">
        <div class="wechat van-hairline--surround">{{ basicData.withdrawalOperationWechat }}</div>
      </div>
      <div class="withdrawal_btns">
        <van-button block round type="primary" @click="getMoneyByWechat">{{ basicData.withdrawalBtnText }}</van-button>
        <p>{{ basicData.withdrawalTips }}</p>
      </div>
    </div>
    <van-dialog
      class="password-van-dialog"
      v-model="showDialog"
      title="请输入提现密码"
      :show-cancel-button='false'
      :show-confirm-button='false'
    >
      <div class="close_ic" @click="showDialog = false;password = ''"><img src="../../assets/images/close_ic.png" alt=""></div>
      <div class="password_content">
        <h4><span>提现至</span>微信零钱</h4>
        <h5><span>¥</span>{{ cashExchangeMsg.money }}</h5>
      </div>
       <BlockInput ref="passwordInput" class="password_input" :maxlength="6" :value="password" @input="onInput" />
      <div class="forgetPassword"><a @click="forgetPassword">忘记密码？</a></div>
    </van-dialog>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import basicData from './const'
import md5 from 'js-md5'

export default {
  name: 'Withdrawal',
  data () {
    return {
      basicData: basicData,
      code: '',
      password: '',
      showDialog: false,
    }
  },
  computed: {
    cashExchangeMsg () {
      return this.$store.getters.cashExchangeMsg
    }
  },
  created () {
    const { dispatch } = this.$store
    const { id } = this.$route.params
    dispatch('GetCashExchangeMsg', { commodityId: id })
  },
  methods: {
    getMoneyByWechat () {
      const { dispatch } = this.$store
      const { id } = this.$route.params
      const { ACTION_TYPE: { IS_SET_PASSWORD }, WITHDRAWAL_TYPE: { WECHART } } = basicData
      const params = {
        actionType: IS_SET_PASSWORD,
        withdrawType: WECHART,
        commodityId: id
      }
      dispatch('GetRuleCheck', params).then(async () => {
        this.isShowDialog(true)
      }).catch((data) => {
        this.isShowDialog(false)
        const { msg, data: { type } } = data
        if ([22].includes(type)) {
          const cancelButton = {}
          const confirmButton = {
            22: '去设置',
          }
          Dialog.confirm({
            title: '提示',
            message: msg,
            cancelButtonText: cancelButton[type] || '取消',
            confirmButtonText: confirmButton[type],
          }).then(() => {
            if (type === 22) {
              this.isShowDialog(false)
              this.$router.push('/setPassword')
            }
          })
        }
      })
    },
    onInput(val) {
      this.password = val;
      if (this.password.length === 6) {
        const { id } = this.$route.params
        const { dispatch } = this.$store
        const { ACTION_TYPE: { PASSWORD }, WITHDRAWAL_TYPE: { WECHART } } = basicData
        const params = {
          commodityId: id,
          accountPassword: md5(this.password)
        }
        const ruleParams = {
          actionType: PASSWORD,
          withdrawType: WECHART,
          commodityId: id,
          accountPassword: md5(this.password)
        }

        dispatch('GetRuleCheck', ruleParams).then(async () => {
          await dispatch('GetMoneyByWechat', params)
          this.$router.push({
            path: '/withdrawalSuccess',
            query: {
              description: basicData.withdrawalSuccessDescription,
              message: basicData.withdrawalSuccessTips,
            }
          })
        }).catch((data) => {
          this.isShowDialog(false)
          const { msg, data: { type } } = data
          if ([22, 23, 24].includes(type)) {
            const cancelButton = {
              23: '忘记密码',
              24: '忘记密码'
            }
            const confirmButton = {
              22: '去设置',
              23: '重试',
              24: '返回'
            }
            Dialog.confirm({
              title: '提示',
              message: msg,
              cancelButtonText: cancelButton[type] || '取消',
              confirmButtonText: confirmButton[type],
            }).then(() => {
              if (type === 22) {
                this.isShowDialog(false)
                this.$router.push('/setPassword')
              } else if (type === 23) {
                this.isShowDialog(true)
              } else if (type === 24) {
                this.isShowDialog(false)
              }
            }).catch(() => {
              if (type === 23 || type === 24) {
                this.isShowDialog(false)
                this.$router.push('/setPassword')
              }
            });
          }
        })
      }
    },
    forgetPassword() {
      this.$router.push('/setPassword')
    },
    isShowDialog(bol) {
      this.showDialog = bol;
      setTimeout(() => {
        if (bol === false) {
          this.password = ''
          this.$refs.passwordInput.onBlur()
        } else {
          this.$refs.passwordInput.onFocus()
        }
      })
    }
  },
  destroyed() {
    this.showDialog = false;
  }
}
</script>

<style lang='less' scoped>
//@import url()
.withdrawal_box{
  height: 100%;
  background: @white;
  overflow-y: auto;
  /deep/ .password-van-dialog {
    top: 35%;
    padding-bottom: 20px;
    .close_ic{
      width: 24px;
      height: 24px;
      position: absolute;
      right: 10px;
      top: 10px;
      img{
        width: 12px;
        height: 12px;
        margin-left: 6px;
        margin-top: 6px;
      }
    }
    .password_content{
      text-align: center;
      margin-bottom: 15px;
      h4{
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: @title-gray1;
        line-height: 18px;
        padding: 14px 0;
        span{
          color: @title-gray2;
        }
      }
      h5{
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC;
        color: @title-gray1;
        line-height: 33px;
        span{
          font-size: 14px;
          color: @title-gray2;
          padding-right: 5px;
        }
      }
    }
    .forgetPassword{
      text-align: right;
      padding: 10px 10px 0 10px;
      a{
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #B7B4E8;
        line-height: 17px;
      }
    }
    .van-password-input__security{
      height: 48px;
    }
  }
  /deep/ .van-number-keyboard {
    z-index: 9999;
  }
  .withdrawal_info{
    height: 310px;
    background: url('../../assets/images/market/withdrawal_bg@2x.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 30px 0 30px;
    .withdrawal_exchange_bg{
      width: 185px;
      height: 78px;
      background: url('../../assets/images/market/withdrawal_exchange_ic@2x.png') no-repeat;
      background-size: 100% 100%;
    }
    .withdrawal_gold_coin, .withdrawal_cash{
      flex: 1 0;
      text-align: center;
      h3{
        font-size: 48px;
        font-family: PingFang SC;
        color:@title-blue1;
        line-height: 42px;
      }
      p{
        font-size: 26px;
        font-family: PingFang SC;
        color:@title-blue1;
        line-height: 42px;
        padding-left: 60px;
        margin-top: 10px;
        position: relative;
        &::before{
          content: '';
          width: 32px;
          height: 32px;
          position: absolute;
          top: 0;
          left: 32px;
          bottom: 0;
          margin: auto 0;
        }
      }
    }
    .withdrawal_gold_coin{
      padding-left: 40px;
      p{
        &::before{
          background: url('../../assets/images/market/withdrawal_gold_coin_ic@2x.png') no-repeat;
          background-size: cover;
        }
      }
    }
    .withdrawal_cash{
      padding-right: 40px;
      p{
        &::before{
          background: url('../../assets/images/market/withdrawal_cash_ic@2x.png') no-repeat;
          background-size: cover;
        }
      }
    }
  }
  .withdrawal_operation{
    padding: 0 60px;
    .title{
      padding: 50px 0 40px 0;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: bold;
      color: @title-gray1;
    }
    .select_withdrawal_mode{
      margin-bottom: 20px;
      .wechat{
        width: 300px;
        color: @violet;
        border-radius: 15px;
        text-align: center;
        padding: 24px 0 24px 58px;
        position: relative;
        &::before{
          content: '';
          width: 44px;
          height: 36px;
          background: url('../../assets/images/market/mywallet_ic_wechart@2x.png') no-repeat;
          background-size: cover;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 65px;
          margin: auto 0;
        }
        &::after{
          border-color: @violet;
          border-radius: 20px;
        }
      }
    }
    .send_verification_code{
      .verification_code_title{
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: bold;
        color: @title-gray1;
        padding-top: 20px;
      }
      .van-field{
        padding-left: 0;
        padding-right: 0;
      }
      .send_code_btn{
        width: 200px;
        height: 60px;
        /deep/ .van-button__text{
          display: flex;
          align-items: center;
          .van-count-down{
            color: @violet;
            font-size: 12px;
          }
        }
      }
    }
    .withdrawal_btns{
      margin-top: 100px;
      p{
        font-size: 24px;
        font-family: PingFang SC;
        color:rgba(168, 173, 233, 1);
        line-height: 42px;
        margin-top: 30px;
        text-align: center;
      }
    }
  }
  /deep/ .password_input{
    padding: 0 32px;
    .block_input{
      border: 1px solid #ddd;
      span{
        background: none;
        margin: 0;
        border-right: 1px solid #ddd;
        border-radius: 0;
        -webkit-text-security: disc;
        &:last-child{
          border: none;
        }
      }
    }
  }
}
</style>