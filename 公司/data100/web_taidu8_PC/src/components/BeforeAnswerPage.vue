<template>
  <div class="answer" @click="hideSelect">
    <com-header></com-header>
    <div class="tips">
      <p>完善信息，轻松获取更多问卷</p>
      <ul>
        <li>
          <span>1</span>
          <span>选择城市</span>
        </li>
        <li>
          <span>2</span>
          <span>选择性别</span>
        </li>
        <li>
          <span>3</span>
          <span>选择年龄</span>
        </li>
      </ul>
    </div>
    <div class="before_question">
      <p>所在城市</p>
      <div class="select">
        <div class="city" :class="{'actived':city!='请选择您的所在城市'}" @click.stop="selectCity">
          <div v-html="city"></div>
          <i></i>
          <select-city v-if="isSelected" @selectedCity="getCity"></select-city>
        </div>
      </div>
      <div class="select">
        <span>您的性别</span>
        <span class="num2" :class="{'num':gender=='2'}" @click="selectSex(2)">女</span>
        <span class="num1" :class="{'num':gender=='1'}" @click="selectSex(1)">男</span>
      </div>
      <p>您的年龄</p>
      <div class="select">
        <input type="number" v-model="age" placeholder="15-70岁之间" />
      </div>
      <button @click="next">下一页</button>
      <div class="sclutionBox">所有个人信息保护及使用规则均符合<a href="https://www.pinrenwu.cn/app/delete_user/sclution.html" target="_blank">《隐私保护指引》</a></div>
    </div>
  </div>
</template>
<script>
import common from "../api/common";
import SelectCity from "./common/SelectCity";
export default {
  name: "beforeanswer",
  components: {
    SelectCity
  },
  data() {
    return {
      surveyId: "",
      isSelected: false,
      age: "",
      gender: "", //1男2女
      city: "请选择您的所在城市",
      selectedCode: "" //选中的城市编码
    };
  },
  created() {
    this.surveyId = this.$route.params.surveyId;
    console.log(this.surveyId, "前置问卷页面surveyId");
  },
  methods: {
    selectSex(sex) {
      this.gender = sex;
    },

    next() {
      if (this.selectedCode == "") {
        $toast.show("请选择居住地");
        return;
      }
      if (this.gender == "") {
        $toast.show("请选择性别");
        return;
      }
      if (this.age == "") {
        $toast.show("请填写年龄");
        return;
      }
      if (this.age < 15) {
        $toast.show("年龄不能小于15");
        return;
      } else if (this.age > 70) {
        $toast.show("年龄不能大于70");
        return;
      }
      common
        .commit_before_question(
          this.age,
          this.selectedCode,
          String(this.gender),
          this.surveyId
        )
        .then(data => {
          if (data.data.isCanAnswer) {
            window.open(data.data.surveyUrl);
            this.$nextTick(() => {
              this.$router.replace({ name: "SurveyList" });
            });
            // window.location.href = data.data.surveyUrl;
          } else {
            //不符合答题条件
            this.$router.replace({
              name: "UnqualifiedPage",
              params: { msg: encodeURIComponent(data.data.resultMsg) }
            });
          }
          console.log(data, "提交前置问卷信息");
        });
    },
    selectCity() {
      if (this.isSelected) {
        this.isSelected = false;
      } else {
        this.isSelected = true;
      }
    },
    getCity(data) {
      this.city = data.province + "&nbsp;" + data.city;
      this.selectedCode = data.provinceCode + "-" + data.cityCode;
      this.isSelected = false;
      console.log(this.isSelected, "是否关闭");
    },
    hideSelect() {
      this.isSelected = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.tips {
  margin: 0 auto;
  width: 60%;
  height: 150px;
  background: #7575f9;
  padding: 20px 0;
  box-sizing: border-box;
  p {
    font-size: 18px;
    color: #fff;
    text-align: center;
  }
  ul {
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  li {
    font-size: 15px;
    color: #a5abf3;
    &:nth-child(2) {
      margin: 0 50px;
    }
    span {
      display: inline-block;
      vertical-align: middle;
      line-height: 20px;
    }
    span:nth-child(1) {
      margin-right: 6px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      text-align: center;
      font-size: 15px;
      color: #7575f9;
      background: #a5abf3;
    }
  }
}
.answer {
  box-sizing: border-box;
  padding-top: 80px;
  width: 100%;
  height: 100%;
  .before_question {
    box-sizing: border-box;
    padding: 50px 60px 40px;
    width: 60%;
    margin: -50px auto 0;
    border-top-right-radius: 50px;
    background: #fff;
    position: relative;
    p {
      color: #7575f9;
      font-size: 16px;
      span {
        color: #7575f9;
      }
    }
    .select {
      background: #fff;
      font-size: 15px;
      color: #353535;
      margin-bottom: 10px;
      height: 45px;
      line-height: 45px;
      border-bottom: 1px solid #ddd;
      span:nth-child(1) {
        display: inline-block;
        width: 100px;
      }
      input {
        width: 400px;
        height: 40px;
        font-size: 16px;
        color: #353535;
      }

      input::-webkit-input-placeholder {
        font-size: 16px;
        color: #a9a9a9;
      }
    }
    .select:nth-child(2) {
      position: relative;
      .city {
        cursor: pointer;
        font-size: 16px;
        position: absolute;
        top: 0;
        left: 0;
        right: 20px;
        color: #a9a9a9;
        &.actived {
          color: #353535;
        }
        div {
          float: left;
        }
        i {
          width: 10px;
          height: 10px;
          border-bottom: 2px solid #7575f9;
          border-right: 2px solid #7575f9;
          transform: rotate(45deg);
          float: right;
          margin-top: 14px;
        }
        img {
          width: 20px;
          float: right;
          margin-top: 25px;
        }
        .sel {
          position: absolute;
          left: 0;
          top: 48px;
          color: #353535;
        }
      }
    }
    .select:nth-child(3) {
      padding: 10px 0;
      span {
        &:nth-child(1) {
          display: inline-block;
          width: 105px;
          color: #7575f9;
          font-size: 16px;
        }
      }
      .num1,
      .num2 {
        float: right;
        margin-left: 26px;
        width: 90px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        border: 2px solid #d9daef;
        border-radius: 17px;
        font-size: 16px;
        color: #8d97b5;
        &.num {
          color: #7575f9;
          background: #ecedff;
          border: 2px solid #8990ed;
        }
      }
    }
    button {
      display: block;
      text-align: center;
      width: 100%;
      height: 50px;
      line-height: 50px;
      color: #fff;
      background: #7575f9;
      font-size: 18px;
      border-radius: 6px;
      margin: 100px auto 0;
      cursor: pointer;
    }
    .sclutionBox{
      a{
        color: #7575f9;
      }
      color: #888;
      font-size: 12px;
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>