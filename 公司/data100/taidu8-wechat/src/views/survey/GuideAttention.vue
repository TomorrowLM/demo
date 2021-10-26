<template>
  <div class='guide_attention'>
    <van-notice-bar class="guide_attention_notice_bar" color="#fff" :left-icon="require('../../assets/images/survey/logo_mini.png')">
      拼任务 | 上市公司旗下产品，500万人都在答卷赚钱
    </van-notice-bar>
    <div class="guide_attention_bg">
      <div class="guide_attention_gold">
        <h3 v-if="queryParams.gold">{{ queryParams.gold }}<span>金<br />币</span></h3>
        <p v-if="!queryParams.gold" class="participated">您已参与过此问卷</p>
        <p>{{ queryParams.gold ? '已存入账户' : '请登录拼任务参与其他问卷和活动' }}</p>
      </div>
      <div class="guide_attention_content">
        <div class="step_box" v-for="(item, index) of stepData" :key="'step' + index">
          <div class="step_title">
            <span><i>{{ index + 1 }}</i></span>
            <h3>{{ item.title }}</h3>
          </div>
          <p>{{ item.subTitle }}</p>
          <img :src="item.img" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUrl } from "@/utils/base";

export default {
  name: 'GuideAttention',
  data () {
    return {
      queryParams: null,
      stepData: [
        {
          title: '第一步',
          subTitle: '截图保存下方二维码微信扫描关注或微信搜索【拼任务君】关注',
          img: require('../../assets/images/survey/qrcode_pinrenwu.jpg')
        },
        {
          title: '第二步',
          subTitle: '打开公众号后点击底部菜单栏的“提现”',
          img: require('../../assets/images/survey/guide_attention_des2.png')
        },
        {
          title: '第三步',
          subTitle: '点击提现按钮，提现到微信',
          img: require('../../assets/images/survey/guide_attention_des3.png')
        }
      ]
    }
  },
  created () {
    this.queryParams = getUrl(this.$route.fullPath)
  },
  methods: {
  },
}
</script>

<style lang='less' scoped>
//@import url()
.guide_attention{
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #973BDF 0%, #1D26BB 100%);
  overflow: auto;
  /deep/ .van-notice-bar{
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 999;
  }
  &_bg{
    width: 100%;
    height: 100%;
    background: url('../../assets/images/survey/channel_end_bg.png') no-repeat;
    background-size: 100% 100%;
  }
  &_notice_bar{
    background: url('../../assets/images/survey/channel_end_notice_bg.png') no-repeat;
    background-size: cover;
  }
  &_gold{
    height: 380px;
    background: url('../../assets/images/survey/channel_end_top_bg.png') no-repeat;
    background-size: cover;
    text-align: center;
    padding-top: 170px;
    .participated{
      position: relative;
      padding: 10px 0 10px 56px;
      margin-top: 40px;
      &::before{
        content: '';
        width: 36px;
        height: 36px;
        background: url('../../assets/images/survey/participated_ic.png') no-repeat;
        background-size: cover;
        position: absolute;
        left: 240px;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
    p{
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #FFFFFF;
      line-height: 40px;
    }
    .register{
      color: #FFDA8E;
    }
    h3{
      font-size: 100px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #FFCC00;
      line-height: 140px;
      position: relative;
      padding-right: 40px;
      span{
        width: 48px;
        height: 68px;
        border-radius: 12px;
        color: #F5A623;
        border: 1px solid #F5A623;
        display: inline-block;
        font-size: 20px;
        line-height: 34px;
        position: absolute;
        right: 248px;
        top: 0;
        bottom: 0;
        margin: auto 0;
      }
    }
  }
  &_content{
    width: 100%;
    background: url('../../assets/images/survey/guide_attention_bg.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    padding: 100px 0;
    &::before{
      content: '关注公众号提现';
      width: 420px;
      height: 124px;
      background: url('../../assets/images/survey/guide_attention_title_bg.png') no-repeat;
      background-size: cover;
      position: absolute;
      top: 0;
      left: 134px;
      color: #fff;
      font-size: 26px;
      font-family: PingFangSC-Medium, PingFang SC;
      line-height: 100px;
      text-align: center;
    }
    .step_box{
      padding: 0 70px;
      .step_title{
        display: flex;
        align-items: center;
        span{
          width: 52px;
          height: 52px;
          background: linear-gradient(180deg, #6826EC 0%, #3745D3 100%);
          box-shadow: 0px 10px 20px 0px rgba(54, 21, 187, 0.3);
          border-radius: 50%;
          display: block;
          i{
            width: 40px;
            height: 40px;
            border: 1px solid #715CEC;
            border-radius: 50%;
            margin: 6px auto 0;
            text-align: center;
            line-height: 40px;
            color: #fff;
            display: block;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            font-size: 28px;
            font-style: normal;
          }
        }
        h3{
          font-size: 30px;
          font-family: PingFangSC-Medium, PingFang SC;
          color: #3439CC;
          line-height: 42px;
          margin-left: 20px;
        }
      }
      p{
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #888888;
        line-height: 44px;
        margin-top: 20px;
      }
      img{
        display: block;
        margin: 20px auto;
      }
    }
  }
}
</style>