<template>
  <div class='guide_group'>
    <div class="guide_group_banner">
      <img src="../../assets/images/survey/guide_group_banner.png" alt="">
    </div>
    <div class="guide_group_code">
      <img src="../../assets/images/survey/guide_group_qrcode.png" alt="">
    </div>
    <div class="guide_group_back">
      <van-button block round color="linear-gradient(to bottom, #FF8E21, #FC3C3C)" @click="back">返回</van-button>
    </div>
    <div class="guide_group_step">
      <h3>三步入群</h3>
      <ul>
        <li>
          <span>1<i>前往</i></span>
          <p>截图二维码保存到手机相册</p>
        </li>
         <li>
          <span>2<i>前往</i></span>
          <p>打开微信，点击右上角找到扫一扫</p>
        </li>
         <li>
          <span>3</span>
          <p>选择相册中的本页截图扫描，按照步骤操作入群即可。</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuideGroup',
  methods: {
    back() {
      window.history.go(-1)
    }
  },
}
</script>

<style lang='scss' scoped>
//@import url()
.guide_group{
  width: 100%;
  height: 100%;
  background: url('../../assets/images/survey/guide_group_bg.png') no-repeat;
  background-size: cover;
  background-color: #7B5EFB;
  overflow: auto;
  &_banner{
    width: 100%;
    img{
      width: 100%;
      height: auto;
    }
  }
  &_code{
    width: 440px;
    height: 440px;
    background: url('../../assets/images/survey/guide_group_code_border.png') no-repeat;
    background-size: cover;
    margin: 0 auto;
    position: relative;
    bottom: 100px;
    img{
      width: 360px;
      height: 360px;
      margin: 40px;
    }
  }
  &_back{
    width: 520px;
    margin: 0 auto;
    position: relative;
    bottom: 40px;
  }
  &_step{
    width: 690px;
    background: #fff;
    border-radius: 20px;
    margin: 0 auto 40px;
    padding: 40px;
    h3{
      width: 472px;
      height: 84px;
      background: url('../../assets/images/survey/guide_group_title_bg.png') no-repeat;
      background-size: cover;
      font-size: 28px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: rgba(255, 207, 105, 0.98);
      line-height: 64px;
      text-align: center;
      margin: 0 auto;
    }
    ul{
      li{
        display: flex;
        padding-top: 40px;
        span{
          width: 48px;
          height: 48px;
          background: linear-gradient(180deg, #6033FB 0%, #9C31E4 100%);
          border-radius: 50%;
          color: #fff;
          font-size: 24px;
          text-align: center;
          line-height: 48px;
          margin-right: 20px;
          display: block;
          position: relative;
          i{
            width: 12px;
            height: 28px;
            position: absolute;
            font-size: 0;
            background: url('../../assets/images/survey/guide_group_step_ic.png') no-repeat;
            background-size: cover;
            left: 18px;
            top: 114%;
          }
        }
        p{
          flex: 1 0;
          font-size: 28px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #666666;
          line-height: 48px;
        }
      }
    }
  }
}
</style>