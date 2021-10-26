<template>
  <div class="qustion">
    <com-header></com-header>
    <div class="content">
      <div class="title">{{surveyDetails.surveyName}}</div>

      <div class="introduce">
        <ul class="info">
          <li>{{surveyDetails.guide}}</li>
          <li>
            <div class="name">本次奖池</div>
            <div class="money">
              最高
              <span>{{surveyDetails.appSurveyWelcomePageVO.gold}}</span>金币
            </div>
          </li>
        </ul>
        <a
          class="btn"
          v-if="surveyDetails.appSurveyWelcomePageVO.hasBeforeQuestion == 0"
          :href="surveyDetails.surveyUrl"
          target="_blank"
          @click="goAnswer"
        >开始答题</a>
        <!-- <a class="btn" v-else  @click="goAnswer">开始答题</a> -->
        <router-link
          class="btn"
          target="_blank"
          v-else
          :to="{ name: 'BeforeAnswerPage', params: { surveyId:surveyDetails.surveyId }}"
        >开始答题</router-link>
        <div class="rule" @click="goRules">
          <div class="img">
            <img src="../../static/images/ic-rules.png" alt />
          </div>
          <span>规则：答问卷，抽取随机奖励</span>
          <div class="img imgr">
            <img src="../../static/images/ic-what.png" alt />
          </div>
        </div>
      </div>
      <div class="nameList">
        <div class="btn">获奖名单</div>
        <div class="list" v-if="awardLists.length>0">
          <ul>
            <li v-for="(item,index) in awardLists" :key="index">
              <div class="win_top">
                <div class="img">
                  <img v-if="item.headImgUrl" :src="item.headImgUrl" alt />
                  <img v-else src="../../static/images/integral_user_norimg.png" alt />
                </div>
                <div class="dis">
                  <h4>
                    <p>{{item.nickName}}</p>
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
              <!-- <div class="win_bot" v-if="item.detail!=''">
                <p>明细：</p>
                <p v-html="item.detail"></p>
              </div>-->
            </li>
          </ul>
        </div>
        <empty v-else msg="暂无获奖者,赶快答题获奖吧!"></empty>
      </div>
    </div>
    <div class="modal" v-if="isRule">
      <div class="rules">
        <div class="close" @click="closeRules">
          <img src="../../static/images/btn-close.png" alt />
        </div>
        <div class="top"></div>
        <div class="rule_content" v-html="surveyDetails.rule"></div>
      </div>
    </div>
  </div>
</template>

<script>
import common from "../api/common";
import url from "../api/url";
export default {
  name: "agree",
  data() {
    return {
      isRule: true, //规则弹框
      surveyDetails: null, //问卷详情
      awardLists: []
    };
  },
  created() {
    console.log(localStorage.getItem("isRule"));
    this.surveyDetails = JSON.parse(localStorage.getItem("surveyDetails"));
    console.log(this.surveyDetails, "问卷详情");
    common.completed_survey_award(this.surveyDetails.surveyId).then(data => {
      console.log(data);
      this.awardLists = data.data;
    });
    if (localStorage.getItem("isRule") == null) {
      this.isRule = true;
    } else {
      this.isRule = false;
    }
  },
  mounted() {
    localStorage.setItem("isRule", true);
  },
  methods: {
    goRules() {
      this.isRule = true;
    },
    closeRules() {
      this.isRule = false;
    },
    goAnswer() {
      if (this.surveyDetails.appSurveyWelcomePageVO.hasBeforeQuestion == 0) {
        this.$nextTick(() => {
          this.$router.replace({ name: "SurveyList" });
        });

        //无前置问卷
        // this.$router.push({
        //   name: "AnswerPage",
        //   params: {
        //     surveyUrl: this.surveyDetails.surveyUrl+ "&state="+localStorage.getItem("userInfo")
        //   }
        // });
      } else if (
        this.surveyDetails.appSurveyWelcomePageVO.hasBeforeQuestion == 1
      ) {
        // //有前置问卷
        //  this.$nextTick(() => {
        //   this.$router.replace({ name: "SurveyList" });
        // });
        // this.$router.replace({
        //   name: "BeforeAnswerPage",
        //   params: { surveyId: this.surveyDetails.surveyId }
        // });
      }
    }
  }
};
</script>

<style scoped lang="scss">
@mixin size($w: 100%, $h: 100px) {
  width: $w;
  height: $h;
}
@mixin font($size: 16px, $color: #333) {
  font-size: $size;
  color: $color;
}
.qustion {
  padding: 80px 0 30px;
  background: #ededed;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  .modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    @include size(100%, 100%);
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 22;
    padding-top: 160px;
    box-sizing: border-box;
    .rules {
      width: 42%;
      left: 29%;
      min-height: 50px;
      background: #fff;
      border-radius: 4px;
      position: relative;
      .close {
        position: absolute;
        top: -12px;
        right: -12px;
        @include size(24px, 24px);
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
      .top {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        @include size(100%, 50px);
        background: linear-gradient(to right, #ffa733, #ffde17);
      }
      .rule_content {
        padding: 10px 20px;
        color: #666;
        line-height: 30px;
      }
    }
  }
}
.content {
  min-height: 418px;
  width: 750px;
  margin: 0 auto;
  background: url(../../static/images/bg-head-inf-que.jpg) no-repeat;
  padding-top: 300px;
  .title {
    font-size: 20px;
    color: #fff;
    text-align: center;
    line-height: 50px;
  }
  .introduce {
    width: 740px;
    background: #fff;
    margin: 0 auto;
    border-radius: 4px;
    overflow: hidden;
    padding: 0 10px;
    box-sizing: border-box;
    .info {
      width: 100%;
      height: 60px;
      li {
        float: left;
        text-align: center;
        &:nth-child(1) {
          width: 60%;
          color: #999;
          padding-top: 15px;
        }
        &:nth-child(2) {
          width: 40%;
          .name {
            background: #ffa733;
            height: 20px;
            line-height: 20px;
            color: #fff;
          }
          .money {
            font-size: 14px;
            // color: #333;
            color: #e1544a;
            span {
              display: inline-block;
              margin-right: 3px;
              font-size: 30px;
              // color: #e1544a;
            }
          }
        }
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 44px;
      line-height: 44px;
      border: 1px solid #ffa733;
      color: #ffa733;
      border-radius: 4px;
      font-size: 18px;
      text-align: center;
      margin-top: 10px;
      cursor: pointer;
    }
    .rule {
      margin: 20px 0 0 -10px;
      width: 100%;
      height: 30px;
      padding: 0 10px;
      color: #999;
      background: #f6f6f6;
      text-align: center;
      cursor: pointer;
      .img {
        width: 15px;
        height: 15px;
        line-height: 15px;
        display: inline-block;
        vertical-align: middle;
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
      .img.imgr {
        float: right;
        margin-top: 8px;
      }
      span {
        line-height: 30px;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
  .nameList {
    width: 740px;
    background: #fff;
    margin: 20px auto 0;
    border-radius: 4px;
    overflow: hidden;
    .btn {
      background: linear-gradient(to right, #ffa733, #ffde17);
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      color: #fff;
      text-align: center;
    }
    ul {
      background: #f6f6f6;
      li {
        margin-top: 20px;
        overflow: hidden;
        padding: 15px 10px;
        background: #fff;
        border-radius: 4px;
        .win_top {
          width: 100%;
          overflow: hidden;
          // padding-bottom: 15px;
          // border-bottom: 1px solid #ddd;
          position: relative;
          .img {
            float: left;
            @include size(48px, 48px);
            text-align: center;
            line-height: 48px;
            img {
              vertical-align: middle;
              max-width: 100%;
              max-height: 100%;
            }
          }
          .dis {
            float: left;
            position: absolute;
            left: 58px;
            right: 10px;
            h4 {
              overflow: hidden;
              font-weight: normal;
              @include font(16px, #666);
              p {
                &:nth-child(1) {
                  float: left;
                }
                &:nth-child(2) {
                  float: right;
                }
                span {
                  color: #e64340;
                  margin-left: 5px;
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
    }
  }
}
</style>
