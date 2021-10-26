<template>
  <div class='channel_end'>
    <van-notice-bar class="channel_end_notice_bar" color="#fff" :left-icon="require('../../assets/images/survey/logo_mini.png')">
      拼任务 | 上市公司旗下产品，500万人都在答卷赚钱
    </van-notice-bar>
    <van-overlay :show="showSlider" @click="showSlider = false">
      <div class="wrapper" @click.stop v-if="showSlider">
        <iframe id="verification" :src="domainName + '/common/share/#/verification?type=wechat'" frameborder="0" width="80%" height="190px"></iframe>
      </div>
    </van-overlay>
    <div class="channel_end_bg">
      <div class="channel_end_gold">
        <p>恭喜您，获得{{ queryParams.status === '1' ? '' : queryParams.gold }}金币奖励</p>
        <p class="register" v-if="queryParams.status !== '1'">新用户注册再领</p>
        <h3>{{ queryParams.status === '1' ? queryParams.gold : '200' }}<span>金<br />币</span></h3>
      </div>
      <div class="channel_end_advantage">
        <dl v-for="(item, index) of advantageData" :key="'advantage' + index">
          <dt><img :src="item.url" alt=""></dt>
          <dd>
            <p>{{ item.title }}</p>
            <p>{{ item.subTitle }}</p>
          </dd>
        </dl>
      </div>
      <div class="channel_end_content">
        <div class="channel_end_content_form">
          <van-field v-model="form.mobile" maxlength="11" type="digit" placeholder="请输入手机号" />
          <van-field v-model="form.smsCode" maxlength="6" type="digit" placeholder="请输入验证码">
            <template #button>
              <button class="send_code" :disabled="sendCodeStatus === 1 || form.mobile.length < 11" @click="showSlider = true">
                <van-count-down
                  v-if="sendCodeStatus === 1"
                  :time="90000"
                  format="ss"
                  @finish="finish"
                />
                {{ sendCodeStatus === 0 ? '获取验证码' : 's后获取' }}
              </button>
            </template>
          </van-field>
          <van-button type="primary" round block class="submit" @click="submit">立即领钱(100金币=1元)</van-button>
          <p class="agreement">
            登录即表示同意
            <i @click="showAgreement(`${domainName}/app/delete_user/agreement.html`, '拼任务服务条款')">《拼任务服务条款》</i>
            <i @click="showAgreement(`${domainName}/app/delete_user/sclution.html`, '拼任务隐私保护指引')">《拼任务隐私保护指引》</i>
          </p>
        </div>
      </div>
      <div class="channel_end_divider">简单三步，当天到账</div>
      <div class="channel_end_footer">
        <dl v-for="(item, index) of footerData" :key="'footer' + index">
          <dt>{{ item.title }}</dt>
          <dd>{{ item.subTitle }}</dd>
        </dl>
      </div>
    </div>
    <van-action-sheet v-model="isShowAgreement" :title="agreementTitle">
      <iframe width="100%" height="500px" :src="agreementPath" frameborder="0"></iframe>
    </van-action-sheet>
  </div>
</template>

<script>
import { getPhoneCode, channelRegister } from "@/api/survey";
import { getUrl } from "@/utils/base";
import { loadMonitorJs } from "@/utils/monitor";
import { Toast } from 'vant';

export default {
  name: 'ChannelEnd',
  data () {
    return {
      queryParams: null,
      sendCodeStatus: 0,
      showSlider: false,
      domainName: process.env.VUE_APP_PAGE_BASE_URL,
      agreementTitle: '',
      isShowAgreement: false,
      agreementPath: '',
      form: {
        mobile: '',
        smsCode: ''
      },
      advantageData: [
        {
          title: '门槛低',
          subTitle: '人人可赚',
          url: require('../../assets/images/survey/advantage_ic1.png')
        },
        {
          title: '到账快',
          subTitle: '秒提秒到',
          url: require('../../assets/images/survey/advantage_ic2.png')
        },
        {
          title: '赚钱多',
          subTitle: '海量问卷',
          url: require('../../assets/images/survey/advantage_ic3.png')
        }
      ],
      footerData: [
        {
          title: '1',
          subTitle: '答问卷'
        },
        {
          title: '2',
          subTitle: '注册'
        },
        {
          title: '3',
          subTitle: '关注公众号提现'
        },
      ]
    }
  },
  created () {
    this.queryParams = getUrl()
    window.addEventListener('message', this.receiveMessage, false);
    loadMonitorJs()
  },
  methods: {
    finish() {
      this.sendCodeStatus = 0
    },
    receiveMessage(params) {
      const { data: { nc_token: sliderToken, csessionid: sliderSessionId, sig: sliderSig } } = params;
      sliderToken && this.getCode({ sliderToken, sliderSessionId, sliderSig })
    },
    // 获取验证码
    getCode(params) {
      const { mobile } = this.form
      getPhoneCode({
        mobile,
        ...params
      }).then(() => {
        this.sendCodeStatus = 1
        Toast.success('验证码已发送，请查收！')
        this.showSlider = false
      }).catch(() => {
        Toast.success('验证码发送失败！')
        this.showSlider = false
      })
    },
    async submit() {
      const { mobile, smsCode } = this.form
      const { answerId } = this.queryParams
      if (!mobile || !smsCode || mobile.length < 11 || smsCode.length < 6) {
        Toast.fail('请检查手机号或验证码是否正确')
        return false
      }
      const { data } = await channelRegister({ phone: mobile, smsCode, answerId })
      const { newUser } = getUrl(data)
      if (newUser === 't') {
        window.meteor.track('form', { convert_id: 1680313462654979 }) // 哇棒头条监测
        window.meteor.track('form', { convert_id: 1680314976478212 }) // 品众头条监测
        window.sendTrace({t:"js_active",op2:"js_form", opt_convert_id: "10202"}) // 趣头条监测
      }
      window.location.href = data
    },
    showAgreement(url, title) {
      this.isShowAgreement = true
      this.agreementTitle = title
      this.agreementPath = url
    }
  },
}
</script>

<style lang='less' scoped>
//@import url()
.channel_end{
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #973BDF 0%, #1D26BB 100%);
  overflow: auto;
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  /deep/ .van-notice-bar{
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 999;
  }
  &_bg{
    width: 100%;
    height: 100%;
    background: url('../../assets/images/survey/channel_end_bg.png') no-repeat;
    background-size: 100% 100%;
  }
  &_notice_bar{
    background: url('../../assets/images/survey/channel_end_notice_bg.png') no-repeat;
    background-size: cover;
  }
  &_gold{
    height: 380px;
    background: url('../../assets/images/survey/channel_end_top_bg.png') no-repeat;
    background-size: cover;
    text-align: center;
    padding-top: 170px;
    p{
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #FFFFFF;
      line-height: 40px;
    }
    .register{
      color: #FFDA8E;
    }
    h3{
      font-size: 100px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #FFCC00;
      line-height: 140px;
      position: relative;
      padding-right: 40px;
      span{
        width: 48px;
        height: 68px;
        border-radius: 12px;
        color: #F5A623;
        border: 1px solid #F5A623;
        display: inline-block;
        font-size: 20px;
        line-height: 34px;
        position: absolute;
        right: 248px;
        top: 0;
        bottom: 0;
        margin: auto 0;
      }
    }
  }
  &_advantage{
    width: 305px;
    height: 90px;
    background: linear-gradient(90deg, #6033FB 0%, #9C31E4 100%);
    border-radius: 10px 10px 0px 0px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    dl{
      flex: 1 0;
      text-align: center;
      img{
        width: 28px;
        height: 28px;
      }
      dd{
        p{
          color: #fff;
          font-size: 14px;
          &:last-child{
            color: #BC94FF;
            font-size: 12px;
          }
        }
      }
    }
  }
  &_content{
    width: 100%;
    height: 580px;
    background: url('../../assets/images/survey/channel_end_content_bg.png') no-repeat;
    background-size: cover;
    position: relative;
    bottom: 30px;
    padding-top: 60px;
    &::before{
      content: '';
      width: 64px;
      height: 76px;
      background: url('../../assets/images/survey/gold_coin_icon2.png') no-repeat;
      position: absolute;
      left: 0;
      top: 120px;
    }
    &::after{
      content: '';
      width: 80px;
      height: 82px;
      background: url('../../assets/images/survey/gold_coin_icon1.png') no-repeat;
      position: absolute;
      right: 0;
      top: 0;
    }
    &_form{
      width: 610px;
      height: 460px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      /deep/ .van-field{
        margin-bottom: 10px;
        border-radius: 22px;
      }
      .send_code{
        width: 200px;
        color: @violet;
        outline: none;
        border: none;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        .van-count-down{
          color: @violet;
        }
        &::before{
          content: '';
          width: 1px;
          height: 40px;
          background: @violet;
          position: absolute;
          top: 2px;
          bottom: 0;
          left: -12px;
          margin: auto 0;
        }
        &:disabled{
          opacity: 0.5;
        }
      }
      .submit{
        background: linear-gradient(90deg, #FB9346 0%, #FC5572 100%);
      }
      .agreement{
        font-size: 24px;
        color: #9C73FD;
        i{
          color: #C5ABFF;
          font-style: normal;
        }
      }
    }
  }
  &_divider{
    font-size: 30px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #FFFFFF;
    line-height: 42px;
    text-align: center;
    position: relative;
    &::before{
      content: '';
      width: 690px;
      height: 4px;
      background: url('../../assets/images/survey/divider_bg.png') no-repeat;
      background-size: cover;
      position: absolute;
      left: 30px;
      top: 0;
      bottom: 0;
      margin: auto 0;
    }
  }
  &_footer{
    width: 100%;
    height: 330px;
    background: url('../../assets/images/survey/channel_end_footer_bg.png') no-repeat;
    background-size: cover;
    display: flex;
    align-items: center;
    padding: 0 50px;
    dl{
      flex: 1 0;
      text-align: center;
      position: relative;
      &::before{
        content: '';
        width: 12px;
        height: 20px;
        background: url('../../assets/images/survey/arrow.png') no-repeat;
        background-size: cover;
        position: absolute;
        right: -8px;
        top: 50px;
      }
      &:last-child::before{
        display: none;
      }
      dt{
        width: 116px;
        height: 116px;
        background: url('../../assets/images/survey/steps_bg.png') no-repeat;
        background-size: cover;
        margin: 0 auto;
        font-size: 48px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ECEDFF;
        line-height: 116px;
        text-shadow: 0px 4px 10px rgba(28, 10, 159, 0.5);
      }
      dd{
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #FFFFFF;
        line-height: 40px;
        margin-top: 20px;
      }
    }
  }
}
</style>