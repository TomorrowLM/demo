<template>
  <div class="beforeQue">
    <div class="beforeQueCont">
      <div class="informations">
        <div class="inforTitle">
          <!-- <img src="../../assets/images/home_impreinf_topbg.png" width="100%" alt /> -->
          <div class="inforTitlep">
            <p>欢迎来到拼任务</p>
            <p>基本信息能够帮您匹配到更多高额奖金任务，请您认真填写。</p>
          </div>
        </div>
        <div class="q2-wrap">
          <div class="q2">
            <div class="man" @click="selSex('1')">
              <label for="r1" :class="[genderCode==1?'label1act label1':'label1']">
                <div class style="position: relative;">
                  <img src="../../assets/images/home_impreinf_ic_boy.png" alt />
                  <p>男生</p>
                </div>
              </label>
              <input id="r1" type="radio" value="1" name="sexCode" />
            </div>
            <div class="girl" @click="selSex('2')">
              <label for="r2" :class="[genderCode==2?'label2act label2':'label2']">
                <div class style="position: relative;">
                  <img src="../../assets/images/home_impreinf_ic_girl.png" alt />
                  <p>女生</p>
                </div>
              </label>
              <input id="r2" type="radio" value="2" name="sexCode" />
            </div>
          </div>
        </div>

        <div class="q1">
          <div class="q_box">
            <div class="city">
              城市
              <span></span>
            </div>
            <div class="trigger" id="trigger1">请选择</div>
            <i></i>
          </div>
        </div>
        <div class="q3">
          <div class="q_box">
            <div class="city">出生年份</div>
            <div class="age trigger">
              <van-password-input
                :value="birthDay"
                :mask="false"
                :length="4"
                :focused="showKeyboard"
                @focus="showKeyboard = true"
              />
            </div>
          </div>
        </div>
        <div class="globalWarn"></div>
      </div>
      <button class="informationSaves" @click="informationSave" v-bind:disabled="disable">确定</button>
      <van-number-keyboard
        :show="showKeyboard"
        @input="onInput"
        @delete="onDelete"
        @blur="showKeyboard = false"
      />
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { Toast } from "vant";
import { editUserFullInfo, city_drop_down } from "@/api/survey.js";
import { MobileSelect } from "../../utils/mobileSelect.js";
export default {
  name: "basicInformation",
  data() {
    return {
      genderCode: "",
      q2Scope: "",
      birthDay: "",
      province: "",
      provinceCode: "",
      city: "",
      cityCode: "",
      disable: false,
      data: "",
      showKeyboard: false,
    };
  },
  methods: {
    onInput(key) {
      const currentYearData = $_moment(new Date()).format('YYYY')
      this.birthDay = (this.birthDay + key).slice(0, 4)
      if (this.birthDay.length === 4) {
        this.showKeyboard = false
        console.log(currentYearData - this.birthDay)
        if (currentYearData - this.birthDay < 10 || currentYearData - this.birthDay > 70) {
          this.birthDay = ''
          Toast("请填写正确的出生年份")
        }
      }
    },
    onDelete() {
      this.birthDay = this.birthDay.slice(0, this.birthDay.length - 1);
    },
    selSex(index) {
      if (index != this.genderCode) {
        this.genderCode = index;
      }
    },
    inputBlur() {},
    informationSave() {
      if (this.genderCode === "") {
        Toast("请选择性别!");
      } else if (this.q2Scope === "") {
        Toast("请选择居住城市!");
      } else if (this.birthDay === "") {
        Toast("请输入出生年份!");
      } else {
        const {
          genderCode,
          birthDay,
          province,
          provinceCode,
          city,
          cityCode
        } = this;
        this.disable = true;
        const gender = genderCode === "1" ? "男" : "女";
        console.log("token");

        editUserFullInfo({
          birthDay,
          province,
          provinceCode,
          city,
          cityCode,
          genderCode,
          gender
        }).then(() => {
          this.disable = false;
          if (this.data.surveyId) {
            this.$router.replace({ name: "SurveyFront",query:this.data });
          } else {
            this.$router.replace({ name: "tabs" });
          }
        });
      }
    }
  },
  mounted() {
    this.data = this.$route.query;
    if (this.data.token) {
      //老用户未完善信息 链接中会拼接token
      this.$ls.set("token", this.data.token);
    }
    const that = this;
    // 获取地址级联
    city_drop_down({}).then(response => {
      new MobileSelect({
        trigger: "#trigger1",
        title: "选择城市",
        wheels: [{ data: response.data }],
        position: [], //初始化定位 打开时默认选中的哪个 如果不填默认为0
        //   transitionEnd: function(indexArr, data) {},
        callback: function(indexArr, data) {
          that.province = data[0].value;
          that.provinceCode = data[0].id + "";
          that.city = data[1].value;
          that.cityCode = data[1].id + "";
          that.q2Scope = data[0].id + "-" + data[1].id;
          $("#trigger1").css("color", "#000");
        }
      });
    });
    // // 出生日期
    // new MobileSelect({
    //   trigger: "#trigger2",
    //   title: "选择出生年月",
    //   wheels: [{ data: cityArr() }],
    //   position: [40, 0, 0], //初始化定位 打开时默认选中的哪个 如果不填默认为0
    //   //   transitionEnd: function(indexArr, data) {
    //   //     //console.log(data);
    //   //   },
    //   callback: function(indexArr, data) {
    //     that.birthDay = data[0].id - 1 + "-" + data[1].id + "-" + data[2].id;
    //     // $('#trigger2').val(data[0].id-1+'-'+data[1].id+"-"+data[2].id)
    //     $("#trigger2").css("color", "#000");
    //   }
    // });
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
  width: 100%;
  flex: 1;
  flex-direction: column;
  .beforeQueCont {
    width: 100%;
    .informations {
      width: 100%;
      height: 100%;
      background: #fff;
      text-align: left;
      position: relative;
    }
    .inforTitle {
      position: relative;
      .inforTitlep {
        width: 100%;
        height: 300px;
        text-align: center;
        padding: 30px;
        box-sizing: border-box;
        p:nth-child(1) {
          font-size: 40px;
          color: #333;
        }
        p:nth-child(2) {
          font-size: 28px;
          color: #999;
          padding-top: 16px;
          text-align: left;
        }
      }
    }
    .q2-wrap {
      margin-top: -80px;
      background: #fff;
      border-radius: 0 80px 0 0;
    }
    .informationSaves {
      width: 90%;
      height: 84px;
      text-align: center;
      line-height: 84px;
      border-radius: 42px;
      background: #7575f9;
      color: #fff;
      cursor: pointer;
      font-size: 32px;
      margin-left: 5%;
      bottom: 100px;
      outline: none;
      border: none;
      position: fixed;
    }
    .q2 {
      display: flex;
      box-sizing: border-box;
      background: #fff;
      height: 420px;
      border-radius: 0 80px 0 0;
      .man,
      .girl {
        height: 100%;
        flex: 1;
        background: #fff;
        img {
          width: 176px;
        }

        text-align: center;
      }
      .girl {
        border-radius: 0 80px 0 0;
      }
    }
    .q1,
    .q3 {
      padding: 0 60px 0 60px;
    }
    .q1 .q_box,
    .q3 .q_box {
      border-bottom: @PX solid #ccc;
    }

    .q1 > p,
    .q3 > p {
      padding: 36px 30px 20px;
      color: #888;
    }
    .q1 p span,
    .q3 p span {
      color: #7575f9;
    }

    .q1 .q_box,
    .q3 .q_box,
    .q2 > div {
      height: 90px;
      line-height: 90px;
      background-color: #fff;
      position: relative;
    }
    .q1 .city,
    .q3 .city,
    .q2 > div > div:nth-child(1) {
      position: absolute;
      left: 0px;
      top: 0;
      width: 25%;
      text-align: left;
      color: #353535;
    }

    .q2 > div > div:nth-child(2) {
      position: absolute;
      right: 0;
      top: 0;
      width: 70%;
      text-align: right;
    }
    input:focus {
      outline: none;
    }
    .q2 .label1,
    .q2 .label2 {
      width: 100%;
      position: relative;
      display: inline-block;
      margin-top: 90px;
    }
    #r1,
    #r2 {
      display: none;
    }
    .q2 .label2act.label2:after,
    .q2 .label1act.label1:after {
      content: "";
      width: 40px;
      height: 40px;
      background: url(../../assets/images/home_impreinf_ic_select.png);
      position: absolute;
      bottom: 120px;
      right: 110px;
      background-size: cover;
    }

    .q2 .label1act,
    .q2 .label2act {
      color: #7575f9;
    }

    .q1 .trigger span,
    .q3 .trigger span {
      display: inline-block;
      width: 100%;
    }
    .trigger {
      width: 70%;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 0;
      color: #666;
      text-align: right;
      padding-right: 60px;
      box-sizing: border-box;
    }
    .age{
      width: 320px;
      padding-right: 0px;
      top: 8px;
      /deep/ .van-password-input{
        margin-right: 0;
        .van-password-input__security{
          height: 35px;
        }
      }
    }
    .q3 i,
    .q1 i {
      position: absolute;
      right: 0px;
      top: 26px;
      background: url(../../assets/images/ic_arrowr@2x.png);
      background-size: cover;
      z-index: 1;
      width: 24px;
      height: 40px;
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
    }
  }
}
</style>
