<template>
  <div class="page">
    <div class="signtext">Sign Up</div>
    <div class="login-verify">
      <div>
        <div class="username style-verify">
          <input type="text" :placeholder="username" v-model="usernameText" />
          <hr />
        </div>
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
        <div class="confirePassword style-verify">
          <input type="text" :placeholder="confirePasswordText" />
          <hr />
        </div>
      </div>
    </div>
    <div class="sign-button">
      <router-link to="/"> <span>Sign Up</span></router-link>
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
      confirePasswordText: "Confirm password",
      username: "username",
      usernameText: "",
    };
  },
  components: { [Toast.name]: Toast },
  props: {},
  methods: {
    signUP() {},
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
<style scoped src="./../css/register.css">
/* @import url("./../css/login.css"); */
</style>
