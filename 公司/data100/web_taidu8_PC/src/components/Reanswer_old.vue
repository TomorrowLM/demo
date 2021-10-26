<template>
  <div class="reanswer">
    <com-header v-if="isHeader"></com-header>
    <img src="../../static/images/que_img_justice.png" alt />
    <div class="rull">
      <p>严格遵守平台规则</p>
      <p>打造积极向上的平台环境需要我们共同参与</p>
      <p>利用多页面进行刷题等行为是平台严厉禁止的</p>
      <p>如有疑问，请截图此页面联系管理员</p>
      <p>
        问卷ID:
        <span>{{surveyId}}</span>
      </p>
      <p></p>
    </div>
    <button class="com_btn" @click="goLists">去看看其他问卷</button>
  </div>
</template>

<script>
import common from "../api/common";
export default {
  name: "reanswer",
  data() {
    return {
      isHeader: true,
      surveyId:""
    };
  },
  created() {
    this.surveyId = this.$route.params.surveyId
  },

  methods: {
     goLists() {
      this.$router.replace({ name: "SurveyList" });
    },
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
    width: 153px;
  }
  .rull {
    p {
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(5) {
        font-size: 15px;
        color: #333;
        line-height: 23px;
      }
      &:nth-child(5) {
        margin-top: 20px;
        span {
          color: #8d97b5;
        }
      }
      &:nth-child(3) {
        margin-top: 12px;
      }
      &:nth-child(3),
      &:nth-child(4) {
        font-size: 12px;
        color: #888;
        line-height: 20px;
      }
    }
  }

  .com_btn {
    margin-top: 40px;
  }
}
</style>
