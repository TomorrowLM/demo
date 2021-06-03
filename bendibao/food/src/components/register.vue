<template>
  <div class="page">
    <div class="signtext">Sign In</div>
    <div class="login-verify">
      <div>
        <div class="email style-verify">
          <input type="text" :placeholder="email" v-model="emailText" v-focus />
          <div
            class="fail-text"
            v-if="!isEmail"
            @click="clearEmail"
            ref="email"
          >
            不是正确的Email
          </div>
          <hr />
        </div>
        <div class="password style-verify">
          <input type="text" :placeholder="password" />
          <hr />
        </div>
        <div class="forget style-verify">
          <input type="text" :placeholder="forgetText" />
          <hr />
        </div>
      </div>
    </div>
    <div class="sign-button" @click="sign">
      <span>Sign In</span>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      isEmail: true,
      email: "email",
      emailText: "",
      password: "password",
      forgetText: "Forgot password?",
    };
  },
  props: {},
  methods: {
    sign() {
      let reg = /^\w+@\w+\.\w+$/;
      // console.log(reg.test(this.emailText));
      if (!reg.test(this.emailText)) {
        this.isEmail = false;
      }
    },
    clearEmail() {
      console.log(12);
      this.dialogVisibleTwo = true;
      this.$nextTick(() => {
        this.$refs.email.focus();
      });
    },
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus();
      },
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("./../css/register.css");
</style>
