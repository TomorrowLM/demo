<template>
  <div class="invite_friends" v-if="invitationFriendData">
    <div class="scroller">
      <div class="title">~ 邀请好友答问卷 ~</div>
      <div class="earn_gold">
        每位赚
        <span>{{ invitationFriendData.gold }}</span>金币
      </div>
      <!-- <div class="share_tips">分享到三个以上微信群，邀请成功率<span>提升200%</span></div> -->
      <div class="share_tips">{{ invitationFriendData.shareSuccessRateInfo }}</div>
      <van-button
        class="make_money_now"
        color="linear-gradient(to right, #AB64F5, #6C63FF)"
        type="default"
        round
        @click="backSurveyOne"
      >立即邀友赚钱</van-button>
      <div class="how_make_money">
        <div class="head">如何赚到{{ invitationFriendData.gold }}金币？</div>
        <dl v-for="(item, index) in invitationFriendData.getGoldMethod" :key="index">
          <dt>
            <img class="icon" :src="item.imageUrl" alt />
            <p class="or" v-if="index < invitationFriendData.getGoldMethod.length - 1">或</p>
            <!-- <img v-if="index < invitationFriendData.getGoldMethod.length - 1" class="plus" src="../../assets/images/user/plus_ic.png" alt=""> -->
          </dt>
          <dd>{{ item.message }}</dd>
        </dl>
      </div>
      <div class="who_is_invited">
        <div class="head">都可以邀请谁？</div>
        <dl v-for="(item, index) in invitationFriendData.inviteUser" :key="index">
          <dt>
            <img class="icon" :src="item.imageUrl" alt />
            <p class="or" v-if="index < invitationFriendData.inviteUser.length - 1">或</p>
            <!-- <img v-if="index < invitationFriendData.inviteUser.length - 1" class="plus" src="../../assets/images/user/plus_ic.png" alt=""> -->
          </dt>
          <dd>{{ item.message }}</dd>
        </dl>
      </div>
      <div class="invite_info">
        <h4>我的邀请码</h4>
        <div class="invite_code">
          <span>{{invitationFriendData.invitationCode}}</span>
          <van-button
            class="copy_btn"
            size="mini"
            plain
            hairline
            round
            type="primary"
            v-clipboard:copy="invitationFriendData.invitationLinkInfo"
            v-clipboard:success="onCopy"
            v-clipboard:error="onCopyError"
          >复制</van-button>
        </div>
        <div class="invite_tips">
          <img src="../../assets/images/user/ic.png" alt="">
          <span>{{invitationFriendData.invitationIntroduction}}</span>
        </div>
        <div
          class="invite_user"
          v-if="invitationFriendData.isCanFillInvitationUser==1||(invitationFriendData.invitationUser&&invitationFriendData.invitationUser.length>0)"
        >
          <h4>我的推荐人</h4>
          <ul v-if="invitationFriendData.invitationUser&&invitationFriendData.invitationUser.length>0">
            <li>
              <img :src="invitationFriendData.invitationUserHeadImg" alt srcset />
            </li>
            <li class="overflow_ellipsis">{{invitationFriendData.invitationUser}}</li>
          </ul>
          <div v-else>
            <input type="text" placeholder="请输入推荐人的邀请码" v-model="inviteCode" />
            <button @click="inviteCodeSave">提交</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import {blindInviteCode} from "@/api/user"
export default {
  name: 'InviteFriends',
  data(){
    return {
      inviteCode:""
    }
  },
  computed: {
    invitationFriendData () {
      return this.$store.getters.invitationFriendData
    }
  },
  created () {
    const { dispatch } = this.$store
    dispatch('GetInvitationFriendTabInfo')
  },
  methods: {
    backSurveyOne() {
      sessionStorage.setItem('tabIndex', 'index')
      sessionStorage.setItem("survey_name", "history");
      this.$router.push('/surveyOne')
    },
    inviteCodeSave(){
      blindInviteCode({inviteCode:this.inviteCode}).then(()=>{
        this.$store.dispatch('GetInvitationFriendTabInfo')
      })
    },
    onCopy () {
      Toast.success('复制成功,请打开好友列表分享给好友')
    },
    onCopyError () {
      Toast.fail('复制失败')
    },
  }
}
</script>

<style lang='less' scoped>
//@import url()
.invite_friends {
  height: 100%;
  position: relative;
  overflow-y: scroll;
  padding-bottom: 40px;
  .invite_info {
    width: 690px;
    margin: 60px auto 0;
    .invite_code {
      margin: 20px auto;
      width: 100%;
      height: 90px;
      line-height: 90px;
      background: #f6f6f6;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 0 20px;
      color: #f74545;
      font-weight: bold;
    }
    button {
      width: 160px;
      height: 56px;
      line-height: 56px;
      border-radius: 28px;
      border: 2px solid #7575f9;
      color: #7575f9;
    }
    .invite_tips{
      width:690px;
      margin: 20px auto 30px;
      height: 60px;
      line-height: 60px;
      background: #F7F2EE;
      border-radius: 30px;
      color: #F28C48;
      font-size: 24px;
      box-sizing: border-box;
      padding:0 20px;
      img{
        margin-right:10px;
        vertical-align: middle;
      }
      span{
        display: inline-block;
        vertical-align: middle;
      }

    }
    .invite_user {
      ul {
        display: flex;
        align-items: center;
        margin: 20px 0 0;
        li {
          &:nth-child(1) {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 20px;
            img {
              max-width: 100%;
              max-height: 100%;
            }
          }
          &:nth-child(2) {
            flex: 1;
          }
        }
      }
      div {
        display: flex;
        align-items: center;
        margin: 20px 0 0;
        box-sizing: border-box;
        padding: 0 20px 0 0;
        input {
          flex: 1;
          width: 480px;
          height: 90px;
          line-height: 90px;
          border-radius: 12px;
          border: 1px solid #ddd;
          margin-right: 30px;
          box-sizing: border-box;
          padding: 20px;
        }
      }
    }
  }
  h4 {
    font-size: 26px;
    line-height: 18px;
    font-weight: bold;
  }
  .title {
    font-size: 30px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #916bff;
    line-height: 42px;
    text-align: center;
    margin: 40px 0 30px 0;
  }
  .earn_gold {
    font-size: 48px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: @title-gray1;
    line-height: 66px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      width: 120px;
      height: 72px;
      line-height: 72px;
      background: #f4f4f4;
      border-radius: 12px;
      display: block;
      color: @violet;
      margin: 0 20px;
    }
  }
  .share_tips {
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8d97b5;
    line-height: 34px;
    text-align: center;
    margin: 30px 0;
  }
  .make_money_now {
    width: 440px;
    display: block;
    margin: 0 auto;
  }
  .how_make_money,
  .who_is_invited {
    width: 690px;
    height: 304px;
    background: #f3f3fe;
    border-radius: 12px;
    margin: 80px auto 0;
    position: relative;
    display: flex;
    padding-top: 70px;
    .head {
      width: 420px;
      height: 116px;
      position: absolute;
      background: url("../../assets/images/user/invitation_title_bg.png")
        no-repeat;
      background-size: cover;
      top: -46px;
      left: 18%;
      font-size: 28px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #ffffff;
      text-align: center;
      line-height: 98px;
      padding-left: 40px;
      box-sizing: border-box;
    }
    dl {
      flex: 1 0;
      padding: 0 10px;
      dt {
        width: 100%;
        position: relative;
        .icon {
          width: 128px;
          height: 128px;
          display: block;
          margin: 0 auto;
        }
        .or {
          width: 24px;
          height: 24px;
          position: absolute;
          right: -22px;
          top: 36px;
          color: #6565c5;
          font-size: 24px;
        }
      }
      dd {
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #6565c5;
        line-height: 34px;
        text-align: center;
      }
    }
  }
  .who_is_invited {
    padding: 70px 50px 0 50px;
  }
}
</style>