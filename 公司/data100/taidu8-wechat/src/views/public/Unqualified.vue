<template>
  <div class="noSurvey">
    <div class="noSurveyCont">
      <img src="../../assets/images/img_empty_noque.png" alt />
      <p class="noSurveyContp1">{{obj.msg}}</p>
      <button class="commonBtn" @click="toHome">{{obj.tabText}}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      obj: {
        msg: "系统错误，请联系管理员",
        name: "tabs",
        tabText: "去看看其他问卷",
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
    // 4 5 6 开红包之后的回调 手拉手返回的 status
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
  background: #efeff4;
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
  margin: 40px 0;
  font-size: 28px;
  color: #a9a9a9;
}
</style>
