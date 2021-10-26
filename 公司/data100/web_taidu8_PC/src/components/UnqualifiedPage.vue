<template>
  <div class="empty">
    <com-header></com-header>
    <img src="../../static/images/filteredout_img.png" alt>
    <p>{{msg}}</p>
    <button @click="back">返回问卷列表</button>
  </div>
</template>
<script>
export default {
  name: "empty",
  data() {
    return {
      msg: "很抱歉你不符合本次调研的条件，请点击返回问卷列表参与其它调研。"
    };
  },
  created() {
    this.msg = decodeURIComponent(this.$route.params.msg);
    if (this.msg == 4) {
      this.msg = "很抱歉，此问卷的答题人数已满，下次早点来哦";
    } else if (this.msg == 5) {
      this.msg =
        "很抱歉，跟您相同条件的小伙伴已经抢先回答了问卷，请您下次早点过来抢问卷!";
    } else if (this.msg == 6) {
      this.msg = "很抱歉，您已超过此问卷的答题期限，下次早点来哦!";
    }
  },
  methods: {
    back() {
      this.$router.replace({ name: "SurveyList" });
    }
  }
};
</script>
<style lang="scss" scoped>
.empty {
  width: 60%;
  margin: 0 auto;
  padding-top: 100px;
  text-align: center;
  color: #999;
  font-size: 16px;
  p {
    margin: 20px 0;
  }
  button {
    font-size: 18px;
    width: 100%;
    height: 50px;
    color: #fff;
    background: #7575f9;
    border-radius: 6px;
    bottom: 20px;
    cursor: pointer;
  }
}
</style>