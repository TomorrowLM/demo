<template>
  <div class="open-packet">
    <com-header></com-header>
    <div class="details" v-if="isPacket">
      <iframe v-if="redPacketUrl" style='width: 100%;height: 100%;overflow: hidden;' :src="redPacketUrl" frameborder="0"></iframe>
      <!-- <ul class="logo_bg">
        <li v-if="status === '1'">成功完成</li>
        <li v-else-if="status === '2'">条件不符</li>
        <li v-else-if="status === '3'">名额已满</li>
        <li>获得金币个数</li>
        <li>{{finalGold}}</li>
        <li class="double" v-if="isDoubleFlag==1&&discount!=''">已翻倍</li>
      </ul>
      <div
        class="reward_double"
        @click="getTickets"
        :style="[availableNum>0&&isDoubleFlag==0?{cursor:'pointer'}:{cursor:'auto'}]"
      >
        <p>卡券</p>
        <div class="tickets" v-if="isTicketsDataLoad">
          <span v-if="isDoubleFlag==0&&availableNum==0">
            <span>无卡券可用</span>
          </span>
          <span v-if="isDoubleFlag==0&&availableNum>0&&discount==''">
            <span>{{availableNum}}张卡券可用</span>
          </span>
          <span v-if="isDoubleFlag==1&&discount!=''">
            <span>已使用</span>
            <span style="color:#ed5758">问卷奖励{{discount}}倍翻倍卡</span>
          </span>
          <img v-if="availableNum>0&&isDoubleFlag==0" src="../assets/ic_arrowr.png" alt />
        </div>
      </div>
      <button @click="goLists">去看看其他问卷</button>
      <div class="dis">问卷奖励已存入个人账户，可前往拼任务APP【我的】-【金币商城】查看或兑换物品</div> -->
    </div>
    <!-- <ticket-list
      v-if="isTickets"
      @click.native="hideTicketlist"
      :ticketLists="ticketLists"
      :userId="params.taidu8Id"
      :surveyId="params.surveyId"
      :finalGold="finalGold"
    ></ticket-list> -->
  </div>
</template>

<script>
import common from "../api/common";
import TicketList from "./common/Ticket";
export default {
  name: "openpacket",
  components: {
    TicketList
  },
  data() {
    return {
      isPacket: false,
      finalGold: "",
      status: '',
      isTickets: false,
      isTicketsDataLoad: false,
      ticketLists: [],
      params: {},
      isDoubleFlag: -1, //是否翻倍 0:否1：是
      availableNum: 0,
      discount: "", //翻倍卡
      redPacketUrl: ""
    };
  },
  created() {
    var url = decodeURIComponent(window.location.href);
    // var url = decodeURIComponent(
    //   "https://wwwtest.pinrenwu.cn/pc/#/open?key=F79FA875E1E74D1C2B52B7EAA77CB300&taidu8Id=26ff01f89f7b7a4f&surveyId=S201901161821FVQ&status=1&terminalMark=3"
    // );
    console.log(url, "地址参数");
    var params = common.getParams(url);
    this.params = params;
    console.log(params, "收到的参数");
    common.respondSurvey(params).then(data => {
      // data = {"code":1,"msg":"success","data":{"msg":"返回信息到用户奖励页面","code":2,"taidu8Id":"e0f5b586fd04be5a","surveyId":"S202009011138S4D","surveyName":"445","isBindPhone":null,"invitationCode":null,"terminalMark":"3","isFirst":"0","detail":{"finalGold":"100","status":"1","flag":"0","adFlag":null,"adUrl":null,"shareDesc":"","answerTime":"2020-09-03 15:00:02"}}}
      console.log(data,process.env.BASE_PAGE);
      var redPacketUrl = process.env.BASE_PAGE + '/wechatpub/redPacket/' + JSON.stringify(data.data) + "?type=pc"
      console.log(redPacketUrl)
      this.redPacketUrl = process.env.BASE_PAGE + '/wechatpub/redPacket/' + JSON.stringify(data.data) + "?type=pc"
      // console.log("打印参数",redPacketUrl,data.data)
      this.finalGold = data.data.detail.finalGold;
      this.status = data.data.detail.status;
      if (data.data.code == 3) {
        // // 用户答过此问卷 4.1.0版本
        // this.$router.replace({
        //   name: "Reanswer",
        //   params: { surveyId: params.surveyId }
        // });

        // 4.2.0版本
        //data.data.detail.status为4567 没有红包奖励  123有红包奖励
        //4:其他(系统错误)
        //5：用户已答题
        //6：问卷过期
        // 7：前置问卷被甄别

        this.$router.replace({
          name: "ReanswerDated",
          params: {
            surveyId: params.surveyId,
            answerTime: data.data.detail.answerTime,
            finalGold: data.data.detail.finalGold,
            taidu8Id:this.params.taidu8Id,
            status: data.data.detail.status
          }
        });

        ////用户答过此问卷 展示红包结果  3.0版本
        // this.isPacket = true;
        // this.isHaveTickets();
        // this.loadTicketData();
      } else if (data.data.code == 2) {
        //status为123 有红包奖励
        var status = data.data.detail.status;
        if (status == 1 || status == 2 || status == 3) {
          //成功、失败奖励红包
          this.isPacket = true;
          this.isHaveTickets();
          this.loadTicketData();
        }
      } else if (data.data.code == -1) {
        //服务器出现错误请与管理员联系
        this.$router.replace({ name: "ErrorPage" });
      } else {
        //status为4567 没有红包奖励
        //4:其他(系统错误)
        //5：用户已答题
        //6：问卷过期
        // 7：前置问卷被甄别
        if (
          data.data.detail.status == 5 ||
          data.data.detail.status == 6 ||
          data.data.detail.status == 4
        ) {
          this.$router.replace({
            name: "UnqualifiedPage",
            params: { msg: data.data.detail.status }
          });
        }
      }
    });
  },
  // mounted() {
  //   this.isHaveTickets();
  //   this.loadTicketData();
  // },
  methods: {
    goLists() {
      this.$router.replace({
        name: "SurveyList"
      });
    },
    loadTicketData() {
      common.cardTicket(this.params.taidu8Id).then(data => {
        var list = data.data;
        this.availableNum = 0
        for (var i = 0; i < list.length; i++) {
          list[i].isUsed = false;
          if (this.finalGold > 100 || list[i].type === 4) {
            this.availableNum += 1
          }
        }
        this.isTicketsDataLoad = true;
        this.ticketLists = list;
      });
    },
    // 详情
    isHaveTickets() {
      common
        .isHaveTickets(this.params.taidu8Id, this.params.surveyId)
        .then(data => {
          // flag:0未使用卡券  1：使用卡券
          console.log(999999992)
          this.isDoubleFlag = data.data.flag;
          if (data.data.flag == 1) {
            this.discount = data.data.discount;
            this.finalGold = data.data.gold;
          }
        });
    },
    // 卡券列表
    getTickets() {
      if (
        this.ticketLists.length > 0 &&
        this.discount == "" &&
        this.isDoubleFlag == 0
      ) {
        this.isTickets = true;
      }
    },
    hideTicketlist() {
      var list = this.ticketLists;
      for (var i = 0; i < list.length; i++) {
        list[i].isUsed = false;
      }
      this.ticketLists = list;
      this.isTickets = false;
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
  .details {
    overflow: hidden;
    width: 500px;
    height: 100%;
    min-height: 100%;
    background: #fff;
    margin: -20px auto 0;
    text-align: center;
    padding-bottom: 30px;
    box-sizing: border-box;
    .logo_bg {
      margin-left: -5%;
      width: 110%;
      height: 300px;
      background: -webkit-linear-gradient(
        #f47b7c,
        #ed5757
      ); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(#f47b7c, #ed5757); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(#f47b7c, #ed5757); /* Firefox 3.6 - 15 */
      background: linear-gradient(#f47b7c, #ed5757); /* 标准的语法 */
      border-bottom-left-radius: 50% 150px;
      border-bottom-right-radius: 50% 150px;
      padding-top: 50px;
      box-sizing: border-box;
      font-size: 18px;
      color: #ffe6b4;
      & li:nth-child(1) {
        font-size: 22px;
      }
      & li:nth-child(2) {
        margin-top: 15px;
      }
      & li:nth-child(3) {
        margin-top: 5px;
        font-size: 50px;
      }
      .double {
        margin: 0 auto;
        width: 60px;
        height: 20px;
        line-height: 20px;
        background-image: linear-gradient(to right, #fae1b5, #e3b364);
        font-size: 10px;
        color: #c11616;
        border-radius: 10px;
      }
    }
    button {
      width: 80%;
      height: 50px;
      color: #ed5757;
      font-size: 18px;
      border: 2px solid #ed5757;
      border-radius: 45px;
      margin-top: 90px;
      cursor: pointer;
      // &:hover {
      //   background: #ed5757;
      //   color: #fff;
      // }
    }
    .dis {
      margin-top: 60px;
      font-size: 15px;
      color: #888;
    }
    .reward_double {
      margin: 20px auto 0;
      width: 80%;
      border-bottom: 1px solid #ddd;
      padding: 20px 0 30px;
      cursor: pointer;
      p {
        float: left;
      }
      div {
        float: right;
      }
      .tickets {
        span {
          margin-top: -2px;
          display: inline-block;
          vertical-align: middle;
          color: #8d97b5;
        }
        img {
          width: 10px;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
