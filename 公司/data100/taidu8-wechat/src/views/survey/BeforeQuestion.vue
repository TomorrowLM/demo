<template>
  <div class="beforeQue">
    <div class="beforeQueCont">
      <div class="title">
        <p>完善信息，轻松获取更多问卷</p>
        <p>
          <span>
            <span>1</span>选择城市
          </span>
          <span class="select">
            <span>2</span>选择性别
          </span>
          <span class="select">
            <span>3</span>选择年龄
          </span>
        </p>
      </div>
      <div class="informations">
        <div class="q1">
          <p>所在城市？</p>
          <div>
            <div id="trigger1">请选择您所在城市</div>
            <i></i>
          </div>
        </div>
        <div class="q2">
          <span>您的性别？</span>
          <ul>
            <li :class="{ active: q2Scope==1 }" @click="selSex('1')">男</li>
            <li :class="{ active: q2Scope==2 }" @click="selSex('2')">女</li>
          </ul>
        </div>
        <div class="q3">
          <p>您的年龄？</p>
          <div>
            <div>
              <input
                class="inputAge"
                type="number"
                id="age"
                v-model="q3Scope"
                @blur="inputBlur"
                placeholder="15-70岁之间"
                min="10"
                max="80"
                onkeyup="this.value=this.value.replace(/\D/g,'')"
                onafterpaste="this.value=this.value.replace(/\D/g,'')"
              />
            </div>
          </div>
        </div>
        <div class="globalWarn"></div>
      </div>
    </div>
    <button
      class="commonBtn informationSaves"
      @click="informationSave"
      v-bind:disabled="disable"
    >下一步</button>
    <div class="sclutionBox">所有个人信息保护及使用规则均符合<a :href="`${domainName}/app/delete_user/sclution.html`">《隐私保护指引》</a></div>
  </div>
</template>

<script>
var isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
var scrollY = 0; //记录ios系统中滚动条的高度  input失去焦点时 页面还原未获取焦点时的位置 解决键盘将页面顶起的问题
window.addEventListener("scroll", function() {
  // console.log(window.scrollY);
  scrollY = window.scrollY;
});
import $ from "jquery";
import {
  commit_before_question,
  city_drop_down,
  channel_before_question
} from "@/api/survey.js";
import { Toast } from "vant";
import { MobileSelect } from "../../utils/mobileSelect.js";
export default {
  name: "beforeQue",
  data() {
    return {
      domainName: process.env.VUE_APP_PAGE_BASE_URL,
      surveyId: this.$route.params.surveyId,
      q1Scope: "", //城市
      q2Scope: "", //性别
      q3Scope: "", //年龄
      disable: false
    };
  },
  methods: {
    selSex(code) {
      if (this.q2Scope != code) {
        this.q2Scope = code;
      }
    },
    inputBlur() {
      if (isIOS) {
        window.scrollTo(0, scrollY);
      }
    },

    informationSave() {
      if (this.q1Scope === "") {
        Toast("请选择居住城市!");
      } else if (this.q2Scope === "") {
        Toast("请选择性别!");
      } else if (this.q3Scope < 15) {
        this.q3Scope = "";
        Toast("年龄不能小于15岁");
      } else if (this.q3Scope > 70) {
        this.q3Scope = "";
        Toast("年龄不能大于70岁");
      } else {
        const { surveyId, q1Scope, q2Scope, q3Scope } = this;
        this.disable = true;
        if (this.$route.query.channelAnswer) {
          channel_before_question({
            ...this.$route.query,
            terminalCode: "",
            surveyId: surveyId,
            age: String(q3Scope),
            city: q1Scope,
            gender: q2Scope
          }).then(res => {
            this.disable = false;
            location.replace(res.data);
          });
        } else {
          commit_before_question({
            ...this.$route.query,
            surveyId: surveyId,
            age: String(q3Scope),
            city: q1Scope,
            gender: q2Scope
          }).then(res => {
            this.disable = false;
            if (res.data.isCanAnswer) {
              // 可以进入问卷
              location.replace(res.data.surveyUrl);
            } else {
              // 前置问卷甄别
              // 跳转到甄别页面
              if (this.$route.query.wechatShare === '1') {
                var obj = {
                  surveyId: this.surveyId, //问卷id
                  msg: res.data.resultMsg, //提示文案
                  tabText: "返回问卷列表"
                };
                this.$router.push({
                  name: "SurveyUnqualified",
                  params: { data: JSON.stringify(obj) }
                });
              } else {
                window.location.href = `${window.location.origin}/common/share/#/datedSurvey/1/survey/${res.data.resultMsg}`
              }
            }
          });
        }
      }
    }
  },
  created() {
    console.log(this.$route.query);
    const that = this;
    // 获取地址级联
    city_drop_down({}).then(response => {
      // this.areaList = response.data
      // this.surveyList = response.data
      var mobileSelect3 = new MobileSelect({
        trigger: "#trigger1",
        title: "选择城市",
        wheels: [{ data: response.data }],
        position: [], //初始化定位 打开时默认选中的哪个 如果不填默认为0
        transitionEnd: function(indexArr, data) {
          console.log(indexArr, data);
        },
        callback: function(indexArr, data) {
          that.q1Scope = data[0].id + "-" + data[1].id;
          $("#trigger1").css("color", "#000");
        }
      });
      console.log(mobileSelect3);
    });
  },
  beforeDestroy() {
    $("body")
      .find(".mobileSelect")
      .remove();
  }
};
</script>

<style scoped lang="less">
.beforeQue {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 1000px;
  box-sizing: border-box;
  padding-bottom: 150px;
  overflow: auto;
  .informationSaves {
    width: 630px;
    background: #7575f9;
    color: #fff;
    cursor: pointer;
    position: absolute;
    bottom: 80px;
    left: 60px;
  }
  .sclutionBox{
    width: 630px;
    position: absolute;
    bottom: 20px;
    left: 60px;
    color: @title-gray2;
    font-size: 24px;
    text-align: center;
  }
  .beforeQueCont {
    width: 100%;
    .title {
      // height: 240px;
      background: #7575f9;
      text-align: center;
      padding: 30px 0 110px;
      p:nth-child(1) {
        font-size: 30px;
        color: #fff;
        // padding-top: 30px;
      }
      p:nth-child(2) {
        font-size: 24px;
        color: #a5abf3;
        margin-top: 20px;
        span {
          position: relative;
          padding-left: 40px;
          span {
            position: absolute;
            width: 30px;
            height: 30px;
            background: #a5abf3;
            color: #7575f9;
            font-size: 18px;
            text-align: center;
            line-height: 30px;
            left: 0px;
            top: 0px;
            padding: 0;
            border-radius: 50%;
            // transform: scale(0.8);
          }
        }
        .select {
          margin-left: 44px;
        }
      }
    }
    .informations {
      width: 100%;
      height: 100%;
      background: #fff;
      text-align: left;
      position: relative;
      margin-top: -80px;
      border-radius: 0 80px 0 0;
      padding: 0 60px 30px;
      box-sizing: border-box;
    }

    .q1 > p,
    .q3 > p {
      padding: 36px 0px 20px;
      color: #7575f9;
      font-size: 26px;
    }

    .q1 > div,
    .q3 > div {
      height: 90px;
      line-height: 90px;
      background-color: #fff;
      position: relative;
      border-bottom: @PX solid #ddd;
    }
    .q3 .inputAge {
      font-size: 30px;
      line-height: 30px;
      width: 100%;
    }
    .q1 > div > div:nth-child(1),
    .q3 > div > div:nth-child(1) {
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
      text-align: left;
    }

    input:focus {
      outline: none;
    }
    .q2 {
      padding: 40px 0 45px;
      border-bottom: @PX solid #ddd;
      span {
        line-height: 68px;
        color: @violet;
        font-size: 26px;
      }
      ul {
        overflow: hidden;
        float: right;
        li {
          float: left;
          width: 180px;
          height: 68px;
          line-height: 68px;
          color: #8d97b5;
          text-align: center;
          border: 2px solid #d9daef;
          border-radius: 34px;
          &:nth-child(1) {
            margin-right: 30px;
          }
          &.active {
            background: #ecedff;
            border: 2px solid #8990ed;
            color: @violet;
          }
        }
      }
    }
    .q1 > div > div > span,
    .q2 > div > div > span,
    .q3 > div > div > span {
      display: inline-block;
      width: 100%;
    }
    #trigger1 {
      position: absolute;
      z-index: 1;
      color: #8d97b5;
      font-size: 30px;
    }
    .q1 > div > i {
      width: 22px;
      height: 22px;
      border-right: 4px solid #7575f9;
      border-bottom: 4px solid #7575f9;
      transform: rotate(45deg);
      position: absolute;
      right: 30px;
      top: 26px;
      background-size: cover;
      z-index: 1;
    }
    #age {
      border: none;
    }
    .load-fixed {
      position: fixed;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.0001);
      display: none;
    }
    .ball-spin-fade-loader > div {
      background-color: #7575f9;
      font-size: 30px;
    }
  }
}
#age::-webkit-input-placeholder {
  color: #8d97b5;
  font-size: 30px;
}
#age:-moz-placeholder {
  color: #8d97b5;
  font-size: 30px;
}
#age::-moz-placeholder {
  color: #8d97b5;
  font-size: 30px;
}
#age:-ms-input-placeholder {
  color: #8d97b5;
  font-size: 30px;
}
</style>
