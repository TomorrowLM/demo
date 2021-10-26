<template>
  <div class="down">
    <ul>
      <li>
        <img src="../../../static/images/home_ban_ic_iphone.png" alt>
        <span>iPhone下载</span>
      </li>
      <li>
        <img src="../../../static/images/home_ban_ic_android.png" alt>
        <span>Android下载</span>
      </li>
    </ul>
    <div class="img">
      <img :src="qrcodeImg" alt>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcode";
import url from "../../api/url"
export default {
  name: "download",
  data(){
    return{
      qrcodeImg:""
    }
  },
  created() {
    QRCode.toDataURL(url.basePage + "/common/share/#/homeshare")
      .then(url => {
        this.qrcodeImg = url
      })
      .catch(err => {
        console.error(err);
      });
  },
};
</script>
<style lang="scss" scoped>
@mixin size($w: 100%, $h: 100px) {
  width: $w;
  height: $h;
}
ul {
  display: inline-block;
  vertical-align: middle;
  li {
    @include size(196px, 52px);
    line-height:47px;
    border: 1px solid #fff;
    border-radius: 26px;
    text-align: center;
    &:nth-child(2) {
      margin-top: 28px;
    }
    span {
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
    }
    img {
      vertical-align: middle;
    }
  }
}

.img {
  display: inline-block;
  vertical-align: middle;
  margin-left: 40px;
  @include size(148px, 148px);
  background: #fff;
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>

