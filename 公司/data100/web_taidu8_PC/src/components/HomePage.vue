<template>
  <div class="home-page">
    <com-header headerIndex="0" @isLogin="getIsLogin"></com-header>
    <div class="banner">
      <div class="banner_left" :class="isLogin ? 'isLogin':''">
        <div class="app_img">
          <img src="../../static/images/home_ban_t1.png" alt />
        </div>
        <div class="qrcode">
          <download></download>
        </div>
      </div>
      <div class="banner_right" v-if="!isLogin">
        <login pagename="homepage"></login>
      </div>
    </div>
    <ul class="info">
      <li>
        <div class="img">
          <img src="../../static/images/home_data_ic_ind.png" alt />
        </div>
        <div class="dis">
          <p>调研行业</p>
          <h3>15年+</h3>
        </div>
      </li>
      <li>
        <div class="img">
          <img src="../../static/images/home_data_ic_rew.png" alt />
        </div>
        <div class="dis">
          <p>
            已完成市场
            <br />调查项目数
          </p>
          <h3>12万+</h3>
        </div>
      </li>
      <li>
        <div>
          <img src="../../static/images/home_data_ic_task.png" alt />
        </div>
        <div>
          <p>受访者数量</p>
          <h3>485万+</h3>
        </div>
      </li>
    </ul>
    <div class="integral com">
      <div>
        <img src="../../static/images/home_img1.png" alt />
      </div>
      <div>
        <h3>
          <img src="../../static/images/home_step1.png" alt />
        </h3>
        <p>答问卷、小任务、做活动，多种方式表达观点，赢取回报——你的观点价值千金</p>
      </div>
    </div>
    <div class="activity com">
      <div>
        <h3>
          <img src="../../static/images/home_step2.png" alt />
        </h3>
        <p>高频低门槛的精彩活动等你来玩，总有一款让你流连忘返</p>
      </div>
      <div>
        <img src="../../static/images/home_img2.png" alt />
      </div>
    </div>
    <div class="invite com">
      <div>
        <img src="../../static/images/home_img3.png" alt />
      </div>
      <div>
        <h3>
          <img src="../../static/images/home_step3.png" alt />
        </h3>
        <p>好东西记得分享哦！邀请好友参与问卷，可以获得高额分成，赶快行动吧</p>
      </div>
    </div>
    <div class="money com">
      <h2>
        <img src="../../static/images/home_step4.png" alt />
      </h2>
      <div>
        <img src="../../static/images/step1.png" alt />
        <h4>注册账号</h4>
        <p>下载app完成注册</p>
      </div>
      <div>
        <img src="../../static/images/home_how_ic_arrow.png" alt />
      </div>
      <div>
        <img src="../../static/images/step2.png" alt />
        <h4>参与问卷</h4>
        <p>各式任务每日更新，动动鼠标就能完成</p>
      </div>
      <div>
        <img src="../../static/images/home_how_ic_arrow.png" alt />
      </div>
      <div>
        <img src="../../static/images/step3.png" alt />
        <h4>提取现金</h4>
        <p>下载拼任务app，完成提现</p>
      </div>
    </div>
    <div class="footer">
      <ul>
        <li>
          <h4>关于我们</h4>
          <a style="cursor:pointer;" @click="goIntroduction">拼任务简介</a>
          <a href="https://www.data100.com/about_us.php" target="_blank">公司简介</a>
          <!-- <a href="http://www.data100.com.cn" target="_blank">数字一百官网</a>-->
        </li>
        <li>
          <h4>友情链接</h4>
          <a href="https://www.data100insight.com" target="_blank">DATA100 INSIGHT</a>
          <a href="http://www.data100.com.cn" target="_blank">数字一百官网</a>
          <!-- <a href="https://www.matrixpanel.com" target="_blank">WeSurvey</a> -->
          <!-- <a href="http://yunding.pinrenwu.cn" target="_blank">云顶天天赚</a>
          <a href="http://web.ppznet.com" target="_blank">拍拍赚</a>-->
        </li>
        <li>
          <h4>联系我们</h4>
          <!-- <div>
            <img src="../../static/images/home_footer_ic_tel.png" alt />
            <span>
              <p>400-687-5100</p>
              <p>010-87835788-8113</p>
            </span>
           
          </div> -->
          <div>
            <img src="../../static/images/home_footer_ic_email.png" alt />
            <span>pinrenwu@data100.com</span>
          </div>
          <div>
            <img src="../../static/images/home_footer_ic_add.png" alt />
            <span>
              北京市朝阳区东四环四惠桥南侧
              <br />伊莎文心广场主楼五层
            </span>
          </div>
        </li>
      </ul>
      <div class="footer_qrcode">
        <p>下载app，发现更多精彩内容</p>
        <download></download>
      </div>
    </div>
    <div class="footer_nav">
      <span>版权声明:Copyright ©2016-2020. &nbsp;DATA100 Market Research Co.Ltd. &nbsp;All Rights Reserved. &nbsp;</span>
      <span>
        数字一百. &nbsp;版权所有 &nbsp;
        <a href="https://beian.miit.gov.cn" target="_blank">
          <span>京ICP备12038410号-24</span>
        </a>
      </span>
    </div>
  </div>
</template>

<script>
import Login from "./common/Login";
import Download from "./common/Download";
import url from "../api/url";

export default {
  name: "Home",
  components: {
    login: Login,
    Download
  },
  created() {
    // if (window.location.href.slice(0, 25) == url.httpBasePage) {
    //   console.log("协议");
    //   window.location.href = window.location.href.replace("http:", "https:");
    // }
  },
  data() {
    return {
      isLogin: localStorage.getItem("userInfo") ? true : false //是否登录
    };
  },

  methods: {
    goIntroduction(){
      this.$router.push({ name: "Introduction" });
    },
    getIsLogin() {
      this.isLogin = false;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name == "AnswerPage") {
        console.log(to, from, window.location.href);
        if (window.location.href.slice(0, 5) == "http") {
          localStorage.clear();
        }
      }
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@mixin size($w: 100%, $h: 100px) {
  width: $w;
  height: $h;
}
@mixin pad($padT: 10%, $padR: 10%, $padB: 10%, $padL: 10%) {
  box-sizing: border-box;
  padding: $padT $padR $padB $padL;
}
@mixin font($size: 16px, $color: #333) {
  font-size: $size;
  color: $color;
}
.footer_nav {
  height: 40px;
  background: #353535;
  text-align: center;
  color: #7a7878;
  font-size: 12px;
  a {
    font-size: 12px;
    color: #7a7878;
    text-decoration: underline;
  }
}
.home-page {
  padding-top: 80px;
  width: 100%;
  .banner {
    @include size(100%, 586px);
    background: url(../../static/images/home_banner_img.png) no-repeat;
    background-size: cover;
    padding: 128px 6% 0;
    box-sizing: border-box;

    .banner_left {
      width: 60%;
      float: left;
      .app_img img {
        max-width: 100%;
      }
      .qrcode {
        color: #fff;
        font-size: 20px;
        margin-top: 58px;
      }
      &.isLogin {
        margin: 0 auto;
        float: initial;
        text-align: center;
        .qrcode {
          text-align: center;
        }
      }
    }
    .banner_right {
      float: right;
      @include size(389px, 335px);
      max-width: 38%;
    }
  }
  .info {
    @include size(100%, 130px);
    @include pad(0, 10%, 0, 10%);
    background: #f8f8f8;
    li {
      float: left;
      @include size(33.33%, 100%);
      @include pad(33px, 0, 0, 0);
      border-left: 1px solid #eee;
      text-align: center;
      img {
        width: 68px;
      }
      &:last-child {
        border-right: 1px solid #eee;
      }
      div {
        display: inline-block;
        vertical-align: middle;
        &:nth-child(2) {
          text-align: left;
          margin-left: 20px;
        }
        p {
          @include font(16px, #999);
          height: 40px;
        }
        h3 {
          @include font(30px);
          font-weight: normal;
          color: #7575f9;
        }
      }
    }
  }
  .com {
    overflow: hidden;
    @include size(100%, auto);
    text-align: center;
    div {
      display: inline-block;
      vertical-align: middle;
      img {
        max-width: 100%;
      }
      p {
        @include font(24px, #333);
        margin-top: 40px;
      }
    }
  }
  .integral {
    @include pad(68px, 10%, 30px, 10%);
    background: #fff;
    div {
      &:nth-child(1) {
        max-width: 40%;
      }
      &:nth-child(2) {
        @include pad(0, 0, 0, 20px);
        text-align: left;
        max-width: 58%;
      }
    }
  }
  .activity {
    background: #f6f5f5;
    @include pad(50px, 10%, 50px, 10%);
    div:nth-child(1) {
      text-align: right;
      margin-right: 20px;
      max-width: 45%;
      img {
        margin-right: -35px;
      }
    }
    div:nth-child(2) {
      max-width: 40%;
    }
  }
  .invite {
    @include pad(50px, 10%, 50px, 10%);
    background: #fff;
    div {
      &:nth-child(1) {
        max-width: 40%;
      }
      &:nth-child(2) {
        @include pad(0, 0, 0, 20px);
        text-align: left;
        max-width: 58%;
      }
    }
  }
  .money {
    background: #7575f9;
    @include pad(80px, 0, 35px, 0);
    h2 {
      margin-bottom: 45px;
    }
    div {
      margin-bottom: 45px;
      &:nth-child(odd) {
        margin: -130px 5% 0;
      }
      h4 {
        margin-top: 30px;
        @include font(20px, #fff);
      }
      p {
        @include font(16px, #fff);
        margin-top: 15px;
      }
    }
  }
  .footer {
    @include size(100%, auto);
    @include pad(50px, 7%, 60px, 7%);
    background: #353535;
    @include font(16px, #fff);
    overflow: hidden;
    ul {
      float: left;
      li {
        float: left;
        margin-left: 80px;
        &:nth-child(1) {
          margin-left: 0;
        }
        h4 {
          @include font(18px, #7575f9);
          font-weight: normal;
        }
        a {
          color: rgba(255, 255, 255, 0.6);
          display: block;
          margin-top: 20px;
          font-size: 16px;
          &:nth-child(1) {
            margin-top: 25px;
          }
          &:hover {
            text-decoration: underline;
          }
        }
        div {
          margin-top: 15px;
          img {
            vertical-align: middle;
          }
          span {
            margin-left: 10px;
            display: inline-block;
            vertical-align: middle;
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }
    }
    .footer_qrcode {
      float: right;
      text-align: left;
      p {
        font-size: 24px;
        margin-bottom: 30px;
      }
    }
  }
}
</style>
