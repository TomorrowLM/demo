<template>
  <div class="SurveyDetail" v-if="data">
    <div class="survey-wrap">
      <div class="survey-cont">
        <img :src="imgIcon" alt class="imgIcon" />
        <div class="surveyTitle">
          <p class="surveyTitlep1">
            <span>{{data.appSurveyWelcomePageVO.surveyName}}</span>
            <span>{{data.appSurveyWelcomePageVO.gold}}</span>
          </p>
          <p class="surveyTitlep2">{{data.appSurveyWelcomePageVO.answerTime}}</p>
        </div>
      </div>
      <div class="rule_box">
        <div class="require">
          <p class="title">
            <img :src="imgIcons" alt />
            <span>奖励说明：</span>
            <van-icon class="question_icon" name="question-o" @click="awardQuestion" />
          </p>
          <div v-html="data.appSurveyWelcomePageVO.award.replace(/\n/g,'<br/>')"></div>
        </div>
        <div class="require">
          <p class="title">
            <img :src="imgIcons" alt />
            <span>基本要求：</span>
          </p>
          <div v-html="data.appSurveyWelcomePageVO.require.replace(/\n/g,'<br/>')"></div>
        </div>
      </div>
      <!-- <div class="attention">
        <p class="title">
          <img :src="imgIcons" alt class />
          <span>注意事项：</span>
        </p>
        <div v-html="data.appSurveyWelcomePageVO.attention.replace(/\n/g,'<br/>')"></div>
      </div>-->
    </div>
    <div class="share" v-if="shareshow">
      <img src="../../assets/images/share_img.png" alt />
      <p @click="closeShow" class="closeShow">知道了</p>
    </div>
    <div class="shareBtn">
      <div>
        <button class="SurveyDetailContBegin commonBtn" @click="answerQuestion">开始答题</button>
      </div>
      <div v-if="!params_qus.channelAnswer && isPinRenWu && isShowShareBtn == 1">
        <button class="SurveyDetailContShare commonBtn" @click="shareClick">分享任务</button>
        <div class="tips_bg" v-if="shareWords">{{shareWords}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { is_can_answer, welcome } from "@/api/survey.js";
import { Dialog } from "vant";

export default {
  name: "SurveyDetail",
  data() {
    return {
      data: "",
      title: "",
      rulerShow: false,
      shareshow: false,
      userRecordList: [],
      surveyId: "",
      imgIcon: require("../../assets/images/survey/task_ic_other.png"),
      imgIcons: require("../../assets/images/survey/task_ic_des@2x.png"),
      shareWords: "",
      isShowShareBtn: '',
      params_qus: {}, //是否是从渠道落地页进入的答题
      isPinRenWu: true
    };
  },
  methods: {
    surveyMarkedWords() {
      //分享提示语
    },
    // 开始答题
    answerQuestion() {
      if (this.params_qus.channelAnswer) {
        //渠道答题
        if (this.data.appSurveyWelcomePageVO.hasBeforeQuestion == 1) {
          this.$router.replace({
            name: "BeforeQuestion",
            params: {
              surveyId: this.params_qus.surveyId
            },
            query: {
              channelAnswer: this.params_qus.channelAnswer,
              channelCode: this.params_qus.channelCode
            }
          });
        } else {
          location.replace(this.data.surveyUrl);
        }
      } else {
        if (this.data.isCanAnswer) {
          // 问卷可以答：判断是否有前置问卷
          if (this.data.appSurveyWelcomePageVO.hasBeforeQuestion == 0) {
            // 跳转到问卷页面
            location.replace(this.data.surveyUrl);
          } else {
            // 跳转到前置问卷页面 param:surveyId
            if (this.$route.query.isShare) {
              this.$router.replace({
                name: "BeforeQuestion",
                params: { surveyId: this.data.surveyId },
                query: this.$route.query
              });
            } else {
              this.$router.replace({
                name: "BeforeQuestion",
                params: { surveyId: this.data.surveyId }
              });
            }
          }
        } else {
          // 失败问卷
          if (
            this.data.code === 1 ||
            this.data.code === 2 ||
            this.data.code === 3 ||
            this.data.code === 4
          ) {
            // 1已答过此问卷 2问卷已下线 3问卷已抢光 4问卷已结束
            this.data.name = "tabs";
            this.data.surveyId = this.surveyId;
            this.$router.replace({
              name: "SurveyUnqualified",
              params: { data: JSON.stringify(this.data) }
            });
          } else if (this.data.code === 6) {
            //问卷详情页不会出现手机号未绑定和未完善信息的情况
            // 6绑定手机号
            // this.data.name = "bindphone";
            // this.data.tabText = "去绑定";
            // this.$router.push({
            //   name: "Unqualified",
            //   params: { data: JSON.stringify(this.data) }
            // });
          } else if (this.data.code === 5) {
            // 5完善基本信息
            // this.data.name = 'perfect'
            // this.data.btncont = '去完善'
            // this.$router.push({name:'noanswer',params:{data:JSON.stringify(this.data)}})
            // const obj = {
            //   type: "1",
            //   token: localStorage.tokenStorage
            // };
            // this.$router.push({ name: "BasicInformation", query: obj });
          } else {
            // error
            this.$router.push({
              name: "Error",
              params: { data: this.$route.name },
              query: { msg: this.data.msg }
            });
          }
        }
      }
    },
    shareClick() {
      this.shareshow = true;
    },
    closeShow() {
      this.shareshow = false;
    },
    awardQuestion() {
      Dialog.alert({
        title: "问卷状态说明",
        message: this.data.appSurveyWelcomePageVO.surveyState,
        confirmButtonText: "朕知道了",
        confirmButtonColor: "#7575f9",
        messageAlign: "left"
      });
    }
  },
  created() {
    this.isPinRenWu = window.location.origin.includes('pinrenwu')
    var params_qus = {
      surveyId: this.$route.params.surveyId,
      ...this.$route.query
    };
    this.params_qus = params_qus;
    if (this.params_qus.channelAnswer) {
      //渠道推广答问卷流程
      params_qus.token = "";
      params_qus.terminalCode = "";
      welcome(params_qus).then(res => {
        this.data = res.data;
      });
    } else {
      is_can_answer(params_qus).then(res => {
        this.data = res.data;
        this.shareWords = res.data.shareWords;
        this.isShowShareBtn = res.data.isShowShareBtn
      });
    }
  }
};
</script>

<style scoped lang="less">
p {
  margin-block-start: 0em;
  margin-block-end: 0em;
}
.SurveyDetail {
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 30px;
  overflow-y: auto;
  background: #fff;
}
.survey-wrap {
  .survey-cont {
    width: 100%;
    // height:210px;
    background: #7575f9;
    border-radius: 0 0 40px 40px;
    padding: 60px 30px;
    box-sizing: border-box;
    display: flex;
    .imgIcon {
      width: 80px;
      height: 80px;
      border-radius: 80px;
      background: #fff;
      margin-right: 20px;
    }
    .surveyTitle {
      flex: 1;
      color: #fff;
      .surveyTitlep1 {
        display: flex;
        span:nth-child(1) {
          font-size: 30px;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
          width: 380px;
        }
        span:nth-child(2) {
          font-size: 30px;
          color: #ffd530;
          text-align: right;
          display: inline-block;
          flex: 2;
        }
      }
      .surveyTitlep2 {
        padding-top: 8px;
        font-size: 24px;
        color: #cacefe;
      }
    }
  }
  p.title {
    font-size: 26px;
    color: #7575f9;
    img {
      width: 32px;
      height: auto;
      vertical-align: middle;
      margin-right: 15px;
    }
    span {
      display: inline-block;
      vertical-align: middle;
    }
  }
  .rule_box {
    padding: 0 30px;
  }
  .require {
    width: 100%;
    padding: 50px 0;
    box-sizing: border-box;
    border-bottom: @PX dashed #ddd;
    div {
      padding-top: 30px;
      font-size: 26px;
      color: #8d97b5;
      line-height: 160%;
    }
    .question_icon {
      font-size: 32px;
      position: relative;
      top: 10px;
    }
  }
  .attention {
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
    p {
      padding-top: 60px;
      border-top: @PX dashed #ddd;
    }
    div {
      padding-top: 30px;
      font-size: 26px;
      color: #8d97b5;
      line-height: 160%;
    }
  }
}
.shareBtn {
  width: 100%;
  padding: 30px 30px 10px;
  .SurveyDetailContBegin,
  .SurveyDetailContShare {
    margin-top: 30px;
  }
}

.share {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.72);
  img {
    width: 100%;
  }
}
.closeShow {
  font-size: 28px;
  color: #fff;
  position: absolute;
  left: 50%;
  bottom: 120px;
  width: 72%;
  height: 72px;
  text-align: center;
  border: @PX solid #fff;
  border-radius: 10px;
  line-height: 72px;
  transform: translateX(-50%);
}
</style>
