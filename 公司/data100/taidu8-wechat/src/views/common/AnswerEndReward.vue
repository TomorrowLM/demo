<template>
  <div class="container">
    <div class="detail">
      <div class="img"><img src="../../assets/images/common/reward.png" alt="" srcset=""></div>
      <div class="text">恭喜您！获得一个红包</div>
      <div class="reward_box">
        <div class="reward" ref="qrcode" id="qrcode" :text="codeUrl"></div>
        <div id="qrcode_img"></div>
      </div>
      <div class="span">
        <p>(请勿将二维码发给别人)</p>
        <p>在三十分钟之内请用微信扫描二维码或者长按识别二维码，领取红包</p>
      </div>
    </div>
  </div>
</template>
<script>
import QrCode from "qrcodejs2";
export default {
  name: "AnswerEndReward",
  data() {
    return {
      codeUrl: "",
    };
  },
  created() {
    this.codeUrl =`${process.env.VUE_APP_API_SLS_BASE_URL}/distribution/rp/requestUserId?data100ID=${this.$route.query.data100ID}&nonceStr=${this.$route.query.nonceStr}`
    this.$nextTick(() => {
      this.createCode();
      // setTimeout(()=>{
      //     localStorage.removeItem('qrCode')
      // },5000)
    });
  },
  mounted(){
    document.getElementsByTagName("html")[0].style.maxWidth = "100%"
  },
  beforeDestroy(){
      document.getElementsByTagName("html")[0].style.maxWidth = "500px"
  },
  methods: {
    createCode() {
      new QrCode("qrcode", {
        width: 190, // 二维码宽度
        height: 190, // 二维码高度
        text: this.codeUrl,
        correctLevel: QrCode.CorrectLevel.L,
        src: "../../assets/images/common/logo.png",
      });
			let canvas = document.getElementsByTagName('canvas')[0];
			let img = this.convertCanvasToImage(canvas);
			document.getElementById('qrcode_img').append(img)
    },
		convertCanvasToImage(canvas){
			let image = new Image(); 
			image.src = canvas.toDataURL("image/png"); 
			return image;
		}
  },
};
</script>
<style lang="scss" scoped>
@media only screen and (min-width: 500px) {
  .container {
    background: url("../../assets/images/common/background.png") no-repeat top,
      -webkit-linear-gradient(0deg, #c7a2ee 0%, #6b6bd3 100%);
    height: 100%;
    margin: auto;
    padding-top: 112px;
    position: relative;
    .img{
      width: 220px;
    }
    .detail {
      background: url("../../assets/images/common/bg2.png") no-repeat top,
        -webkit-linear-gradient(270deg, #ffffff 100%, #f3f2ff 100%);
      width: 1000px;
      height: 833px;
      margin: 0 auto;
      border-radius: 20px;
      box-shadow: 0px 5px 15px 0px rgba(40, 0, 161, 0.1);
      padding-top: 50px;
      .span {
        height: 30px;
        opacity: 1;
        font-size: 22px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #909399;
        line-height: 30px;
        // margin-top: 20px;
      }
    }
  }
}
@media only screen and (max-width: 450px) {
  .container {
    background: #fff;
    height: 100%;
    width: 100%;
    margin: auto;
    position: relative;
    .img{
      width: 360px;
    }
    .detail {
      background: url("../../assets/images/common/bg2.png") no-repeat top,
        -webkit-linear-gradient(270deg, #ffffff 100%, #f3f2ff 100%);
      width: 100%;
      height: 60%;
      margin: 0 auto;
      margin-top: 44px;
      padding-top: 60px;
      position: fixed;
      .span {
        width: 508px;
        height: 52px;
        opacity: 1;
        font-size: 24px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #909399;
        line-height: 30px;
        margin: 20px auto;
      }
    }
     .reward_box {
        width: 230PX;
        height: 230PX;
        opacity: 1;
        background: #ffffff;
        border: 1px solid #e9e9eb;
        margin: 0 auto;
        padding:20PX;
        .reward {
          width: 190PX;
          height: 190PX;
          background: #6b6bd3;
          display: none;
        }
        #qrcode_img {
          width: 190PX;
          height: 190PX;
        }
      }
  }
 
}
.img {
  // width: 300px;
  margin: 0 auto;
  img{
    width: 100%;
  }
}
.text {
  height: 40px;
  opacity: 1;
  font-size: 30px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: center;
  color: #303133;
  line-height: 40px;
  margin-top: 40px;
  margin-bottom: 40px;
}
.reward_box {
  width: 230PX;
  height: 230PX;
  opacity: 1;
  background: #ffffff;
  border: 1px solid #e9e9eb;
  margin: 0 auto;
  padding: 20PX 0 0 20PX;
  .reward {
    width: 190PX;
    height: 190PX;
    background: #6b6bd3;
    display: none;
  }
  #qrcode_img {
    width: 190PX;
    height: 190PX;
  }
}
</style>