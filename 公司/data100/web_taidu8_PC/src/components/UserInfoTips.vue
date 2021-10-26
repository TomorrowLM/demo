<template>
  <div class="user_info_tips" v-if="registrationInfo.title">
    <div class="tips">
      <h3>{{ registrationInfo.title }}</h3>
      <p>{{ registrationInfo.contents.replace("\n","") }}</p>
    </div>
    <div class="tip">
      <img src="../../static/images/ic@2x.png" alt />
      您将进入拼任务合作的第三方问卷系统，所有个人信息保护及使用规则均符合
      <a :href="`${domain}/pc/#/sclutionDataYibai`"  target="_black">《隐私保护指引》</a>，点击【继续答题】代表您已充分了解并同意授权进入。
    </div>
    <div class="content">
      <h3>您的基本信息为</h3>
      <button class="edit_button" @click="edit">修改基本信息</button>
      <ul>
        <li>
          <span>城市：</span>
          {{ registrationInfo.userData.city }}
        </li>
        <li>
          <span>性别：</span>
          {{ registrationInfo.userData.sex }}
        </li>
        <li>
          <span>出生年份：</span>
          {{ registrationInfo.userData.birthday }}
        </li>
      </ul>
    </div>
    <div class="continue_button_tips">若信息无误，请点击下方按钮参与问卷</div>
    <button class="continue_button" @click="continueAnswer">继续答题</button>
  </div>
</template>

<script>
import common from "../api/common";

export default {
  name: "UserInfoTips",
  data() {
    return {
      registrationInfo: {},
      domain: process.env.BASE_PAGE
    };
  },
  created() {
    common.getRegistrationInfo().then(data => {
      this.registrationInfo = data.data;
    });
  },
  methods: {
    continueAnswer() {
      this.$emit("on-continueAnswer");
    },
    edit() {
      localStorage.setItem("userpageIndex", 3);
      this.$router.push({ name: "UserPage" });
    }
  }
};
</script>

<style lang='scss' scoped>
.user_info_tips {
  width: 700px;
  height: 600px;
  background: url("../../static/images/user_info_tips_bg@2x.png") no-repeat;
  background-size: 100% auto;
  background-color: #fff;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  margin: 20px auto 0;
  .tips {
    width: 480px;
    padding: 25px 0 0 40px;
    h3 {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 25px;
      margin-bottom: 12px;
    }
    p {
      white-space: pre-wrap;
      color: #fff;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      line-height: 20px;
    }
  }
    .tip{
      width: 630px;
      height: 98px;
      margin:10px auto 0;
      background: url(../../static/images/user_info_tip_bg.png) no-repeat;
      background-size:contain ;
      box-sizing: border-box;
      padding: 25px;
      font-size: 12px;
      line-height: 20px;
      color:#D6D6FF;
      position: relative;
      img{
        position: absolute;
        width: 107px;
        right: 30px;
        top: -70px;
      }
      a{
        color:#fff;
      }
    }
  .content {
    padding: 60px 30px 30px 30px;
    position: relative;
    h3 {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #000000;
      line-height: 20px;
    }
    ul {
      margin-top: 20px;
      li {
        padding: 30px 0;
        border-bottom: 1px solid #dddddd;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #333;
        span {
          font-size: 14px;
          color: #999999;
        }
      }
    }
    .edit_button {
      width: 136px;
      height: 34px;
      line-height: 34px;
      border-radius: 18px;
      border: 1px solid #7575f9;
      color: #7575f9;
      position: absolute;
      right: 30px;
      top: 60px;
      cursor: pointer;
      padding-left: 30px;
      &::before {
        content: "";
        width: 12px;
        height: 12px;
        background: url("../assets/edit@2x.png") no-repeat;
        background-size: cover;
        position: absolute;
        left: 17px;
        top: 11px;
      }
    }
  }
  .continue_button_tips {
    width: 100%;
    line-height: 45px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #b7b4e8;
    text-align: center;
  }
  .continue_button {
    width: 315px;
    height: 45px;
    line-height: 45px;
    border-radius: 23px;
    border: 1px solid #7575f9;
    background: #7575f9;
    color: #fff;
    bottom: 30px;
    display: block;
    margin: 0 auto;
    cursor: pointer;
  }
}
</style>