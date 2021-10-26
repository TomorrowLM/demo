<template>
  <div>
    <div class="dis">
      <div class="name nowrap" :style="{'color': clickSurveyIds.includes(list.surveyId) ? '#bbb' : ''}">{{list.surveyName}}</div>
      <div class="people">{{list.remainNum}}</div>
    </div>
    <a class="btn" @click="goQuestion(list.surveyId)">立即答题</a>
    <div class="price">
      <!--最高金币-->
      <span>{{list.gold}}</span>
    </div>
  </div>
</template>
<script>
import common from "../../api/common";
// import $ from "jquery";
export default {
  name: "list",
  components: {},
  props: {
    list: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      clickSurveyIds: []
    };
  },
  created() {
    this.clickSurveyIds = localStorage.getItem('clickSurveyIds') ? JSON.parse(localStorage.getItem('clickSurveyIds')) : []
  },
  methods: {
    goQuestion(surveyId) {
      if (!this.clickSurveyIds.includes(surveyId)) {
        this.clickSurveyIds.push(surveyId)
        localStorage.setItem('clickSurveyIds', JSON.stringify([ ...this.clickSurveyIds ]))
      }
      common.is_can_answer(surveyId).then(data => {
        console.log(data, "是否可以答题");
        if (data.data.isCanAnswer) {
          if (data.data.appSurveyWelcomePageVO.hasWelcome == 0) {
            //没有欢迎页
            if (data.data.appSurveyWelcomePageVO.hasBeforeQuestion == 0) {
              //没有前置问卷
              window.open(data.data.surveyUrl);
            } else {
              this.$router.push({
                name: "BeforeAnswerPage",
                params: { surveyId: surveyId }
              });
            }
          } else {
            this.$router.push({
              name: "QuestionPage",
              params: { surveyId: surveyId }
            });
          }
        } else {
          // $toast.show("您已经答过此问卷")
          if (data.data.code == 5) {
            $toast.show("请完善基本信息后再答题", 2000);
            localStorage.setItem("userpageIndex", 3);
            this.$router.push({ name: "UserPage" }); //跳转完善基本信息页面
          } else {
            this.$router.push({
              name: "UnqualifiedPage",
              params: { msg: data.data.msg }
            });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin size($w: 100%, $h: 100px) {
  width: $w;
  height: $h;
}

.dis {
  float: left;
  position: absolute;
  left: 10px;
  right: 360px;
  .name {
    font-size: 16px;
    color: #666;
    margin: 0px 30px 15px 0;
  }
  .people {
    font-size: 12px;
    color: #bbb;
  }
}
.price {
  float: right;
  font-size: 20px;
  color: #e64340;
  padding-right: 40px;
  height: 52px;
  line-height: 52px;
  // span {
  //   font-size: 40px;
  //   margin-right: 5px;
  // }
}
.btn {
  float: right;
  margin-top: 5px;
  width: 152px;
  text-align: center;
  height: 44px;
  line-height: 44px;
  border: 1px solid #7575f9;
  border-radius: 6px;
  font-size: 16px;
  color: #7575f9;
  background-color: #fff;
  padding: 0;
  cursor: pointer;
}

.footer {
  width: 100%;
  margin: 80px 0 25px;
}
</style>

