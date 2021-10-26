<template>
  <div class="wallet">
    <div class="balance">
      <img src="../../static/images/integral_ic_total.png" alt>
      <div class="info">
        <p>
          总金币：
          <span>{{userInfo.gold}}</span>
        </p>
        <p>所获金币可用于兑换商品、参与活动等，详情请至拼任务APP查看！</p>
      </div>
      <div class="download">
        <ul>
          <li>
            <img src="../../static/images/que_ic_iphone.png" alt>
            <span>iPhone下载</span>
          </li>
          <li>
            <img src="../../static/images/que_ic_and.png" alt>
            <span>Android下载</span>
          </li>
        </ul>
        <div class="img">
          <img :src="qrcodeImg" alt>
        </div>
      </div>
    </div>
    <div class="details">
      <div class="title">
        <ul>
          <li :class="[tabIndex==0?'active':'']" @click="changeTab(0)">收入</li>
          <li :class="[tabIndex==1?'active':'']" @click="changeTab(1)">兑换</li>
        </ul>
        <div class="sum">
          <img src="../../static/images/wallet_ic_total2.png" alt>
          <p v-show="tabIndex==0">
            累计收入：
            <span>{{userInfo.totalGold}}</span>
          </p>
          <p v-show="tabIndex==1">
            累计兑换：
            <span>{{userInfo.withdrawGold}}</span>
          </p>
        </div>
      </div>
      <income-detail v-show="tabIndex==0"></income-detail>
      <out-detail v-show="tabIndex==1"></out-detail>
    </div>
    <div class="backtop" @click="backtop">返回顶部</div>
  </div>
</template>

<script>
import eventBus from "../services/eventBus.js";
import IncomeDetail from "./GoldIncome";
import OutDetail from "./GoldOut";
import QRCode from "qrcode";
import url from "../api/url";
export default {
  name: "wallet",
  components: {
    IncomeDetail,
    OutDetail
  },
  data() {
    return {
      tabIndex: 0,
      qrcodeImg: "",
      userInfo: JSON.parse(localStorage.getItem("userInfo"))
    };
  },
  created() {
    QRCode.toDataURL(url.basePage + "/common/share/#/homeshare")
      .then(url => {
        this.qrcodeImg = url;
      })
      .catch(err => {
        console.error(err);
      });
  },
  mounted() {
    eventBus.$on("userInfo", data => {
      this.userInfo = data;
      console.log(data, "实时更新信息");
    });
  },
  destroyed() {
    eventBus.$off("userInfo");
  },
  methods: {
    changeTab(index) {
      if (this.tabIndex != index) {
        this.tabIndex = index;
      }
    },
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
.balance {
  @include size(100%, 168px);
  line-height: 168px;
  background: #fff;
  box-sizing: border-box;
  padding: 0 40px;
  border-radius: 6px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
  img {
    vertical-align: middle;
  }
  .info {
    max-width: 43%;
    vertical-align: middle;
    display: inline-block;
    line-height: 30px;
    p {
      margin-left: 6px;
      &:nth-child(1) {
        font-size: 20px;
        color: #666;
        span {
          font-size: 36px;
          color: #e64340;
          margin-right: 6px;
        }
      }
      &:nth-child(2) {
        margin-top: 8px;
        font-size: 14px;
        color: #999;
        line-height: 20px;
      }
    }
  }
  .download {
    display: inline-block;
    float: right;
    vertical-align: middle;
    line-height: 0px;
    margin-top: 20px;

    ul {
      display: inline-block;
      vertical-align: middle;
      li {
        @include size(152px, 40px);
        line-height: 40px;
        border: 1px solid #666;
        border-radius: 20px;
        text-align: center;
        &:nth-child(2) {
          margin-top: 22px;
        }
        span {
          display: inline-block;
          vertical-align: middle;
          margin-left: 10px;
        }
        img {
          vertical-align: middle;
        }
      }
    }
    .img {
      display: inline-block;
      vertical-align: middle;
      @include size(128px, 128px);
      // background: #222;
      img {
        max-width: 100%;
        max-height: 100%;
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
  padding: 40px 40px 0;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
  .title {
    border-bottom: 1px solid #ddd;
    height: 52px;
    position: relative;
    ul {
      // float:left;
      position: absolute;
      bottom: -1px;
      li {
        border: 1px solid #ddd;
        margin-right: 10px;
        float: left;
        @include size(186px, 50px);
        text-align: center;
        line-height: 50px;
        font-size: 16px;
        color: #333;
        background: #fff;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        cursor: pointer;
        &.active {
          color: #999;
          background: #f6f6f6;
          border-bottom: 1px solid #fff;
        }
      }
    }
    .sum {
      float: right;
      margin-top: 5px;
      img {
        vertical-align: middle;
        margin: 5px 6px 0 0;
      }
      p {
        vertical-align: middle;
        display: inline-block;
        vertical-align: middle;
        font-size: 16px;
        color: #666;
        span {
          font-size: 24px;
          color: #7575f9;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
