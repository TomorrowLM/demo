<template>
  <div class="survey" @click.stop="beginAnswer(item)">
    <div class="survey_img">
      <img v-if="item.isPc=='0'" src="../../assets/images/survey/que_listimg_xun.png" alt srcset />
      <img v-if="item.isPc=='1'" src="../../assets/images/survey/que_listimg_pc.png" alt srcset />
      <img class="lock_ic" v-if="item.isShowMaskLayer === 1" src="../../assets/images/survey/lock_ic.png" alt srcset />
    </div>
    <div class="survey_dis">
      <div class="name overflow_ellipsis" :style="{'color': clickSurveyIds.includes(item.surveyId) && type !== 'redPacket' ? '#a9a9a9' : ''}">{{item.surveyName}}</div>
      <div class="dis" v-if="item.remainNum==1">
        <span>{{item.time}}</span>
        已完成
      </div>
      <div class="dis" v-else>
        <span v-if="type !== 'redPacket'">{{item.time}}</span>
        {{item.remainNum}}
      </div>
    </div>
    <div class="shareBtn" v-if="item.type==3&&item.isCanShare ==1" @click.stop="goShare(item)">分享问卷赚金币</div>
    <div class="gold" v-if="item.type!=3">{{item.gold}}</div>
    <div class="novice_tag" v-if="item.isNovice === 1"><img src="../../assets/images/survey/novice_tag_ic.png" alt=""></div>
    <div class="rebate_tag" v-if="item.isShowRebate === 1" @click.stop="showDialog(item.showRebateMsg)"><img src="../../assets/images/survey/rebate_tag_ic.png" alt=""></div>
  </div>
</template>

<script>
import { is_can_answer, getWechatOauth } from "@/api/survey.js";
import { Dialog, Toast } from 'vant';

export default {
  components: {},
  props: {
    item: {
      type: Object,
      required: true
    },
    type: String
  },
  data() {
    return {
      clickSurveyIds: []
    };
  },
  created() {
    this.clickSurveyIds = this.$ls.get('clickSurveyIds', [])
  },
  methods: {
    showDialog(msg) {
      Dialog.alert({
        title: '标签释义',
        message: msg,
        messageAlign: 'left',
        confirmButtonText: '知道了',
        confirmButtonColor: "#7575f9"
      })
    },
    goShare(item) {
      if (item.isCanShare == 1) {
        //可以分享
        this.$router.push({
          name: "ShareGuide",
          params: { data:encodeURIComponent(JSON.stringify(item)) }
        });
      }
    },
    // 开始答题
    beginAnswer(item) {
      if (item.type == 3) { // 历史问卷
        return;
      }
      if (item.isShowMaskLayer === 1) {
        Toast('先完成新手问卷，会帮助你顺利通过商业问卷，赚取更多奖励哦～');
        return;
      }
      const isWX = navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
      if (isWX) {
        if (this.$ls.get("token")) { // 已经登录过的老用户(token有可能已过期，或者用户注销)
          if (item.isPc == "1") { // pc端答题 弹框提示
            this.$emit("showPc", true);
          } else {
            if (!this.clickSurveyIds.includes(item.surveyId)) {
              this.clickSurveyIds.push(item.surveyId)
              this.$ls.set('clickSurveyIds', [ ...this.clickSurveyIds ])
            }
            this.is_can_answer(item.surveyId, item.type);
          }
        } else { // 未登录过的用户
          getWechatOauth("?type=1");
        }
      } else {
        const isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (isIOS) {
          window.webkit.messageHandlers.clickQuestionnaire.postMessage(item.surveyId);
        } else {
          window.control.clickQuestionnaire(item.surveyId)
        }
      }
    },
    is_can_answer(surveyId, type) {
      if (type == 0) {
        //一区
        is_can_answer({
          surveyId: surveyId
        }).then(res => {
          if (res.data.isCanAnswer) {
            if (res.data.appSurveyWelcomePageVO.hasWelcome == 1) {
              //有欢迎页
              this.$router.push({
                name: "SurveyDetail",
                params: { surveyId: res.data.surveyId },
              });
            } else {
              //没有欢迎页
              // 判断是否有前置问卷
              if (res.data.appSurveyWelcomePageVO.hasBeforeQuestion == 0) {
                // 跳转到问卷页面
                window.location.href = res.data.surveyUrl;
              } else {
                // 跳转到前置问卷页面 param:surveyId
                this.$router.push({
                  name: "BeforeQuestion",
                  params: { surveyId: res.data.surveyId }
                });
              }
            }
          } else {
            // 失败问卷
            if (
              res.data.code === 1 ||
              res.data.code === 2 ||
              res.data.code === 3 ||
              res.data.code === 4
            ) {
              // 1已答过此问卷 2问卷已下线 3问卷已抢光 4问卷已结束
              res.data.name = "tabs";
              res.data.surveyId = surveyId;
              this.$router.push({
                name: "SurveyUnqualified",
                params: { data: JSON.stringify(res.data) }
              });
            } else if (res.data.code === 6) {
              // 6绑定手机号
              // res.data.name = "bindphone";
              // res.data.tabText = "去绑定";
              // this.$router.push({
              //   name: "Unqualified",
              //   params: { data: JSON.stringify(res.data) }
              // });
              this.$router.push({
                name: "BindPhone",
                query: { flag: "2", token: this.$ls.get("token") }
              });
            } else if (res.data.code === 5) {
              // 5完善基本信息
              const obj = {
                token: this.$ls.get("token")
              };
              this.$router.push({ name: "BasicInformation", query: obj });
            } else {
              // error
              this.$router.push({
                name: "Error",
                params: { data: this.$route.name },
                query: { msg: res.data.msg }
              });
            }
          }
        });
      } else if (type == 1) {
        //二区
        is_can_answer({
          surveyId: surveyId
        }).then(res => {
          if (res.data.isCanAnswer) {
            // 问卷正常
            window.location.href = res.data.surveyUrl;
          } else {
            // 失败问卷
            if (
              res.data.code === 1 ||
              res.data.code === 2 ||
              res.data.code === 3 ||
              res.data.code === 4
            ) {
              // 1已答过此问卷 2问卷已下线 3问卷已抢光 4问卷已结束
              res.data.name = "tabs";
              res.data.surveyId = surveyId;
              this.$router.push({
                name: "SurveyUnqualified",
                params: { data: JSON.stringify(res.data) }
              });
            } else if (res.data.code === 6) {
              // 6绑定手机号
              // res.data.name = "bindphone";
              // res.data.tabText = "去绑定";
              // this.$router.push({
              //   name: "Unqualified",
              //   params: { data: JSON.stringify(res.data) }
              // });
              this.$router.push({
                name: "BindPhone",
                query: { flag: "2", token: this.$ls.get("token") }
              });
            } else if (res.data.code === 5) {
              // 5完善基本信息
              this.$router.push({
                name: "BasicInformation",
                query: { token: this.$ls.get("token") }
              });
            } else {
              // error
              this.$router.push({
                name: "Error",
                params: { data: this.$route.name },
                query: { msg: res.data.msg }
              });
            }
          }
        });
      }
    }
  }
};
</script>

<style lang='less' scoped>
.survey {
  padding: 10px 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  .survey_img {
    width: 80px;
    margin-right: 20px;
    flex-shrink: 0;
    position: relative;
    img {
      width: 80px;
      height: 80px;
    }
    .lock_ic{
      width: 32px;
      height: 32px;
      position: absolute;
      left: 0;
      bottom: 14px;
    }
  }
  .survey_dis {
    flex: 1 0;
    overflow: hidden;
    .dis {
      color: @gray-a9;
      font-size: 24px;
      line-height: 30px;
      margin-top: 20px;
      span {
        display: inline-block;
        margin: 0 10px 0 0;
      }
    }
    .name {
      line-height:34px;
      color: @title-gray1;
      font-size: 28px;
    }
  }
  .gold {
    width: 200px;
    text-align: right;
    color: @taidu8-red;
    font-size: 30px;
    flex-shrink: 0;
    line-height:34px;
  }
  .novice_tag{
    width: 110px;
    height: 32px;
    position: absolute;
    right: 0;
    top: 64px;
    img{
      width: 100%;
      height: 100%;
      display: block;
      
    }
  }
  .rebate_tag{
    width: 70px;
    height: 32px;
    position: absolute;
    right: 0;
    top: 64px;
    img{
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .shareBtn {
    margin-top: 20px;
    width: 220px;
    height: 56px;
    line-height: 56px;
    border: @PX solid @taidu8-red;
    border-radius: 28px;
    text-align: center;
    font-size: 24px;
    color: @taidu8-red;
  }
}
</style>