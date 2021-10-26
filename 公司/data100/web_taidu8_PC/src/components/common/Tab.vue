<template>
  <div class="tabs">
    <div
      class="tab"
      :class="[init==index?'active':'']"
      v-for="(tab, index) in tabData"
      :key="index"
      @click="selectTab(index)"
    >
      <span>{{tab}}</span>
    </div>
    <!-- <img
      v-show="fromPage=='loginPage'&&init==0"
      @click="selectTab(1)"
      src="../../../static/images/login_ic_mob.png"
      alt
    />
    <img
      v-show="fromPage=='loginPage'&&init==1"
      @click="selectTab(0)"
      src="../../../static/images/login_ic_qcode.png"
      alt
    />-->
  </div>
</template>
<script>
import common from "../../api/common";
export default {
  name: "tab",
  props: ["tabData", "fromPage"],
  data() {
    return {
      init: 0
    };
  },
  mounted() {
    console.log(common.GetRequest());
    if (common.GetRequest().index != undefined) {
      this.init = common.GetRequest().index;
      console.log(this.init);
    }
  },
  methods: {
    selectTab(index) {
      if (this.init != index) {
        this.init = index;
        this.$emit("actived", index);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.tabs {
  overflow: hidden;
  .tab {
    font-size: 18px;
    color: #999;
    float: left;
    width: 25%;
    text-align: center;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
  }
}
// 问卷列表页
.surveyList {
  .tabs {
    border-bottom: 1px solid #ddd;
    .tab {
      width: 33.33%;
    }
  }
  .tab.active {
    border-bottom: 4px solid #7575f9;
    color: #343434;
  }
}

// 登录页
.login .tabs {
  // position: relative;
  background: linear-gradient(#efefef, #f6f5f5);
  // img {
  //   cursor: pointer;
  //   position: absolute;
  //   top: 0;
  //   right: 0;
  // }
  .tab {
    width: 50%;
    color: #666;
    span {
      display: inline-block;
      height: 58px;
    }
    &.active {
      color: #7575f9;
      span {
        border-bottom: 2px solid #7575f9;
      }
    }
  }
}
</style>
