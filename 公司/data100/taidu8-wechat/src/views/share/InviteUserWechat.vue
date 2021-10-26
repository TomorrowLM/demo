<template>
  <div class='guide_attention'>
    <div class="bg">
      <van-notice-bar class="guide_attention_notice_bar" color="#fff" :left-icon="require('../../assets/images/share/logo_1@2x.png')">
        拼任务 | 上市公司旗下产品，500万人都在答卷赚钱
      </van-notice-bar>
      <div class="guide_attention_bg">
        <div class="result">
          欢迎来到拼任务
        </div>
        <h1>
          <img src="../../assets/images/share/wechat@2x.png" alt="">
        </h1>
      </div>
      
    </div>
   <div class="guide_wx">
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
            <van-button  class="btn" type="default" color="linear-gradient(135deg,#9d47e8, #766dff)" round url="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MjM5NjA5NTA4MA==&scene=110#wechat_redirect">赚钱</van-button>
          </van-col>
        </van-row>
       
      </div>
  </div>
</template>

<script>

export default {
  name: 'GuideAttention',
  data () {
    return {
      
 
    }
  },
  created () {
    
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
    // padding:360px 0 0;
    width: 100%;
    position: fixed;
    bottom: 170px;
    top: 120px;
    left: 0;
    right: 0;
    background: url('../../assets/images/share/inviteUserWechat.png') no-repeat  center bottom;
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
    .result{
      margin: 0 auto;
      font-size: 28px;
      font-family: PingFangSC, PingFangSC-Light;
      font-weight: 300;
      text-align: center;
      color: rgba(255,230,176,0.98);
    }
    h1{
      margin:30px auto 0;
      text-align: center;
      img{
        width: 320px;
      }
    } 
  }
  .guide_wx{
      background:#fff;
      position: fixed;
      bottom:0;
      margin: auto;
      left:0 ;
      right: 0;
      padding:40px ;
      box-sizing: border-box;
      .content{
        padding:0 60px;
        .col{
          &:nth-child(odd){
            img{
              width: 96px;
            }
          }
          &:nth-child(even){
            img{
              position: relative;
              top:-28px;
              width: 24px;
              height:16px;
            }
          }
        }
        
        h5{
          font-size: 28px;
        }
      }
      h4{
        background-size: contain;
        color: #fff;
        font-size:28px ;
        width: 470px;
        height:42px;
        margin:0 auto 40px;
        text-align: center;
        font-weight: bold;
        box-sizing: border-box;
        padding:88px 0 40px;
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