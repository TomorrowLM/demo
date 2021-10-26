<template>
  <div class="survey_list">
    <van-tabbar
      v-model="active"
      :fixed="false"
      active-color="#7575f9"
      inactive-color="#888"
      @change="onChange"
    >
      <van-tabbar-item name="survryone">
        <span>寻智囊(一区)</span>
        <p class="underline" v-show="active==='survryone'"></p>
      </van-tabbar-item>
      <van-tabbar-item name="survrytwo">
        <span>问英雄(二区)</span>
        <p class="underline" v-show="active==='survrytwo'"></p>
      </van-tabbar-item>
      <van-tabbar-item name="history">
        <span>分享赚金币</span>
        <p class="underline" v-show="active==='history'"></p>
      </van-tabbar-item>
    </van-tabbar>
    <div class="content">
      <survey-one v-if="active==='survryone'"></survey-one>
      <survey-two v-if="active==='survrytwo'"></survey-two>
      <survey-history v-if="active==='history'"></survey-history>
    </div>
  </div>
</template>

<script>
import SurveyOne from "./SurveyOne";
import SurveyTwo from "./SurveyTwo";
import SurveyHistory from "./SurveyHistory";
import { getWechatOauth } from "@/api/survey.js";
export default {
  components: {
    SurveyOne,
    SurveyTwo,
    SurveyHistory
  },
  data() {
    return {
      active: "survryone"
    };
  },
  created() {
    if (sessionStorage.getItem("survey_name")) {
      this.active = sessionStorage.getItem("survey_name");
    }
  },
  methods: {
    onChange(index) {
      console.log(index);
      if (this.$ls.get("token")) {
          sessionStorage.setItem("survey_name", index);
      } else { //未登录的状态下 点击问英雄 分享赚金币 重新授权
        if(index == "survrytwo" ||index == "history"){
          this.active = "survryone"
          sessionStorage.setItem("survey_name", "survryone");
          getWechatOauth("?type=1")
        }
      }
    }
  }
};
</script>

<style lang='less' scoped>
.survey_list {
  height: 100%;
  span {
    font-size: 26px;
  }
  .van-tabbar {
    border-bottom: #ddd;
  }
  .van-tabbar-item {
    position: relative;
  }
  .underline {
    z-index: 10;
    position: absolute;
    width: 80px;
    height: 4px;
    background: @violet;
    bottom: 0px;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  .content {
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    padding-bottom: 100px;
  }
}
</style>