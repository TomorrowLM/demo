<template>
  <div class="perfect_info_box" v-show="fullInfo.user">
    <div class="top_bg">
      <h3>基本信息</h3>
    </div>
    <div class="basicInfo">
      <van-cell
        v-for="(item, index) in basicData.basicUserInfo"
        :key="'userInfo' + index"
        :title="item.title"
        :is-link="item.disabled === 1 ? false : true"
        :class="{'complete': item.value}"
        :value="item.value || '待完善'"
        @click="openPopup(item)"
      ></van-cell>
    </div>
    <div class="otherInfo">
      <h3>其他信息</h3>
      <van-cell
        v-for="(item, index) in fullInfo.industryList"
        :key="'otherInfo' + index"
        :title="item.name"
        is-link
        :class="{'complete': item.stateCode === '1'}"
        :value="item.state"
        @click="pushOtherInfo(item)"
      ></van-cell>
    </div>
    <div class="submit_btn">
      <van-button block round type="primary" @click="submit">保存</van-button>
    </div>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        v-show="activeData.componentType === 'picker'"
        show-toolbar
        :columns="columns"
        :default-index="defaultIndex"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
      <van-datetime-picker
        v-show="activeData.componentType === 'datetime'"
        v-model="currentDate"
        type="date"
        title="选择出生日期"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showPicker = false"
        @confirm="onBirthdayConfirm"
      />
      <van-area
        v-show="activeData.componentType === 'area'"
        :value="activeData.provinceCode"
        :area-list="areaList"
        :columns-num="2"
        @cancel="showPicker = false"
        @confirm="onCityConfirm"
      />
    </van-popup>
    <van-dialog
      class="birth-day-van-dialog"
      v-model="showDialog"
      title="请填写您的出生年份"
      show-cancel-button
      :before-close="birthDayDialogClose"
    >
      <van-password-input
        :value="birthDay"
        :mask="false"
        :length="4"
        :gutter="10"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
      />
    </van-dialog>
    <van-number-keyboard
      :show="showKeyboard"
      @input="onInput"
      @delete="onDelete"
      @blur="showKeyboard = false"
    />
  </div>
</template>

<script>
import basicData from "./const";
import { Toast } from "vant";

export default {
  name: "PerfectInfo",
  data() {
    return {
      basicData: basicData,
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(2020, 11, 31),
      currentDate: new Date(1980, 0, 1),
      columns: [],
      showPicker: false,
      showDialog: false,
      showKeyboard: false,
      defaultIndex: -1,
      activeData: {},
      editBirthDay: 0,
      editSex: 0,
      birthDay: ""
    };
  },
  watch: {
    fullInfo: {
      handler(data) {
        for (const basic of this.basicData.basicUserInfo) {
          const { componentType, paramsType, columnType } = basic;
          const { labelList, user } = data;
          if (paramsType === "gender" && user.editSex === 1) {
            basic.disabled = user.editSex;
          }
          if (paramsType === "birthDay" && user.editBirthDay === 1) {
            basic.disabled = user.editBirthDay;
          }
          if (componentType === "picker") {
            const value = user[paramsType] ? user[paramsType] : "";
            const code =
              user[`${paramsType}Code`] !== null
                ? user[`${paramsType}Code`].toString()
                : "";
            basic.value = value;
            basic.code = code;
            basic.columns = labelList[columnType].map(item => {
              return {
                text: item.itemName,
                code: item.itemCode
              };
            });
          } else if (componentType === "datetime") {
            this.currentDate = user[paramsType]
              ? new Date($_moment(user[paramsType]))
              : new Date(1980, 0, 1);
            basic.value = user[paramsType] ? user[paramsType] : "";
          } else if (componentType === "area") {
            if (user.province) {
              basic.value = `${user.province}-${user.city}`;
              basic.province = user.province;
              basic.provinceCode = user.provinceCode;
              basic.cityCode = user.cityCode;
              basic.city = user.city;
            } else {
              basic.value = "";
            }
          }
        }
      },
      deep: true
    }
  },
  computed: {
    fullInfo() {
      return this.$store.getters.fullInfo;
    },
    areaList() {
      return this.$store.getters.areaList;
    }
  },
  created() {
    const { dispatch } = this.$store;
    dispatch("GetUserFullInfo");
    dispatch("GetCityDropDown");
  },
  methods: {
    openPopup(evt) {
      const { paramsType, componentType, columns, code, value, disabled } = evt;
      if (disabled === 1) return;
      this.columns = columns;
      this.activeData = evt;
      if (paramsType === "birthDay") {
        this.showDialog = true;
        this.showKeyboard = true;
        this.birthDay = value;
      } else {
        this.showPicker = true;
      }
      if (componentType === "picker") {
        this.defaultIndex = columns.findIndex(item => item.code === code);
      }
    },
    onConfirm(value) {
      const { text, code } = value;
      this.activeData.value = text;
      this.activeData.code = code;
      this.showPicker = false;
    },
    onBirthdayConfirm(values) {
      this.activeData.value = $_moment(values).format("YYYY-MM-DD");
      this.showPicker = false;
    },
    onCityConfirm(values) {
      const [province, city] = values;
      this.activeData.value = values.map(item => item.name).join("-");
      this.activeData.province = province.name;
      this.activeData.provinceCode = province.code;
      this.activeData.cityCode = city.code;
      this.activeData.city = city.name;
      this.showPicker = false;
    },
    onInput(key) {
      const currentYearData = $_moment(new Date()).format("YYYY");
      this.birthDay = (this.birthDay + key).slice(0, 4);
      if (this.birthDay.length === 4) {
        if (
          currentYearData - this.birthDay < 15 ||
          currentYearData - this.birthDay > 70
        ) {
          this.birthDay = "";
          this.$toast("请填写正确的出生年份");
        }
      }
    },
    onDelete() {
      this.birthDay = this.birthDay.slice(0, this.birthDay.length - 1);
    },
    birthDayDialogClose(action, done) {
      if (action === "confirm") {
        if (this.birthDay.length < 4) {
          this.$toast("请填写正确的出生年份");
          done(false);
        } else {
          const data = this.basicData.basicUserInfo.find(
            item => item.paramsType === "birthDay"
          );
          data.value = this.birthDay;
        }
      }
      done();
    },
    async pushOtherInfo(evt) {
      await this.saveUserFullInfo();
      window.location.href = evt.linkUrl;
    },
    async saveUserFullInfo() {
      const params = {};
      for (const item of this.basicData.basicUserInfo) {
        const { componentType, paramsType, value, code } = item;
        if (!value) {
          Toast.fail("请您先完善基本信息");
          return Promise.reject("请您先完善基本信息");
        }
        if (componentType === "picker") {
          params[paramsType] = value;
          params[`${paramsType}Code`] = code;
        } else if (componentType === "datetime") {
          params[paramsType] = value;
        } else if (componentType === "area") {
          params.province = item.province;
          params.provinceCode = item.provinceCode;
          params.cityCode = item.cityCode;
          params.city = item.city;
        }
      }
      const {
        $store: { dispatch }
      } = this;
      await dispatch("EditUserFullInfo", params);
    },
    async submit() {
      await this.saveUserFullInfo();
      const { $router } = this;
      Toast.success("保存成功");
      $router.push("/surveyOne");
    }
  }
};
</script>

<style lang='less' scoped>
//@import url()
.perfect_info_box {
  height: 100%;
  background: @page-bg;
  overflow-y: auto;
  /deep/ .birth-day-van-dialog {
    top: 35%;
  }
  .top_bg {
    height: 200px;
    background: url("../../assets/images/user/Improveinf_topbg.png") no-repeat;
    background-size: 100% 100%;
    h3 {
      color: @white;
      font-size: 32px;
      padding-left: 60px;
      padding-top: 140px;
      position: relative;
      &::before {
        content: "";
        width: 8px;
        height: 30px;
        border-radius: 4px;
        background: @white;
        position: absolute;
        left: 30px;
        top: 140px;
        bottom: 0;
        margin: auto 0;
      }
    }
  }
  .otherInfo {
    h3 {
      color: @violet;
      font-size: 32px;
      padding: 30px 0 30px 60px;
      position: relative;
      &::before {
        content: "";
        width: 8px;
        height: 30px;
        border-radius: 4px;
        background: @violet;
        position: absolute;
        left: 30px;
        top: 0;
        bottom: 0;
        margin: auto 0;
      }
    }
  }
  .complete {
    /deep/ .van-cell__value {
      color: @title-gray3;
    }
  }
  .submit_btn {
    padding: 60px;
  }
  /deep/ .van-number-keyboard {
    z-index: 9999;
  }
  /deep/ .van-password-input {
    margin: 20px 16px;
  }
  /deep/ .van-password-input__item {
    background: #f5f5f5;
    border-radius: 10px;
    color: @title-gray1;
  }
}
</style>