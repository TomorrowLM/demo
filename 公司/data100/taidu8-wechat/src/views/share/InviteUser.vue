<template>
  <div class='guide_attention'>
    <div class="bg">
      <van-notice-bar class="guide_attention_notice_bar" color="#fff" :left-icon="require('../../assets/images/share/logo_1@2x.png')">
        拼任务 | 上市公司旗下产品，500万人都在答卷赚钱
      </van-notice-bar>
      <div class="guide_attention_bg">
        <div class="result">
          <van-row type="flex" justify="center" class="content">
            <van-col span="8" v-for="(content,index) in contentData" :key="index">
              <img :src="content.img" alt="">
              <h5>{{content.title}}</h5>
              <h6>{{content.dis}}</h6>
            </van-col>
          </van-row>
        </div>
        <div class="signinPhone">
            <div class="input_box">
              <input
                type="number"
                v-model="phoneNumber"
                placeholder="请输入手机号"
                class="inputPhone"
                @input="input"
              />
            </div>
            <div class="input_box">
              <input
                type="number"
                v-model="verificationCode"
                placeholder="请输入验证码"
                class="inputCode"
                @input="inputCode"
              />
            </div>
            <div @click="verifyRegistBind" :disabled="disabledBtn" class="getcode">{{getcode}}</div>
            <!--:style="{background:disabledSignin||!checked?'#bbb':'linear-gradient(135deg,#916bff, #5368ff)'}"-->
            <button class="commonBtn"  v-on:click="signinBtn()" :disabled="disabledSignin">开始赚钱</button>
              <div class="agreement">
                <van-checkbox v-model="checked" checked-color="#7575f9" shape="square">同意</van-checkbox>
                <i @click="showAgreement(`${domainName}/app/delete_user/agreement.html`, '拼任务服务条款')">《拼任务服务条款》</i>
                <span>和</span>
                <i @click="showAgreement(`${domainName}/app/delete_user/sclution.html`, '拼任务隐私保护指引')">《拼任务隐私保护指引》</i>
              </div>
          </div>
      </div>
      <div class="guide_wx">
        <h4>
          简单三步，答卷赚现金
        </h4>
        <van-row type="flex" justify="space-around" class="content" align="center">
          <van-col v-for="(content,index) in contentData2" :key="index" class="col">
            <img :src="content.img" alt="">
            <h5 v-if="index%2==0">{{content.title}}</h5>
          </van-col>
        </van-row>
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
  </div>
</template>

<script>
import { getUrlFirst } from "@/utils/base";
import { Toast, Dialog } from "vant";
import { getSmsCode, invitationUserRegister, verifyRegistBind } from "@/api/share";
export default {
  name: 'GuideAttention',
  data () {
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
      loading: false,
      contentData:[
        {
          img:require("../../assets/images/share/inviteUser_content1@2x.png"),
          title:"门槛低",
          dis:"人人可赚"
        },
        {
          img:require("../../assets/images/share/inviteUser_content2@2x.png"),
          title:"到账快",
          dis:"秒提秒到"
        },
        {
          img:require("../../assets/images/share/inviteUser_content3@2x.png"),
          title:"赚钱多",
          dis:"海量问卷"
        },
      ],
      contentData2:[
        {
          img:require("../../assets/images/share/inviteUser_content4@2x.png"),
          title:"关注公众号",
        },
        {img:require("../../assets/images/share/step@2x.png"),},
        {
          img:require("../../assets/images/share/inviteUser_content5@2x.png"),
          title:"答问卷",
        },
        {img:require("../../assets/images/share/step@2x.png"),},
        {
          img:require("../../assets/images/share/inviteUser_content6@2x.png"),
          title:"提现",
        },
      ]
 
    }
  },
  created () {
    this.datas = getUrlFirst()
    console.log(this.datas)
     window.addEventListener("message", this.receiveMessage, false);
  },
  methods: {
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
        invitationUserRegister(this.datas).then(res => {
          console.log(res)
          this.disabledSignin = false;
          if (res.code === 1) {
            Toast("注册成功");
            this.$router.replace({
              name: "InviteUserWechat",
            });
        
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
}
</script>

<style lang='less' scoped>
//@import url()
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
.guide_attention{
  width: 100%;
  height: 100%;
  background:linear-gradient( rgba(156,49,228,1) 0%, rgba(96,51,251,1) 100%);
  .bg{
    box-sizing: border-box;
    padding:360px 0 30px;
    width: 100%;
    height: 100%;
    background: url('../../assets/images/share/invite_user_bg.png') no-repeat  ;
    overflow: auto;
    background-size: contain;
  }
  /deep/ .van-notice-bar{
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    border-radius:0 0 10px 10px;
    img{
      width: 24px;
      height:24px;
      margin-right:10px;
    }
  }
  &_notice_bar{
    background:rgba(90, 0, 187,0.6);
    box-shadow:0 2PX 6PX  rgba(80, 0, 129,0.2);
    background-size: cover;
  }
  .content{
    text-align: center;
    img{
      width: 48px;
    }
    h5{
      margin:8px 0 2px;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      color: #8632ed;
    }
    h6{
      font-size: 20px;
      font-weight: 400;
      text-align: center;
      color: #ac90d3;
    }
  }
  .guide_attention_bg{
    width:100%;
    height:700px;
    background: url('../../assets/images/share/invite_user_content_bg.png') no-repeat center ;
    background-size: contain;
    color:rgba(224,99,16,1);
    text-align: center;
    box-sizing: border-box;
    padding-top:10px;
   
    .result{
      margin: 0 auto;
      width:480px;
      height:160px;
      display: flex;
      flex-direction: column;
      justify-content:center;
     
     
    }
     .signinPhone {
        color:#333;
        width:690px;
        margin:0 auto;
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
        .commonBtn{
          display: block;
          width: 600px;
          margin:20px auto 0;
        }
      }
      .signinPhone input {
        width: 100%;
        padding-left: 0px;
        box-sizing: border-box;
        border: none;
      }

      .signinPhone .input_box {
        margin:28px auto;
        width:600px;
        height: 90px;
        border: 1px solid #ede5f6;
        border-radius: 48px;
        padding: 30px 40px;
        background: #f8f8f8;
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
        bottom: 184px;
        text-align: right;
        height: 90px;
        line-height: 90px;
        width: 240px;
        text-align: center;
        background: linear-gradient(0deg,#b2a3eb 0%, #ddc1fa 99%);
        border-radius: 0px 46px 46px 0px;
        color: #fff;
        font-size: 28px;
      }
      .signinPhone .getcode:hover {
        background-color: #fff;
      }
    h3{
      font-size:36px;
    }
    p{
      margin-top:10px;
      font-size:30px;
      .span{
        color: rgba(208,52,52,0.98);
        font-weight: bold;
      }
    }
    h1{
      margin:30px 0 0;
      display: flex;
      justify-content: center;
      align-items: center;
      span{
        font-size:96px;
        margin-left:15px;
        color: rgba(208,52,52,0.98);
      }
    }
  }
  .guide_wx{
      background:url('../../assets/images/share/step_bg.png') no-repeat center;
      background-size: 100% 100%;
      width: 730px;
      height: 380px;
      margin:-20px auto 0;
      box-sizing: border-box;
      .content{
        padding:0 60px;
        .col{
          &:nth-child(odd){
            img{
              width: 96px;
            }
          }
          &:nth-child(even){
            img{
              position: relative;
              top:-28px;
              width: 24px;
              height:16px;
            }
          }
        }
        
        h5{
          font-size: 28px;
        }
      }
      h4{
        background-size: contain;
        color: #fff;
        font-size:28px ;
        width: 470px;
        height:42px;
        margin:0 auto 40px;
        text-align: center;
        font-weight: bold;
        box-sizing: border-box;
        padding:88px 0 40px;
      }
      h2{
        font-size:30px;
        font-weight: bold;
        color: #333333;
      }
      img{
        width: 96px;
        height:96px;
        margin-right: 20px;
      }
      p{
        margin-top:12px;
        font-size: 24px;
        font-weight: 400;
        text-align: left;
        color: #888888;
      }
      .btn{
        width:160px;
        height:60px;
      }
    }
}
</style>