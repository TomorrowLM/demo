<template>
  <div class='set_password'>
    <van-overlay :show="showSlider" @click="showSlider = false">
      <div class="wrapper" @click.stop v-if="showSlider">
        <iframe id="verification" :src="domainName + '/common/share/#/verification?type=wechat'" frameborder="0" width="80%" height="190px"></iframe>
      </div>
    </van-overlay>
    <van-form @submit="onSubmit">
      <van-field
        class="password"
        v-model="password1"
        type="digit"
        name="password"
        placeholder="请输入6位纯数字作为密码"
        maxlength="6"
        :error='false'
        :rules="[{ validator: validatorPassword1, message: '请输入6位纯数字作为密码' }]"
      />
      <van-field
        class="password"
        v-model="password2"
        type="digit"
        name="password"
        placeholder="确认您的密码"
        maxlength="6"
        :error='false'
        :rules="[{ validator: validatorPassword2, message: '请确保两次输入的密码相同' }]"
      />
      <van-field
        v-model="code"
        type="digit"
        clearable
        name="code"
        placeholder="请输入您的验证码"
        maxlength="6"
        :error='false'
        :rules="[{ validator: validatorCode, message: '请输入您的验证码' }]"
      >
        <template #button>
          <van-button class="send_code_btn" size="small" plain hairline round type="primary" :disabled="sendCodeStatus === 1" @click="checkTodySmsNumber">
            <van-count-down
              v-if="sendCodeStatus === 1"
              :time="90000"
              format="ss"
              @finish="finish"
            />
            {{ sendCodeStatus === 0 ? '获取验证码' : 's后获取' }}
          </van-button>
        </template>
      </van-field>
      <div style="margin-top: 90px;">
        <van-button round block type="primary" native-type="submit">
          确认提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { Toast } from 'vant'
import basicData from '../market/const'
import md5 from 'js-md5'

export default {
  name: 'SetPassword',
  data () {
    return {
      domainName: process.env.VUE_APP_PAGE_BASE_URL,
      password1: '',
      password2: '',
      code: '',
      showSlider: false,
      sendCodeStatus: 0,
    }
  },
  created () {
    window.addEventListener('message', this.receiveMessage, false);
  },
  methods: {
    receiveMessage(params) {
      const { data: { nc_token: sliderToken, csessionid: sliderSessionId, sig: sliderSig } } = params;
      sliderToken && this.getWithdrawV5({ sliderToken, sliderSessionId, sliderSig })
    },
    validatorPassword1(val) {
      if (val.length < 6) {
        return false
      }
    },
    validatorPassword2(val) {
      if (this.password1 !== val) {
        return false
      }
    },
    validatorCode(val) {
      if (val.length < 6 && this.password1.length === 6 && this.password2.length === 6) {
        return false
      }
    },
    async checkTodySmsNumber() {
      if (!this.password1 || !this.password2) {
        Toast('请输入新密码')
        return false
      }
      const { dispatch } = this.$store
      const { ACTION_TYPE: { GET_CODE } } = basicData
      const params = {
        actionType: GET_CODE,
      }
      await dispatch('CheckTodySmsNumber', params)
      this.showSlider = true
    },
    getWithdrawV5 (sliderParams) {
      const { dispatch } = this.$store
      const params = {
        type: '2',
        ...sliderParams
      }
      dispatch('GetWithdrawV5', params).then(() => {
        this.sendCodeStatus = 1
        Toast.success(basicData.withdrawalCodeSuccess)
        this.showSlider = false
      }).catch(() => {
        Toast.success(basicData.withdrawalCodeError)
        this.showSlider = false
      })
    },
    finish() {
      this.sendCodeStatus = 0
    },
    async onSubmit(values) {
      values.password = md5(values.password)
      const { dispatch } = this.$store
      const { msg } = await dispatch('SetPassword', values)
      Toast.success(msg)
      setTimeout(() => {
        window.history.go(-1)
      }, 1000)
    }
  },
  destroyed() {
    window.removeEventListener('message', this.receiveMessage, false)
  }
}
</script>

<style lang='less' scoped>
//@import url()
.set_password{
  padding: 80px 40px;
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  /deep/ .van-cell{
    padding: 16px;
  }
  .password{
    /deep/ .van-field__control{
      -webkit-text-security: disc !important;
      -moz-text-security: disc !important;
      -o-text-security: disc !important;
    }
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
</style>