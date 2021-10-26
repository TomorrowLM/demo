<template>
  <div class="integral">
    <div class="total">
      <img src="../../static/images/integral_ic_total.png" alt>
      <div class="sum">
        总金币：
        <span>{{userInfo.gold}}</span>
      </div>
    </div>
    <div class="details">
      <h3>
        <img src="../../static/images/integral_ic_detail.png" alt>
        <span>金币明细</span>
      </h3>
      <integral-detail></integral-detail>
    </div>
    <div class="backtop" @click="backtop">返回顶部</div>
  </div>
</template>

<script>
import IntegralDetail from "./IntegralDetail";
import common from "../api/common";

export default {
  name: "integral",
  components: {
    IntegralDetail
  },
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo"))
    };
  },
  created() {},
  methods: {
    backtop() {
      document.documentElement.scrollTop = 0;
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
@mixin font($size: 16px, $color: #333) {
  font-size: $size;
  color: $color;
}

.total {
  @include size(100%, 124px);
  line-height: 124px;
  background: #fff;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 0 40px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
  img {
    vertical-align: middle;
  }
  .sum {
    margin-left: 6px;
    display: inline-block;
    @include font(20px, #666);
    vertical-align: middle;
    span {
      @include font(36px, #e64340);
    }
  }
  p {
    vertical-align: middle;
    float: right;
    display: inline-block;
    @include font(16px, #bbb);
    &.score {
      color: #666;
      span {
        color: #e64340;
      }
    }
  }
}
.details {
  margin-top: 40px;
  // @include size(100%, 500px);
  width: 100%;
  min-height: 500px;
  box-sizing: border-box;
  padding: 0 40px 1px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
  h3 {
    padding: 35px 0 20px;
    border-bottom: 1px solid #ddd;
    img {
      vertical-align: middle;
    }
    span {
      display: inline-block;
      vertical-align: middle;
      margin-left: 6px;
      @include font(18px, #333);
      font-weight: normal;
    }
  }
}
</style>
