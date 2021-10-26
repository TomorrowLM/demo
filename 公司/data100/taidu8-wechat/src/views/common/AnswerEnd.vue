<template>
    <div class="detail">
        <div v-if="token!=''" class="header">提示：当前为预览页面，回答将不计入结果</div>
        <div class="img">
            <img v-if="state == '1'" src="../../assets/images/common/project_queend_img5.png" alt />
            <img v-else src="../../assets/images/common/project_queend_img4.png" alt />
        </div>
        <div class="dis">
            <p class="ck-content" style="color:#999999;font-size: 0.26rem" v-html="msg"></p>
            <p style="font-weight: bold;font-size: 0.3rem">{{ state == '1' ? '您已完成此问卷！' : '感谢参与！'}}</p>
            <p class="viewReward" v-if="isShow" @click="setRedPacket">查看奖励</p>
            <div class="container">
                <!--首次进入抽奖的DOM-->
                <div class="container_title" v-if="isHide">恭喜您获得1次抽奖机会</div>
                <div class="gameBox" v-if="isHide">
                    <div class="start" v-if="isHide" @click="move">
                        点击<br>抽奖
                    </div>
                    <div v-for="(item,i) in list" :key="i"
                         :class="['item' + (i+1), {'active': index == i}]"
                         :title="item.lotteryDrawName"
                         :style="{lineHeight:(item.lotteryDrawImgUrl?'0.9rem':'1.8rem')}">
                        <img v-if="item.lotteryDrawImgUrl" :src="item.lotteryDrawImgUrl"
                             style="width:0.6rem;height:0.6rem;display: block;margin-top: 0.2rem">
                        <p v-if="item.lotteryDrawType=='0'"
                                style="width:1.8rem;hieght:auto;margin-top: 0px;
                         overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">谢谢参与</p>
                        <p v-if="item.lotteryDrawType=='1'"
                           style="width:1.8rem;hieght:auto;margin-top: 0px;
                         overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{item.lotteryDrawAmt/100}}元红包</p>
                        <p v-if="item.lotteryDrawType=='2'"
                           style="width:1.8rem;hieght:auto;margin-top: 0px;
                         overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{item.lotteryDrawName}}</p>
                    </div>
                </div>
                <!--再次进入抽奖的DOM-->
                <!--再次进入抽奖的DOM-->
                <!--<div class="container_title">您已抽中500万</div>
                <div class="box">
                    <div class="redPack">
                        <img src="../../static/images/jiangpin.png" alt="">
                    </div>
                    <div class="sure" style="margin-bottom: 1.5rem">确定</div>
                </div>-->


            </div>

        </div>

        <div class="botm" v-if="isHide">
            <div class="txt">
                <p class="icon1"><img src="../../assets/images/common/userIcon1.png"></p>
                <div class="titltxt">主办方：</div>
                <div class="descTxt" style="width:4rem">{{lotteryDrawInfo.senderName}}  {{lotteryDrawInfo.senderMobile}}</div>
            </div>
            <div class="txt">
                <p class="icon1">
                    <img src="../../assets/images/common/desc.png">
                </p>
                <div class="titltxt">
                    <p style="display: inline-block;width:auto">声</p>
                    <p style="display: inline-block;width:15px"></p>
                    <p style="display: inline-block;width:auto">明：</p>
                </div>
                <div class="descTxt" style="width:4rem;height:auto;padding-bottom: 0.3rem">
                    问卷奖励由活动主办方提供并发放，与问卷一百平台无关，如有疑问请直接联系主办方
                </div>
            </div>
        </div>
        <div class="bottomer" >
            <div>问卷一百提供技术支持</div>
            <div @click="tipOff">举报</div>
        </div>
        <van-popup v-model="show" round :style="{height: '60%' }" closeable>
            <div class="box">
                <div class="callbackmsg">恭喜您</div>
                <div class="callbackmsg sec">抽中了{{prize_data.lotteryDrawName}}</div>
                <div class="redPack">
                    <img :src="imgUrl">
                </div>
                <div class="callbackmsg sec" style="width:4rem;text-align: center">{{timeData}}秒后将跳转至奖品领取页面</div>
                <div class="sure" @click="go" v-if="goRedPacket">确定</div>
                <div class="sure" v-else @click="go">确定</div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import Request from "../../api/request"
    import common from "../../api/common"
    import { Toast } from 'vant'
    export default {
        name: 'AnswerEnd',
        data () {
            return {
                msg: "",
                state: '',
                token: "",
                answerId:'',
                surveyId:'',
                isShow:false,//查看奖励按钮显隐
                isHide:false,//抽奖DOM的显隐
                list:[],
                index: 0, // 当前转动到哪个位置，第一次起点位置0,对应页面item1位置
                count: 8, // 总共有多少个位置
                times: 0, // 转动跑格子次数,
                cycle: 60, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
                speed: 200, // 初始转动速度
                lampShow:false,//开始抽奖，灯光闪烁
                timer: 0, // 转动定时器
                lamp:0, // 灯光定时器
                prize: 0, // 中奖位置，接口返回
                number_of_draws:1,//限制每天抽奖次数，接口返回
                prize_data: {},
                show:false,
                goRedPacket:true,
                timeData:3,
                isGetJp:true,
                productId:false,
                recordId:'',
                lotteryDrawInfo:'',
                timeInter1:'',
                imgUrl:'',
                drawSkip:{}
            }
        },
        mounted() {
            const decodeParams = common.getParams(decodeURIComponent(this.$route.fullPath))
            this.msg = decodeParams.msg;
            this.state = decodeParams.state;
            this.surveyId=decodeParams.surveyId;
            if (this.$route.query.token) {
                this.token = this.$route.query.token;
            }
            if(this.state=="1"&&decodeParams.answerId){
                this.answerId=decodeParams.answerId;
                this.getRedPacket()
            }
            this.getList()
            if (['1', '2'].includes(this.state)) {
                this.getMsg()
            }
        },
        methods:{
            getMsg () {
                let decodeParams = common.getParams(decodeURIComponent(window.location.href))
                let surveyId = decodeParams.surveyId;
                let obj = {
                    state: this.state,
                    surveyId: surveyId,
                    terminalCode: '3'
                }
                Request.getSurveyEngMsg(obj).then(res => {
                    if (res.code === 1) {
                        let url = decodeURIComponent(res.data.callBackUrl.replace(/\+/g, ' '))
                        if (url.indexOf('?') !== -1) {
                            this.msg = url.split("?msg=")[1]
                        }
                    }
                })
            },
            getRedPacket(){
                let params={
                    answerId:this.answerId,
                    surveyId:this.surveyId,
                }
                Request.isRedPacket(params).then(res=>{
                    if(res.code==1){
                        if(res.data.setUpType=='0'){
                            this.isShow=false;
                            this.isHide=false;
                        }else if(res.data.setUpType=='1'){
                            if(res.data.hide){
                                this.isShow=false;
                                this.isHide=false;
                            }else{
                                this.isShow=true;
                                this.isHide=false;
                            }
                        }else if(res.data.setUpType=='2'){
                            if(res.data.hide){
                                this.isShow=false;
                                this.isHide=false;
                            }else{
                                this.isShow=false;
                                this.isHide=true;
                            }
                        }

                    }
                })
            },
            setRedPacket(){
                let params={
                    code:'answerSurvey',
                    answerId:this.answerId,
                    surveyId:this.surveyId,
                    state:this.state
                }
                if(this.productId){
                    params.productId="2"
                    params.recordId=this.recordId
                }
                Request.getMoney(params).then(res=>{
                    if(res.code==1){
                        this.state=res.data.state;
                        if(res.data.state=="0"){
                            this.$router.push({
                                path:'/redOver',
                                query:{
                                    answerId:this.answerId,
                                    surveyId:this.surveyId,
                                    state:this.state,
                                    msg:res.data.msg,
                                }
                            })
                        }else if(res.data.state=="1") {
                            console.log(res.data.qrCode)
                            this.$router.push({
                                path:'/wxRedPacket',
                                query:{
                                    answerId:this.answerId,
                                    surveyId:this.surveyId,
                                    state:this.state,
                                    qrCode:res.data.qrCode
                                }
                            })
                        }else{
                            this.$router.push({
                                path:'/wxRedApplySucess',
                                query:{
                                    answerId:this.answerId,
                                    surveyId:this.surveyId,
                                    state:this.state,
                                    money:res.data.money,
                                    msg:res.data.msg,
                                    time:res.data.time
                                }
                            })
                        }
                    }
                })
            },
            /*获取奖品列表*/
            getList(){
              let params={
                  surveyId:this.surveyId,
                  terminalCode:'3',
              }
              Request.getDrawInfo(params).then(res=>{
                  if(res.code==1){
                      this.lotteryDrawInfo=res.data.lotteryDrawInfo;
                      res.data.lotteryDrawList.forEach((item,idx)=>{
                          if(item.lotteryDrawNo==9){
                              res.data.lotteryDrawList.splice(idx,1)
                          }
                      })
                      res.data.lotteryDrawList.sort(this.sortBy("lotteryDrawNo"))
                      console.log(res.data)
                      this.list=res.data.lotteryDrawList
                  }
                  console.log(res)
              })
            },
            sortBy(props) {
                return function(a,b) {
                    return a[props] - b[props];
                }
            },
            move() {
                if( this.number_of_draws == 0){
                    Toast('当前问卷您已完成抽奖，请勿重复操作');
                }else if(this.times != 0){
                    Toast('正在抽奖中，请勿重复点击')
                } else{
                    let params={
                        answerId:this.answerId,
                        surveyId:this.surveyId,
                        terminalCode:'3',
                    }
                    Request.getDraw(params).then(res=>{
                        if(res.code == 1){
                            if(res.data.lotteryDrawNo==9){
                                Toast(res.msg)
                            }else{
                                this.drawSkip=res.data;
                                this.recordId=res.data.recordId
                                this.imgUrl=res.data.lotteryDrawImgUrl;
                                this.number_of_draws--;//抽奖开始，次数-1
                                this.speed = 150;//值越小，初始速度越快
                                this.prize_data = res.data;//已经拿到中奖信息，页面展示，等抽奖结束后，将弹窗弹出
                                //this.prize = res.data.lotteryDrawNo-1;//中奖位置赋值,跑马灯最终停留位置,实际位置需要-1
                                this.prize = res.data.lotteryDrawNo-1;
                                this.startRoll();//执行抽奖
                                this.lamp = setInterval(()=>{//灯光闪烁开启
                                    this.lampShow = !this.lampShow;
                                },500)
                            }
                        }else{
                            Toast(res.msg);
                        }
                    })
                }
            },
            // 开始转动
            startRoll() {
                this.times += 1; // 转动次数
                this.oneRoll(); // 转动过程调用的每一次转动方法，这里是第一次调用初始化
                this.usePrize();
            },
            // 每一次转动
            oneRoll() {
                let index = this.index; // 当前转动到哪个位置
                const count = 8; // 总共有多少个位置
                index += 1;
                if (index > count - 1) {
                    index = 0;
                }
                this.index = index;
            },
            usePrize() {
                // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
                if (this.times > this.cycle + 5 && this.prize === this.index) {
                    clearTimeout(this.timer); // 清除转动定时器
                    clearTimeout(this.lamp); // 清除灯光定时器
                    this.lampShow = false; // 白色灯隐藏
                    this.times = 0; // 转动跑格子次数初始化为0，可以开始下次抽奖
                    if (this.prize_data.lotteryDrawName !== "感谢参与") {
                        if(this.prize_data.lotteryDrawOutUrl==""){
                            this.show=true;
                            this.goRedPacket=true;
                            let _this=this;
                            this.timeInter1=setInterval(function(){
                                _this.timeData--;
                                if(_this.timeData==0){
                                    window.clearInterval(this.timeInter1)
                                    _this.show=false;
                                    _this.productId=true
                                   _this.setRedPacket()
                                }
                            },1000)
                        }else{
                            this.show=true;
                            this.goRedPacket=false;
                            let _this=this;
                            this.timeInter1=setInterval(function(){
                                _this.timeData--;
                                if(_this.timeData==0){
                                    window.clearInterval(_this.timeInter1)
                                    _this.show=false;
                                    let param={
                                        surveyId:_this.surveyId,
                                        answerId:_this.answerId,
                                        outUrlSkip:_this.prize_data.lotteryDrawOutUrl,
                                        lotteryDrawId:_this.prize_data.lotteryDrawNo,
                                        lotteryDrawName:_this.prize_data.lotteryDrawName,
                                    }
                                    Request.remberDrawUrlSkip(param).then(res=>{
                                        if(res.code==1){
                                            window.location.href=_this.prize_data.lotteryDrawOutUrl;
                                        }
                                    })

                                }
                            },1000)
                        }
                    }else{
                        this.isGetJp=false;
                        Toast("感谢参与");
                    }
                } else {
                    if (this.times < this.cycle - 15) {
                        this.speed -= 4; // 加快转动速度
                    } else {
                        this.speed += 10; // 抽奖即将结束，放慢转动速度
                    }
                    this.timer = setTimeout(this.startRoll, this.speed);//开始转动
                }
            },
            go(){
                window.clearInterval(this.timeInter1)
               if(this.goRedPacket) {
                   this.show=false;
                   this.productId=true
                   this.setRedPacket()
               }else{
                   this.show=false;
                   let param={
                       surveyId:this.surveyId,
                       answerId:this.answerId,
                       outUrlSkip:this.prize_data.lotteryDrawOutUrl,
                       lotteryDrawId:this.prize_data.lotteryDrawNo,
                       lotteryDrawName:this.prize_data.lotteryDrawName,
                   }
                   Request.remberDrawUrlSkip(param).then(res=>{
                       if(res.code==1){
                           window.location.href=this.prize_data.lotteryDrawOutUrl;
                       }
                   })
               }
            },
            tipOff(){
                this.$router.push({
                    path:'/tipOff',
                    query:{
                        surveyId:this.surveyId,
                        answerId:this.answerId,
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        box-sizing: border-box;
        padding:0.25rem 0.3rem;
        background: linear-gradient(to left,rgba(227, 58, 115,0.9),rgba(233, 122, 73,0.9));
        background: -webkit-linear-gradient(to left,rgba(227, 58, 115,0.9),rgba(233, 122, 73,0.9));
        color: #ffdcbf;
        text-align: center;
        font-size: 0.3rem;
    }
    .detail {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-image: linear-gradient(#FFEED7,#ffffff);
        background-image: -webkit-linear-gradient(#FFEED7,#ffffff);
        padding-top: 1.5rem;
        .img {
            width: 2rem;
            height: 2rem;
            text-align: center;
            line-height: 2rem;
            background: #7575f9;
            border-radius: 50%;
            margin: 0 auto;
            box-sizing: border-box;
            img {
                width: 2rem;
            }
        }
        .dis {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            justify-content: center;
            p {
                max-width: 5.6rem;
                margin: 0 auto;
                margin-top: 0.4rem;
                font-size: 0.32rem;
                color: #333;
                &:nth-child(1) {
                    margin-top: 0.4rem;
                    font-size: 0.28rem;
                    color: #666;
                }
                &:nth-child(2) {
                    margin-top: 0.4rem;
                    font-size: 0.32rem;
                    color: #333;
                }
            }
            .viewReward{
                width:4.6rem;
                height:0.9rem;
                line-height: 0.9rem;
                font-size: 0.32rem;
                color:#7575F9;
                border:1px solid #7575f9;
                border-radius: 0.46rem;
                margin-top: 0.84rem;
                font-weight: bold;
            }
            .container{
                margin-top: 0.3rem;
                max-width:6.6rem;
                min-height:6.6rem;
                display: flex;
                align-items: center;
                flex-direction: column;
                .container_title{
                    font-size: 15px;
                    color:#F74545
                }
                .gameBox{
                    position: relative;
                    top:10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width:6.6rem;
                    height:6.6rem;
                    background: #F2E0CA;
                    border-radius: 10px;
                    .start{
                        cursor: pointer;
                        width: 1.8rem;
                        height: 1.8rem;
                        border-radius: 10px;
                        background: linear-gradient(to bottom right,rgba(254,220,21,0.9),rgba(255,101,0,0.9));
                        background: -webkit-linear-gradient(to bottom right,rgba(254,220,21,0.9),rgba(255,101,0,0.9));
                        z-index:111;
                        font-size: 18px;
                        text-align: center;
                        color:#ffffff;
                        padding-top: 20px;
                    }
                    & div{
                        display: flex;
                        justify-items: center;
                        align-items: center;
                        flex-direction: column;
                        position: absolute;
                        width: 1.8rem;
                        height: 1.8rem;
                        background: rgba(255, 255, 255, 1);
                        border-radius: 10px;
                        background-image: linear-gradient(#ffffff,#F7ECE0);
                        background-image: -webkit-linear-gradient(#ffffff,#F7ECE0);
                        color:#333333;
                        font-size: 16px;
                    }
                    .item1 {left: 0.3rem;top: 0.3rem;}
                    .item2 {left: 2.4rem;top: 0.3rem;}
                    .item3 {left: 4.5rem;top: 0.3rem;}
                    .item4 {left: 4.5rem;top: 2.4rem;}
                    .item5 {left: 4.5rem;top: 4.5rem;}
                    .item6 {left: 2.4rem;top: 4.5rem;}
                    .item7 {left: 0.3rem;top: 4.5rem;}
                    .item8 {left: 0.3rem;top: 2.4rem;}
                    .active {background: #FFFFFF;}
                }

            }
        }
        .botm{
            margin-top:  0.5rem;
            margin-bottom: 0.5rem;
            width:6.6rem;
            background: #FFECC8;
            border-radius: 10px;
            border: 1px dashed #C45A00;
            .txt{
                display: flex;
                width:6.6rem;
                .icon1{
                    margin-left: 0.4rem;
                    margin-top: 0.4rem;
                    width:0.6rem;
                    height:0.5rem;
                    display: inline-block;
                    & img{
                        width:0.4rem;
                        height:0.4rem;
                    }
                }
                .titltxt,.descTxt{
                    width:1.4rem;
                    line-height: 0.5rem;
                    color:#C45A00;
                    font-size: 15px;
                    display: inline-block;
                    margin-top: 0.4rem;
                }
                .descTxt{
                    width:auto;
                    padding-right: 0.1rem;
                }
                .icon2{
                    width:0.5rem;
                    height:0.5rem;
                    //background-image:url("../../static/images/desc.png");
                    background-position: top center;
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    margin: 0 0.2rem 0 0.45rem;
                }
            }
        }
        .bottomer{
            position: relative;
            bottom:0rem;
            & div{
                width:3.25rem;
                display: inline-block;
                height:auto;
                color:#B2B2B2;
                margin-bottom: 1rem;
                cursor: pointer;
            }
            & div:last-child{
                text-align: right;
            }

        }
        .box{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width:6.6rem;
            border-radius: 0.5rem;
            .callbackmsg{
                color:#333333;
                font-size: 17px;
                margin-top: 0.6rem;
            }
            .sec{
                color:#888888;
                font-size: 15px;
                margin-top: 0.2rem;
            }
            .redPack{
                & img{
                    padding-top: 0.2rem;
                    width:4rem;
                    height:4rem
                }
            }
            .sure{
                width:4rem;
                height:1rem;
                line-height: 1rem;
                border-radius: 1rem;
                text-align: center;
                margin-top: 0.3rem;
                background-image: linear-gradient(right,#AB64F5,#6C63FF);
                background-image: -webkit-linear-gradient(right,#AB64F5,#6C63FF);
            }

        }
    }
</style>
