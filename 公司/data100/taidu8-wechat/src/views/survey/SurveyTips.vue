<template>
  <div class="survey_tips">
    <img class="logo" src="../../assets/images/survey/logo@2x.png" alt />
    <img class="img" src="../../assets/images/survey/img@2x.png" alt />
    <div class="content">
      <p>感谢您参加数字一百公司发起的问卷调查。</p>
      <p>数字一百是一家独立的市场调研公司，公司正在进行一项关于消费者可能会接触到的一些品牌和体验的调查。我们希望在调查中听取您的意见。</p>
      <p>您在所有数字一百及我们的合作方问卷中填写信息的保护及使用政策均符合 <router-link to="/sclution">《隐私保护指引》</router-link ></p>
      <p>点击【继续】按钮，即代表您已充分了解，并同意授权进入问卷。</p>
    </div>
    <a class="commonBtn"   @click="goSls">继续</a>
  </div>
</template>

<script>
import { getUrl } from "../../utils/base";
export default {
  components: {},
  data() {
    return {
      isFirst:true
    };
  },
  created(){
    
  },
   mounted(){
    document.getElementsByTagName("html")[0].style.maxWidth = "100%"
  },
  beforeDestroy(){
    document.getElementsByTagName("html")[0].style.maxWidth = "500px"
  },
  methods: {
    goSls(){
      if(this.isFirst){
        this.isFirst = false 
        window.location.replace( getUrl().c==1?`${process.env.VUE_APP_API_SLS_URL}survey/survey/author${location.search}`:`${process.env.VUE_APP_API_SLS_URL}distribution/survey/partner/author${location.search}`)
      }
     
    }
  }
};
</script>

<style lang='less' scoped>
.survey_tips {
  width: 100%;
  height: 100%;
  background: url(../../assets/images/survey/survey_tips_bg@2x.png) no-repeat center;
  background-size: contain;
  background-color: @violet;
  box-sizing: border-box;
  padding: 60px 60px 0;
  overflow: auto;
  @media screen and (min-width: 500px) {
    background: url(../../assets/images/survey/survey_tips_bg.png) no-repeat center #7575f9;
    padding: 100PX 60px 0;
    background-size: contain;
  }
  .content{
    @media screen and (min-width: 500px) {
      padding:60PX;
      margin:-80PX auto 0;
      width: 790PX;
      border-radius: 20px;
      box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15); 
      background:#fff;
      font-size:14PX;
      color: #666666;
      line-height: 26PX;
      p{
        color:#666;
        a{
          color:#666;
        }
      }
      
    }
  }
  img {
    display: block;
    @media screen and (min-width: 500px) {
      position: relative;
      z-index: 1;
    }
  }
  .logo {
    width: 268px;
    margin:0 auto;
   
  }
  .img {
    width: 456px;
    margin:40px auto 46px;
  }
  p{
    margin-bottom:50px;
    color:#D9DBFF;
    a{
      color:#fff;
    }
  }
  .commonBtn{
    width: 100%;
    display: block;
    background: #FF8787;
    @media screen and (min-width: 500px) {
      margin: 35PX auto;
      width:220PX;
      height:50PX;
      line-height:50PX;
      font-size: 14PX;
    }
  }
}
</style>