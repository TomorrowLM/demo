<template>
  <div class="noSurvey">
    <div class="noSurveyCont">
      <img src="../../assets/images/survey/share_expired_img.png" alt />
      <p class="noSurveyContp1">{{obj.msg}}</p>
      <button class="commonBtn" @click="toHome">{{obj.tabText}}</button>
    </div>
  </div>
</template>

<script>
// 答问卷不合格、不符合条件的
export default {
  data() {
    return {
      obj: {
        msg: "系统错误，请联系管理员",
        name: "tabs",
        tabText: "返回问卷列表",
        surveyId:"",//问卷分享需要提供surveyId
      }
    };
  },
  methods: {
    toHome() {
      this.$router.push({ name: this.obj.name });
    }
  },
  created() {
    if (this.$route.params.data) {
      this.obj = Object.assign(this.obj,JSON.parse(this.$route.params.data));
    }
    // if (this.type === "4") {
    //   this.txt = "很抱歉，此问卷的答题人数已满，下次早点来哦";
    // } else if (this.type === "5") {
    //   this.txt =
    //     "很抱歉，跟您相同条件的小伙伴已经抢先回答了问卷，请您下次早点过来抢问卷";
    // } else if (this.type === "6") {
    //   this.txt = " 很抱歉，您已超过此问卷的答题期限，下次早点来哦";
    // } else {
    //   this.txt = "系统错误，请联系管理员";
    // }
  }
};
</script>

<style lang="less" scoped>
.noSurvey {
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  text-align: center;
}
.noSurveyCont {
  padding: 35px 0;
  img {
    width: 60%;
  }
}
.noSurveyContp1 {
  max-width:690px;
  margin: 40px auto;
  font-size: 28px;
  color: #a9a9a9;
}
</style>
