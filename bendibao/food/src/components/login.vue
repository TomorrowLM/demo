<template>
  <div class="page">
    <div class="signtext">Sign In</div>
    <div class="login-verify">
      <div>
        <div class="email style-verify">
          <input
            type="text"
            :placeholder="email"
            v-model="emailText"
            @keydown="clearEmail"
          />
          <div class="fail-text" v-if="!isEmail" ref="email">
            不是正确的Email
          </div>
          <hr />
        </div>
        <div class="password style-verify">
          <input type="text" :placeholder="password" v-model="passwordText" />
          <hr />
        </div>
        <div class="forget style-verify">
          <!-- <input type="text" :placeholder="forgetText" /> -->
          <router-link to="/register"
            ><div>{{ forgetText }}</div></router-link
          >
        </div>
      </div>
    </div>
    <div class="sign-button" @click="sign">
      <span>Sign In</span>
      <router-link to></router-link>
    </div>

    <van-Toast></van-Toast>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data: () => {
    return {
      isEmail: true,
      email: "email",
      emailText: "",
      password: "password",
      passwordText: "",
      forgetText: "Forgot password?",
    };
  },
  components: { [Toast.name]: Toast },
  props: {},
  methods: {
    sign() {
      if (this.passwordText != "") {
        console.log(1);
        Toast("密码错误");
      } else {
        this.$router.push("/HomePage");
      }
    },
    clearEmail() {
      let reg = /^\w+@\w+\.\w+$/;
      if (!reg.test(this.emailText) || this.emailText == "") {
        this.isEmail = false;
      } else this.isEmail = true;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./../css/login.css">
/* @import url("./../css/login.css"); */
</style>
