<template>
  <div class="reanswer">
    <com-header v-if="isHeader"></com-header>
    <img src="../../static/images/share_expired_img.png" alt />
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
      <p v-if="status==1||status==2||status==3"> 用户ID:
        <span>{{taidu8Id}}</span></p>
    </div>
    <button class="com_btn" @click="goLists">返回问卷列表</button>
  </div>
</template>

<script>
import common from "../api/common";
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
    this.status = this.$route.params.status;
    this.surveyId = this.$route.params.surveyId;
    if (this.status == 1 || this.status == 2 || this.status == 3) {
      this.finalGold = this.$route.params.finalGold;
      this.answerTime = this.$route.params.answerTime;
      this.taidu8Id = this.$route.params.taidu8Id;
    }
  },

  methods: {
    goLists() {
      this.$router.replace({ name: "SurveyList" });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.reanswer {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding-top: 100px;
  text-align: center;
  img {
    width: 280px;
  }
  .rull {
    p {
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        font-size: 15px;
        color: #333;
        line-height: 23px;
      }
      &:nth-child(3) {
        margin-top: 20px;
        span {
          color: #8d97b5;
        }
      }
      &:nth-child(2) {
        color:#888;
        span {
          font-size: 20px;
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
    margin-top: 40px;
  }
}
</style>
