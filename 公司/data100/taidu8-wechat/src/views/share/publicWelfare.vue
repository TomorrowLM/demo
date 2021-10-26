<template>
  <div id="publicWelfare">
    <img :src="pageInfo.picture" alt="" class="active-img" />
    <div class="active-theme">
      <p class="active-theme-title">本期主题：{{ pageInfo.theme }}</p>
      <div class="active-theme-detail">
        <div class="active-target">
          <span>本期助力目标：</span>
          <span>{{ pageInfo.goal }}</span>
          <span>份问卷</span>
        </div>
        <div class="active-progress">
          <span>已完成：</span>
          <span>{{ pageInfo.percent }}%</span>
        </div>
      </div>
      <div class="active-theme-progress">
        <div
          class="skills html"
          :style="{ width:(pageInfo.percent>100?100:pageInfo.percent)+'%' }"
        ></div>
      </div>
    </div>
    <div class="active-detail">
      <div>
        <img src="../../assets/images/share/time.png" alt="" />
        <span>助力活动</span>
        <span>时间</span>
        <span>:</span>
        <div>
          <span class="content"> {{pageInfo.startTime}}-{{pageInfo.endTime}} </span>
        </div>
      </div>
      <div>
        <img src="../../assets/images/share/rule.png" alt="" />
        <span>助力活动</span>
        <span>规则</span>
        <span>:</span>
        <div>
          <span class="content">
            {{ pageInfo.rule }}
          </span>
        </div>
      </div>
    </div>
    <div class="active-rule"></div>
    <div class="go-help">
      <p @click="downloadApp">去助力</p>
    </div>
  </div>
</template>

<script>
import config from "@/config/defaultSettings";
import { getPublicWelfare } from "@/api/share";
import { getUrl } from "../../utils/base";
export default {
  name: "publicWelfare",
  data() {
    return {
      appPageUrl: config.appPageUrl,
      pageInfo: {
        questionnaireNum: 0,
        goal: 0,
        rule: "",
        startTime: "",
        theme: "",
        id: 0,
        endTime: "",
        percent: "0",
        picture: "",
      },
    };
  },
  created() {
    this.getPublicWelfare();
  },
  methods: {
    downloadApp() {
      window.location.href = this.appPageUrl;
    },
    getPublicWelfare() {
      let id;
      if(getUrl().id){
        id = getUrl().id
      }else{
       // id = 4
      }
      getPublicWelfare({id}).then((res) => {
        this.pageInfo = res.data;
        //this.pageInfo.startTime = $_moment(this.pageInfo.startTime).utc().format('YYYY-MM-DD')
        //this.pageInfo.endTime = $_moment(this.pageInfo.endTime).utc().format('YYYY-MM-DD')
        this.pageInfo.percent = this.pageInfo.percent.replace(/,/g, "")
      })
    },
  },
};
</script>

<style lang='less' scoped>
#publicWelfare {
  height: 100%;
  overflow: auto;
}
.active-img {
  opacity: 1;
  margin-bottom: 60px;
  object-fit: contain;
}
.active-theme {
  margin: 0 60px;
  .active-theme-title {
    height: 48px;
    opacity: 1;
    font-size: 30px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: left;
    color: #333333;
    line-height: 48px;
    margin-bottom: 20px;
  }
  .active-theme-detail {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
    .active-target {
      span:nth-of-type(1),
      span:nth-of-type(3) {
        font-size: 28px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #999999;
      }
      span:nth-of-type(2) {
        font-size: 28px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #f74545;
      }
      span:nth-of-type(3) {
        margin-left: 10px;
      }
    }
    .active-progress {
      span {
        font-size: 24px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: right;
        color: #999999;
      }
    }
  }
  .active-theme-progress {
    width: 100%;
    background-color: #ddd;
    height: 16px;
    opacity: 1;
    background: #eeeeee;
    border-radius: 8px;
    .skills {
      height: 16px;
      border-radius: 8px;
      text-align: right;
      padding-right: 20px;
      line-height: 40px;
      color: white;
      background-color: #01cf97;
    }
  }
}
.active-detail {
  margin: 0 60px;
  margin-top: 60px;
  div {
    img {
      width: 28px;
      height: 28px;
      opacity: 1;
      margin-right: 20px;
      vertical-align: text-top;
    }
    span {
      width: 196px;
      height: 40px;
      opacity: 1;
      font-size: 28px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #7575f9;
      line-height: 40px;
    }
    span:nth-of-type(2) {
      color: #7575f9;
      margin-left: 1px;
    }
    div {
      width: 630px;
      padding: 22px 30px;
      opacity: 1;
      border: 2px dashed #9393dd;
      border-radius: 20px;
      margin-top: 14px;
    }
    .content {
      opacity: 1;
      font-size: 28px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: justify;
      color: #888888;
      line-height: 48px;
    }
  }
  div + div {
    margin-top: 60px;
  }
}
.go-help {
  width: 340px;
  height: 130px;
  opacity: 1;
  margin: auto;
  background: url("../../assets/images/share/publicWelfarebutton.png") center
    8px no-repeat;
  background-size: contain;
  margin-top: 152px;
  margin-bottom: 50px;
  position: relative;
  p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 1;
    font-size: 32px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: center;
    color: #ffffff;
    line-height: 48px;
  }
}
</style>