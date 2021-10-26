<template>
  <div class="survey_one">
    <!--<div></div>-->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <empty tips="问卷被抢光啦!" v-if="isEmpty===1">
        <p>过会再来看看吧</p>
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
import { partition_survey } from "@/api/survey.js";
export default {
  components: {
    Survey
  },
  mixins: [mixin],
  data() {
    return {
      isPull: true,
      surveyChannelCode:""
    };
  },
  created() {
    this.surveyChannelCode = this.$route.params.channelCode
  },
  methods: {
    getList() {
      return partition_survey({
        page: this.page - 1,
        limit: this.limit,
        surveyChannelCode: this.surveyChannelCode+"", //二区问卷的渠道码
        type: 1 //0:一区问卷、1：二区问卷列表 2：pc问卷列表 3：历史问卷（上拉加载）
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
}
</style>