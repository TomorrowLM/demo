<template>
  <div class="qustion">
    <com-header></com-header>
    <div class="content">
      <div class="introduce">
        <img src="../../static/images/que_listimg_xun2.png" alt />
        <div class="info">
          <div class="title">
            <span class="nowrap">{{surveyDetails.appSurveyWelcomePageVO.surveyName}}</span>
            <span>{{surveyDetails.appSurveyWelcomePageVO.gold}}</span>
          </div>
          <p>{{surveyDetails.appSurveyWelcomePageVO.answerTime}}</p>
        </div>
      </div>
      <div class="rule_box">
        <div class="rule">
          <div class="require">
            <img src="../assets/Integral_ic_detail.png" alt />
            <span>奖励说明:</span>
            <img style="margin-left: 10px;" src="../assets/que_ic_qa2.png" alt  @click="showSurveyState = true" />
          </div>
          <div style="line-height: 40px;" v-html="surveyDetails.appSurveyWelcomePageVO.award"></div>
        </div>
        <div class="rule">
          <div class="require">
            <img src="../assets/Integral_ic_detail.png" alt />
            <span>基本要求:</span>
          </div>
          <ul>
            <li v-for="(item,index) in ruleLists" :key="index">{{item}}</li>
          </ul>
        </div>
      </div>
      <!-- <div class="rule">
        <div class="require">
          <img src="../assets/Integral_ic_detail.png" alt />
          <span>注意事项:</span>
        </div>
        <ul>
          <li v-for="(item,index) in attentionLists" :key="index">{{item}}</li>
        </ul>
      </div> -->
      <a class="btn" @click="goAnswer">下一步</a>
    </div>
    <div class="t_overlay" v-show="showSurveyState"></div>
    <div class="t_dialog" v-show="showSurveyState">
      <div class="t_dialog_header">问卷状态说明</div>
      <div class="t_dialog_body" v-html="surveyDetails.appSurveyWelcomePageVO.surveyState"></div>
      <div class="t_dialog_footer">
        <button @click="showSurveyState = false">朕知道了</button>
      </div>
    </div>
  </div>
</template>

<script>
import common from "../api/common";
import url from "../api/url";
export default {
  name: "agree",
  data() {
    return {
      surveyDetails: {
        appSurveyWelcomePageVO: {}
      }, //问卷详情
      attentionLists: [],
      ruleLists: [],
      showSurveyState: false
    };
  },
  created() {
    common.is_can_answer(this.$route.params.surveyId).then(data => {
      console.log(data, "是否可以答题");
      this.surveyDetails = data.data;
      this.ruleLists = this.surveyDetails.appSurveyWelcomePageVO.require.split(
        "\n"
      );
      this.attentionLists = this.surveyDetails.appSurveyWelcomePageVO.attention.split(
        "\n"
      );
    });
  },
  methods: {
    goAnswer() {
      if (this.surveyDetails.appSurveyWelcomePageVO.hasBeforeQuestion == 0) {
        //无前置问卷
        window.open(this.surveyDetails.surveyUrl);
        this.$nextTick(() => {
          this.$router.replace({ name: "SurveyList" });
        });
      } else if (
        this.surveyDetails.appSurveyWelcomePageVO.hasBeforeQuestion == 1
      ) {
        //有前置问卷
        this.$router.replace({
          name: "BeforeAnswerPage",
          params: { surveyId: this.surveyDetails.surveyId }
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
@mixin size($w: 100%, $h: 100px) {
  width: $w;
  height: $h;
}
@mixin font($size: 16px, $color: #333) {
  font-size: $size;
  color: $color;
}
.qustion {
  padding: 80px 0 0;
  background: #ededed;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
}
.content {
  min-height: 418px;
  width: 750px;
  margin: 0 auto;
  background: #fff;
  padding-bottom: 30px;

  .introduce {
    height: 140px;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
    background: #7575f9;
    margin: 0 auto;
    overflow: hidden;
    padding: 30px;
    box-sizing: border-box;
    color: #fff;
    img {
      vertical-align: middle;
    }
    .info {
      display: inline-block;
      vertical-align: middle;
      height: 60px;
      margin-left: 30px;
      .title {
        font-size: 16px;
        width: 560px;
        .nowrap {
          display: inline-block;
          max-width: 350px;
        }
        span:nth-child(2) {
          float: right;
          color: #ffe930;
        }
      }
      p {
        margin-top: 16px;
        color: #cacefe;
      }
    }
  }
  .rule_box{
    padding: 0 30px;
  }
  .rule {
    padding: 30px 0;
    width: 690px;
    margin: 0 auto;
    color: #888;
    border-bottom: 1px dashed #ddd;
    .require {
      margin-bottom: 30px;
      font-size: 16px;
      color: #7575f9;
      img {
        width: 22px;
        vertical-align: middle;
      }
      span {
        display: inline-block;
        vertical-align: middle;
        margin-left: 10px;
      }
    }
    ul {
      font-size: 14px;
      color: #888;
      line-height: 40px;
    }
  }
  .btn {
    display: block;
    width: 690px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #7575f9;
    color: #fff;
    font-size: 16px;
    margin: 30px auto;
    border-radius: 6px;
  }
}
.t_overlay{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}
.t_dialog{
  position: fixed;
  top: 45%;
  left: 50%;
  width: 320px;
  overflow: hidden;
  font-size: 16px;
  background-color: #fff;
  border-radius: 16px;
  transform: translate3d(-50%, -40%, 0);
  z-index: 99;
  &_header{
    padding-top: 24px;
    font-weight: 500;
    line-height: 24px;
    text-align: center;
  }
  &_body{
    max-height: 60vh;
    padding: 24px;
    overflow-y: auto;
    font-size: 14px;
    line-height: 20px;
    white-space: pre-wrap;
    text-align: left;
    word-wrap: break-word;
    padding-top: 12px;
    color: #646566;
  }
  &_footer{
    overflow: hidden;
    button{
      width: 100%;
      color: #7575f9;
      text-align: center;
      line-height: 50px;
      display: block;
      cursor: pointer;
    }
  }
}
</style>
