<template>
  <div class="reanswer">
    <img src="../../assets/images/survey/share_expired_img.png" alt />
    <div class="rull">
      <p>您已回答过此问卷</p>
      <p v-if="status==1||status==2||status==3">
        {{answerTime}}&nbsp;&nbsp;&nbsp; 已获得奖励
        <span>{{finalGold}}</span>金币
      </p>
      <p v-if="status==4">答题人数已满，未获得问卷奖励</p>
      <p v-if="status==5">相同条件用户已答题，未获得问卷奖励</p>
      <p v-if="status==6">超过答题期限，未获得问卷奖励</p>
      <p v-if="status==7">不符合答题条件，未获得问卷奖励</p>
      <p>
        问卷ID:
        <span>{{surveyId}}</span>
      </p>
      <p  v-if="status==1||status==2||status==3" >用户ID:
        <span>{{taidu8Id}}</span></p>
    </div>
    <div class="com_btn" @click="goLists">返回问卷列表</div>
  </div>
</template>

<script>
export default {
  name: "reanswer",
  data() {
    return {
      isHeader: true,
      surveyId: "",
      finalGold: "",
      answerTime: "",
      status: "",
      taidu8Id:""

    };
  },
  created() {
    this.status = this.$route.query.status;
    this.surveyId = this.$route.query.surveyId;
    if (this.status == 1 || this.status == 2 || this.status == 3) {
      this.finalGold = this.$route.query.finalGold;
      this.answerTime = this.$route.query.answerTime;
      this.taidu8Id = this.$route.query.taidu8Id;
    }
  },

  methods: {
    goLists() {
      this.$router.replace({ name: "tabs" });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.reanswer {
  width: 100%;
  // max-width: 640px;
  margin: 0 auto;
  padding-top: 120px;
  text-align: center;
  img {
    width: 460px;
  }
  .rull {
    p {
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3),&:nth-child(4) {
        font-size: 30px;
        color: #333;
        line-height: 60px;
      }
      &:nth-child(3) {
        margin-top: 40px;
        span {
          color: #8d97b5;
        }
      }
      &:nth-child(2) {
        color: #888;
        span {
          font-size: 40px;
          color: #c11616;
        }
      }

      // &:nth-child(3),
      // &:nth-child(4) {
      //   font-size: 12px;
      //   color: #888;
      //   line-height: 20px;
      // }
    }
  }

  .com_btn {
    margin: 80px auto;
    border-radius: 45px;
    width: 690px;
    height: 90px;
    line-height: 90px;
    background: #7575f9;
    color: #fff;
    font-size:32px;
  }
}
</style>
