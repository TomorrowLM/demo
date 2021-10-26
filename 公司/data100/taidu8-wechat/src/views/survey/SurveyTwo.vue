<template>
  <div class="survey_two">
    <van-pull-refresh v-model="isLoading" @refresh="getChannelList">
      <div v-if="isEmpty===0" class="channelList">
        <ul
          v-for="(channel,index) in channelList"
          :key="index+'channel'"
          @click.stop="goAnswer(channel)"
        >
          <li>
            <img :src="channel.icon" alt />
          </li>
          <li>{{channel.showName}}</li>
        </ul>
      </div>
      <empty tips="问卷被抢光啦!" v-else>
        <p>过会再来看看吧</p>
      </empty>
    </van-pull-refresh>
  </div>
</template>

<script>
import { survey_api_channel, isHaveBasicInfo } from "@/api/survey.js";
import { mixin } from "@/utils/mixin/list";
export default {
  components: {},
  mixins: [mixin],
  data() {
    return {
      isLoading: false, //是否加载
      channelList: [],
      emptyImg: require("../../assets/images/img_empty_noque.png"),
      isList: 0, //是否在二级列表内 0:否  1：是
      isEmpty: -1
    };
  },
  created() {
    this.getChannelList();
  },
  methods: {
    getChannelList() {
      survey_api_channel({}).then(res => {
        if (res.data.length > 0) {
          this.isEmpty = 0;
        } else {
          this.isEmpty = 1;
        }
        this.channelList = res.data;
        this.isLoading = false;
      });
    },
    async goAnswer(channel) {
      const { data } = await isHaveBasicInfo()
      if (data.isHaveBasicInfo === '1') {
        this.$router.replace({
          name: "UserInfoTips",
          query: { isList: channel.isList, channelCode: channel.channelCode, surveyId: channel.surveyId }
        });
      } else {
        this.$router.replace({
          name: "BasicInformation",
          query: { token: this.$ls.get("token") }
        });
      }
    }
  }
};
</script>

<style lang='less' scoped>
//@import url()

.survey_two {
  width: 100%;
  height: 100%;
  .van-pull-refresh {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .channelList {
    box-sizing: border-box;
    padding: 30px 20px;
    width: 100%;
    height: auto;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    ul {
      margin: 30px 67px;
      overflow: hidden;
    }
    li:nth-child(1) {
      width: 100px;
      height: 115px;
    }
    img {
      width: 100px;
      height: auto;
    }
    li:nth-child(2) {
      font-size: 30px;
      color: @title-gray1;
    }
  }
}
</style>