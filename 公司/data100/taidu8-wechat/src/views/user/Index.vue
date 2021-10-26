<template>
  <div class='user_box'>
    <div class="user_info_box">
      <div class="user_info">
        <div class="user_head">
          <img :src="userCoreInfo.headImgUrl" alt="">
        </div>
        <div class="info">
          <h3 class="van-ellipsis">{{ userCoreInfo.nickName }}</h3>
          <p class="id">ID: {{ userCoreInfo.userId }}</p>
          <div class="tag_box">
            <span class="grade">LV.{{ userCoreInfo.level }}</span>
            <span class="badge">{{ userCoreInfo.medal }} 徽章</span>
          </div>
        </div>
        <div class="gold_coin_box" v-if="userCoreInfo.userId">
          <h3>{{ userCoreInfo.gold }}</h3>
          <p>金币</p>
          <van-button class="withdrawal_btn" plain type="primary" @click="withdrawal">兑换</van-button>
        </div>
        <div class="credit_rating" @click="clickCredit">
          <div class="class-title">
            <i class="rating">{{ userCoreInfo.starInfo }}</i>
            <span class="title">信誉等级</span>
          </div>
          <div class="star">
            <!-- <van-rate
              :value="userCoreInfo.star"
              :count="userCoreInfo.star || 0"
              :size="18"
              readonly
              color="#FFD83C"
              void-icon="star"
              void-color="#eee"
            /> -->
            <img v-for="i in userCoreInfo.star" :key="i" src="../../assets/images/user/star@2x.png" alt="">   
          </div>
          <div class="class-score">
            <span>
              {{ userCoreInfo.reputation }}分
            </span>
          </div>
        </div>
      </div>
      <div class="improve_info">
        <div class="info" @click="pushPerfect">
          <div>
            <h3>{{ basicData.improveInfoText }}</h3>
            <p>已完善<span>{{ userCoreInfo.userLabelStep }}</span></p>
          </div>
          <img src="../../assets/images/user/improve_information_ic@2x.png" alt="">
        </div>
        <div class="center" @click="pushInvitationCenter">
          <div>
            <h3>{{ basicData.invitationCenterText }}</h3>
            <p>已邀请<span>{{ userCoreInfo.invitationNum }}</span>人</p>
          </div>
          <img src="../../assets/images/user/invitation_center_ic@2x.png" alt="">
        </div>
      </div>
    </div>
    <div class="guide_wx" v-if="userCoreInfo.isSubscribed!=1">
         <van-row type="flex" justify="space-between" align="center">
          <van-col>
            <van-row type="flex" align="center">
              <img src="../../assets/images/share/logo@2x.png" alt="" srcset="">
              <div>
                <h2>拼任务君公众号</h2>
                <p>点一下关注，提现不迷路</p>
              </div>
              </van-row>
          </van-col>
          <van-col>
            <van-button  class="btn" type="primary" round plain  url="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MjM5NjA5NTA4MA==&scene=110#wechat_redirect">关注</van-button>
          </van-col>
        </van-row>
      </div>
    <div class="scroller_box">
      <div class="banner_info">
        <h3>赚钱攻略</h3>
        <p>{{ basicData.downloadAppText }}</p>
        <van-button
          class="download_btn"
          color="linear-gradient(to right, #906bff, #5468ff)"
          type="default"
          :url="appPageUrl"
        >立即下载</van-button>
      </div>
      <div class="app_content">
        <dl v-for="(item, index) in basicData.appIntroduceList" :key="'content' + index">
          <dt><img :src="item.img" alt=""></dt>
          <dd @click="downloadApp">
            <h3>{{ item.title }}</h3>
            <p v-html="item.content"></p>
          </dd>
        </dl>
      </div>
    </div>
    <van-dialog     
      v-model="IsGoDownloadApp"
      title="温馨提示"
      message="请前往拼任务APP查看信誉等级详情"
      show-cancel-button
      :before-close="downLoadAppDialogClose"
    >
    </van-dialog>
  </div>
</template>

<script>
import basicData from './const.js'
import config from '@/config/defaultSettings'

export default {
  name: 'User',
  data () {
    return {
      basicData: basicData,
      appPageUrl: config.appPageUrl,
      IsGoDownloadApp: false,
    }
  },
  computed: {
    userCoreInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    const { dispatch } = this.$store
    dispatch('GetUserCoreInfo')
  },
  methods: {
    withdrawal () {
      const { $router } = this
      $router.push('/market')
    },
    pushPerfect () {
      const { $router } = this
      $router.push('/perfect')
    },
    pushInvitationCenter () {
      const { $router } = this
      $router.push('/invitationCenter')
    },
    clickCredit () {
      this.IsGoDownloadApp = true
    },
    downLoadAppDialogClose(action, done) {
      event.stopPropagation();
      if(action == 'cancel'){
        this.IsGoDownloadApp = false
        done();
      }else{
        this.IsGoDownloadApp = false
        done();
        this.downloadApp()
      }
    },
    downloadApp () {
      window.location.href = this.appPageUrl
    },
  },
}
</script>

<style lang='less' scoped>
// @import url()
.user_box{
  height: 100%;
  background: url('../../assets/images/user/my_topbg@2x.png') no-repeat;
  background-size: 100% auto;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  .scroller_box{
    // height: calc(100% - 440px);
    // overflow-y: auto;
    // overflow-x: hidden;
    background: #F8F8F8;
  }
  .user_info_box{
    padding: 0 60px;
  }
  .user_info{
    height: 410px;
    background: #FFFFFF;
    box-shadow: 0px 0px 60px 0px rgba(0, 0, 0, 0.1);
    border-radius: 40px;
    margin-top: 114px;
    margin-bottom: 60px;
    position: relative;
    .info{
      width: 100%;
      padding-top: 100px;
      h3{
        max-width: 300px;
        font-size: 36px;
        color: @title-gray1;
        font-family: PingFang SC;
        text-align: center;
        margin: 0 auto 20px;
      }
      .id{
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 400;
        color: @title-gray2;
        opacity: 0.6;
        text-align: center;
      }
    }
    .tag_box{
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      height: 44px;
      .grade{
        width: 180px;
        height: 64px;
        background: linear-gradient(90deg,rgba(212,156,84,1) 0%,rgba(247,212,152,1) 100%);
        font-size: 40px;
        color:rgba(82,49,0,1);
        border-radius: 32px;
        display: inline-block;
        text-align: center;
        line-height: 64px;
        transform: scale(0.5);
        transform-origin: left center;
        position: absolute;
        left: 30%;
      }
      .badge{
        width: 278px;
        height: 88px;
        background: url('../../assets/images/user/my_bg_topbadge@2x.png') no-repeat;
        background-size: cover;
        line-height: 88px;
        font-size: 40px;
        color:rgba(52,52,159,1);
        padding-left: 100px;
        box-sizing: border-box;
        transform: scale(0.5);
        transform-origin: left center;
        position: absolute;
        right: 6%;
      }
    }
    .user_head{
      width: 160px;
      height: 160px;
      border-radius: 50%;
      position: absolute;
      left: 0;
      right: 0;
      top: -70px;
      border: 10px solid #fff;
      margin: 0 auto;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
    .guide_wx{
      box-shadow:0 0 10PX  rgba(0,0,160,0.1);
      width: 676px;
      height:260px;
      border-radius:10px;
      margin:0 auto;
      box-sizing: border-box;
      padding:30px;
      h2{
        font-size:30px;
        font-weight: bold;
        color: #333333;
      }
      img{
        width: 96px;
        height:96px;
        margin-right: 20px;
      }
      p{
        margin-top:12px;
        font-size: 24px;
        font-weight: 400;
        text-align: left;
        color: #888888;
      }
      .btn{
        width:160px;
        height:60px;
        
      }
    }
  .gold_coin_box{
    padding: 0 60px;
    position: relative;
    h3{
      font-size: 48px;
      font-family: PingFang SC;
      font-weight: 500;
      color: @title-gray1;
    }
    p{
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 400;
      color: @title-gray2;
      text-indent: 34px;
      position: relative;
      &::before{
        content: '';
        width: 24px;
        height: 24px;
        background: url('../../assets/images/user/gold_coin_ic@2x.png') no-repeat;
        background-size: cover;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
      }
    }
    .withdrawal_btn{
      width: 180px;
      height: 70px;
      border-radius: 35px;
      position: absolute;
      right: 50px;
      top: 0;
      bottom: 0;
      margin: auto 0;
      &::after, &::before{
        border-radius: 35px;
      }
      .van-button__text{
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        color: @violet;
      }
    }
  }
  .credit_rating{
    width: 530px;
    height: 80px;
    background: linear-gradient(90deg, #FD3B84 0%, #FFA779 100%);
    border-radius: 40px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -40px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    .class-title{
      height: 100%;
      margin-top: 8px;
      box-sizing: border-box;
      flex: 1;
    }
    .title{
      display: block;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.6);
      text-indent: 31px;
    }
    .star{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 10px;
      img{
        width: 40px;
        height: 40px;
        margin-right: 16px;
        position: relative;
        bottom: 2px;
      }
    }
    .rating{
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFD83C;
      font-style: normal;
      margin-right: 20px;
      margin-left:31px
    }
    .class-score{
      flex: 1;
      text-align: center;
      span{
        font-size: 0.85333rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #FFD83C;
        font-style: normal;
      }
    }
  }
  .improve_info{
    display: flex;
    justify-content: space-around;
    padding: 30px 0;
    .info, .center{
      width: 300px;
      height: 140px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0px 0px 60px 0px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      h3{
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 500;
        color: @title-gray1;
        line-height: 42px;
      }
      p{
        font-size: 20px;
        font-family: PingFang SC;
        font-weight: 400;
        color: @title-gray2;
        line-height: 42px;
        span{
          color: @title-gray1;
          margin-left: 10px;
        }
      }
      img{
        width: 40px;
        height: 40px;
        margin-left: 60px;
      }
    }
  }
  .banner_info{
    background: #fff;
    margin: 20px auto 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 30px 60px 10px 60px;
    position: relative;
    h3{
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 500;
      color: @title-gray1;
      margin-bottom: 10px;
    }
    p{
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 400;
      color: @title-gray2;
    }
    .download_btn{
      width: 200px;
      height: 64px;
      border-radius: 32px;
      border: none;
      position: absolute;
      right: 60px;
      &::after, &::before{
        border-radius: 32px;
      }
      .van-button__text{
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #fff;
      }
    }
  }
  .app_content{
    background: #fff;
    padding: 0 60px;
    dl{
      display: flex;
      padding: 28px 0;
      border-bottom: @PX solid #DDDDDD;
      align-items: center;
      position: relative;
      &::before{
        content: '';
        width: 36px;
        height: 36px;
        background: url('../../assets/images/user/go_ic@2x.png') no-repeat;
        background-size: cover;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -18px;
      }
      &:last-child{
        border-bottom: none;
      }
      dt{
        width: 80px;
        height: 80px;
        img{
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      dd{
        flex: 1 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 30px;
        h3{
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 500;
          color: @title-gray1;
          line-height: 62px;
        }
        p{
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 400;
          color: @title-gray2;
          line-height: 42px;
          // /deep/ span{
          //   color: @taidu8-red;
          // }
        }
      }
    }
  }
}
</style>