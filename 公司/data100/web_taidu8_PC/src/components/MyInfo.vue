<template>
  <div class="info">
    <div class="title">
      <img src="../../static/images/perinf_ic_tit.png" alt />
      <span>个人资料</span>
    </div>
    <div class="photo">
      <p>我的头像</p>
      <div class="img">
        <img v-if="info.headImgUrl" :src="info.headImgUrl" alt />
        <img v-else src="../../static/images/perinf_userimg_nor.png" alt />
      </div>
    </div>
    <div class="photo changeNickname">
      <p>昵称</p>
      <input id="nickInput" v-if="isEditNickname" v-model="nickName" @blur="seeNickName" />
      <span class="nowrap" v-else >{{nickName}}</span>
      <!-- @click="editNickname" -->
      <div @click="editNickname">
        <img src="../../static/images/projectlist_btn_icedit.png" alt />
      </div>
      <!-- <div
        @click="changeNickname"
        :style="{'background':isEditNickname?'#7575f9':'#aaa','cursor':isEditNickname?'pointer':'default'}"
      >修改昵称</div>-->
    </div>
    <div class="photo">
      <p>邮箱</p>
      <span>{{info.email||'未设置'}}</span>
    </div>
    <div class="photo">
      <p>手机号</p>
      <span>{{info.phone|formatPhone}}</span>
    </div>
    <!--<div class="photo">
      <p>微信</p>
      <span>{{info.wechatBlind==0?'未绑定':'已绑定'}}</span>
    </div>
    <div class="photo">
      <p>支付宝</p>
      <span>{{info.alipayBlind==0?'未绑定':'已绑定'}}</span>
    </div>-->
    <div class="photo">
      <p>身份认证</p>
      <span>{{idcardBlind}}</span>
    </div>
    <div class="load">
      <div class="hint">如若绑定第三方账号和认证身份，可以下载app完成</div>
      <div class="download">
        <div class="img">
          <img :src="qrcodeImg" alt />
        </div>
        <ul>
          <li>
            <img src="../../static/images/que_ic_iphone.png" alt />
            <span>iPhone下载</span>
          </li>
          <li>
            <img src="../../static/images/que_ic_and.png" alt />
            <span>Android下载</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import common from "../api/common";
import QRCode from "qrcode";
import url from "../api/url";
import Request from "../api/newRequest";
import eventBus from "../services/eventBus";

export default {
  name: "info",
  data() {
    return {
      info: {},
      qrcodeImg: "",
      idcardBlind: "",
      isEditNickname: false,
      nickName: ""
    };
  },
  methods: {
    seeNickName() {
      this.isEditNickname = false;
      this.changeNickname();
      // setTimeout(() => {
      //   this.isEditNickname = false;
      //   this.getUserInfo();
      // }, 300);
    },
    changeNickname() {
      console.log(this.isEditNickname);
        if (this.nickName.length < 2 || this.nickName.length > 30) {
          $toast.show("昵称长度限制2-30个字符");
          this.getUserInfo();
          return;
        }
        console.log(/^[A-Za-z0-9\u4E00-\u9FA5]+$/g.test(this.nickName));
        if (!/^[A-Za-z0-9\u4E00-\u9FA5]+$/g.test(this.nickName)) {
          $toast.show("昵称不能包含特殊字符");
          this.getUserInfo();
          return;
        }
        Request(url.editUserInfo, {
          nickName: this.nickName
        }).then(data => {
          this.getUserInfo();
        });
      
    },
    editNickname() {
      this.isEditNickname = true;
      this.$nextTick(() => {
        document.getElementById("nickInput").focus();
      });
    },
    getUserInfo() {
      common.getUserInfo().then(data => {
        this.info = data.data;
        var userInfo = JSON.parse(localStorage.getItem("userInfo"));
        userInfo.balance = this.info.balance;
        userInfo.headImgUrl = this.info.headImgUrl;
        userInfo.integral = this.info.integral;
        userInfo.integralDesc = this.info.integralDesc;
        userInfo.nickName = this.info.nickName;
        this.nickName =
          this.info.nickName == undefined ||
          this.info.nickName == null ||
          this.info.nickName == "null"
            ? ""
            : this.info.nickName;
        userInfo.withdraw = this.info.withdraw;
        userInfo.total = data.data.total;
        userInfo.gold = data.data.gold;
        userInfo.totalGold = data.data.totalGold;
        userInfo.withdrawGold = data.data.withdrawGold;
        eventBus.$emit("userInfo", userInfo);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        if (this.info.idcardBlind == 0) {
          this.idcardBlind = "待审核";
        } else if (this.info.idcardBlind == 1) {
          this.idcardBlind = "审核已通过";
        } else if (this.info.idcardBlind == -1) {
          this.idcardBlind = "审核未通过";
        } else if (this.info.idcardBlind == -2) {
          this.idcardBlind = "未认证，认证可获得20金币";
        }
      });
    }
  },
  created() {
    this.getUserInfo();
    QRCode.toDataURL(url.basePage + "/common/share/#/homeshare")
      .then(url => {
        this.qrcodeImg = url;
      })
      .catch(err => {
        console.error(err);
      });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@mixin size($w: 100%, $h: 100px) {
  width: $w;
  height: $h;
}
@mixin font($size: 16px, $color: #333) {
  font-size: $size;
  color: $color;
}

.info {
  box-sizing: border-box;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
  p {
    width: 66px;
    text-align-last: justify;
    display: inline-block;
    vertical-align: middle;
    @include font(16px, #666);
    margin-right: 40px;
  }
  width: 100%;
  padding: 35px 40px 60px;
  background: #fff;
  border-radius: 6px;
  .title {
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
    img {
      vertical-align: middle;
    }
    span {
      @include font(18px, #333);
      margin-left: 8px;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .photo {
    margin-top: 40px;
    // &:nth-last-child(2) {
    //   border-bottom: 1px dashed #ddd;
    //   padding-bottom: 40px;
    // }
    .img {
      display: inline-block;
      vertical-align: middle;
      @include size(90px, 90px);

      img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }
    }
    span {
      display: inline-block;
      vertical-align: middle;
      @include font(16px, #999);
    }
  }
  .changeNickname.photo {
    input {
      width: 210px;
      display: inline-block;
      vertical-align: middle;

      padding: 2px 10px 0;
      box-sizing: border-box;
      background: #eee;
      height: 32px;
      line-height: 32px;
      border-radius: 5px;
      @include font(16px, #999);
    }
    span {
      border-radius: 5px;
      box-sizing: border-box;
      width: 210px;
      display: inline-block;
      padding: 0px 10px 0 0;
      height: 32px;
      line-height: 32px;
      // &:hover {
      //   background: #eee;
      // }
    }
    div {
      margin-left: 5px;
      margin-top: 5px;
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
      // width: 100px;
      // height: 32px;
      // line-height: 32px;
      color: #fff;
      // border-radius: 3px;
      // text-align: center;
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  .load {
    padding-top: 60px;
    border-top: 1px dashed #ddd;
    margin-top: 40px;
    .hint {
      @include font(16px, #7575f9);
    }
    .download {
      margin-top: 20px;
      ul {
        display: inline-block;
        vertical-align: middle;
        li {
          @include size(152px, 40px);
          line-height: 40px;
          border: 1px solid #666;
          border-radius: 20px;
          text-align: center;
          &:nth-child(2) {
            margin-top: 22px;
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
        margin-right: 20px;
        @include size(128px, 128px);
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
    }
  }
}
</style>
