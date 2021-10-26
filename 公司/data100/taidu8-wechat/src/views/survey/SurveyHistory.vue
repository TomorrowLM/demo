<template>
  <div class="survey_one">
    <div class="tips_bg" v-if="shareTips!==''">{{shareTips}}</div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <empty tips="您还未完成问卷" v-if="isEmpty===1">
        <p>赶紧去参与问卷领奖励吧</p>
      </empty>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-else>
        <van-cell v-for="(item,index) in list" :key="index">
          <Survey :item="item"></Survey>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import Survey from "./Survey";
import { mixin } from "@/utils/mixin/list";
import { partition_survey, surveyMarkedWordsCommon } from "@/api/survey.js";
export default {
  components: {
    Survey
  },
  mixins: [mixin],
  data() {
    return {
      isPull: true,
      shareTips: ""
    };
  },
  created() {
    surveyMarkedWordsCommon({}).then(res => {
      this.shareTips = res.data;
    });
  },
  methods: {
    getList() {
      return partition_survey({
        page: this.page,
        limit: this.limit,
        surveyChannelCode: "0", //二区问卷的渠道码
        type: 3 //0:一区问卷、1：二区问卷列表 2：pc问卷列表 3：历史问卷（上拉加载）
      });
    }
  }
};
</script>

<style lang='less' scoped>
//@import url()
.survey_one {
  height: 100%;
  .van-pull-refresh {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .tips_bg{
    text-align:left;
    padding:15px 20px;
     border-radius: 15px;
  }
  .tips_bg:after {
    top: -10px;
    left: 586px;
  }
}
</style>