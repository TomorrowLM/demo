<template>
  <div class="error">
    <div class="errorWrap">
      <img src="../../assets/images/img_empage_nonetwork.png" alt width="52%" />
      <p class="error-p error-p1">哎呀，服务器出错啦！</p>
      <p class="error-p">{{ msg ? msg : '请联系管理员' }}</p>
      <button class="commonBtn" @click="toHome">刷新试试</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "error",
  components: {},
  data() {
    return {
      url: "tabs",
      msg: ''
    };
  },
  created() {
    this.msg = this.$route.query.msg
    if (this.$route.params.data) {
      this.url = this.$route.params.data;
    }
  },
  methods: {
    toHome() {
      this.$router.replace({ name: this.url });
    }
  }
};
</script>

<style lang='less' scoped>
.error {
  background: #efeff4;
  width: 100%;
  height: 100%;
  padding: 30px 0 0;
  box-sizing: border-box;
  text-align: center;
}
.errorWrap {
  padding: 35px 0;
}
.error-p1 {
  margin-top: 68px;
}
.error-p {
  font-size: 32px;
  color: #888;
  padding: 20px 0 0 0;
}
</style>