<template>
  <div class='survey_front' v-if="shareInfo.surveyName">
    <div class="survey_front_content">
      <div class="survey_front_answer">
        <dl>
          <dt><img :src="shareInfo.shareUserHeadImgUrl" alt=""></dt>
          <dd><span>您的好友</span><a>{{ shareInfo.shareUserName }}</a><br/><span>邀请您参与问卷：</span></dd>
        </dl>
        <p class="title van-multi-ellipsis--l3">{{ shareInfo.surveyName }}</p>
        <van-button type="primary" round block class="start_answer" @click="startAnswer">开始答题</van-button>
      </div>
      <div class="survey_front_reward">
        <i class="coloured_ribbon_ic1"></i>
        <i class="coloured_ribbon_ic2"></i>
        <h3 class="title_tips">（100金币=1元）</h3>
        <van-empty description="暂无数据" v-if="!shareInfo.list || shareInfo.list.length === 0" />
        <van-cell v-for="item of shareInfo.list" :key="item.time" :value="item.gold + '金币'">
          <template #icon>
            <img class="head_portrait" :src="item.headImgUrl" alt="">
          </template>
          <template #title>
            <span class="custom-title">
              <div class="nick_name van-ellipsis">{{ item.nickName }}</div>
              <van-tag type="danger" color="#C9A2EC" text-color="#fff" v-if="shareInfo.shareUserId === item.userId">好友</van-tag>
            </span>
          </template>
        </van-cell>
      </div>
    </div>
  </div>
</template>

<script>
import { getSurveyShareInfo, is_can_answer } from '@/api/survey';
import { getUrlFirst } from "@/utils/base";

export default {
  name: 'SurveyFront',
  data () {
    return {
      shareInfo: {}
    }
  },
  created () {
    this.getSurveyShareInfo()
  },
  methods: {
    async getSurveyShareInfo() {
      const { shareUserId, surveyId, userId } = getUrlFirst(this.$route.fullPath)
      const { data } = await getSurveyShareInfo({ shareUserId, surveyId, userId })
      this.shareInfo = data
    },
    startAnswer () {
      const params = getUrlFirst(this.$route.fullPath)
      delete params.NickName
      is_can_answer(params).then(({ data }) => {
        if (data.isCanAnswer) {
          if (data.appSurveyWelcomePageVO.hasWelcome == 0) {
              //没有欢迎页
              if (data.appSurveyWelcomePageVO.hasBeforeQuestion == 0) {
                //没有前置问卷
                window.location.href = data.surveyUrl;
              } else {
                //有前置问卷
                this.$router.replace({
                  name: "BeforeQuestion",
                  params: { surveyId: String(data.surveyId) },
                  query: params
                });
              }
            } else {
              //有欢迎页
              // this.$router.replace({ name: "SurveyDetail" });
              data.shareUserId = params.shareUserId;
              this.$router.replace({
                name: "SurveyDetail",
                params: {
                  surveyId: String(data.surveyId)
                },
                query: params
              });
            }
        } else {
          if (params.wechatShare === '1') {
            if (
              data.code === 1 ||
              data.code === 2 ||
              data.code === 3 ||
              data.code === 4 ||
              data.code === 7
            ) {
              // 1已答过此问卷 2问卷已下线 3问卷已抢光 4问卷已结束
              data.name = "tabs";
              data.surveyId = params.surveyId;
              this.$router.push({
                name: "SurveyUnqualified",
                params: { data: JSON.stringify(data) }
              });
            } else if (data.code === 6) {
              // 6绑定手机号
              this.$router.push({
                name: "BindPhone",
                query: { flag: "2", token: this.$ls.get("token") }
              });
            } else if (data.code === 5) {
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
                query: { msg: data.msg }
              });
            }
          } else {
            window.location.href = `${window.location.origin}/common/share/#/datedSurvey/${data.code}/survey/${data.msg}`
          }
        }
      })
    }
  },
}
</script>

<style lang='less' scoped>
//@import url()
.survey_front{
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #AB64F5 0%, #2000C1 100%);
  overflow: auto;
  &_content{
    width: 100%;
    background: url('../../assets/images/survey/survey_front_bg.png') no-repeat;
    background-size: cover;
    padding: 40px 0;
  }
  &_answer{
    width: 690px;
    height: 458px;
    background: url('../../assets/images/survey/survey_front_top_bg.png') no-repeat;
    background-size: cover;
    margin: 0 auto 120px;
    dl{
      display: flex;
      align-items: center;
      height: 112px;
      padding: 0 70px;
      dt{
        width: 64px;
        height: 64px;
        border-radius: 50%;
        margin-right: 20px;
        overflow: hidden;
        img{
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      dd{
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: @title-gray1;
        span{
          display: inline-block;
          vertical-align: middle;
        }
        a{
          color: @violet;
          padding: 0 10px;
          max-width: 200px;
          display: inline-block;
          vertical-align: middle;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .title{
      width: 80%;
      height: 130px;
      font-size: 32px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: @title-gray1;
      line-height: 44px;
      justify-content: center;
      display: flex;
      align-items: center;
      margin: 0 auto;
    }
    .start_answer{
      width: 440px;
      height: 90px;
      background: linear-gradient(180deg, #FFFFE7 0%, #FFB45E 100%);
      box-shadow: 0px 5px 10px 0px rgba(166, 0, 0, 0.2);
      border: none;
      color: #D03434;
      margin: 90px auto 0;
      font-family: PingFangSC-Medium, PingFang SC;
    }
  }
  &_reward{
    width: 690px;
    min-height: 600px;
    border-radius: 20px;
    margin: 0 auto;
    background: #fff;
    position: relative;
    padding-bottom: 40px;
    &::before{
      content: '大家获得的奖励';
      width: 440px;
      height: 102px;
      background: url('../../assets/images/survey/survey_front_title_bg.png') no-repeat;
      background-size: cover;
      position: absolute;
      left: 0;
      right: 0;
      top: -70px;
      margin: 0 auto;
      font-size: 28px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #FFFFFF;
      text-align: center;
      line-height: 76px;
      z-index: 99;
    }
    .coloured_ribbon_ic1{
      content: '';
      width: 48px;
      height: 32px;
      background: url('../../assets/images/survey/coloured_ribbon_ic1.png') no-repeat;
      position: absolute;
      left: -24px;
      top: 158px;
      z-index: 99;
    }
    .coloured_ribbon_ic2{
      content: '';
      width: 62px;
      height: 38px;
      background: url('../../assets/images/survey/coloured_ribbon_ic2.png') no-repeat;
      position: absolute;
      right: -30px;
      top: 320px;
      z-index: 99;
    }
    .title_tips{
      color: #F5A623;
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      text-align: center;
      padding-top: 30px;
    }
    .head_portrait{
      width: 96px;
      height: 96px;
      margin-right: 20px;
      border-radius: 50%;
    }
    /deep/ .van-cell{
      align-items: center;
    }
    /deep/ .van-cell__value{
      color: @taidu8-red;
      font-size: 15px;
      font-family: PingFangSC-Regular, PingFang SC;
    }
    /deep/ .van-cell__title{
      position: relative;
    }
    /deep/ .custom-title{
      color: @title-gray1;
      font-size: 30px;
      font-family: PingFangSC-Regular, PingFang SC;
      display: flex;
      .nick_name{
        max-width: 300px;
      }
    }
    /deep/ .van-tag{
      position: relative;
      left: 10px;
      bottom: 1px;
      flex-shrink: 0;
    }
  }
}
</style>