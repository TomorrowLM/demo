<template>
  <div class="userPage">
    <com-header headerIndex="2" @sendIndex="getIndex"></com-header>
    <div class="fl">
      <div class="photo">
        <img v-if="userInfo.headImgUrl!=''" :src="userInfo.headImgUrl" alt />
        <img v-else src="../../static/images/integral_user_norimg.png" alt />
      </div>
      <div class="info">
        <p class="nowrap">{{userInfo.nickName}}</p>
        <span>ID：{{userInfo.userId}}</span>
      </div>
      <dl class="list">
        <dd :class="[index==0?'active':'']" @click="change(0)">
          <img src="../../static/images/top_menu_ic_integral.png" alt />
          <p>我的金币</p>
          <p>
            <span>{{userInfo.gold}}</span>金币
          </p>
        </dd>
       <!-- <dd :class="[index==1?'active':'']" @click="change(1)">
          <img src="../../static/images/top_menu_ic_wallet.png" alt />
          <p>我的钱包</p>
          <p>
            <span>{{userInfo.balance}}</span>元
          </p>
        </dd>-->
        <dd :class="[index==2?'active':'']" @click="change(2)">
          <img src="../../static/images/top_menu_ic_inf.png" alt />
          <p>个人资料</p>
        </dd>
        <dd :class="[index==3?'active':'']" @click="change(3)">
          <img src="../assets/my_ic_basicinf1.png" alt />
          <p>完善信息</p>
        </dd>
      </dl>
    </div>
    <div class="fr">
      <my-integral v-show="index==0"></my-integral>
      <my-wallet v-show="index==1"></my-wallet>
      <my-info v-show="index==2"></my-info>
      <basic-info v-show="index==3"></basic-info>
    </div>
  </div>
</template>

<script>
import eventBus from "../services/eventBus.js";
import MyIntegral from "./MyGold";
import MyWallet from "./MyWallet";
import MyInfo from "./MyInfo";
import BasicInfo from "./BasicInfo";
import common from "../api/common";
// import url from "../api/url";

export default {
  name: "user",
  components: {
    MyIntegral,
    MyWallet,
    MyInfo,
    BasicInfo
  },
  data() {
    return {
      index: localStorage.getItem("userpageIndex"),
      userInfo: JSON.parse(localStorage.getItem("userInfo"))
    };
  },
  mounted() {
    eventBus.$on("userInfo", data => {
      this.userInfo = data;
      console.log(data, "userpage实时更新信息");
    });
  },
  destroyed() {
    eventBus.$off("userInfo");
  },
  methods: {
    change(index) {
      if (this.index != index) {
        this.index = index;
      }
    },
    getIndex(index) {
      //接收头部下拉框传递来的index
      if (this.index != index) {
        this.index = index;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@mixin size($w: 100%, $h: 100px) {
  width: $w;
  height: $h;
}
@mixin font($size: 16px, $color: #333) {
  font-size: $size;
  color: $color;
}
.userPage {
  box-sizing: border-box;
  padding: 80px 7% 0;
  @include size(100%, 100%);
  // background:#f8f8f8;
  .fl {
    float: left;
    @include size(25%, 100%);
    background: #fff;
    padding-top: 60px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
    .photo {
      @include size(112px, 112px);
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .info {
      width: 100%;
      text-align: center;
      margin-top: 20px;
      p {
        box-sizing: border-box;
        padding: 0 30px;
        @include font(16px, #666);
        margin-bottom: 8px;
      }
      span {
        @include font(14px, #999);
      }
    }
    .list {
      // @include size(200px, 170px);
      margin-top: 60px;
      background: #fff;
      border-radius: 4px;

      dd {
        padding: 0 30px;
        box-sizing: border-box;
        font-size: 14px;
        color: #666;
        height: 50px;
        line-height: 50px;
        cursor: pointer;
        border-left: 4px solid #fff;
        &.active {
          border-left: 4px solid #7575f9;
          background: #f8f8f8;
        }
        img {
          vertical-align: middle;
          width: 20px;
        }
        p {
          display: inline-block;
          vertical-align: middle;
          &:nth-child(2) {
            margin-left: 5px;
          }
          &:nth-child(3) {
            float: right;
            color: #999;
            span {
              color: #7575f9;
            }
          }
        }
      }
    }
  }
  .fr {
    float: right;
    @include size(72%, 100%);
    margin-left: 3%;
    padding-top: 40px;
  }
}
</style>
