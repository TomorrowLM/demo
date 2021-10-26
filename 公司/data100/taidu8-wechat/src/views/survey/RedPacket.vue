<template>
  <div class="redPacket" v-if="stat">
    <novice-notice-bar :userId="datas.taidu8Id" v-if="stat !== 1 && datas.taidu8Id" />
    <div class="redPacketContent">
      <div
        class="showGold"
        :class="{'success': stat === 1, 'condition': stat === 2, 'full': stat === 3}"
      >
        <p v-if="stat === 1">成功完成</p>
        <p v-else-if="stat === 2">条件不符</p>
        <p v-else-if="stat === 3">名额已满</p>
        <p>获得金币个数</p>
        <p>
          <span v-if="isDoubleFlag==0">{{datas.detail.finalGold}}</span>
          <span v-if="isDoubleFlag==1">{{finalGold}}</span>
        </p>
        <p v-if="isDoubleFlag==1" class="double">已翻倍</p>
      </div>
      <div
        class="reward_double"
        @click="getTickets"
        :style="[availableNum>0&&isDoubleFlag==0?{cursor:'pointer'}:{cursor:'auto'}]"
      >
        <p>卡券</p>
        <div class="tickets" v-if="isTicketsDataLoad">
          <span v-if="isDoubleFlag == 0 && availableNum == 0 && ticketLists.length > 0">
            <span>暂无可用</span>
          </span>
          <span v-if="isDoubleFlag == 0 && availableNum == 0 && ticketLists.length === 0">
            <span>无可用卡券</span>
          </span>
          <span v-if="isDoubleFlag == 0 && availableNum > 0 && discount == ''">
            <span>{{ availableNum }}张卡券可用</span>
          </span>
          <span v-if="isDoubleFlag == 1 && discount!=''">
            <span>已使用</span>
            <span style="color:#ed5758">问卷奖励{{discount}}倍翻倍卡</span>
          </span>
          <img
            v-if="ticketLists.length > 0 && isDoubleFlag == 0"
            src="../../assets/images/ic_arrowr@2x.png"
            alt
          />
        </div>
      </div>
      <div class="shareBtn">
        <button @click="answerSurvey" v-if="[ 'common', 'pc' ].includes(type)">去看看其他问卷</button>
        <!-- <ul>
          <li @click="toHome">继续答题</li>
          <li @click="toUser">立即提现</li>
        </ul>-->
        <button
          v-if="![ 'common', 'pc' ].includes(type) && datas.detail.isShowShareBtn == 1"
          @click="shareClick"
          class="btnShare"
        >{{ datas.detail.flag == 1 ? '分享问卷得提成' : '分享问卷' }}</button>
      </div>
      <div
        class="tips_bg"
        v-if="datas.detail.flag == 1 && ![ 'common', 'pc' ].includes(type) && datas.detail.shareDesc && datas.detail.isShowShareBtn == 1"
      >{{ datas.detail.shareDesc }}</div>
      <p class="sm" v-if="[ 'common', 'app', 'pc' ].includes(type)">问卷奖励已存入个人账户,可前往【金币商城】查看明细或兑换物品</p>
      <!-- <div class="awardShowWrap" v-if="[ 'common', 'app', 'pc' ].includes(type)">
        <h3>奖励说明：</h3>
        <div class="awardShow">
          <div>
            <p>{{datas.surveyName}}</p>
            <p>{{datas.surveyId}}</p>
          </div>
          <div>
            +
            <span v-if="isDoubleFlag==0">{{datas.detail.finalGold}}</span>
            <span v-if="isDoubleFlag==1">{{finalGold}}</span>
            金币
          </div>   :style=" background: linear-gradient(
      0deg,
      rgba(251, 219, 184, 1) 0%,
      rgba(249, 119, 120, 1) 100%
    )"
        </div>
      </div>-->
      <div class="publicWelfare" v-if="showPublicWelfarModule">
        <div>
          <div>
            <span>公益助力：</span>
            <span>{{this.assistinfo.assist}}</span>
          </div>
          <span @click="goAssistDetail">{{this.assistinfo.detail}}</span>
        </div>
      </div>
      <div
        class="survey_list_box"
        :style="list&&list.length>0?'background:linear-gradient(0deg,rgba(251, 219, 184, 1) 0%,rgba(249, 119, 120, 1) 100%)':'background:#fff'"
        v-if="![ 'common', 'pc','wechat_share' ].includes(type) && showSurveyList"
      >
        <div class="survey_list_title" v-if="list&&list.length>0">专属高额奖励任务，再不参与就结束啦</div>
        <div class="survey_list_wrap">
          <van-list v-model="loading" :finished="finished" finished-text @load="onLoad">
            <template v-for="(item,index) in list">
              <van-cell :key="index" v-if="index < 3">
                <survey :item="item" type="redPacket" @showPc="show = true"></survey>
              </van-cell>
            </template>
          </van-list>
        </div>
      </div>
      <div class="share" v-if="shareshow && ![ 'common', 'pc' ].includes(type)">
        <img src="../../assets/images/share_img.png" alt />
        <p @click="closeShow" class="closeShow">知道了</p>
      </div>
      <ticket-list
        :isTickets="isTickets"
        @click.native="hideTicketlist"
        :ticketLists="ticketLists"
        :userId="datas.taidu8Id"
        :surveyId="datas.surveyId"
        :availableNum="availableNum"
        :finalGold="datas.detail.finalGold"
      ></ticket-list>
    </div>
    <!--新手30金币弹框-->
    <van-overlay :show="datas.isFirst == 1" @click="closeTips">
      <div class="wrapper" @click.stop>
        <div class="block">
          <div class="bg">
            <div class="tip">~恭喜获得新手金币~</div>
            <div class="reward_gold">30</div>
            <div
              class="tips"
              v-if="this.type === 'pc'||datas.isNewPeriod==0"
            >可在&nbsp;[{{isWeiXin?'个人中心':'我的'}}]&nbsp;-&nbsp;[金币]&nbsp;查看</div>
            <div class="tips" v-else>完成提现，参与新手福利抽奖</div>
            <div class="btn" @click="closeTips" v-if="this.type === 'pc'||datas.isNewPeriod==0">欣然接受</div>
            <div class="btn" @click="goMarket" v-else>去提现</div>
          </div>
        </div>
        <img @click="closeTips" src="../../assets/images/my_pop_btn_close.png" alt srcset />
      </div>
    </van-overlay>
    <van-overlay :show="show" @click="show = false">
      <div class="wrapper" @click.stop>
        <div class="block">
          <div class="bg">
            <img src="../../assets/images/survey/que_pop_pcimg.png" alt srcset />
            <div class="tip">电脑答题，红包更大</div>
            <div class="tips">
              此问卷只能在电脑端参与：电脑端搜索【拼任务】，或输入网址：
              <span>www.pinrenwu.cn</span>，登录后即可参与。
            </div>
          </div>

          <van-button class="btn" @click="show = false"
            v-clipboard:copy="'www.pinrenwu.cn'" 
            v-clipboard:success="onCopy" 
            v-clipboard:error="onCopyError"
          >复制网址</van-button>
        </div>
        <img @click="show = false" src="../../assets/images/my_pop_btn_close.png" alt srcset />
      </div>
    </van-overlay>
    <!--banner广告-->
    <!-- <div class="banner_advertguang" id="banner_2_0" v-if="!isWeiXin"></div> -->
  </div>
</template>

<script>
import Survey from "./Survey";
import { CardTicketV5, isHaveTickets, partition_survey, publicWelfarEelements, isShowPublicWelfar } from "@/api/survey.js";
import TicketList from "./Ticket.vue";
import { mixin } from "@/utils/mixin/list";
import { Toast } from 'vant'
export default {
  name: "redpacket",
  components: {
    TicketList,
    Survey
  },
  mixins: [mixin],
  data() {
    return {
      redpackShow: false,
      datas: JSON.parse(decodeURIComponent(this.$route.params.data)),
      lists: [],
      shareshow: false,
      stat: "",
      finalGold: "",
      isTickets: false,
      isTicketsDataLoad: false,
      ticketLists: [],
      params: {},
      isDoubleFlag: -1, //是否翻倍 0:否1：是
      availableNum: 0,
      discount: "", //翻倍卡
      show: false,
      type: "",
      showSurveyList: true,
      isWeiXin:
        navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1,
      domainName:window.location.origin,
      assistinfo: {},
      publicWelfarExist: {},
      showPublicWelfarModule: false,
      jumpUrl: '',
    };
  },
  created() {
    document.title = this.datas.surveyId;
    this.type = this.$route.query.type;
    if (
      sessionStorage.getItem("terminalCode") &&
      sessionStorage.getItem("terminalCode") == 6
    ) {
      //分享流程中的不展示问卷列表
      this.type = "wechat_share";
    }
    this.isHaveTickets();
    this.isShowPublicWelfar();
  },
  watch: {
    list(data) {
      if (data.length === 0) {
        this.showSurveyList = false;
      }
    }
  },
  methods: {
    onCopy () {
      Toast.success('已复制')
    },
    onCopyError () {
      Toast.fail('复制失败')
    },
    goMarket() {
      const isIOS = !!navigator.userAgent.match(
        /\(i[^;]+;( U;)? CPU.+Mac OS X/
      );
      const isAndroid =
        navigator.userAgent.indexOf("Android") > -1 ||
        navigator.userAgent.indexOf("Adr") > -1;
      const isWeiXin =
        navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
      if (isWeiXin) {
        // 返回微信列表
        window.location.href = this.domainName + "/wechatpub/market";
          // process.env.VUE_APP_PAGE_BASE_URL + "/wechatpub/market";
      } else {
        if (isIOS) {
          window.webkit.messageHandlers.jumpVc.postMessage("pinrenwu://pinrenwu/TaskGoldShopController?type=19");
        } else if (isAndroid) {
          window.control.startActivityPage("pinrenwu://pinrenwu?type=19");
        } else {
          // 返回PC列表
          window.close();
        }
      }
    },
    goAssistDetail() {
      const isIOS = !!navigator.userAgent.match(
        /\(i[^;]+;( U;)? CPU.+Mac OS X/
      );
      if (isIOS) {
        window.webkit.messageHandlers.jumpVc.postMessage(this.assistinfo.jumpUrl);
      } else {
        window.control.startActivityPage(this.assistinfo.jumpUrl)
      }
    },
    closeTips() {
      //关闭奖励弹框
      this.datas.isFirst = 0;
    },
    redPacketShow() {
      this.redpackShow = false;
    },
    toHome() {
      this.$router.replace({ name: "tabs" });
    },
    toUser() {
      this.$router.replace({ name: "tabs" });
      sessionStorage.setItem("tabIndex", "user");
    },
    surveyShare() {
      const isIOS = !!navigator.userAgent.match(
        /\(i[^;]+;( U;)? CPU.+Mac OS X/
      );
      if (isIOS) {
        window.webkit.messageHandlers.deductShare.postMessage(null);
      } else {
        window.control.deductShare();
      }
    },
    shareClick() {
      if (this.type === "app") {
        this.surveyShare();
      } else {
        this.shareshow = true;
      }
    },
    closeShow() {
      this.shareshow = false;
    },
    /**
     * 继续答题
     */
    answerSurvey() {
      if (this.type === "pc") {
        window.parent.location.href =  this.domainName.indexOf("/wwwtest.pinrenwu.cn")>-1? this.domainName+"/pc/#/surveyList":
            "https://www.pinrenwu.cn/pc/#/surveyList";
      } else {
        // 如果是问卷分发过来的(此业务已暂停)
        if (
          sessionStorage.getItem("terminalCode_api") &&
          sessionStorage.getItem("terminalCode_api") == "10"
        ) {
          window.location.href =
            // process.env.VUE_APP_PAGE_BASE_URL +
            this.domainName +  "/questionIissue/#/surveycareful";
          return;
        }
        const isIOS = !!navigator.userAgent.match(
          /\(i[^;]+;( U;)? CPU.+Mac OS X/
        );
        const isAndroid =
          navigator.userAgent.indexOf("Android") > -1 ||
          navigator.userAgent.indexOf("Adr") > -1;
        const isWeiXin =
          navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
        if (isWeiXin) {
          // 返回微信列表
          window.location.href = this.domainName + "/wechatpub/surveyOne";
            // process.env.VUE_APP_PAGE_BASE_URL + "/wechatpub/surveyOne";
        } else {
          if (isIOS) {
            window.webkit.messageHandlers.answerSurvey.postMessage(null);
          } else if (isAndroid) {
            window.control.finish();
          } else {
            // 返回PC列表
            window.close();
          }
        }
      }
    },
    loadTicketData() {
      CardTicketV5({
        userId: this.datas.taidu8Id,
        surveyId: this.datas.surveyId
      }).then(response => {
        var list = response.data;
        this.availableNum = 0;
        for (var i = 0; i < list.length; i++) {
          list[i].isUsed = false;
          if (list[i].available) {
            this.availableNum += 1;
          }
        }
        this.isTicketsDataLoad = true;
        this.ticketLists = list;
      });
    },
    // 详情
    isHaveTickets() {
      isHaveTickets({
        userId: this.datas.taidu8Id,
        surveyId: this.datas.surveyId
      }).then(data => {
        // flag:0未使用卡券  1：使用卡券
        this.isDoubleFlag = data.data.flag;
        this.stat = data.data.stat;
        if (data.data.flag == 1) {
          this.discount = data.data.discount;
          this.finalGold = data.data.gold;
        }
        this.loadTicketData();
      });
    },
    //
    isShowPublicWelfar() {
      isShowPublicWelfar().then((res) => {
        this.publicWelfarExist = res.data
        if(this.publicWelfarExist.exist == 1){
          this.showPublicWelfarModule = true;
          this.publicWelfarEelements({id:this.publicWelfarExist.id});
        }
      })
    },
    //
    publicWelfarEelements(params) {
      const isIOS = !!navigator.userAgent.match(
        /\(i[^;]+;( U;)? CPU.+Mac OS X/
      );
      const isAndroid =
      navigator.userAgent.indexOf("Android") > -1 ||
      navigator.userAgent.indexOf("Adr") > -1;
      if(this.isWeiXin){
        publicWelfarEelements(params).then((res) => {
          this.assistinfo = res.data
        })
      }else{
        if(isIOS){
          params.terminalCode = 4
          publicWelfarEelements(params).then((res) => {
            this.assistinfo = res.data
          })
        } else if (isAndroid){
          params.terminalCode = 2
          publicWelfarEelements(params).then((res) => {
            this.assistinfo = res.data
          })
        } else {
            // 返回PC列表
            window.close();
        }
      }
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
    },
    getList() {
      return partition_survey({
        page: 1, // init
        limit: 4, // init
        surveyChannelCode: 0, // 二区问卷的渠道码 init
        userId: this.datas.taidu8Id,
        terminalCode: this.datas.terminalMark,
        isRedPacket: 1,
        type: 0 // 0:一区问卷、1：二区问卷列表 2：pc问卷列表 3：历史问卷（上拉加载） init
      });
    }
  }
};
</script>

<style  scoped lang="less">
.redPacket {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  .banner_advertguang {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
  }
  .redPacketContent {
    padding-bottom: 40px;
    // flex: 1 0;
    overflow: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }
  .publicWelfare{
    width: 630px;
    height: 121px;
    opacity: 1;
    background: linear-gradient(#f8f2ef 0%, #f6c7ee 100%);
    border-radius: 20px;
    margin: auto;
    margin-top: 31px;
    margin-bottom: 50px;
    position: relative;
    >div{
      width: 570px;
      height: 81px;
      background: url("../../assets/images/survey/publicWelfare.png") center center no-repeat;
      background-size: contain;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin: auto;
      position: absolute;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      >div{
        margin-left: 90px;
        span:nth-of-type(1){
          font-size: 28px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          text-align: left;
          color: #333333;
        }
        span:nth-of-type(2){
          font-size: 28px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          text-align: left;
          color: #E9494A;
        }
      }
      >span{
        font-size: 24px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        color: #7575f9;
      }
    }
  }
  .double {
    margin: 0 auto;
    width: 120px;
    height: 40px;
    line-height: 40px;
    background-image: linear-gradient(to right, #fae1b5, #e3b364);
    font-size: 20px;
    color: #c11616;
    border-radius: 20px;
  }
  .showGold {
    width: 100%;
    height: 460px;
    text-align: center;
    color: #ffe6b4;
    position: relative;
    z-index: 1;
    p:nth-child(1) {
      padding-top: 90px;
      font-size: 26px;
    }
    p:nth-child(2) {
      padding-top: 30px;
      font-size: 30px;
    }
    // p:nth-child(3) {
    //   padding-top: 50px;
    //   font-size: 28px;
    // }
    p:nth-child(3) {
      position: relative;
      height: 90px;
      padding-top: 4px;
      span {
        font-size: 90px;
        position: absolute;
        width: 100%;
        left: 0;
        text-align: center;
        bottom: -20px;
        line-height: 90%;
      }
    }
    p:nth-child(4) {
      margin: 36px auto 0;
    }
  }
  .success {
    background: url(../../assets/images/survey/que_openenv_bg2.png) no-repeat;
    background-size: 100% 100%;
  }
  .condition {
    background: url(../../assets/images/survey/que_openenv_bg3.png) no-repeat;
    background-size: 100% 100%;
  }
  .full {
    background: url(../../assets/images/survey/que_openenv_bg1.png) no-repeat;
    background-size: 100% 100%;
  }
  .border {
    width: 100%;
    height: 180px;
    background: #ed5757;
    border-radius: 0 0 100% 100%;
    margin-top: -90px;
  }
  .reward_double {
    margin: 40px auto 0;
    width: 80%;
    border-bottom: @PX solid #ddd;
    padding: 40px 0 60px;
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
        margin-right: 2px;
        display: inline-block;
        vertical-align: middle;
        color: #8d97b5;
      }
      img {
        width: 20px;
        vertical-align: middle;
      }
    }
  }
  .survey_list_box {
    width: 630px;
    min-height: 622px;
    // background: linear-gradient(
    //   0deg,
    //   rgba(251, 219, 184, 1) 0%,
    //   rgba(249, 119, 120, 1) 100%
    // );
    border-radius: 20px;
    margin: 80px auto 0;
    position: relative;
    .survey_list_title {
      width: 512px;
      height: 60px;
      background: url("../../assets/images/survey/title_bg.png") no-repeat;
      background-size: cover;
      position: absolute;
      left: 0;
      right: 0;
      top: -20px;
      font-size: 26px;
      color: rgba(255, 255, 255, 1);
      text-align: center;
      line-height: 60px;
      margin: 0 auto;
    }
    .survey_list_wrap {
      padding: 80px 20px 20px 20px;
      .van-cell {
        margin-bottom: 10px;
        border-radius: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .shareBtn {
    padding-top: 50px;
    button {
      width: 84%;
      border-radius: 45px;
      margin-left: 8%;
      height: 90px;
      border: @PX solid #ed5757;
      background: #fff;
      color: #ed5757;
      font-size: 32px;
    }
    .btnShare {
      background: #ed5757;
      color: #fff;
      margin-top: 40px;
    }
    ul {
      display: flex;
      justify-content: space-between;
      padding: 0 60px;
      margin-bottom: 30px;
      li {
        width: 300px;
        height: 90px;
        line-height: 90px;
        border: 3px solid @taidu8-red;
        border-radius: 45px;
        text-align: center;
        font-size: 32px;
        color: @taidu8-red;
      }
    }
  }
  .tips_bg {
    width: 630px;
    &:after {
      left: 305px;
    }
  }
  .sm {
    width: 100%;
    padding: 0 8%;
    box-sizing: border-box;
    font-size: 26px;
    color: #666;
    margin-top: 40px;
  }
}

.share {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.72);
  img {
    width: 100%;
  }
}
.closeShow {
  font-size: 28px;
  color: #fff;
  position: absolute;
  left: 50%;
  bottom: 100px;
  width: 72%;
  height: 72px;
  text-align: center;
  border: @PX solid #fff;
  border-radius: 10px;
  line-height: 72px;
  transform: translateX(-50%);
}
.awardShowWrap {
  text-align: left;
  width: 84%;
  margin: 40px auto 0;
}
.awardShowWrap > h3 {
  font-size: 30px;
  color: #333;
  margin-bottom: 40px;
}
.awardShowWrap > h3:before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 30px;
  background: #7575f9;
  margin-right: 16px;
  border-radius: 8px;
}
.awardShow {
  display: flex;
  margin: 0;
  border-bottom: @PX solid #ddd;
  padding-bottom: 20px;
}
.awardShow > div {
  font-size: 24px;
  color: #a9a9a9;
}
.awardShow > div:nth-child(1) {
  flex: 2;
}
.awardShow > div:nth-child(2) {
  flex: 1;
  text-align: right;
}
.awardShow > div:nth-child(1) > p:nth-child(1) {
  font-size: 28px;
  color: #333;
}
.awardShow > div:nth-child(2) {
  font-size: 28px;
  color: #7575f9;
}

.van-overlay {
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper {
  .btn {
    width: 100%;
    margin: 50px auto 0;
    // width: 466px;
    height: 130px;
    line-height: 105px;
    background: rgba(0, 0, 0, 0)
      url(../../assets/images/survey/pop_newuser_hbbtn_bg.png) no-repeat center;
    background-size: contain;
    color: #bb6b18;
    font-size: 34px;
    text-align: center;
    border: none;
    span{
      display: inline-block;
      margin-top:-20px;
    }
  }
  .block {
    .bg {
      width: 723px;
      height: 682px;
      box-sizing: border-box;
      padding: 80px 0 0 0;
      background: rgba(0, 0, 0, 0)
        url(../../assets/images/survey/pop_newuser_hbimg.png) no-repeat center;
      background-size: contain;
      box-sizing: border-box;
    }
    img {
      display: block;
      width: 458px;
      height: auto;
    }
    .tip {
      font-size: 32px;
      color: #ed9001;
      margin: 40px 0;
      text-align: center;
    }
    .reward_gold {
      margin-top: 80px;
      font-size: 80px;
      color: #e32b2b;
      text-align: center;
    }
    .tips {
      width: 500px;
      margin:0 auto;
      padding:0 0 0 20px;
      color: #fee4b5;
      font-size: 26px;
      text-align: center;
      // margin-top: 120px;
    }
  }

  img {
    display: block;
    width: 48px;
    height: auto;
    margin: 50px auto 0;
  }
}
</style>
