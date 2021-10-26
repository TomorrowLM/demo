<template>
  <div class="signIn">
    <h1>拼任务欢迎您</h1>
    <h4>绑定手机号码</h4>
    <div class="signinPhone">
      <div class="input_box">
        <input
          type="number"
          v-model="phoneNumber"
          placeholder="请输入您的手机号"
          class="inputPhone"
          @input="input"
        />
      </div>
      <div class="input_box">
        <input
          type="number"
          v-model="verificationCode"
          placeholder="请输入短信验证码"
          class="inputCode"
          @input="inputCode"
        />
      </div>
      <div @click="verifyRegistBind" :disabled="disabledBtn" class="getcode">{{getcode}}</div>
      <button class="commonBtn" v-on:click="signinBtn()" :disabled="disabledSignin">绑定</button>
        <div class="agreement">
          <van-checkbox v-model="checked" checked-color="#7575f9" shape="square">同意</van-checkbox>
          <i @click="showAgreement(`${domainName}/app/delete_user/agreement.html`, '拼任务服务条款')">《拼任务服务条款》</i>
          <span>和</span>
          <i @click="showAgreement(`${domainName}/app/delete_user/sclution.html`, '拼任务隐私保护指引')">《拼任务隐私保护指引》</i>
        </div>
    </div>
    <div class="mark" v-if="overlayState" @click="overlayState = false">
      <div class="codeLoading" v-if="loading">
        <i class="el-icon-loading codesi"></i>
      </div>
      <iframe
        id="verification"
        :src="domainName + '/common/share/#/verification?type=wechat'"
        frameborder="0"
        width="80%"
        height="280px"
        @load="verificationLoad"
      ></iframe>
    </div>
    <van-action-sheet v-model="isShowAgreement" :title="agreementTitle">
      <iframe width="100%" height="500px" :src="agreementPath" frameborder="0"></iframe>
    </van-action-sheet>
  </div>
</template>

<script>
import { getSmsCode, invitationUserRegister, verifyRegistBind } from "@/api/share";
import { Toast, Dialog } from "vant";
import { getUrlFirst } from "../../utils/base";
export default {
  name: "codes",
  data() {
    return {
      checked:false,
      agreementTitle: '',
      isShowAgreement: false,
      agreementPath: '',
      domainName: process.env.VUE_APP_PAGE_BASE_URL,
      phoneNumber: "", //手机号
      verificationCode: "", //验证码
      getcode: "获取验证码",
      disabledBtn: false,
      disabledSignin: false,
      token: "",
      // shareType: "", //分享类型【1：问卷；2：小任务、邀请中心】
      nonce_str: "",
      sign: "",
      getcodes: 99,
      Codes: "",
      surveyId: "",
      invitationCode: "", //邀请码
      // oldphone: "",
      obj: {
        txt: "手机号绑定成功",
        name: "surveyone",
        btncont: "知道了"
      },
      datas: {},
      overlayState: false,
      loading: false
    };
  },
  created() {
    // flag:1新用户  2：老用户
    this.datas = getUrlFirst()
    console.log(this.datas,)
    window.addEventListener("message", this.receiveMessage, false);
    if (this.datas.terminalCode) {
      //分享流程过来的连接中会带terminalCode
      sessionStorage.setItem("terminalCode", this.datas.terminalCode);
    }
  },
  methods: {
    showAgreement(url, title) {
      this.isShowAgreement = true
      this.agreementTitle = title
      this.agreementPath = url
    },
    inputCode() {
      if (this.verificationCode.length > 6) {
        this.verificationCode = this.verificationCode.substring(0, 6);
      }
    },
    input() {
      if (this.phoneNumber.length > 11) {
        this.phoneNumber = this.phoneNumber.substring(0, 11);
      }
    },
    receiveMessage(params) {
      const {
        data: {
          nc_token: sliderToken,
          csessionid: sliderSessionId,
          sig: sliderSig
        }
      } = params;
      console.log(sliderToken, sliderSessionId, sliderSig);
      sliderToken && this.getCode({ sliderToken, sliderSessionId, sliderSig });
    },
    verificationLoad() {
      this.loading = false;
    },
    openOverlay() {
      const phongreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (this.phoneNumber == "" || !phongreg.test(this.phoneNumber)) {
        Toast("请输入正确的手机号");
      } else {
        //先判断逻辑再走风控
        this.overlayState = true;
        this.loading = true;
      }
    },
    //获取验证码
    getCode(params) {
      const phone = this.phoneNumber;
      this.disabledBtn = true;
      getSmsCode({
        mobile: phone,
        ...params
      }).then(res => {
        this.oldphone = phone;
        this.overlayState = false;
        if (res.code === 1) {
          this.getCodes();
        } else {
          this.disabledBtn = false;
          Toast(res.msg);
        }
      });
    },
    verifyRegistBind() {
      const phongreg = /^[1][0-9]{10}$/;//只校验1开头 11位即可
      if (this.phoneNumber == "" || !phongreg.test(this.phoneNumber)) {
        Toast("请输入正确的手机号");
        return;
      }
      this.disabledBtn = true;
      const cancelBind = msg => {
        this.disabledBtn = false;
        msg && Toast(msg);
        window.clearInterval(this.Codes);
        this.disabledBtn = false;
        this.getcode = "获取验证码";
        this.getcodes = 99;
      };
      verifyRegistBind({
        phone: this.phoneNumber,
        flag: this.datas.flag
      }).then(res => {
        const {
          code,
          msg,
          data: { statusNum, msg: dataMsg }
        } = res;
        if (code === 1) {
          if (statusNum === "0") {
            Toast(dataMsg);
          } else if (statusNum === "1") {
            this.overlayState = true;
            this.loading = true;
          } else {
            Dialog.confirm({
              title: "提示",
              message: dataMsg,
              cancelButtonText: "更换手机号",
              confirmButtonText: "合并账号",
              confirmButtonColor: "#7575f9"
            })
              .then(() => {
                this.overlayState = true;
                this.loading = true;
              })
              .catch(() => {
                cancelBind();
              });
          }
        } else {
          cancelBind(msg);
        }
      });
    },
    getCodes() {
      const that = this;
      this.Codes = setInterval(function() {
        that.getcodes = that.getcodes - 1;
        that.getcode = that.getcodes + "S";
        if (that.getcodes == -1) {
          window.clearInterval(that.Codes);
          that.disabledBtn = false;
          that.getcode = "获取验证码";
          that.getcodes = 99;
          return;
        }
      }, 1000);
    },
    // 提交表单 注册
    signinBtn: function() {
      if(!this.checked){
        Toast("请认真阅读相关服务条款和隐私保护指引，并勾选同意后再进行登录。");
        return
      }
      window.clearInterval(this.Codes);
      this.disabledBtn = false;
      this.getcode = "获取验证码";
      this.getcodes = 99;
      if (this.phoneNumber == "") {
        Toast("请输入正确的手机号");
      } else if (this.verificationCode == "") {
        Toast("请输入验证码");
      } else {
        this.disabledSignin = true;
        const phone = this.phoneNumber;
        const smsCode = this.verificationCode;
        this.datas.phone = phone;
        this.datas.code = smsCode;
        console.log("链接参数：", this.datas);
        // this.disabledBtn=false
        invitationUserRegister(this.datas).then(res => {
          console.log(res)
          this.disabledSignin = false;
          if (res.code === 1) {
            Toast("注册成功");
            if (this.datas.surveyId) {//问卷分享过来的
              //问卷分享流程中的
              this.datas = {
                ...this.datas,
                ...res.data
              }
              this.$router.replace({
                name: "SurveyFront",
                query: this.datas
              });
            } else {//邀请中心分享的
              if(this.datas.wechatShare == 1){//wechatShare:1  //微信分享
                this.$router.replace({
                  name: "BasicInformation",
                  query: { token: res.data.token, type: this.datas.type } //type:1进问卷列表 2：进个人中心
                });
              }else{//app分享过来的
                
              }
            }
          }else{
            this.disabledSignin = false;
            Toast(res.msg);
          }
        });
      }
    }
  },
  destroyed() {
    window.removeEventListener("message", this.receiveMessage, false);
  }
};
</script>

<style lang="less" scoped>

.signIn {
  height: 100%;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  padding:200px 30px 30px;
  color:#333;
  h1{
    font-size: 64px;
    margin:0px 0 140px;
    font-weight: 200;
  }
  h4{
    font-size:34px;
    font-weight: bold;
  }
}
.signinPhone {
  padding: 40px 0px 0px;
  text-align: left;
  position: relative;
  .agreement{
    text-align: center;
    margin-top:30px;
    font-size: 24px;
    color: #bbb;
    display: flex;
    justify-content: center;
    align-items: center;
    /deep/ .van-checkbox{
      .van-icon{
        margin-top:3PX;
        width:14PX;
        height:14PX;
        line-height:14PX;
        border: 1PX dashed #bbb;
        
      }
      span{
        color:#bbb;
      }
    }
    
    i{
      color: #7575f9;
      font-style: normal;
    }
  }
}
.signinPhone input {
  width: 100%;
  padding-left: 0px;
  box-sizing: border-box;
  border: none;
}

.signinPhone .input_box {
  padding: 60px 0 30px;
  border-bottom: @PX solid #efefef;
}
.signinPhone img {
  position: absolute;
  left: 10px;
  top: 20px;
  width: 32px;
}
.signinPhone .share_ic_code {
  width: 44px;
}
.inputCode {
  width: 80%;
}
.signinPhone .labelImg {
  position: absolute;
  left: 20px;
  top: 0px;
}
.signinPhone .getcode {
  position: absolute;
  right: 40px;
  bottom: 256px;
  text-align: right;
  padding: 8px 24px;
  border: @PX solid #7575f9;
  border-radius: 38px;
  color: #7575f9;
  font-size: 24px;
}
.signinPhone .getcode:hover {
  background-color: #fff;
}
.mark {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}

#verification {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.signinPhone .el-button.is-disabled:hover {
  /*color: #f9ac50;*/
  color: #c0c4cc;
}
#app .el-message {
  width: 68%;
  min-width: 68%;
}
.codesi {
  font-size: 138px;
  color: #7575f9;
}
.codeLoading {
  position: absolute;
  width: 100px;
  height: 100px;
  /* background: rgba(0,0,0,0.2); */
  left: 50%;
  top: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
}
.codeLoading .el-loading-spinner .path {
  -webkit-animation: loading-dash 1.5s ease-in-out infinite;
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: #ffa733;
  stroke-linecap: round;
}
</style>