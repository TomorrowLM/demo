<template>
  <div class="share">
    <div class="share_bg">
      <div class="share_bg2">
        <img class="click_tips" src="../../assets/images/survey/click_tips.png" alt="" srcset="">
        <div class="share_tips">
          <h3>您将分享问卷</h3>
          <h4>{{data.surveyName}}</h4>
          <p>{{shareWords}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {surveyMarkedWords } from "@/api/survey.js";
export default {
  components: {},
  data() {
    return {
      data:JSON.parse(decodeURIComponent(this.$route.params.data)),
      shareWords:""
    };
  },
  created() {
    console.log(this.data)
    surveyMarkedWords({}).then(res => {
      this.shareWords = res.data;
    });
  },
  methods: {}
};
</script>

<style lang='less' scoped>
//@import url()
.share {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: linear-gradient(
    45deg,
    rgba(101, 17, 223, 1) 0%,
    rgba(255, 95, 57, 1) 99%
  );
  .share_bg {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: url(../../assets/images/survey/share_bg.png) no-repeat;
    background-size: contain;
  }
  .share_bg2 {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: url(../../assets/images/survey/share_bg2.png) no-repeat;
    background-size: contain;
    text-align: right;
    .click_tips{
      width:556px;
      margin-top:60px;
    }
    .share_tips{
      width:100%;
      height: 900px;
      background: url(../../assets/images/survey/share.png) no-repeat;
      background-size: contain;
      box-sizing: border-box;
      padding-top:70px;
      text-align: center;
      
      h3{
        color:@title-gray1;
        font-weight: bold;
        font-size: 30px;
      }
      h4{
        color:@violet;
        box-sizing: border-box;
        padding:35px 0 25px;
        width:338px;
        margin:0 auto;
        font-size: 30px;
      }
      p{
        text-align: left;
        width:338px;
        margin:0 auto;
        font-size:26px;
        color:#999;
        line-height:42px;
      }
    }
  }
}
</style>