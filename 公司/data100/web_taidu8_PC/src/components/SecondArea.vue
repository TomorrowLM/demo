<template>
  <div>
    <!-- 问英雄 -->
    <ul class="ask" v-show="!isAskList && !showUserInfo">
      <li
        v-for="(item,index) in askDatas"
        :key="index"
        @click="goAskList(index,item.isList,item.channelCode,item.surveyId)"
      >
        <p>{{item.showName}}</p>
        <img src="../assets/que_hero_ic_go.png" alt />
        <span>
          <img :src="item.icon" alt />
        </span>
      </li>
    </ul>
    <div v-show="isAskList" class="lists">
      <div class="back">
        <p @click="backAsk">
          <span></span>返回
        </p>
      </div>
      <ul class="list" v-if="!isEmpty">
        <li v-for="item in lists" :key="item.id">
          <list :list="item"></list>
        </li>
      </ul>
      <div class="nomore" v-if="isNoMore">没有更多数据</div>
      <div class="loadmore" v-else @click="loadMore">加载更多</div>
      <empty v-if="isEmpty"></empty>
      <loading v-if="isPending"></loading>
    </div>
    <div v-show="showUserInfo" class="lists">
      <div class="back">
        <p @click="backAsk">
          <span></span>返回
        </p>
      </div>
      <UserInfoTips @on-continueAnswer='continueAnswer' />
    </div>
  </div>
</template>
<script>
import List from "./common/List";
import Empty from "./common/Empty";
import common from "../api/common";
import UserInfoTips from './UserInfoTips';

export default {
  name: "secondarea",
  components: {
    List,
    Empty,
    UserInfoTips
  },
  data() {
    return {
      page: 0,
      lists: [], //问英雄列表
      isPending: true, //是否加载中
      askDatas: [],
      isAskList: false, //问英雄
      showUserInfo: false,
      isEmpty: false,
      isNoMore: false,
      activeAsk: {}
    };
  },
  created() {
    common.survey_api_channel().then(data => {
    //   //隐藏问英雄光明顶  桃花岛  苍龙岭  幽兰涧
    //   let value=[]
    //   if(data.data){
    //     let arr=data.data
    //     arr.forEach(item => {
    //       if(item.channelCode!==4&&item.channelCode!==1&&item.channelCode!==12&&item.channelCode!==14){
    //         value.push(item)
    //       }
    //     });
    //   }
    //   this.askDatas = value;
         this.askDatas = data.data
    });
  },
  methods: {
    goAskList(index, isList, channelCode, surveyId) {
      common.isHaveBasicInfo().then(data => {
        if (data.data.isHaveBasicInfo === "1") {
          this.showUserInfo = true;
          this.activeAsk = { isList, channelCode, surveyId }
        } else {
          $toast.show("为了匹配更多适合您的问卷，请完善您的基本信息", 2000);
        }
      })
    },
    loadMore () {
      this.page += 1
      this.getPartitionSurvey()
    },
    getPartitionSurvey () {
      const { channelCode } = this.activeAsk
      common.partition_survey(String(channelCode), "1", this.page, "10")
      .then(data => {
        this.lists = [...this.lists, ...data.data.surveyList];
        if (this.lists.length == 0) {
          this.isEmpty = true;
        } else {
          this.isEmpty = false;
        }
        if (data.data.surveyList.length == 0) {
          this.isNoMore = true
        } else {
          this.isNoMore = false
        }
      })
      .then(() => {
        this.isPending = false;
      });
    },
    continueAnswer() {
      const { isList, channelCode, surveyId } = this.activeAsk
      common.add_surveychannel_record(String(channelCode));
      if (isList == 1) {
        this.showUserInfo = false;
        this.isAskList = true;
        this.getPartitionSurvey()
      } else if (isList == 0) {
        //无列表
        common.is_can_answer(surveyId).then(data => {
          console.log(data.data, "用户是否可以答题");
          this.showUserInfo = false;
          if (data.data.isCanAnswer) {
            // if (data.data.appSurveyWelcomePageVO.hasWelcome == 0) {
            //   //没有欢迎页
            //   if (data.data.appSurveyWelcomePageVO.hasBeforeQuestion == 0) {
            //     //没有前置问卷
            window.open(data.data.surveyUrl);
            // } else {
            //   this.$router.push({
            //     name: "BeforeAnswerPage",
            //     params: { surveyId: surveyId }
            //   });
            // }
            //   } else {
            //     this.$router.push({
            //       name: "QuestionPage",
            //       params: { surveyId: surveyId }
            //     });
            //   }
          } else {
            $toast.show(data.data.msg, 2000);
          }
        });
      }
    },
    backAsk() {
      //返回问英雄
      // console.log("返回问英雄");
      this.isAskList = false;
      this.isEmpty = false;
      this.lists = [];
      this.isPending = true;
      this.showUserInfo = false;
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin size($w: 100%, $h: 100px) {
  width: $w;
  height: $h;
}
@mixin font($size: 16px, $color: #333) {
  font-size: $size;
  color: $color;
}

.back {
  @include size(100%, 40px);
  line-height: 40px;
  border-bottom: 1px solid #ddd;
  color: #7575f9;
  p {
    width: 60px;
    cursor: pointer;
  }
  span {
    display: inline-block;
    @include size(10px, 10px);
    border-top: 2px solid #7575f9;
    border-left: 2px solid #7575f9;
    transform: rotate(-45deg);
    margin-left: 6px;
  }
}
.lists {
  position: relative;
}
.list {
  margin-top: 10px;
  li {
    padding: 30px 10px;
    border-bottom: 1px dashed #ddd;
    overflow: hidden;
    position: relative;
  }
}
.ask {
  margin-top: 10px;
  li {
    cursor: pointer;
    float: left;
    padding: 0 30px;
    margin-top: 30px;
    @include size(49%, 136px);
    line-height: 136px;
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid #ddd;
    border-radius: 4px;
    &:nth-child(even) {
      margin-left: 2%;
    }
    p {
      display: inline-block;
      @include font(16px, #666);
      vertical-align: middle;
    }
    img {
      vertical-align: middle;
      &:nth-child(2) {
        margin-left: 15px;
      }
    }
    span {
      float: right;
      vertical-align: middle;
      img {
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
