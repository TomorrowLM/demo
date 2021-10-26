<template>
  <div class="channelRegister" id="channelRegister">
    <div class="basicInformation" v-if="name === 'BasicInformation'">
      <h3>欢迎来到拼任务</h3>
      <h5>基本信息能够帮您匹配到更多高额奖金任务，请您认真填写。</h5>
    </div>
    <div class="channelRegisterInfo" v-else>
     <!-- <h3>基本信息</h3>
      <h5>填写基础信息获得与你匹配的任务类型</h5>-->
      <div class="tip_bg"></div>
      <div class="tip">您在下方提供的个人数据和个人详情将仅用于市场研究用途。所有个人信息保护和使用规则均符合<router-link to="/sclution">《隐私保护指引》</router-link>，点击提交即代表您已充分了解并授权进入。</div>
    </div>
    <div class="channelRegisterContent">
      <div class="sexBox">
        <dl class="boy">
          <dt>
            <input type="radio" name="sex" value="1" id="boy" v-model="params.genderCode" />
            <label for="boy"></label>
          </dt>
          <dd>男生</dd>
        </dl>
        <dl class="girl">
          <dt>
            <input type="radio" name="sex" value="2" id="girl" v-model="params.genderCode" />
            <label for="girl"></label>
          </dt>
          <dd>女生</dd>
        </dl>
      </div>
      <div class="infoBox">
        <van-form
          ref="form"
          :show-error-message="false"
          :validate-first="true"
          @submit="onSubmit"
          @failed="onFailed"
        >
          <van-field
            readonly
            input-align="right"
            clickable
            name="city"
            :value="cityValue"
            label="城市"
            :placeholder='isLocation===0?"去授权":"请选择城市"'
            right-icon="arrow"
            :rules="[{ required: true, trigger: 'onChange', message: '请选择城市' }]"
            @click="getLocation"
          />
          <van-popup v-model="showCity" position="bottom">
            <van-area
              :value="params.provinceCode"
              :area-list="areaList"
              :columns-num="2"
              @cancel="showCity = false"
              @confirm="onCityConfirm"
            />
          </van-popup>
          <span class="label">出生年份</span>
          <BlockInput
            ref="birthDay"
            class="birth_day_input"
            :value="params.birthDay"
            @input="onInput"
          />
        </van-form>
      </div>
    </div>
    <div class="submitBox">
      <van-button round block type="info" :disabled="disabledSubmit" @click="submit">提交</van-button>
    </div>
    <div class="sclutionBox" v-if="name === 'BasicInformation'">
      所有个人信息保护及使用规则均符合
      <a :href="`${domainName}/app/delete_user/sclution.html`">《隐私保护指引》</a>
    </div>
  </div>
</template>

<script>
// import { getUrl } from "../../utils/base";
import { getProvinces } from "@/api/user";
export default {
  data() {
    return {
      domainName:window.location.origin,//process.env.VUE_APP_PAGE_BASE_URL,
      cityValue: "",
      showCity: false,
      disabledSubmit: false,
      name: "",
      isLocation:0,//0:未请求授权  1 已请求授权用户同意 2已请求授权 用户拒绝或异常情况
      params: {
        provinceCode: "110000",
        province: "",
        city: "",
        cityCode: "",
        genderCode: "",
        gender: "",
        birthDay: ""
      }
    };
  },
  computed: {
    areaList() {
      return this.$store.getters.areaList;
    }
  },
  created() {
    const {
      $store: { dispatch },
      $route: { name },
    } = this;
    this.name = name;
    this.name === "BasicInformation"
      ? (document.title = "拼任务")
      : (document.title = "手拉手");
    dispatch("GetCityDropDown");
    if (this.$route.query.token) {
      //老用户未完善信息
      this.$ls.set("token", this.$route.query.token);
    }
    
  },
  methods: {
    getLocation(){
      if(this.isLocation ===0){
        const that = this
        var geolocation = new window.BMap.Geolocation();
        geolocation.getCurrentPosition(function(r) {
          if (this.getStatus() == 0) {
            that.isLocation = 1
            getProvinces({
              longitude: r.point.lng,
              latitude: r.point.lat
            }).then((data)=>{
              // console.log(data)
              that.params.provinceCode = data.data.provinceCode
              that.params.province = data.data.province
              that.params.city = data.data.city
              that.params.cityCode = data.data.cityCode
              that.cityValue = data.data.province + "/"+data.data.city
            })
          } else {
            //获取定位失败或用户拒绝授权
            that.isLocation = 2
          }
        })
        
      }else if(this.isLocation === 2){
        this.showCity = true
       }
    },
    submit() {
      // console.log(this.params);
      if (!this.params.genderCode) {
        this.$toast("请选择性别");
        return false;
      } else if (!this.params.birthDay) {
        this.$toast("请输入出生年月");
        return false;
      }
      this.$refs.form.submit();
    },
    async onSubmit() {
      this.disabledSubmit = true;
      try {
        const {
          $store: { dispatch },
          $route: { name }
        } = this;
        if (name === "BasicInformation") {
          this.params.genderCode === "1"
            ? (this.params.gender = "男")
            : (this.params.gender = "女");
          await dispatch("EditUserFullInfo", this.params);
          if (this.$route.query.surveyId) {
            this.$router.replace({
              name: "SurveyFront",
              query: this.$route.query
            });
          } else {
            if (this.$route.query.type == 1) {
              //type:1进问卷列表 2：进个人中心
              sessionStorage.setItem("tabIndex", "index");
            }else if(this.$route.query.type == 3){//分享赚金币
              sessionStorage.setItem("tabIndex", "index");
              sessionStorage.setItem("survey_name", "history");
            } else {
              sessionStorage.setItem("tabIndex", "user");
            }
            this.$router.replace({ name: "tabs" });
          }
        } else {
          const {
            provinceCode,
            cityCode,
            genderCode,
            birthDay: birthday
          } = this.params;
          const channelParams = {
            provinceCode,
            cityCode,
            gender: genderCode,
            birthday
          };
          const params = Object.assign({}, this.$route.query, channelParams);
          const result = await dispatch("SavePartnerInfo", params);
          console.log(result);
          window.location.href = result;
          this.$toast.loading({ message: "正在跳转中...", duration: 0 });
          this.disabledSubmit = false;
        }
      } catch (error) {
        this.disabledSubmit = false;
      }
    },
    onFailed(value) {
      const { errors } = value;
      const [{ message }] = errors;
      this.$toast(message);
    },
    onCityConfirm(values) {
      const [province, city] = values;
      
      this.cityValue = values.map(item => item.name).join("/");
      console.log(values,this.cityValue)
      this.params.province = province.name;
      this.params.provinceCode = province.code;
      this.params.city = city.name;
      this.params.cityCode = city.code;
      this.showCity = false;
    },
    onInput(val) {
      const currentYearData = $_moment(new Date()).format("YYYY");
      this.params.birthDay = val;
      if (val.length === 4) {
        if (currentYearData - val < 15 || currentYearData - val > 70) {
          this.params.birthDay = "";
          this.$toast("请填写正确的出生年份");
        } else {
          this.$refs.birthDay.onBlur();
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.channelRegister {
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 750px;
  margin: 0 auto;
  overflow-y: auto;
  background: #fff;
  // background: url('../../assets/images/home_impreinf_topbg.png') no-repeat;
  // background-size: 100% auto;
  .basicInformation {
    padding: 80px 60px 40px 60px;
    h3 {
      font-size: 40px;
      color: @title-gray1;
      text-align: center;
      padding-bottom: 30px;
    }
    h5 {
      font-size: 28px;
      color: @title-gray2;
      text-align: left;
    }
  }
  .channelRegisterInfo {
    // padding: 80px 60px 40px 60px;
    width:100%;
    height: 230px;
    background:@violet;
    border-radius:0 0 80px 0;
    position: relative;
    .tip_bg{
      width:208px;
      height: 192px;
      background: url(../../assets/images/user/tips@2x.png) no-repeat;
      background-size:contain;
    }
    .tip{
      position: absolute;
      right: 60px;
      top: 30px;
      width: 504px;
      font-size: 24px;
      line-height: 40px;
      color:#D6D6FF;
      a{
        color:#fff;
      }
    }
    h3 {
      font-size: 32px;
      color: @title-gray1;
      line-height: 50px;
      text-align: center;
    }
    h5 {
      font-size: 28px;
      color: @title-gray2;
      padding: 40px 0 20px 0;
      text-align: center;
    }
  }
  .channelRegisterContent {
    // flex: 1 0;
    background: #fff;
    // border-top-left-radius: 80px;
    // border-top-right-radius: 80px;
    .label {
      color: #888888;
      font-size: 14PX;
      line-height: 24PX;
      padding: 10PX 16PX;
      display: block;
    }
    .birth_day_input {
      padding: 0 40px;
    }
    .sexBox {
      display: flex;
      justify-content: center;
      padding: 80px 0;
      dl {
        margin: 0 70px;
        dt {
          width: 156px;
          height: 188px;
          position: relative;
          input {
            width: 150%;
            height: 150%;
            position: absolute;
            left: -25%;
            top: -25%;
            background: none;
            outline: none;
            z-index: 99;
            &:checked + label {
              opacity: 1;
              transition: opacity 0.5s;
            }
          }
          label {
            width: 40px;
            height: 40px;
            background: url("../../assets/images/home_impreinf_ic_select.png")
              no-repeat;
            background-size: contain;
            position: absolute;
            bottom: 0;
            right: 0;
            opacity: 0;
            transition: opacity 0.5s;
          }
        }
        dd {
          font-size: 28px;
          line-height: 60px;
          text-align: center;
        }
      }
      .boy {
        dt {
          background: url("../../assets/images/home_impreinf_ic_boy.png")
            no-repeat;
          background-size: contain;
        }
      }
      .girl {
        dt {
          background: url("../../assets/images/home_impreinf_ic_girl.png")
            no-repeat;
          background-size: contain;
        }
      }
    }
    .infoBox {
      width: 90%;
      margin: 0 auto;
      .birth_day {
        /deep/ .van-cell__value {
          flex: 0;
        }
        /deep/ .van-cell__label {
          margin-top: 20px;
        }
      }
      /deep/ .van-cell__title {
        color: @title-gray2;
      }
      /deep/ .van-password-input {
        margin: 0;
      }
      /deep/ .van-password-input__item {
        background: #f5f5f5;
        border-radius: 10px;
        color: @title-gray1;
      }
    }
  }
  .submitBox {
    width: 675px;
    margin: 150px auto 0;
    .van-button {
      background-color: @violet;
    }
  }
  .sclutionBox {
    width: 675px;
    color: @title-gray2;
    font-size: 24px;
    text-align: center;
    margin: 20px auto;
  }
}
</style>