<template>
  <div class="sclution">
    <com-header></com-header>
    <iframe width="100%" height="100%" :src="`${domain}/wechatpub/sclution`"></iframe>
    <div class="btn" @click="goBack">我知道了</div>
  </div>
</template>

<script>
import Login from "./common/Login";

export default {
  name: "agree",
  data(){
    return {
       domain: process.env.BASE_PAGE
    }
  },
  methods: {
    goBack() {
      window.close()
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
iframe{
  border:none;
}
.sclution {
  position: absolute;
  top:0;
  left:0;
  right:0;
  bottom:100px;
  // height: 100%;
  padding: 90px 7% 0;
  line-height: 25px;
  div {
    font-size: 14px;
    text-align: left;
  }
  .btn {
    margin: 20px auto;
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
