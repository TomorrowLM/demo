<template>
  <div class="login-page">
    <com-header headerIndex="2"></com-header>
    <div class="banner">
      <div class="banner_right">
        <login pagename="loginpage"></login>
      </div>
    </div>
  </div>
</template>

<script>
import Login from "./common/Login";
import Download from "./common/Download";

export default {
  name: "loginpage",
  components: {
    login: Login,
    Download
  },
  data() {
    return {
      // isLogin: false //是否登录
    };
  },
  created() {
    if (localStorage.getItem("userInfo")) {
      // next(vm => {
      this.$router.replace({ name: "SurveyList" });
      // });
    }
  },
  methods: {
    login() {
      this.$router.push({ name: "SurveyList" });
    }
  }
  // beforeRouteEnter(to, from, next) {
  //   if (localStorage.getItem("userInfo")) {
  //     next(vm => {
  //       this.$router.replace({ name: "SurveyList" });
  //     });
  //   }
  // }
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
.login-page {
  padding-top: 80px;
  width: 100%;
  .banner {
    min-width:1134px;
    top: 80px;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    background: url(../../static/images/home_banner_img.png) no-repeat;
    background-size: cover;
    .banner_right {
      padding-top: 150px;
      margin: 0 auto;
      @include size(410px, 335px);
      max-width: 38%;
      min-width:410px;
    }
  }
}
</style>
