<template>
  <div class='guide_attention'>
    <div class="bg">
      <van-notice-bar class="guide_attention_notice_bar" color="#fff" :left-icon="require('../../assets/images/share/logo_1@2x.png')">
        拼任务16年，六百万会员，大平台靠谱！
      </van-notice-bar>
      <div class="guide_attention_bg">
        <div class="result">
          <h3>{{queryParams.status==1?'恭喜您': '很遗憾，您答卷失败'}}</h3>
          <p v-if="queryParams.status==1">成功完成问卷获得奖励金币</p>
          <p v-if="queryParams.status!=1&&queryParams.isFirst==1">获得<span class="span">{{queryParams.finalGold}}金币</span>奖励 </p>
          <p v-if="queryParams.status!=1&&queryParams.isFirst==1">+ 首次答卷额外奖励</p>
        </div>
        <h1>
          <van-icon :name="require('../../assets/images/share/gold@2x.png')" />
          <span>{{queryParams.status!=1&&queryParams.isFirst==1?"100":queryParams.finalGold}}</span>
        </h1>
        <van-button class="goldInfo" type="info" color="rgba(246,176,129,1)" round>(100金币=1元)</van-button>
      </div>
      <div class="guide_wx">
        <h4>
          请到公众号提现
        </h4>
         <van-row type="flex" justify="space-between" align="center">
          <van-col>
            <van-row type="flex" align="center">
              <img src="../../assets/images/share/logo@2x.png" alt="" srcset="">
              <div>
                <h2>拼任务君公众号</h2>
                <p>点一下关注，提现不迷路</p>
              </div>
              </van-row>
          </van-col>
          <van-col>
            <van-button  class="btn" type="default" color="linear-gradient(135deg,#9d47e8, #766dff)" round url="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MjM5NjA5NTA4MA==&scene=110#wechat_redirect">提现</van-button>
          </van-col>
        </van-row>
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
      queryParams:null,
      // queryParams: {
      //   finalGold:"",
      //   status:""
      // },
 
    }
  },
  created () {
    this.queryParams = getUrl()
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
  background:linear-gradient( rgba(156,49,228,1) 0%, rgba(96,51,251,1) 100%);
  .bg{
    box-sizing: border-box;
    padding:340px 0 30px;
    width: 100%;
    height: 100%;
    background: url('../../assets/images/share/bg@2x.png') no-repeat  ;
    overflow: auto;
    background-size: contain;
  }
  /deep/ .van-notice-bar{
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    border-radius:0 0 10px 10px;
    img{
      width: 24px;
      height:24px;
      margin-right:10px;
    }
  }
  &_notice_bar{
    background:rgba(90, 0, 187,0.6);
    box-shadow:0 2PX 6PX  rgba(80, 0, 129,0.2);
    background-size: cover;
  }
  .guide_attention_bg{
    width:100%;
    height:700px;
    background: url('../../assets/images/share/redpacket_bg@2x.png') no-repeat center ;
    background-size: contain;
    color:rgba(224,99,16,1);
    text-align: center;
    box-sizing: border-box;
    padding-top:260px;
    .result{
      width:100%;
      height:160px;
      display: flex;
      flex-direction: column;
      justify-content:center;
      
    }
    
    h3{
      font-size:36px;
    }
    p{
      margin-top:10px;
      font-size:30px;
      .span{
        color: rgba(208,52,52,0.98);
        font-weight: bold;
      }
    }
    h1{
      margin:30px 0 0;
      display: flex;
      justify-content: center;
      align-items: center;
      span{
        font-size:96px;
        margin-left:15px;
        color: rgba(208,52,52,0.98);
      }
    }
    .goldInfo{
      height: 40px;
      width:276px;
    }
   
  }
  .guide_wx{
      background:linear-gradient( rgba(255,255,255,1) 0%, rgba(255,238,227,1) 100%);
      box-shadow:0 0 10PX  rgba(0,0,160,0.1);
      width: 676px;
      height:260px;
      border-radius:10px;
      margin:0 auto;
      box-sizing: border-box;
      padding:30px;
      h4{
        background: url('../../assets/images/share/title_bg@2x.png') no-repeat center;
        background-size: contain;
        color: rgba(124,78,238,1);
        font-size:30px ;
        width: 470px;
        height:42px;
        margin:0 auto 40px;
        text-align: center;
        font-weight: 500;
        
      }
      h2{
        font-size:30px;
        font-weight: bold;
        color: #333333;
      }
      img{
        width: 96px;
        height:96px;
        margin-right: 20px;
      }
      p{
        margin-top:12px;
        font-size: 24px;
        font-weight: 400;
        text-align: left;
        color: #888888;
      }
      .btn{
        width:160px;
        height:60px;
      }
    }
}
</style>