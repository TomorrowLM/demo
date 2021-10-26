<template>
  <div class="header">
    <div class="logo" @click="goHome">
      <img src="../../../static/images/home_logo.png" alt />
    </div>
    <ul class="content">
      <li :class="[tabIndex=='2'?'active':'',{'isLogin': isLogin}]">
        <p v-if="!isLogin" @click="goLogin(2)">登录</p>
        <div
          class="user"
          :class="{'isUser': isUser}"
          v-if="isLogin"
          @mouseenter="pulldown"
          @mousemove="pulldown"
          @mouseleave="pullup"
        >
          <div class="img">
            <img v-if="userInfo.headImgUrl" :src="userInfo.headImgUrl" alt />
            <img v-else src="../../../static/images/integral_user_norimg.png" alt />
          </div>
          <div class="username"><span class="nowrap">{{userInfo.nickName}}</span><span>，您好</span></div>
          <img src="../../../static/images/home_top_ic_arrdow.png" alt />
          <div class="drop_down" v-if="isUser">
            <dl class="list">
              <dd @click="change(0)">
                <img src="../../../static/images/top_menu_ic_integral.png" alt />
                <p>我的金币</p>
                <p>
                  <span>{{userInfo.gold}}</span>金币
                </p>
              </dd>
              <!--<dd @click="change(1)">
                <img src="../../../static/images/top_menu_ic_wallet.png" alt />
                <p>我的钱包</p>
                <p>
                  <span>{{userInfo.balance}}</span>元
                </p>
              </dd>-->
              <dd @click="change(2)">
                <img src="../../../static/images/top_menu_ic_inf.png" alt />
                <p>个人资料</p>
              </dd>
              <dd @click="change(3)">
                <img src="../../assets/my_ic_basicinf1.png" alt />
                <p>完善信息</p>
              </dd>
              <dt @click="logout">退出登录</dt>
            </dl>
          </div>
        </div>
      </li>
      <!-- <li @click="goIM" :class="[tabIndex=='3'?'active':'']">在线座谈会</li> -->
      <li @click="goList" :class="[tabIndex=='1'?'active':'']">答问卷</li>
      <li @click="goHome" :class="[tabIndex=='0'?'active':'']">首页</li>
    </ul>
  </div>
</template>
<script>
import eventBus from "../../services/eventBus.js";
import common from "../../api/common";
import utils from "../../api/util";
import request from "../../api/request";
import urls from "../../api/url";
export default {
  name: "commonhead",
  props: {
    headerIndex: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      tabIndex: "",
      isLogin: localStorage.getItem("userInfo") ? true : false,
      isUser: false, //是否显示用户下拉框
      userInfo: {} //用户信息
    };
  },
  created() {
    this.tabIndex = this.headerIndex;
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // console.log(this.userInfo,"用户信息")
  },
  destroyed() {
    eventBus.$off("userInfo");
  },
  mounted() {
    eventBus.$on("userInfo", data => {
      this.userInfo = data;
      console.log(data, "userpage实时更新信息");
    });
    if (this.isLogin == true) {
      common.completed_survey_award("").then(data => {
        localStorage.setItem("awardLists", JSON.stringify(data.data));
      });
      common.getUserInfo().then(data => {
        this.userInfo.balance = data.data.balance;
        this.userInfo.headImgUrl = data.data.headImgUrl;
        this.userInfo.integral = data.data.integral;
        this.userInfo.integralDesc = data.data.integralDesc;
        this.userInfo.nickName = data.data.nickName;
        this.userInfo.withdraw = data.data.withdraw;
        this.userInfo.total = data.data.total;
        this.userInfo.gold = data.data.gold;
        this.userInfo.totalGold = data.data.totalGold;
        this.userInfo.withdrawGold = data.data.withdrawGold;
        eventBus.$emit("userInfo", this.userInfo);
        localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
      });
    }
  },

  methods: {
    goHome() {
      if (this.tabIndex != "0") {
        this.tabIndex = "0";
        this.$router.push({ name: "HomePage" });
      }
    },
    goList() {
      if (this.tabIndex != "1") {
        if (this.isLogin) {
          this.tabIndex = "1";
          this.$router.push({ name: "SurveyList" });
        } else {
          this.tabIndex = "2";
          this.$router.push({ name: "LoginPage" });
        }
      }
    },
    goIM() {
        if (this.isLogin&&localStorage.getItem("userInfo")&&JSON.parse(localStorage.getItem("userInfo")).token) {
          request(urls.queryNeteaseInfo, {
            token: JSON.parse(localStorage.getItem("userInfo")).token
          }).then(data => {
          // IM进入即时通讯
            console.log(data.data)
            utils.setCookie('uid',data.data.accId);
            utils.setCookie('sdktoken',data.data.token);
            window.open(urls.basePage+ '/pc/webdemo/im/main.html');
          });
         
        } else {
          this.tabIndex = "2";
          this.$router.push({ name: "LoginPage" });
        }
      
    },
    // 点击登录跳转登录页
    goLogin(index) {
      if (this.tabIndex != "2") {
        this.tabIndex = "2";
        this.$router.push({ name: "LoginPage" });
      }
    },
    pulldown() {
      this.isUser = true;
    },
    pullup() {
      this.isUser = false;
    },
    change(index) {
      //用户页面中模块切换
      this.isUser = false;
      // console.log(this.$route, "页面路由");
      if (this.$route.name != "UserPage") {
        //非当前页面
        localStorage.setItem("userpageIndex", index);
        this.$router.push({ name: "UserPage" });
      } else {
        //当前页面
        this.$emit("sendIndex", index);
      }
    },
    logout() {
      //退出登录
      localStorage.clear();
      this.$router.push({ name: "HomePage" });
      this.isLogin = false;
      this.$emit("isLogin", false);
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin size($w: 100%, $h: 100px) {
  width: $w;
  height: $h;
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  @include size(100%, 80px);
  min-width: 1134px;
  padding: 16px 7% 0;
  box-sizing: border-box;
  color: #fff;
  background: #fff;
  .logo {
    float: left;
    width: 180px;
    img{
      width: 100%;
    }
  }
  .content {
    font-size: 18px;
    color: #333;
    float: right;
    li {
      // text-align: right;
      float: right;
      margin-left: 35px;
      margin-top: 4px;
      line-height: 40px;
      padding: 0 15px;
      cursor: pointer;
      &:nth-child(1) {
        cursor: default;
        .username span{
          display: inline-block;
          vertical-align: middle;
        }
        .nowrap{
          max-width: 150px;
        }
      }
      &.active {
        color: #7575f9;
      }
      &.isLogin {
        margin-left: 0px;
        padding: 0 15px 0 0;
      }
    }
  }
  .user {
    &.isUser {
      height: 298px;
    }
    // @include size(205px, 40px);
    height: 40px;
    // background: #aaa;
    position: relative;
    left: 45px;
    .img {
      @include size(36px, 36px);
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .username {
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
    }
    .drop_down {
      position: relative;
      .list {
        position: absolute;
        top: 44px;
        right: -36px;
        min-width: 200px;
        height: 170px;
        // @include size(200px, 210px);
        padding: 0 20px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;
        &:after {
          content: "";
          display: block;
          @include size(15px, 15px);
          background: #fff;
          transform: rotate(45deg);
          position: absolute;
          top: -8px;
          right: 36px;
        }
        dd {
          border-bottom: 1px solid #ddd;
          font-size: 14px;
          color: #666;
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
        dt {
          font-size: 14px;
          color: #999;
        }
      }
    }
  }
}
</style>

