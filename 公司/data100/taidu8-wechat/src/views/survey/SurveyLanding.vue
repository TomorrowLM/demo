<template>
  <div class="landing">
    <div class="bg">
      <img class="logo" src="../../assets/images/survey/share_stcj_logo.png" alt />
      <div class="btn" @click="goDetails">去答题赚钱</div>
    </div>
  </div>
</template>

<script>
// import common from "../api/common";
// import weixin from "../api/share";
import { is_can_answer } from "@/api/survey.js";
import { getUrl } from "../../utils/base";
export default {
  name: "landing",

  data() {
    return {
      params: {}
    };
  },
  created() {
    this.params = getUrl();
    console.log(this.params);
    this.$ls.set("token", this.params.token);
    if (getUrl().terminalCode) {
      //分享流程过来的连接中会带terminalCode
      sessionStorage.setItem("terminalCode", getUrl().terminalCode);
    }
  },
  mounted() {},
  methods: {
    goDetails() {
      if (this.params.surveyChannelCode == 0) {
        // 一區問卷分享
        is_can_answer(this.params).then(data => {
          // sessionStorage.setItem("surveyParams", JSON.stringify(this.params));
          if (data.data.isCanAnswer) {
            if (data.data.appSurveyWelcomePageVO.hasWelcome == 0) {
              //没有欢迎页
              if (data.data.appSurveyWelcomePageVO.hasBeforeQuestion == 0) {
                //没有前置问卷
                window.location.href = data.data.surveyUrl;
              } else {
                //有前置问卷
                this.$router.replace({
                  name: "BeforeQuestion",
                  params: { surveyId: String(data.data.surveyId) },
                  query: this.params
                });
              }
            } else {
              //有欢迎页
              // this.$router.replace({ name: "SurveyDetail" });
              data.data.shareUserId = this.params.shareUserId;
              this.$router.replace({
                name: "SurveyDetail",
                params: {
                  surveyId: String(data.data.surveyId)
                },
                query: this.params
              });
            }
          } else {
            if (
              data.data.code === 1 ||
              data.data.code === 2 ||
              data.data.code === 3 ||
              data.data.code === 4 ||
              data.data.code === 7
            ) {
              // 1已答过此问卷 2问卷已下线 3问卷已抢光 4问卷已结束
              data.data.name = "tabs";
              data.data.surveyId = this.params.surveyId;
              this.$router.push({
                name: "SurveyUnqualified",
                params: { data: JSON.stringify(data.data) }
              });
            } else if (data.data.code === 6) {
              // 6绑定手机号
              this.$router.push({
                name: "BindPhone",
                query: { flag: "2", token: this.$ls.get("token") }
              });
            } else if (data.data.code === 5) {
              // 5完善基本信息
              const obj = {
                token: this.$ls.get("token")
              };
              this.$router.push({ name: "BasicInformation", query: obj });
            } else {
              // error
              this.$router.push({
                name: "Error",
                params: { data: this.$route.name },
                query: { msg: data.data.msg }
              });
            }

            // var obj = {
            //   msg: data.data.msg,
            //   name: "tabs",
            //   tabText: "去看看其他问卷"
            // };
            // this.$router.replace({
            //   name: "Unqualified",
            //   params: { data: JSON.stringify(obj) }
            // });
          }
        });
      } else {
        // 二區問卷分享  0：手拉手对接问卷；1：gmo问卷. 3：dataSpring；4：SSI；5：Borderless；6：cint；7：lucid
        is_can_answer(this.params).then(res => {
          if (res.data.isCanAnswer) {
            window.location.href = res.data.surveyUrl;
            // +"&newUserInvitationCode=" +
            // this.params.newUserInvitationCode;
          } else {
            // var obj = {
            //   surveyId:this.params.surveyId,
            //   msg: data.data.msg,
            //   name: "tabs",
            //   tabText: "去看看其他问卷"
            // };
            // this.$router.replace({
            //   name: "SurveyUnqualified",
            //   params: { data: JSON.stringify(obj) }
            // });
            // 失败问卷
            if (
              res.data.code === 1 ||
              res.data.code === 2 ||
              res.data.code === 3 ||
              res.data.code === 4
            ) {
              // 1已答过此问卷 2问卷已下线 3问卷已抢光 4问卷已结束
              this.$router.replace({
                name: "SurveyUnqualified",
                params: {
                  data: JSON.stringify({
                    surveyId: this.params.surveyId,
                    msg: res.data.msg,
                    name: "tabs",
                    tabText: "去看看其他问卷"
                  })
                }
              });
            } else if (res.data.code === 6) {
              this.$router.replace({
                name: "BindPhone",
                query: { flag: "2", token: this.params.token }
              });
            } else if (res.data.code === 5) {
              // 5完善基本信息
              this.$router.replace({
                name: "BasicInformation",
                query: { token: this.params.token }
              });
            } else if (res.data.code === 7) {
              // 不能在分享流程中答题
              this.$router.replace({
                name: "SurveyUnqualified",
                params: {
                  data: JSON.stringify({
                    surveyId: this.params.surveyId,
                    msg: res.data.msg,
                    name: "tabs",
                    tabText: "去看看其他问卷"
                  })
                }
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.landing {
  background: linear-gradient(to bottom, #5e3db5, #ec5758);
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 180px 0 30px;
  .bg {
    width: 100%;
    min-height: 100%;
    background: url(../../assets/images/survey/share_quenor_img.png) no-repeat
      center 80px;
    background-size: contain;
    text-align: center;
    box-sizing: border-box;
    .logo {
      width: 180px;
    }
    .btn {
      width: 630px;
      height: 90px;
      background: linear-gradient(to bottom, #fffbdc, #fdf57a);
      border-radius: 45px;
      margin: 600px auto 0;
      font-size: 34px;
      color: #dd0600;
      text-align: center;
      line-height: 90px;
      box-shadow: 0 20px 40px rgba(201, 17, 0, 0.3);
    }
  }
}
</style>
