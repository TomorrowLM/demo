<template>
  <div class="login">
    <p class="title">用户登录</p>
    <div class="phoneNum">
      <p v-if="phoneMsg">{{phoneMsg}}</p>
      <input
        type="number"
        placeholder="请输入手机号"
        v-model="phoneNum"
        v-on:input="listenKeyword"
        autofocus
      />
    </div>
    <div class="securityCode">
      <p v-if="securityMsg">{{securityCode==''?'验证码不能为空':'请输入正确的验证码'}}</p>
      <div>
        <input
          type="number"
          placeholder="请输入验证码"
          v-model="securityCode"
          @keyup.enter="login"
          v-on:input="listenPassword"
        />
        <button @click="getCode" :class="{'pointer':isgetCode}">{{securityTime}}</button>
      </div>
    </div>
    <div class="btn" @click="login">登录</div>
    <div class="agreement">
      登录即是同意
      <span @click="goAgreement">《拼任务服务条款》</span>
    </div>
  </div>
</template>

<script>
import common from "../../api/common";

export default {
  name: "login",
  data() {
    return {
      phoneMsg: false, //手机号的提示
      phoneNum: "", //手机号
      securityMsg: false, //验证码提示
      securityCode: "", //验证码
      securityTime: "获取验证码", //填写验证码倒计时
      isgetCode: true
    };
  },
  created() {},
  methods: {
    goAgreement() {
      this.$router.push({ name: "Agreement" });
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
    getCode() {
      if (this.isgetCode) {
        if (this.phoneNum == "") {
          this.phoneMsg = "手机号不能为空";
          return;
        } else if (!/^1\d{10}$/.test(this.phoneNum)) {
          this.phoneMsg = "请输入正确手机号";
          return;
        }
        // console.log("点击获取验证码");
        var second = 99;
        var timer;
        this.isgetCode = false;
        this.securityTime = second + "s";
        // 获取验证码接口
        timer = setInterval(() => {
          second--;
          this.securityTime = second + "s";
          // console.log("点击获取验证码", this.securityTime);
          if (second == 0 || this.securityTime == "获取验证码") {
            clearInterval(timer);
            this.isgetCode = true;
            this.securityTime = "获取验证码";
          }
        }, 1000);
        common.smsCode(this.phoneNum).then(data => {
          if (data.code == 0) {
            clearInterval(timer);
            this.isgetCode = true;
            $toast.show(data.msg,5000);
            this.securityTime = "获取验证码";
          }
        });
      }
    }
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
  .title {
    text-align: center;
    font-size: 18px;
    color: #7575f9;
    height: 58px;
    line-height: 58px;
    background: linear-gradient(#efefef, #f6f5f5);
  }
  .phoneNum,
  .securityCode {
    padding-top: 20px;
    height: 48px;
    margin-left: 30px;
    position: relative;

    p {
      color: red;
      position: absolute;
      top: 0;
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
    margin: 25px 0 8px 30px;
    border-radius: 6px;
    background: #7575f9;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
  }
  .agreement {
    margin-left: 30px;
    font-size: 14px;
    color: #999;
    span {
      color: #7979ad;
      cursor: pointer;
    }
  }
}
</style>
