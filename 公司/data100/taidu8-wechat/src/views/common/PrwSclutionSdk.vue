<template>
  <div class="sclution">
    <h1>涉及收集用户个人信息的第三方 SDK目录</h1>
    <br/>
    <div>为保障拼任务服务相关功能的实现与应用安全稳定的运行，我们可能会接入由第三方提供的软件开发包(SDK)或类似应用程序实现相关目的。我们会对合作方获取信息的软件工具开发包(SDK)或类似应用程序进行严格的安全评估，以保护您的个人信息安全。以下是我们接入的主要的第三方服务商的信息:</div>
    <br/>

    <div>第三方SDK名称:友盟SDK</div>
    <div>用途:统计分析、消息分享</div>
    <div>收集的个人信息类型:设备Mac地址、设备信息（IMEI/MAC/Android ID/IDFA/OpenUDID/GUID/SIM卡IMSI/地理位置等）</div>
    <div>官网链接:<a href="https://www.umeng.com/page/policy">https://www.umeng.com/page/policy</a></div>
    <br/>

    <div>第三方SDK名称:优量汇广告SDK</div>
    <div>用途：广告数据监测</div>
    <div>收集的个人信息类型：设备标识信息（设备型号、操作系统及版本、时区、网络类型等）、地理位置信息</div>
    <div>官网链接:<a href="https://adnet.qq.com">https://adnet.qq.com</a></div>
    <br/>

    <div>第三方SDK名称:穿山甲广告SDK</div>
    <div>用途：广告数据监测</div>
    <div>收集的个人信息类型：设备标识信息（设备型号、操作系统及版本、时区、网络类型等）、地理位置信息</div>
    <div>官网链接:<a href="https://www.pangle.cn">https://www.pangle.cn</a></div>
    <br/>
   
    <div>第三方SDK名称:阿里云推送SDK</div>
    <div>用途：向用户推送消息</div>
    <div>收集的个人信息类型：设备标识信息</div>
    <div>官网链接:<a href="https://www.aliyun.com/product/cps">https://www.aliyun.com/product/cps</a></div>
    <br/>

    <div>第三方SDK名称:阿里云一键登录SDK</div>
    <div>用途：一键登录</div>
    <div>收集的个人信息类型：设备的标识信息，手机IMSI，电话号码</div>
    <div>官网链接:<a href="https://www.aliyun.com/product/dypns">https://www.aliyun.com/product/dypns</a></div>
    <br/>

    <div>第三方SDK名称:百度地图SDK</div>
    <div>用途：用于精确定位用户位置，提供基于地理位置信息的服务</div>
    <div>收集的个人信息类型：设备标识信息，网络信息，地理位置信息</div>
    <div>官网链接:<a href="https://lbsyun.baidu.com">https://lbsyun.baidu.com</a></div>
    <br/>

    <div>第三方SDK名称:百度定位SDK</div>
    <div>用途：用于精确定位用户位置，提供基于地理位置信息的服务</div>
    <div>收集的个人信息类型：地理位置信息</div>
    <div>官网链接:<a href="https://lbsyun.baidu.com">https://lbsyun.baidu.com</a></div>
    <br/>

    <div>第三方SDK名称:阿里云ocr识别SDK</div>
    <div>用途：根据用户提供的身份证照片，识别出用户的基本信息</div>
    <div>收集的个人信息类型：姓名信息、年龄信息、地址信息</div>
    <div>官网链接:<a href="https://market.aliyun.com/products/57124001/cmapi033904.html">https://market.aliyun.com/products/57124001/cmapi033904.html</a></div>
    <br/>

    <div>第三方SDK名称:微信SDK</div>
    <div>用途：用户授权后，获得用户的基本信息</div>
    <div>收集的个人信息类型：昵称信息、性别信息、城市信息、头像信息等</div>
    <div>官网链接:<a href="https://developers.weixin.qq.com">https://developers.weixin.qq.com</a></div>
    <br/>
  </div>
</template>

<script>
export default {
  name: "agree",
  mounted(){
    document.getElementsByTagName("html")[0].style.maxWidth = "100%"
  },
  beforeDestroy(){
    document.getElementsByTagName("html")[0].style.maxWidth = "500px"
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@mixin size($w: 100%, $h: 100px) {
  width: $w;
  height: $h;
}

.sclution {
  height: 100%;
  padding: 90px 30px;
  line-height: 40px;
  overflow: auto;
  word-break: break-all;
  a{
    color:#096dd9;
  }
  h1{
    font-weight: bold;
    line-height: 70px;
  }
  div {
    font-size: 24px;
    text-align: justify;
  }
  h3 {
    margin: 3px auto;
    text-align: justify;
  }
  div::-moz-selection {
    background: #7575f9;
    color:#fff;
  }
  div::selection {
    background: #7575f9;
    color:#fff;
  }
  p::-moz-selection {
    background: #7575f9;
    color:#fff;
  }
  p::selection {
    background: #7575f9;
    color:#fff;
  }
  h3::-moz-selection {
    background: #7575f9;
    color:#fff;
  }
  h3::selection {
    background: #7575f9;
    color:#fff;
  }
}
</style>
