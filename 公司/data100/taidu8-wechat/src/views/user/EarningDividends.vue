<template>
  <div class='earning_dividends' v-if="earnDividendData">
    <div class="scroller">
      <div class="title">~ 邀请好友答问卷 ~</div>
      <div class="earn_gold">赚每份最高<span>{{ earnDividendData.gold }}</span>金币分红</div>
      <div class="share_tips">{{ earnDividendData.shareSuccessRateInfo }}</div>
      <van-button
        class="make_money_now"
        color="linear-gradient(to right, #AB64F5, #6C63FF)"
        type="default"
        round
        @click="backSurveyOne"
      >立即邀友赚钱</van-button>
      <div class="how_make_money">
        <dl v-for="(item, index) in earnDividendData.getGoldMethod" :key="index">
          <dt>
            <img class="icon" :src="item.imageUrl" alt="">
            <p class="or" v-if="index < earnDividendData.getGoldMethod.length - 1">或</p>
            <!-- <img v-if="index < earnDividendData.getGoldMethod.length - 1" class="plus" src="../../assets/images/user/plus_ic.png" alt=""> -->
          </dt>
          <dd>
            {{ item.message }}
          </dd>
        </dl>
      </div>
      <div class="who_is_invited">
        <dl v-for="(item, index) in earnDividendData.inviteUser" :key="index">
          <dt>
            <img class="icon" :src="item.imageUrl" alt="">
            <p class="or" v-if="index < earnDividendData.inviteUser.length - 1">或</p>
            <!-- <img v-if="index < earnDividendData.inviteUser.length - 1" class="plus" src="../../assets/images/user/plus_ic.png" alt=""> -->
          </dt>
          <dd>
            {{ item.message }}
          </dd>
        </dl>
      </div>
      <div class="who_is_rules">
        <ul>
          <li v-for="(msg, index) in earnDividendData.rule" :key="index">
            <span>{{ index + 1 }}</span>
            <p>{{ msg }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InviteFriends',
  data () {
    return {
    }
  },
  computed: {
    earnDividendData () {
      return this.$store.getters.earnDividendData
    }
  },
  created () {
    const { dispatch } = this.$store
    dispatch('GetEarnDividendTabInfo')
  },
  methods: {
    backSurveyOne() {
      sessionStorage.setItem('tabIndex', 'index')
      sessionStorage.setItem("survey_name", "history");
      this.$router.push('/surveyOne')
    }
  }
}
</script>

<style lang='less' scoped>
//@import url()
.earning_dividends{
  height: 100%;
  position: relative;
  overflow-y: scroll;
  padding-bottom: 40px;
  .title{
    font-size: 30px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #916BFF;
    line-height: 42px;
    text-align: center;
    margin: 40px 0 30px 0;
  }
  .earn_gold{
    font-size: 48px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: @title-gray1;
    line-height: 66px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    span{
      width: 120px;
      height: 72px;
      line-height: 72px;
      background: #F4F4F4;
      border-radius: 12px;
      display: block;
      color: @violet;
      margin: 0 20px;
    }
  }
  .share_tips{
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8D97B5;
    line-height: 34px;
    text-align: center;
    margin: 30px 0;
  }
  .make_money_now{
    width: 440px;
    display: block;
    margin: 0 auto;
  }
  .how_make_money, .who_is_invited, .who_is_rules{
    width: 690px;
    height: 304px;
    background: #F3F3FE;
    border-radius: 12px;
    margin: 80px auto 0;
    position: relative;
    display: flex;
    padding: 70px 50px 0 50px;
    &::before{
      content: '如何赚取分红？';
      width: 420px;
      height: 116px;
      position: absolute;
      background: url('../../assets/images/user/invitation_title_bg.png') no-repeat;
      background-size: cover;
      top: -46px;
      left: 18%;
      font-size: 28px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #FFFFFF;
      text-align: center;
      line-height: 98px;
      padding-left: 40px;
      box-sizing: border-box;
    }
    dl{
      flex: 1 0;
      padding: 0 10px;
      dt{
        width: 100%;
        position: relative;
        .icon{
          width: 128px;
          height: 128px;
          display: block;
          margin: 0 auto;
        }
        .or{
          width: 24px;
          height: 24px;
          position: absolute;
          right: -22px;
          top: 36px;
          color: #6565C5;
          font-size: 24px;
        }
      }
      dd{
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #6565C5;
        line-height: 34px;
        text-align: center;
      }
    }
    ul{
      li{
        display: flex;
        align-items: center;
        margin: 20px 0;
        span{
          width: 40px;
          height: 40px;
          line-height: 40px;
          border-radius: 20px;
          text-align: center;
          color: #fff;
          font-size: 24px;
          background: linear-gradient(180deg, #AB64F5 0%, #6C63FF 100%);
          margin-right: 20px;
        }
        p{
          flex: 1 0;
          font-size: 24px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #6565C5;
          line-height: 32px;
        }
      }
    }
  }
  .who_is_invited{
    &::before{
      content: '都可以邀请谁？';
    }
  }
  .who_is_rules{
    height: auto;
    padding-bottom: 30px;
    &::before{
      content: '都有哪些规则？';
    }
  }
}
</style>