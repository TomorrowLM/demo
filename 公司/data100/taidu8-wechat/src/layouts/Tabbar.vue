<template>
  <div class="tabbar">
    <div class="content">
      <!--<router-view/>-->
      <survey-list v-if="active==='index'"></survey-list>
      <user v-if="active==='user'"></user>
    </div>
    <van-tabbar v-model="active" active-color="#7575f9" @change="onChange" :class="{bar_bottom:isIPhoneX}">
      <!-- :route='true'-->
      <!--<van-tabbar-item icon="home-o" name="index" to="/tabs/index">首页</van-tabbar-item>
      <van-tabbar-item icon="friends-o" name="user" to="/tabs/user">我的</van-tabbar-item>-->
      <van-tabbar-item name="index">
        <img v-if="active=='index'" src="../assets/images/Tab_ic_que_sel.png" alt srcset />
        <img v-else src="../assets/images/Tab_ic_que_nor.png" alt srcset />
        <p>答问卷</p>
      </van-tabbar-item>
      <van-tabbar-item name="user">
        <img v-if="active=='user'" src="../assets/images/Tab_ic_my_sel.png" alt srcset />
        <img v-else src="../assets/images/Tab_ic_my_nor.png" alt srcset />
        <p>个人中心</p>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import SurveyList from "@/views/survey/Index.vue";
import user from "@/views/user/Index.vue";
import { getWechatOauth } from "@/api/survey";
import {isIPhoneX} from "../utils/base"
export default {
  components: {
    SurveyList,
    user
  },
  data() {
    return {
      active: "index",
      isIPhoneX:isIPhoneX()
    };
  },
  created() {
    // this.$ls.set('token', '8207C2891BCE3790559E5049D7349C5276E0A7E18738FC5CC0C9B6AA15638B78')
    sessionStorage.removeItem('terminalCode')//非分享流程清除terminalCode
    if (sessionStorage.getItem("tabIndex")) {
      this.active = sessionStorage.getItem("tabIndex");
    }
  },
  methods: {
    onChange(index) {
      if (this.$ls.get("token")) {
        sessionStorage.setItem("tabIndex", index);
      } else {
        if (index == "user") {
          this.active = "index";
          getWechatOauth("?type=1");
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
//@import url()
.tabbar {
  height: 100%;
  .van-tabbar {
    height: auto;
    padding-bottom: 10px;
    &.bar_bottom{
      padding-bottom:15px;
    }
  }
  // .van-tabbar-item__icon {
  //   display: none;
  // }
  p {
    font-size: 20px;
  }
  img {
    margin: 0 auto 10px;
    display: block;
    width: 44px;
    height: 44px;
  }
  .content {
    height: calc(100% - 100px);
  }
}
</style>