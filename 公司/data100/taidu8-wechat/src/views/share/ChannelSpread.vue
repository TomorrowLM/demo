<template>
  <div class="channel">
    <h2>答问卷</h2>
    <h1>领<span>{{data.appSurveyWelcomePageVO.gold}}元</span>现金红包</h1>
    <div class="detail">
      <h3>{{data.appSurveyWelcomePageVO.surveyName}}</h3>
      <p>{{data.appSurveyWelcomePageVO.answerTime}}</p>
      <van-button  class="btn" type="default" color="linear-gradient(135deg,#916bff, #5368ff)" round @click="answerQuestion">开始答题</van-button>
      <h4>具体金额以活动规则为准</h4>
    </div>
  </div>
</template>

<script>
import {welcome } from "@/api/survey.js";
import {recordClockNum} from "@/api/share.js";
export default {
  components: {},
  data() {
    return {
      data:null,
      params_qus:{}
    };
  },
  created() {
     var params_qus = {
      ...this.$route.query
    };
    if(this.$ls.get('clickCookieId')){
      params_qus.clickCookieId =  this.$ls.get('clickCookieId')
    }else{
      params_qus.clickCookieId = ""
    }
    params_qus.token = "";
    params_qus.terminalCode = "";
    this.params_qus = params_qus
    welcome(params_qus).then(res => {
      this.data = res.data;
      if(!this.$ls.get('clickCookieId')){
        this.$ls.set('clickCookieId', this.data.clickCookieId)
      }
      
    });
  },
  methods: {
    answerQuestion(){
      recordClockNum({
        clickCookieId:this.$ls.get('clickCookieId'),
        surveyId:this.$route.query.surveyId
      }).then(()=>{
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
      })
    }
  }
};
</script>

<style lang='less' scoped>
  .channel{
    width: 100%;
    height:100%;
    background:url(../../assets/images/share/bg.png) no-repeat top center ;
    background-size:contain ;
    box-sizing: border-box;
    padding:50px 0 40px;
    text-align: center;
    h2{
      color:@violet;
      font-size:36px;
      font-weight: bold;
    }
    h1{
      color:@violet;
      font-size:48px;
      font-weight: bold;
        span{
          color:rgba(247,69,69,1);
        }
    }
    .detail{
      margin:600px 0 0;
      .btn{
        width:560px;
      }
    }
    h3{
      font-size:32px;
      font-weight: bold;
      color:rgba(51,51,51,1);
    }
    p{
      margin:15px 0 60px;
      color:#888;
    }
    h4{
      font-size:24px;
      color:rgba(187,187,187,1);
       margin:30px 0 0;
    }
  }
</style>