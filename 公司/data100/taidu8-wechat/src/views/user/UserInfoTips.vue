<template>
  <div class='user_info_tips' v-if="registrationInfo.title">
    <div class="tips">
      <h3>{{ registrationInfo.title }}</h3>
      <p>{{ registrationInfo.contents }}</p>
    </div>
    <div class="tip">
    <img src="../../assets/images/user/user_info_tipText@2x.png" alt="">
    您将进入拼任务合作的第三方问卷系统，所有个人信息保护及使用规则均符合 <router-link to="/sclution">《隐私保护指引》</router-link>，点击【继续答题】代表您已充分了解并同意授权进入。
    </div>
    <div class="content">
      <h3>您的基本信息为</h3>
      <van-button class="edit_button" round plain icon="edit" type="primary" size="small" to="/perfect">修改基本信息</van-button>
      <ul>
        <li>
          <span>城市：</span>{{ registrationInfo.userData.city }}
        </li>
        <li>
          <span>性别：</span>{{ registrationInfo.userData.sex }}
        </li>
        <li>
          <span>出生年份：</span>{{ registrationInfo.userData.birthday }}
        </li>
      </ul>
    </div>
    <div class="continue_button_tips">若信息无误，请点击下方按钮参与问卷</div>
    <van-button
      class="continue_button"
      type="primary"
      round
      block
      @click="continueAnswer"
    >继续答题</van-button>
  </div>
</template>

<script>
import { is_can_answer } from "@/api/survey.js";

export default {
  name: 'UserInfoTips',
  computed: {
    registrationInfo () {
      return this.$store.getters.registrationInfo
    }
  },
  created () {
    const { dispatch } = this.$store
    dispatch('GetRegistrationInfo')
  },
  methods: {
    continueAnswer() {
      const { isList, surveyId, channelCode } = this.$route.query
      if (isList == 0) {
        //没有列表
        this.is_can_answer(surveyId);
      } else {
        //有列表
        this.$router.push({
          name: "SurveyTwoDetail",
          params: { channelCode }
        });
      }
    },
    is_can_answer(surveyId) {
      is_can_answer({
        surveyId: surveyId
      }).then(res => {
        if (res.data.isCanAnswer) {
          // 问卷正常
          window.location.href = res.data.surveyUrl;
        } else {
          // 失败问卷
          if (
            res.data.code === 1 ||
            res.data.code === 2 ||
            res.data.code === 3 ||
            res.data.code === 4
          ) {
            // 1已答过此问卷 2问卷已下线 3问卷已抢光 4问卷已结束
            res.data.name = "tabs";
            res.data.surveyId = surveyId;
            this.$router.push({
              name: "SurveyUnqualified",
              params: { data: JSON.stringify(res.data) }
            });
          } else if (res.data.code === 6) {
            // 6绑定手机号
            res.data.name = "bindphone";
            res.data.tabText = "去绑定";
            this.$router.push({
              name: "Unqualified",
              params: { data: JSON.stringify(res.data) }
            });
          } else if (res.data.code === 5) {
            // 5完善基本信息
            this.$router.push({
              name: "BasicInformation",
              query: { token: this.$ls.get("token") }
            });
          } else {
            // error
            this.$router.push({
              name: "Error",
              params: { data: this.$route.name },
              query: { msg: res.data.msg }
            });
          }
        }
      });
    }
  },
}
</script>

<style lang='scss' scoped>
//@import url()
.user_info_tips{
  height: 100%;
  background: url('../../assets/images/user/user_info_tips_bg@2x.png') no-repeat;
  background-size: 100% auto;
  background-color: #fff;
  .tips{
    width: 480px;
    padding: 50px 0 0 60px;
    h3, p{
      white-space: pre-wrap;
      color: #fff;
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      line-height: 40px;
    }
    h3{
      margin-bottom: 20px;
    }
  }
  .tip{
      width: 710px;
      height: 220px;
      margin:20px auto 0;
      background: url(../../assets/images/user/user_info_tip_bg@2x.png);
      background-size:contain ;
      box-sizing: border-box;
      padding: 50px;
      font-size: 24px;
      line-height: 40px;
      color:#D6D6FF;
      position: relative;
      img{
        position: absolute;
        width: 214px;
        right: 10px;
        top: -170px;
      }
      a{
        color:#fff;
      }
    }
  .content{
    padding: 120px 60px 60px 60px;
    position: relative;
    h3{
      font-size: 28px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #000000;
      line-height: 40px;
    }
    ul{
      margin-top: 40px;
      li{
        padding: 30px 0;
        border-bottom: 1px solid #DDDDDD;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #333;
        span{
          font-size: 28px;
          color: #999999;
        }
      }
    }
    .edit_button{
      position: absolute;
      right: 60px;
      top: 110px;
    }
  }
  .continue_button_tips{
    width: 100%;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 180px;
    text-align: center;
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #B7B4E8;
    line-height: 34px;
  }
  .continue_button{
    position: fixed;
    bottom: 60px;
    width: 620px;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
}
</style>