<template>
  <div class="open-packet">
    <com-header></com-header>
    <div class="bg" v-if="!isOpen">
      <img class="logo" src="../../static/images/my_m_logo.png" alt>
      <p>拼任务</p>
      <p>{{msg1}}</p>
      <p>{{msg2}}</p>
      <!-- <p v-if="isSuccess ==true">发了一个红包，金额随机</p>
      <p v-if="isSuccess ==false">哎呀,答题失败了</p>

      <p v-if="isSuccess ==true">认真答题，运气才会好</p>
      <p v-if="isSuccess ==false">您的参与是我们前进的动力</p>-->
      <img class="open" @click="open" src="../../static/images/btn-openwal.png" alt>
    </div>
    <div v-if="isOpen&&isSuccess" class="details">
      <div class="logo_bg">
        <img src="../../static/images/my_m_logo.png" alt>
      </div>
      <p>{{msg}}</p>
      <div class="money">
        获得
        <span>{{packetDetails.finalAmount}}</span>元红包、
        <span>{{packetDetails.integral}}</span>积分
      </div>
      <img class="joy" src="../../static/images/share_img_sucque.png">
      <button @click="goLists">去看看其他问卷</button>
      <ul>
        <li>
          <img src="../../static/images/ic-rules.png" alt>
          <span>奖励说明：</span>
        </li>
        <li>总奖励：{{packetDetails.initAmount}}×{{packetDetails.integralMultiple}}={{packetDetails.finalAmount}}元</li>
        <li>
          <span></span>
          问卷奖励{{packetDetails.initAmount}}元
        </li>
        <li>
          <span></span>
          当前积分可以获得{{packetDetails.integralMultiple}}倍奖励
        </li>
        <li>问卷总奖励已存入钱包；</li>
        <li>
          积分请到拼任务APP
          <span>【我的】</span>-
          <span>【任务中心】</span>-
          <span>【问卷任务】</span>领取
        </li>
      </ul>
    </div>
    <div class="successOpen details" v-if="isOpen&&!isSuccess">
      <img v-if="failNum == 0" src="../../static/images/que_falimg1.png" alt>
      <img v-if="failNum == 1" src="../../static/images/que_falimg2.png" alt>
      <img v-if="failNum == 2" src="../../static/images/que_falimg3.png" alt>
      <img v-if="failNum == 3" src="../../static/images/que_falimg4.png" alt>
      <img v-if="failNum == 4" src="../../static/images/que_falimg5.png" alt>
      <div class="dis">
        奖励您
        <span>{{packetDetails.finalAmount}}</span>元，
        <span>{{packetDetails.integral}}</span>积分
      </div>
      <div class="download" @click="goLists">答问卷，获得更多奖励</div>
    </div>
  </div>
</template>

<script>
import common from "../api/common";
export default {
  name: "openpacket",

  data() {
    return {
      isOpen: false,
      isSuccess: null, //是否成功完成问卷
      msg: "恭喜！成功完成问卷",
      msg1: "",
      msg2: "",
      packetDetails: {},
      failNum: 0
      // params:{}
    };
  },
  created() {
    var url = decodeURIComponent(window.location.href);
    // var url = decodeURIComponent(
    //   "https://wwwtest.pinrenwu.cn/pc/#/open?key=F79FA875E1E74D1C2B52B7EAA77CB300&taidu8Id=26ff01f89f7b7a4f&surveyId=S201901161821FVQ&status=1&terminalMark=3"
    // );
    console.log(url, "地址参数");
    var params = common.getParams(url);
    console.log(params, "收到的参数");
    common.respondSurvey(params).then(data => {
      console.log(data);
      this.packetDetails = data.data.rows;
      if (data.data.code == 3) {
        //用户答过此问卷 展示红包结果
        this.isOpen = true;
        this.failNum = Math.floor(Math.random() * 5);
      } else if (data.data.code == 2) {
        //status为123 有红包奖励
        var status = data.data.rows.status;
        if (status == 1) {
          //成功
          this.isSuccess = true;
          this.msg1 = "发了一个红包，金额随机";
          this.msg2 = "认真答题，运气才会好";
          this.msg = "恭喜！成功完成问卷";
        } else if (status == 2 || status == 3) {
          this.msg1 = "哎呀,答题失败了";
          this.msg2 = "您的参与是我们前进的动力";
          this.isSuccess = false;
          this.failNum = Math.floor(Math.random() * 5);
          //失败奖励红包
          this.msg = "获得奖励红包";
        }
      } else if (data.data.code == -1) {
        //服务器出现错误请与管理员联系
        this.$router.replace({ name: "ErrorPage" });
      } else {
        //status为456 没有红包奖励
        //4:其他(系统错误)
        //5：用户已答题
        //6：问卷过期
        if (
          data.data.rows.status == 5 ||
          data.data.rows.status == 6 ||
          data.data.rows.status == 4
        ) {
          this.$router.replace({
            name: "UnqualifiedPage",
            params: { msg: data.data.rows.status }
          });
        }
      }
    });
  },
  methods: {
    open() {
      this.isOpen = true;
    },
    goLists() {
      this.$router.replace({ name: "SurveyList" });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.open-packet {
  width: 100%;
  height: 100%;
  // background: rgba(0, 0, 0, 0.6);
  padding-top: 100px;
  box-sizing: border-box;
  .bg {
    height: 461px;
    margin: 20px auto 0;
    background: url(../../static/images/bg-hb01.png) no-repeat center top;
    background-size: contain;
    padding-top: 1px;
    color: #dbbc83;
    font-size: 15px;
    text-align: center;
    .logo {
      width: 50px;
      height: 50px;
      margin-top: 50px;
    }
    p {
      line-height: 25px;

      // &:nth-child(5) {
      //   color: #fceab6;
      //   font-size: 18px;
      //   margin-top: 40px;
      // }
      // &:nth-child(6) {
      //   color: #fceab6;
      //   font-size: 18px;
      // }
      &:nth-child(4) {
        color: #fceab6;
        font-size: 18px;
        margin-top: 80px;
      }
    }
    .open {
      margin-top: 10px;
      width: 90px;
      height: 90px;
      cursor: pointer;
    }
  }
  .details {
    width: 750px;
    min-height: 100%;
    background: #fff;
    margin: -20px auto 0;
    text-align: center;
    .logo_bg {
      width: 100%;
      height: 200px;
      background: url(../../static/images/openredm_bg.png) no-repeat;
      background-size: 100% 100%;
      // text-align: center;
      padding-top: 160px;
      box-sizing: border-box;
    }
    p {
      font-size: 15px;
      color: #888;
      margin-top: 50px;
    }
    .money {
      font-size: 18px;
      color: #353535;
      margin-top: 10px;
      span:nth-child(1) {
        color: #e64340;
        font-size: 35px;
      }
      span:nth-child(2) {
        color: #7575f9;
      }
    }
    .joy {
      margin-top: 30px;
      width: 260px;
    }
    button {
      width: 80%;
      height: 50px;
      color: #7575f9;
      font-size: 18px;
      border: 1px solid #7575f9;
      border-radius: 5px;
      margin-top: 40px;
      cursor: pointer;
      &:hover {
        background: #7575f9;
        color: #fff;
      }
    }
    ul {
      padding: 0 10%;
      text-align: left;
      font-size: 16px;
      color: #aaa;
      margin-top: 20px;
      padding-bottom: 20px;
      li {
        line-height: 28px;
      }
      li:nth-child(1) {
        color: #7575f9;
        font-size: 18px;
        margin-bottom: 5px;
        img {
          vertical-align: middle;
          width: 18px;
        }
        span {
          display: inline-block;
          vertical-align: middle;
        }
      }
      li:nth-child(3),
      li:nth-child(4) {
        span {
          display: inline-block;
          width: 10px;
          height: 10px;
          background: #7575f9;
          border-radius: 50%;
          margin-right: 10px;
        }
      }
      li:nth-child(5) {
        margin-top: 10px;
      }
      li:nth-child(6) span {
        color: #576b95;
      }
    }
  }
  .successOpen {
    width: 50%;
    max-width: 750px;
    padding: 20px 0 10px;
    img {
      max-width: 100%;
    }
    .dis {
      margin-top: 10px;
      font-size: 14px;
      color: #888;
      span {
        color: #e64340;
      }
    }
    .download {
      width: 80%;
      height: 45px;
      margin: 15px auto 0;
      text-align: center;
      line-height: 45px;
      background: #7575f9;
      font-size: 17px;
      color: #fff;
      border-radius: 22px;
      box-shadow: 0 15px 20px 0 rgba(255, 133, 51, 0.4);
      cursor: pointer;
    }
  }
}
</style>
