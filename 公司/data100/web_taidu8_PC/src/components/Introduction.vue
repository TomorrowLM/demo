<template>
  <div class="agreement">
    <com-header></com-header>
    <div>拼任务APP隶属于北京数字一百市场咨询有限公司，这里不仅有有奖金的企业调研问卷，还可获得参加企业方组织的座谈会、产品试用、调研社区等多样的机会。说出你的建议，打造属于自己的APP，最受欢迎的APP。拼任务App，手机随时参与研，还可以获取现金红包奖励，可以直接提现到微信钱包，利用碎片时间，赚取零花钱。拼任务，建言更简单，赚钱更容易。</div>
    <div class="btn" @click="goBack">我知道了</div>
  </div>
</template>

<script>
import Login from "./common/Login";

export default {
  name: "agree",
  methods: {
    goBack() {
      this.$router.back();
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

.agreement {
  padding: 150px 15% 0;
  line-height: 25px;
  div {
    font-size: 14px;
    text-align: left;
  }
  .btn {
    margin: 80px auto 0;
    text-align: center;
    @include size(200px, 50px);
    line-height: 50px;
    border-radius: 6px;
    background: #7575f9;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
  }
  h3 {
    margin: 3px auto;
    text-align: center;
  }
  div::-moz-selection {
    background: #7575f9;
  }
  div::selection {
    background: #7575f9;
  }
  p::-moz-selection {
    background: #7575f9;
  }
  p::selection {
    background: #7575f9;
  }
  h3::-moz-selection {
    background: #7575f9;
  }
  h3::selection {
    background: #7575f9;
  }
}
</style>
