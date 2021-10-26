<template>
  <div class="login">
    <!-- <div class="title_tab"></div> -->
    <tab :tabData="tabData" @actived="getActived" fromPage="loginPage"></tab>
    <div class="qrcode" v-show="isFlag==0">
      <div v-show="pagename=='homepage'" class="qrcode_img" id="login_container"></div>
      <div v-show="pagename=='loginpage'" class="qrcode_img" id="login_container1"></div>
      <!-- <p>微信扫描二维码登录</p> -->
      <div class="agreement">
        登录即是同意
        <span @click="goAgreement">《拼任务服务条款》</span>和
        <span @click="goSclution">《隐私保护指引》</span>
      </div>
    </div>
    <div v-show="isFlag==1">
      <div class="phoneNum">
        <p v-if="phoneMsg">
          <span>{{phoneMsg}}</span>
        </p>
        <input
          type="number"
          placeholder="请输入手机号"
          v-model="phoneNum"
          v-on:input="listenKeyword"
          autofocus
        />
      </div>
      <div class="securityCode">
        <p v-if="securityMsg">
          <span>{{securityCode==''?'验证码不能为空':'请输入正确的验证码'}}</span>
        </p>
        <div>
          <input
            type="number"
            placeholder="请输入验证码"
            v-model="securityCode"
            @keyup.enter="login"
            v-on:input="listenPassword"
          />
          <button @click="verifyPhoneBind" :class="{'pointer':isgetCode}">{{securityTime}}</button>
        </div>
      </div>
      <div class="btn" @click="login">登录</div>
      <div class="agreement">
        登录即是同意
        <span @click="goAgreement">《拼任务服务条款》</span>和
        <span @click="goSclution">《隐私保护指引》</span>
      </div>
    </div>
    <div class="mark" v-if="overlayState" @click="overlayState = false">
      <loading v-if="loading"></loading>
      <iframe
        id="verification"
        :src="urls.basePage + '/common/share/#/verification?type=wechat'"
        frameborder="0"
        width="80%"
        height="190px"
        @load="verificationLoad"
      ></iframe>
    </div>
  </div>
</template>

<script>
import common from "../../api/common";
import Tab from "./Tab";
import urls from "../../api/url";

export default {
  name: "login",
  props: ["pagename"],
  components: {
    Tab
  },
  data() {
    return {
      urls: urls,
      tabData: ["微信登录", "账号登录"],
      isFlag: 0,
      phoneMsg: false, //手机号的提示
      phoneNum: "", //手机号
      securityMsg: false, //验证码提示
      securityCode: "", //验证码
      securityTime: "获取验证码", //填写验证码倒计时
      isgetCode: true,
      overlayState: false,
      loading: false
    };
  },
  created() {
    window.addEventListener("message", this.receiveMessage, false);
  },
  mounted() {
    var that = this;
    // if (this.pagename == "homepage") {
    new WxLogin({
      self_redirect: false,
      id: that.pagename == "homepage" ? "login_container" : "login_container1",
      appid: "wx51f2006318434af0",
      scope: "snsapi_login",
      redirect_uri: urls.wxLogin_redirect_uri,
      state: "",
      style: "",
      href: urls.loginBasePage + "/static/style/wxLogin.css"
    });
  },
  methods: {
    verifyPhoneBind() {
      if (this.phoneNum == "") {
        this.phoneMsg = "手机号不能为空";
        return;
      } else if (!/^1\d{10}$/.test(this.phoneNum)) {
        this.phoneMsg = "请输入正确手机号";
        return;
      }
      common.verifyPhoneBind({ phone: this.phoneNum }).then(res => {
        if (res.code == 1) {
          //成功
          this.overlayState = true;
          this.loading = true;
        } else {
          //失败
          $toast.show(res.msg);
        }
      });
    },
    receiveMessage(params) {
      const {
        data: {
          nc_token: sliderToken,
          csessionid: sliderSessionId,
          sig: sliderSig
        }
      } = params;
      sliderToken && this.getCode({ sliderToken, sliderSessionId, sliderSig });
    },
    verificationLoad() {
      this.loading = false;
    },
    getActived(index) {
      this.isFlag = index;
    },
    goAgreement() {
      this.$router.push({ name: "Agreement" });
    },
    goSclution() {
      this.$router.push({ name: "Sclution" });
    },
    listenPassword() {
      this.securityMsg = false;
    },
    login() {
      if (this.phoneNum == "") {
        this.phoneMsg = "手机号不能为空";
        return;
      } else if (!/^1\d{10}$/.test(this.phoneNum)) {
        this.phoneMsg = "请输入正确手机号";
        return;
      }
      if (this.securityCode == "") {
        this.securityMsg = true;
        return;
      }

      common.phoneLogin(this.phoneNum, this.securityCode).then(data => {
        if (data.data.status == 1) {
          //登陆成功
          this.securityMsg = false;
          var userInfo = data.data;
          // 个人信息实时更新需提前请求
          common.getUserInfo(userInfo.token).then(userInfodata => {
            userInfo.balance = userInfodata.data.balance;
            userInfo.headImgUrl = userInfodata.data.headImgUrl;
            userInfo.integral = userInfodata.data.integral;
            userInfo.integralDesc = userInfodata.data.integralDesc;
            userInfo.nickName = userInfodata.data.nickName;
            userInfo.withdraw = userInfodata.data.withdraw;
            userInfo.total = userInfodata.data.total;
            userInfo.gold = userInfodata.data.gold;
            userInfo.totalGold = userInfodata.data.totalGold;
            userInfo.withdrawGold = userInfodata.data.withdrawGold;
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            common.completed_survey_award("", userInfo.token).then(data => {
              localStorage.setItem("awardLists", JSON.stringify(data.data));
              this.$router.push({ name: "SurveyList" });
            });
          });

          common.activeClick("5", userInfo.token);
          this.securityTime = "获取验证码";
        } else if (data.data.status == 2) {
          //验证码错误
          this.securityMsg = true;
        } else if (data.data.status == 3) {
          //用户未注册
          $toast.show("请下载拼任务APP，注册后再来登录吧");
        }
      });
    },
    listenKeyword() {
      // console.log("输入事件");
      if (this.phoneNum != "") {
        this.phoneMsg = false;
        if (this.phoneNum.length > 11)
          this.phoneNum = this.phoneNum.slice(0, 11);
      }
    },
    // openOverlay() {
    //   if (this.isgetCode) {
    //     if (this.phoneNum == "") {
    //       this.phoneMsg = "手机号不能为空";
    //       return;
    //     } else if (!/^1\d{10}$/.test(this.phoneNum)) {
    //       this.phoneMsg = "请输入正确手机号";
    //       return;
    //     }
    //     this.overlayState = true;
    //     this.loading = true;
    //   }
    // },
    getCode(params) {
      // 获取验证码接口
      common.smsCode({ mobile: this.phoneNum, ...params }).then(data => {
        this.overlayState = false;
        if (data.code == 0) {
          clearInterval(timer);
          this.isgetCode = true;
          $toast.show(data.msg, 3000);
          this.securityTime = "获取验证码";
        } else {
          var second = 99;
          var timer;
          this.isgetCode = false;
          this.securityTime = second + "s";
          timer = setInterval(() => {
            second--;
            this.securityTime = second + "s";
            if (second == 0 || this.securityTime == "获取验证码") {
              clearInterval(timer);
              this.isgetCode = true;
              this.securityTime = "获取验证码";
            }
          }, 1000);
        }
      });
    }
  },
  destroyed() {
    window.removeEventListener("message", this.receiveMessage, false);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@mixin size($w: 100%, $h: 100px) {
  width: $w;
  height: $h;
}
.login {
  @include size(100%, 100%);
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  .mark {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 999;
  }
  #verification {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .qrcode {
    // text-align: center;
    // height:600px;
    .qrcode_img {
      width: 300px;
      margin: 0 auto -160px;
    }
    p {
      font-size: 14px;
      line-height: 20px;
      color: #666;
    }
  }
  .phoneNum,
  .securityCode {
    padding-top: 20px;
    height: 48px;
    // margin-left: 30px;
    position: relative;
    text-align: center;
    p {
      color: red;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      span {
        display: inline-block;
        width: 300px;
        text-align: left;
        margin: 0 auto;
      }
    }
    input {
      background: #eee;
      border-radius: 6px;
      padding-left: 20px;
      height: 48px;
      line-height: 48px;
      font-size: 16px;
    }
    ::-webkit-input-placeholder {
      font-size: 16px;
      color: #bebebe;
    }
  }
  .phoneNum {
    margin-top: 10px;
    input {
      width: 280px;
    }
  }
  .securityCode {
    margin-top: 5px;
    input {
      width: 140px;
    }
    button {
      margin-left: 6px;
      @include size(130px, 48px);
      line-height: 48px;
      text-align: center;
      font-size: 16px;
      color: #7575f9;
      border: 1px solid #7575f9;
      border-radius: 6px;
      &.pointer {
        cursor: pointer;
      }
    }
  }
  .btn {
    text-align: center;
    @include size(300px, 50px);
    line-height: 50px;
    margin: 25px auto 14px;
    border-radius: 6px;
    background: #7575f9;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
  }
  .agreement {
    // margin-left: 30px;
    text-align: center;
    font-size: 14px;
    color: #999;
    span {
      color: #7575f9;
      cursor: pointer;
      position: relative;
      z-index: 100;
    }
  }
}
</style>
