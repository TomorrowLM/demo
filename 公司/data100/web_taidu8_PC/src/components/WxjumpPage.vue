<template>
  <div class="jump_page"></div>
</template>
<script>
import common from "../api/common";
import request from "../api/request";
import urls from "../api/url";

export default {
  name: "jumppage",

  data() {
    return {
      //   wx_code: ""
    };
  },
  created() {
    if (window.location.href.indexOf("?") > -1) {
      //   this.wx_code = common.getParams(window.location.href).code;
      console.log(common.getParams(window.location.href).code);
      request(urls.wechatLogin, {
        code: common.getParams(window.location.href).code
      }).then(data => {
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
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>