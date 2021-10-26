<template>
  <div class='smashed_egg' ref="smashedEgg">
    <!-- <audio src="../../../public/sound.mp3" controls="controls" preload id="music" hidden></audio> -->
    <div class="rule" @click="showRule = true;">规则说明</div>
    <van-dialog class="rule_info_dialog" v-model="showRule" confirm-button-text="知道了" confirm-button-color="#fff">
      <div class="rule_info">
        <h3>规则说明</h3>
        <p>{{ rule }}</p>
      </div>
    </van-dialog>
    <div class="header">
      <div class="header_content">
        <div class="notice">
          <van-notice-bar :scrollable="false">
            <van-swipe
              vertical
              class="notice-swipe"
              :autoplay="3000"
              :show-indicators="false"
            >
              <van-swipe-item v-for="(item, index) in winRecordList" :key="index">
                <img :src="item.url" alt="">
                <p>{{ item.info }}</p>
              </van-swipe-item>
            </van-swipe>
          </van-notice-bar>
        </div>
        <div class="title">
          <img src="../../assets/images/activity/smashedEgg/title_bg@2x.png" alt="">
        </div>
        <div class="egg" @click="activitySmashEggSmash">
          <img v-show="!startSmashedEgg" src="../../assets/images/activity/smashedEgg/egg@2x.png" alt="">
        </div>
        <div v-show="startSmashedEgg" id="eggSvga" class="eggSvga" ref="eggCanvas"></div>
        <!-- <div class="hammer" ref="hammer">
          <img src="../../assets/images/activity/smashedEgg/hammer.png" alt="">
        </div> -->
        <div class="opportunities">剩余<span>{{ number }}次</span>砸蛋机会</div>
        <div class="prize">
          <vue-seamless-scroll :data="prizeList" :class-option="optionLeft" class="seamless-warp">
            <ul class="item">
              <li v-for="(item, index) in prizeList" :key="index">
                <img :src="item.url" alt="">
                <p>{{ item.name }}</p>
              </li>
            </ul>
          </vue-seamless-scroll>
        </div>
        <!-- <div class="bg_prize"></div> -->
      </div>
    </div>
    <div class="content">
      <div class="task_title">您可通过以下动作获得砸蛋机会</div>
      <div :class="isTaskOpen ? 'task_container' : 'task_container put_task_container'">
        <div class="task_list" v-for="(item, index) in taskList" :key="index" v-show="item.show">
          <div class="task_img">
            <img :src="item.url" alt="">
          </div>
          <div class="task_info">{{ item.info }}</div>
          <div class="task_button">
            <van-button plain round type="primary" :disabled="!item.jumpUrl" @click="clickTask(item)">{{ item.button }}</van-button>
          </div>
        </div>
      </div>
      <!-- <div class="unfoldAndFold" @click="taskOpen">{{ isTaskOpen ? '点击收起' : '点击展开' }}</div> -->
    </div>
    <div class="tips" v-if="isIOS">本活动与苹果公司无关</div>
    <van-dialog class="win_prize_dialog" v-model="showWinPrize" confirm-button-text="确定" confirm-button-color="#fff">
      <div class="win_prize">
        <div class="win_prize_bg">
          <img src="../../assets/images/activity/smashedEgg/win_prize@2x.png" alt="">
        </div>
        <div class="win_prize_img">
          <img v-show="winPrizeInfo.type === '0'" src="../../assets/images/activity/smashedEgg/win_prize_gold@2x.png" alt="">
          <img v-show="winPrizeInfo.type === '1'" src="../../assets/images/activity/smashedEgg/win_prize_card@2x.png" alt="">
          <img v-show="winPrizeInfo.type === '2' || winPrizeInfo.type === '3'" src="../../assets/images/activity/smashedEgg/win_prize_goods@2x.png" alt="">
        </div>
        <div class="win_prize_info">
          <h3>{{ winPrizeInfo.info }}</h3>
          <p v-show="winPrizeInfo.type === '0'">金币已存入您的账户，可前往<span @click="clickTask(winPrizeInfo)">【商城】</span>兑换商品。</p>
          <p v-show="winPrizeInfo.type === '1'">卡券已存入<span @click="clickTask(winPrizeInfo)">【奖品中心】</span>，请尽快使用。</p>
          <p v-show="winPrizeInfo.type === '2' || winPrizeInfo.type === '3'">奖品存入<span @click="clickTask(winPrizeInfo)">【奖品中心】</span>，{{ winPrizeInfo.type === '2' ? '请尽快填写收货信息。' : '话费将于十日内充值到您注册拼任务的手机上，请您留意话费余额。'}}</p>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { getActivitySmashEggInfo, getActivitySmashEggWinRecord, activitySmashEggSmash } from '@/api/activity';
import vueSeamlessScroll from 'vue-seamless-scroll';
import SVGA from "svgaplayerweb";

export default {
  name: 'SmashedEgg',
  components: { vueSeamlessScroll },
  data () {
    return {
      params: {},
      rule: '',
      number: 0,
      isTaskOpen: true,
      showRule: false,
      showWinPrize: false,
      startSmashedEgg: false,
      winPrizeInfo: {},
      prizeList: [],
      taskList: [],
      winRecordList: [],
      isIOS: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      isAndroid: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1,
      isWeiXin: navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1,
      terminalCode: ''
    }
  },
  computed: {
    optionLeft () {
      return {
        direction: 2,
        limitMoveNum: this.prizeList.length
      }
    }
  },
  created () {
    this.params = {
      activityId: this.$route.params.id,
      token: this.$route.query.token,
      //token: "996E4AA6986A1FE01BF7EA50D5907F193B79B43CCD65902AC1ECF683FEFA0801",
      terminalCode: this.isIOS ? '4' : '2'
    }
    this.getActivitySmashEggInfo()
    this.getActivitySmashEggWinRecord()
    // if (this.isWeiXin) {
    //   this.getActivitySmashEggInfo()
    //   this.getActivitySmashEggWinRecord()
    // } else if (this.isIOS) {
    //   window.webkit.messageHandlers.getLocalInfo.postMessage('token')
    // } else if (this.isAndroid) {
    //   this.params.token = window.control.getAppData("token")
    //   this.getActivitySmashEggInfo()
    //   this.getActivitySmashEggWinRecord()
    // }
  },
  methods: {
    // control(){
    //   const audio = document.getElementById('music');
    //   if(audio !== null){
    //     if(audio.paused){
    //       audio.play(); // 播放
    //     } else  {
    //       audio.pause(); // 暂停
    //     }
    //   }
    // },
    async getActivitySmashEggInfo () {
      const result = await getActivitySmashEggInfo(this.params)
      this.prizeList = result.data.prizeList
      this.rule = result.data.rule
      this.taskList = result.data.methodList
      this.taskList.forEach((val,index) => {
        this.taskList[index]["show"] = JSON.parse(this.taskList[index]["show"])
      });
      this.number = result.data.number
    },
    async getActivitySmashEggWinRecord () {
      const result = await getActivitySmashEggWinRecord(this.params)
      this.winRecordList = result.data
    },
    async activitySmashEggSmash () {
      const result = await activitySmashEggSmash(this.params)
      this.getActivitySmashEggInfo()
      this.winPrizeInfo = result.data
      this.startSmashedEgg = true
      this.playEggSvga()
    },
    taskOpen () {
      this.isTaskOpen = !this.isTaskOpen
      const smashedEgg = this.$refs.smashedEgg
      setTimeout(() => {
        smashedEgg.scrollTo({
          top: smashedEgg.scrollHeight,
          left: 0,
          behavior: 'smooth'
        });
      }, 500)
    },
    clickTask (item) {
      if (this.isIOS) {
        window.webkit.messageHandlers.jumpVc.postMessage(item.jumpUrl);
      } else {
        window.control.startActivityPage(item.jumpUrl)
      }
    },
    playEggSvga () {
      const player = new SVGA.Player('#eggSvga');
      const parser = new SVGA.Parser('#eggSvga');
      parser.load('https://www.pinrenwu.cn/wechatpub/egg.svga', (videoItem) => {
        player.loops = 1;
        player.clearsAfterStop = false;
        player.setVideoItem(videoItem);
        player.startAnimation();
        // setTimeout(() => {
        //   this.control()
        // }, 600)
        player.onFinished(() => {
          this.showWinPrize = true
          this.startSmashedEgg = false
        })
      });
    }
  },
}
</script>

<style lang='scss' scoped>
//@import url()
.smashed_egg{
  width: 100%;
  height: 100%;
  background-color: #6505A6;
  overflow-y: auto;
  overflow-x: hidden;
  .rule{
    position: fixed;
    width: 180px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    background: rgba(255, 230, 176, 0.6);
    border-radius: 30px 0px 0px 30px;
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #840F85;
    right: 0;
    top: 54px;
    z-index: 99;
  }
  /deep/ .rule_info_dialog{
    p{
      white-space: pre-wrap;
    }
    .van-dialog__footer{
      padding: 0 20px;
      &::after{
        display: none;
      }
    }
    .van-button{
      width: 100%;
      height: 50px;
      background: -webkit-gradient(linear, 0% 25%, 75% 100%, from(#FFD541), color-stop(50%, #FC9C8B), color-stop(100%, #DF167D));
      border-radius: 25px;
      display: block;
      margin: 20px auto;
    }
  }
  /deep/ .win_prize_dialog{
    width: 560px;
    overflow: initial;
    border-radius: 40px;
    .van-dialog__footer{
      border-radius: 0 0 20px 20px;
      overflow: hidden;
      &::after{
        display: none;
      }
    }
    .van-button{
      width: 100%;
      height: 75px;
      padding-top: 25px;
      background: url('../../assets/images/activity/smashedEgg/win_prize_button@2x.png') no-repeat;
      background-size: cover;
      display: block;
    }
  }
  .rule_info{
    padding: 30px 40px 0 40px;
    h3{
      width: 392px;
      height: 42px;
      font-size: 30px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #CB005E;
      line-height: 42px;
      text-align: center;
      background: url('../../assets/images/activity/smashedEgg/rule_title_bg@2x.png') no-repeat;
      background-size: 100% 26px;
      background-position: center;
      margin: 30px auto;
    }
    p{
      font-size: 26px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 48px;
    }
  }
  .win_prize{
    padding-top: 40px;
    .win_prize_bg{
      width: 100%;
      height: auto;
      position: absolute;
      top: -240px;
      left: 0;
      img{
        width: 100%;
        height: auto;
        display: block;
      }
    }
    .win_prize_img{
      width: 240px;
      height: auto;
      margin: 30px auto;
      img{
        width: 100%;
        height: auto;
        display: block;
      }
    }
    .win_prize_info{
      h3{
        font-size: 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 42px;
        text-align: center;
        margin-bottom: 20px;
      }
      p{
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 44px;
        padding: 0 40px;
        span{
          color: #333333;
        }
      }
    }
  }
  .header{
    width: 100%;
    height: 1136px;
    background: url('../../assets/images/activity/smashedEgg/head_bg@2x.png') no-repeat;
    background-size: cover;
    position: relative;
    .header_content{
      padding: 30px 30px 0 30px;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: url('../../assets/images/activity/smashedEgg/embellishment@2x.png') no-repeat;
      background-size: 100% auto;
    }
    .title{
      padding: 14px 24px 0 24px;
      height: 148px;
      img{
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .egg{
      width: 372px;
      height: 536px;
      margin: 0 auto;
      img{
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .eggSvga{
      width: 100%;
      height: 536px;
      position: absolute;
      left: 8px;
      top: 210px;
      z-index: 9;
    }
    .hammer{
      position: absolute;
      top: 140px;
      right: -60px;
      transform: rotate(60deg);
      transform-origin: 100% 100%;
      transition: transform .4s;
    }
    .show_hammer{
      right: 60px;
      transform: rotate(0);
      transform-origin: 100% 100%;
    }
    .opportunities{
      text-align: center;
      font-size: 32px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #FFFFFF;
      line-height: 44px;
      margin-top: -25px;
      text-shadow: 0px 0px 20px rgba(255, 255, 255, 0.5);
      span{
        color: #FFC23F;
      }
    }
    .prize{
      width: 740px;
      height: 244px;
      background: url('../../assets/images/activity/smashedEgg/prize_bg@2x.png') no-repeat;
      background-size: 100% 100%;
      position: absolute;
      z-index: 1;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0 auto;
      &::before{
        content: '奖池奖品';
        width: 312px;
        height: 108px;
        background: url('../../assets/images/activity/smashedEgg/prize_title_bg@2x.png') no-repeat;
        background-size: cover;
        text-align: center;
        line-height: 88px;
        font-size: 28px;
        font-family: PingFangSC-Medium, PingFang SC;
        color: #FFDC65;
        text-shadow: 0px 0px 5px #902F8D;
        position: absolute;
        left: 0;
        right: 0;
        top: -34px;
        margin: 0 auto;
      }
      .seamless-warp{
        width: 88%;
        height: 244px;
        margin: 0 auto;
        overflow: hidden;
        >div{
          display: flex;
        }
        ul{
          height: 244px;
          display: flex;
          align-items: center;
          li{
            width: 120px;
            height: 120px;
            margin: 0 6px;
            border-radius: 12px;
            background: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            img{
              width: auto;
              height: 50%;
              display: block;
              margin: 0 auto;
            }
            p{
              color: #8949D2;
              font-size: 18px;
              text-align: center;
              // transform: scale(0.8);
              // position: relative;
              // top: 6px;
            }
          }
        }
      }
    }
    // .bg_prize{
    //   position: absolute;
    //   background: #6505A6;
    //   width: 100%;
    //   height: 20%;
    //   left: 0;
    //   top: 83%;
    // }
  }
  .notice{
    width: 100%;
    height: 64px;
    background: rgba(93, 0, 152, 0.4);
    border-radius: 32px;
    /deep/ .van-notice-bar{
      height: 100%;
      padding: 0 10px;
      background: none;
      .notice-swipe {
        height: 32px;
        line-height: 32px;
        .van-swipe-item{
          color: #EDADCD;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          display: flex;
          align-items: center;
          img{
            width: 20px;
            height: 20px;
            border-radius: 10px;
          }
          p{
            margin-left: 5px;
            color: #fff;
          }
        }
      }
    }
  }
  .content{
    padding-bottom: 80px;
    position: relative;
    .task_title{
      width: 630px;
      height: 40px;
      background: url('../../assets/images/activity/smashedEgg/task_title_bg@2x.png') no-repeat;
      background-size: 100% 12px;
      background-position: center;
      margin: 0 auto;
      text-align: center;
      font-size: 28px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #E4BCFF;
      line-height: 40px;
    }
    .task_container{
      width: 690px;
      // height: 776px;
      background: #FFFFFF;
      box-shadow: 0px 0px 20px 0px #4E0282, 0px 0px 20px 0px rgba(101, 5, 166, 0.4);
      border-radius: 20px;
      margin: 30px auto 0;
      padding: 10PX 0;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: height .5s;
      overflow: hidden;
      .task_list{
        height: 77PX;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        padding: 10px 30px;
        .task_img{
          width: 96px;
          height: 96px;
          img{
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        .task_info{
          flex: 1 0;
          padding: 0 0 0 20px;
          font-size: 24px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #333333;
          line-height: 32px;
        }
        .task_button{
          width: 160px;
          height: 80px;
          text-align: right;
        }
      }
    }
    .put_task_container{
      height: 87PX !important;
      transition: height .5s;
    }
    .unfoldAndFold{
      width: 480px;
      height: 52px;
      text-align: center;
      line-height: 52px;
      color: #FFFFFF;
      font-size: 24px;
      background: url('../../assets/images/activity/smashedEgg/unfoldAndFold_bg@2x.png') no-repeat;
      background-size: cover;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 28px;
      margin: 0 auto;
    }
  }
  .tips{
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: rgba(255, 255, 255, 0.4);
    line-height: 34px;
    text-align: center;
    padding-bottom: 24px;
  }
}
</style>