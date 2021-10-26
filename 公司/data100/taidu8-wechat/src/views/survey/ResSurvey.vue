<template>
  <div class="res"></div>
</template>

<script>
import { respondSurvey } from "@/api/survey";
import { getUrl } from "../../utils/base";
export default {
  components: {},
  data() {
    return {};
  },
  created() {
    respondSurvey(getUrl()).then(res => {
      console.log(res)
      /**
       * code 2成功 3已答过此问卷 4sls
       * code2 status 1成功红包 2/3配额满被甄别红包
       * code4 status sls4/5/6
       * "finalAmount"总金额,"integral"积分,"multiple"积分倍数,"initAmount"红包金额,"appMultiple"APP倍数,
       */
      if (res.data.code == 2) {
        this.$router.replace({
          name: "RedPacket",
          params: { data: encodeURIComponent(JSON.stringify(res.data)) }
        });
      } else if (res.data.code == 3) {
        this.$router.replace({
          name: "Reanswer",
          query: {
            surveyId: res.data.surveyId,
            answerTime: res.data.detail.answerTime,
            finalGold: res.data.detail.finalGold,
            taidu8Id: res.data.taidu8Id,
            status: res.data.detail.status
          }
        });
      } else if (res.data.code == 4) {
        var obj = {
          msg: "",
          name: "tabs",
          tabText: "去看看其他问卷",
          surveyId: res.data.surveyId,
        };
        if (res.data.detail.status + "" === "6") {
          obj.msg = "很抱歉，您已超过此问卷的答题期限，下次早点来哦";
        } else if (res.data.detail.status + "" === "5") {
          obj.msg =
            "很抱歉，跟您相同条件的小伙伴已经抢先回答了问卷，请您下次早点过来抢问卷";
        } else if (res.data.detail.status + "" === "4") {
          obj.msg = "很抱歉，此问卷的答题人数已满，下次早点来哦";
        } else {
          obj.msg = "系统错误，请联系管理员";
        }
        this.$router.replace({
          name: "SurveyUnqualified",
          params: { data: JSON.stringify(obj) }
        });
      }else{
        //  this.$router.replace({ name: "Error", params: { data: "ResSurvey" } });
      }
    });
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
//@import url()
</style>