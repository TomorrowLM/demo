<template>
  <div class="surveyList">
    <com-header headerIndex="1"></com-header>
    <div class="content">
      <div class="con_left">
        <tab :tabData="tabData" @actived="getActived"></tab>
        <!-- 寻智囊 -->
        <first-area v-if="isFlag==0"></first-area>

        <!-- 问英雄 -->
        <second-area v-if="isFlag==1"></second-area>
        <!-- 访贤才 
        <survey-talents v-if="isFlag==2"></survey-talents>-->
        <!-- 电脑问卷 -->
        <!-- <computer-area v-if="isFlag==2"></computer-area> -->

        <!-- 历史问卷 -->
        <completed-area v-if="isFlag==2"></completed-area>
      </div>
      <div class="con_right">
        <div class="winnerList common">
          <h3>
            <img src="../assets/que_ic_namelist.png" alt />
            <span>获奖名单</span>
          </h3>
          <ul>
            <swiper :options="swiperOption" style="height:200px">
              <swiper-slide v-for="(item,index) in awardLists" :key="index">
                <li>
                  <div class="win_top">
                    <div class="img">
                      <img v-if="item.headImgUrl" :src="item.headImgUrl" alt />
                      <img v-else src="../../static/images/integral_user_norimg.png" alt />
                    </div>
                    <div class="dis">
                      <h4>
                        <p class="nowrap">{{item.nickName}}</p>
                        <p>
                          奖励
                          <span>{{item.gold}}</span>
                        </p>
                      </h4>
                      <div class="time">
                        <img src="../../static/images/que_ic_time.png" alt />
                        <span>{{item.time}}</span>
                      </div>
                    </div>
                  </div>
                  <!-- v-if="item.detail!=''" -->
                  <!-- <div class="win_bot">
                    <p>明细：</p>
                    <p v-html="item.detail"></p>
                  </div>-->
                </li>
              </swiper-slide>
            </swiper>
          </ul>
        </div>
        <div class="question common">
          <h3>
            <img src="../assets/que_ic_qa.png" alt />
            <span>常见问题</span>
          </h3>
          <ol>
            <li v-for="(help,index) in help_lists" :key="index">
              <h4 class="nowrap">
                <p>{{help.title}}</p>
              </h4>
              <p>{{help.answer}}</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
    <div class="backtop" @click="backtop">返回顶部</div>
  </div>
</template>
<script>
import Tab from "./common/Tab";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import common from "../api/common";
// import url from "../api/url";
import FirstArea from "./FirstArea"; //寻智囊
import SecondArea from "./SecondArea"; //问英雄
import SurveyTalents from './SurveyTalents'; // 访贤才
import ComputerArea from "./ComputerArea"; //电脑问卷
import CompletedArea from "./CompletedArea"; //历史问卷
import { setInterval, setTimeout } from "timers";

export default {
  name: "surveylist",
  components: {
    Tab,
    swiper,
    swiperSlide,
    FirstArea,
    SecondArea,
    ComputerArea,
    CompletedArea,
    SurveyTalents
  },
  data() {
    return {
      swiperOption: {
        //swiper3
        autoplay: true,
        loop: true,
        speed: 500,
        direction: "vertical",
        slidesPerView: 2,
        // slidesPerGroup: 2,
        loopAdditionalSlides: 2,
        autoHeight: true,
        observer: true,
        observeParents: true
      },
      tabData: ["寻智囊", "问英雄", "历史问卷"],// ["寻智囊", "问英雄", "访贤才", "电脑问卷", "历史问卷"],
      isFlag: 0,
      isLogin: localStorage.getItem("userInfo") ? true : false,
      awardLists: JSON.parse(localStorage.getItem("awardLists")),
      help_lists: []
    };
  },
  created() {
    if (common.GetRequest().index != undefined) {
      this.isFlag = common.GetRequest().index;
    }
    common.help_list().then(data => {
      this.help_lists = data.data;
    });
  },

  methods: {
    backtop() {
      document.documentElement.scrollTop = 0;
    },
    getActived(index) {
      this.isFlag = index;
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
.surveyList {
  @include size(100%, 100%);
  box-sizing: border-box;
  padding-top: 80px;
}
.content {
  width: 100%;
  background: #f6f5f5;
  box-sizing: border-box;
  padding: 40px 7% 0;
  .con_left {
    float: left;
    @include size(66%, 100%);
    min-height: 600px;
    box-sizing: border-box;
    padding: 15px 4%;
    background: #fff;
    margin-bottom: 30px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
  }
  .con_right {
    float: left;
    @include size(31%, 100%);
    box-sizing: border-box;
    margin-left: 3%;
    margin-bottom: 30px;
    h3 {
      padding: 35px 0 20px;
      border-bottom: 1px solid #ddd;
      img {
        vertical-align: middle;
      }
      span {
        margin-left: 5px;
        @include font(18px, #333);
        font-weight: normal;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .common {
      padding: 0 25px 40px 25px;
      border-radius: 6px;
      background: #fff;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
    }
    ul {
      li {
        margin-top: 20px;
        overflow: hidden;
        padding: 15px 10px;
        background: #f6f6f6;
        border-radius: 4px;
      }
    }
    .win_top {
      width: 100%;
      overflow: hidden;
      position: relative;
      .img {
        float: left;
        @include size(48px, 48px);
        text-align: center;
        line-height: 48px;
        img {
          vertical-align: middle;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .dis {
        float: left;
        position: absolute;
        left: 58px;
        right: 1px;
        h4 {
          overflow: hidden;
          font-weight: normal;
          @include font(16px, #666);
          p {
            &:nth-child(1) {
              float: left;
              width: 70px;
            }
            &:nth-child(2) {
              float: right;
            }
            span {
              color: #e64340;
            }
          }
        }
        .time {
          margin-top: 10px;
          @include font(12px, #999);
          img {
            vertical-align: middle;
          }
        }
      }
    }
    .win_bot {
      border-top: 1px solid #ddd;
      @include size(100%, 32px);
      @include font(12px, #999);
      position: relative;
      padding-top: 15px;

      p {
        float: left;
        &:nth-child(2) {
          position: absolute;
          left: 36px;
          right: 0;
        }
      }
    }
  }
  .question {
    margin-top: 40px;
    li {
      border-bottom: 1px dashed #ddd;
      overflow: hidden;
      padding: 15px 0;
      h4 {
        height: 20px;
        line-height: 20px;
        font-weight: normal;
        padding-left: 30px;
        background: url(../../static/images/que_ic_q.png) no-repeat 0 center;
        p {
          @include font(16px #666);
        }
      }
      p {
        @include font(14px, #bbb);
      }
    }
  }
}
</style>
