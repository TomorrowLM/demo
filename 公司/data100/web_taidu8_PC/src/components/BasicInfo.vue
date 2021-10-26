<template>
  <div class="info">
    <div class="title">
      <img src="../../static/images/perinf_ic_tit.png" alt>
      <span>基本信息</span>
    </div>
    <div
      class="photo"
      @click="change(0,basicInfo.genderCode)"
      :class="{'dis':basicInfo.editSex!=0}"
    >
      <p>性别</p>
      <div class="change" :class="{'infoActived':basicInfo.gender}">
        <span>{{basicInfo.gender?basicInfo.gender:"未完善"}}</span>
        <img v-if="basicInfo.editSex!=1" src="../assets/ic_arrowr.png" alt>
      </div>
    </div>
    <div class="photo" :class="{'dis':basicInfo.editBirthDay!=0}">
      <p>出生年份</p>
      <!-- <div class="change" :class="{'infoActived':basicInfo.birthDay}">
        <span>{{basicInfo.birthDay?basicInfo.birthDay:"未完善"}}</span>
        <img v-if="basicInfo.editBirthDay!=1" src="../assets/ic_arrowr.png" alt>
      </div> -->
      <div class="birthDay_box">
        <input type="number" :disabled="basicInfo.editSex==1" v-model="basicInfo.birthDay" placeholder="未完善" @keydown="inputLimit($event)" @input="birthDayChange($event)" />
        <img v-if="basicInfo.editSex!=1" src="../assets/ic_arrowr.png" alt>
      </div>
    </div>
    <div class="photo" @click="change(2)">
      <p>所在城市</p>
      <div class="change" :class="{'infoActived':basicInfo.province}">
        <span>{{basicInfo.province?basicInfo.province:"未完善"}}&nbsp;{{basicInfo.city}}</span>
        <img src="../assets/ic_arrowr.png" alt>
      </div>
    </div>
    <div class="photo" @click="change(3,basicInfo.educationCode)">
      <p>学历</p>
      <div class="change" :class="{'infoActived':basicInfo.education}">
        <span>{{basicInfo.education?basicInfo.education:"未完善"}}</span>
        <img src="../assets/ic_arrowr.png" alt>
      </div>
    </div>
    <div class="photo" @click="change(4,basicInfo.workCode)">
      <p>工作状况</p>
      <div class="change" :class="{'infoActived':basicInfo.work}">
        <span>{{basicInfo.work?basicInfo.work:"未完善"}}</span>
        <img src="../assets/ic_arrowr.png" alt>
      </div>
    </div>
    <div class="photo" @click="change(5,basicInfo.industryCode)">
      <p>所在行业</p>
      <div class="change" :class="{'infoActived':basicInfo.industry}">
        <span>{{basicInfo.industry?basicInfo.industry:"未完善"}}</span>
        <img src="../assets/ic_arrowr.png" alt>
      </div>
    </div>
    <div class="photo" @click="change(6,basicInfo.occupationCode)">
      <p>职业</p>
      <div class="change" :class="{'infoActived':basicInfo.occupation}">
        <span>{{basicInfo.occupation?basicInfo.occupation:"未完善"}}</span>
        <img src="../assets/ic_arrowr.png" alt>
      </div>
    </div>
    <div class="photo" @click="change(7,basicInfo.salaryCode)">
      <p>月薪</p>
      <div class="change" :class="{'infoActived':basicInfo.salary}">
        <span>{{basicInfo.salary?basicInfo.salary:"未完善"}}</span>
        <img src="../assets/ic_arrowr.png" alt>
      </div>
    </div>
    <div class="photo" @click="change(8,basicInfo.incomeCode)">
      <p>家庭月收入</p>
      <div class="change" :class="{'infoActived':basicInfo.income}">
        <span>{{basicInfo.income ?basicInfo.income:"未完善"}}</span>
        <img src="../assets/ic_arrowr.png" alt>
      </div>
    </div>
    <div class="photo" @click="change(9,basicInfo.visitCode)">
      <p>是否接受电话回访</p>
      <div class="change" :class="{'infoActived':basicInfo.visit}">
        <span>{{basicInfo.visit ?basicInfo.visit:"未完善"}}</span>
        <img src="../assets/ic_arrowr.png" alt>
      </div>
    </div>
    <div class="line"></div>
    <button @click="keep">保存</button>
    <div class="popup" v-if="ispopup" @click="close">
      <!-- 城市 -->
      <select-city v-if="isSelected == 1" @selectedCity="selectItem"></select-city>
      <!-- 其他 -->
      <ul class="popLists middle" v-if="isSelected != 1&& isSelected != 2">
        <li
          :class="{'actived':sleItemCode==item.itemCode}"
          v-for="(item,index) in popLists"
          :key="index"
          @click.stop="selectItem(item.itemName,item.itemCode)"
        >
          <span>{{item.itemName}}</span>
        </li>
      </ul>
      <!-- 生日 -->
      <div class="middle dated" v-if="isSelected == 2">
        <ul class="popLists" id="year">
          <li
            :class="{'actived':year==item.id}"
            v-for="item in yearLists"
            :key="item.id"
            @click.stop="selYear(item.id,item.childs)"
          >{{item.id}}</li>
        </ul>
        <ul class="popLists" v-if="this.isyear">
          <li
            :class="{'actived':month==item.id}"
            v-for="item in monthLists"
            :key="item.id"
            @click.stop="selMonth(item.id,item.childs)"
          >{{item.id}}</li>
        </ul>
        <ul class="popLists" v-if="this.isyear&&this.ismonth">
          <li
            :class="{'actived':day==item.id}"
            v-for="item in dayLists"
            :key="item.id"
            @click.stop="selDay(item.id)"
          >{{item.id}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import common from "../api/common";
import methods from "../api/methods";
import url from "../api/url";
import SelectCity from "./common/SelectCity";

export default {
  name: "basic",
  components: {
    SelectCity
  },
  data() {
    return {
      basicInfo: {},
      datas: {},
      popLists: [], //弹框显示内容
      ispopup: false, //弹框的显示隐藏
      actived: 0, //更改的类别
      sleItemCode: 0, //信息的itemCode值
      isSelected: 0, //0:不显示 1:城市 2:时间 3:其他
      yearLists: methods.cityArr(),
      monthLists: methods.cityArr()[0].childs,
      dayLists: methods.cityArr()[0].childs[0].childs,
      year: "",
      isyear: false,
      month: "",
      ismonth: false,
      day: ""
    };
  },
  created() {
    common.getUserFullInfo().then(data => {
      // console.log(data, "基本信息");
      this.basicInfo = data.data.user;
      this.basicInfo.userId = JSON.parse(
        localStorage.getItem("userInfo")
      ).userId;
      this.basicInfo.cityCode = String(this.basicInfo.cityCode);
      this.basicInfo.editBirthDay = String(this.basicInfo.editBirthDay);
      this.basicInfo.editSex = String(this.basicInfo.editSex);
      this.basicInfo.provinceCode = String(this.basicInfo.provinceCode);
      if (this.basicInfo.birthDay) {
        var birthDayArr = this.basicInfo.birthDay.split("-");
        this.year = birthDayArr[0];
        this.month = Number(birthDayArr[1]);
        this.day = Number(birthDayArr[2]);
        console.log(birthDayArr)
      }
      this.datas = data.data;
      console.log(this.basicInfo, "初始结果");
    });
  },
  methods: {
    inputLimit(e) {
      const { key } = e
      const prohibitKeys = ['e', '+', '-', '.']
      if (prohibitKeys.includes(key)) {
        e.returnValue = false
        return false
      }
      return true
    },
    birthDayChange(e) {
      const currentYearData = new Date().getFullYear()
      this.basicInfo.birthDay = this.basicInfo.birthDay.slice(0, 4)
      let { birthDay } = this.basicInfo
      if (birthDay.length === 4) {
        if (currentYearData - birthDay < 15 || currentYearData - birthDay > 70) {
          this.basicInfo.birthDay = ''
          $toast.show('请填写正确的出生年份', 2000)
        }
      }
    },
    selYear(code, childs) {
      console.log(document.getElementById("year").scrollTop);
      this.year = code;
      this.isyear = true;
      this.monthLists = childs;
    },
    selMonth(code, childs) {
      this.month = code;
      this.ismonth = true;
      this.dayLists = childs;
      // console.log(this.monthLists, this.dayLists);
    },
    selDay(code) {
      this.day = code;
      this.basicInfo.birthDay = this.year + "-" + this.month + "-" + this.day;
      this.ispopup = false;
      this.isyear = false;
      this.ismonth = false;
    },
    change(index, code) {
      this.actived = index;
      // this.ispopup = true;
      switch (index) {
        case 0: //性别
          if (this.basicInfo.editSex == 1) {
            //不可更改
            return;
          } else {
            this.isSelected = 3;
            this.ispopup = true;
            this.sleItemCode = code;
            this.popLists = this.datas.labelList.sex;
          }
          break;
        case 1: //生日
          if (this.basicInfo.editBirthDay == 1) {
            return;
          } else {
            this.ispopup = true;
            this.isSelected = 2;
            if (this.year) {
              this.$nextTick(function() {
                document.getElementById("year").scrollTop =
                  41 * (Number(this.year) - Number(this.yearLists[0].id) - 1);
              });
            } else {
              this.$nextTick(function() {
                document.getElementById("year").scrollTop =
                  41 * (1989 - Number(this.yearLists[0].id) - 1);
              });
            }
          }
          break;
        case 2: //省市
          this.ispopup = true;
          this.isSelected = 1;
          break;
        case 3: //学历
          this.ispopup = true;
          this.isSelected = 3;
          this.sleItemCode = code;
          this.popLists = this.datas.labelList.education;
          break;
        case 4: //工作状况
          this.ispopup = true;
          this.isSelected = 3;
          this.sleItemCode = code;
          this.popLists = this.datas.labelList.work;
          break;
        case 5: //所在行业
          this.ispopup = true;
          this.isSelected = 3;
          this.sleItemCode = code;
          this.popLists = this.datas.labelList.industry;
          break;
        case 6: //职业
          this.ispopup = true;
          this.isSelected = 3;
          this.sleItemCode = code;
          this.popLists = this.datas.labelList.occupation;
          break;
        case 7: //月薪
          this.ispopup = true;
          this.isSelected = 3;
          this.sleItemCode = code;
          this.popLists = this.datas.labelList.salary;
          break;
        case 8: //家庭收入
          this.ispopup = true;
          this.isSelected = 3;
          this.sleItemCode = code;
          this.popLists = this.datas.labelList.income;
          break;
        case 9: //回访
          this.ispopup = true;
          this.isSelected = 3;
          this.sleItemCode = code;
          this.popLists = this.datas.labelList.visit;
          break;
        default:
          break;
      }
      console.log(index);
    },
    selectItem(name, code) {
      this.ispopup = false;
      switch (this.actived) {
        case 0: //性别
          this.basicInfo.gender = name;
          this.basicInfo.genderCode = code;
          break;
        case 2: //省市
          console.log(name, "选择城市接受到的制");
          this.basicInfo.province = name.province;
          this.basicInfo.provinceCode = String(name.provinceCode);
          this.basicInfo.city = name.city;
          this.basicInfo.cityCode = String(name.cityCode);

          break;
        case 3: //学历
          this.basicInfo.education = name;
          this.basicInfo.educationCode = code;
          break;
        case 4: //工作状况
          this.basicInfo.work = name;
          this.basicInfo.workCode = code;
          break;
        case 5: //所在行业
          this.basicInfo.industry = name;
          this.basicInfo.industryCode = code;
          break;
        case 6: //职业
          this.basicInfo.occupation = name;
          this.basicInfo.occupationCode = code;
          break;
        case 7: //月薪
          this.basicInfo.salary = name;
          this.basicInfo.salaryCode = code;
          break;
        case 8: //家庭收入
          this.basicInfo.income = name;
          this.basicInfo.incomeCode = code;
          break;
        case 9: //回访
          this.basicInfo.visit = name;
          this.basicInfo.visitCode = code;
          break;
        default:
          break;
      }
      console.log(this.basicInfo, "更改完之后的基本信息");
    },
    close() {
      this.ispopup = false;
    },
    keep() {
      if (this.basicInfo.gender == null) {
        $toast.show("请选择性别");
        return;
      }

      if (!this.basicInfo.birthDay || this.basicInfo.birthDay.length < 4) {
        $toast.show("请填写正确的出生年份");
        return;
      }

      if (this.basicInfo.city == null || this.basicInfo.province == null) {
        $toast.show("请选择所在城市");
        return;
      }

      if (this.basicInfo.education == null) {
        $toast.show("请选择学历");
        return;
      }

      if (this.basicInfo.work == null) {
        $toast.show("请选择工作状况");
        return;
      }

      if (this.basicInfo.industry == null) {
        $toast.show("请选择所在行业");
        return;
      }

      if (this.basicInfo.occupation == null) {
        $toast.show("请选择职业");
        return;
      }

      if (this.basicInfo.salary == null) {
        $toast.show("请选择月薪");
        return;
      }

      if (this.basicInfo.income == null) {
        $toast.show("请选择家庭月收入");
        return;
      }

      if (this.basicInfo.visit == null) {
        $toast.show("请选择是否接受电话回访");
        return;
      }

      this.basicInfo.token = JSON.parse(localStorage.getItem("userInfo")).token;
      common.editUserFullInfo(this.basicInfo).then(data => {
        console.log(data);
        if (data.code == 1) {
          $toast.show(data.msg);
        }
      });
    }
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
.birthDay_box{
  float: right;
  input{
    width: 280px;
    text-align: right;
    color: #666;
    font-size: 16px;
    margin-right: 10px;
    line-height: 22px;
    &::placeholder{
      color: #999;
    }
  }
  img {
    width: 10px;
    position: relative;
    top: 3px;
  }
}
.popup {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  .sel {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 400px;
    height: 320px;
  }
  .popLists::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .popLists::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #7575f9;
  }
  .popLists::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
  }
  .middle {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }
  .popLists {
    font-size: 18px;
    width: 300px;
    height: 400px;
    background: #fff;
    // padding: 10px;
    border-radius: 5px;
    overflow-y: auto;
    li {
      cursor: pointer;
      text-align: center;
      padding: 0 5px;
      border-bottom: 1px solid #ccc;
      height: 40px;
      line-height: 40px;
      &.actived {
        background: #eee;
      }
      // span{
      //   float:left;
      // }
      // img{
      //   width:20px;
      //   float:right;
      //   margin-top:15px;
      // }
    }
  }
  .dated {
    width: 400px;
    height: 400px;
    .popLists {
      float: left;
      width: 100px;
    }
  }
}
.info {
  box-sizing: border-box;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
  p {
    width: 80px;
    text-align-last: justify;
    display: inline-block;
    vertical-align: middle;
    @include font(16px, #666);
    margin-right: 40px;
  }
  width: 100%;
  padding: 35px 40px 20px;
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
    margin-top: 10px;
    padding: 15px 0;
    cursor: pointer;
    &.dis {
      cursor: default;
      span {
        cursor: default;
      }
    }
    .change {
      padding-left: 20px;
      float: right;
      &.infoActived span {
        color: #666;
      }
      img {
        width: 10px;
        vertical-align: middle;
      }
      span {
        display: inline-block;
        vertical-align: middle;
        @include font(16px, #999);
        margin-right: 10px;
      }
    }
  }
  .line {
    @include size(100%, 1px);
    background: #ddd;
    margin: 30px 0;
  }
  button {
    display: block;
    @include font(18px, #fff);
    margin: 0 auto;
    border-radius: 4px;
    padding: 10px 50px;
    background: #7575f9;
    cursor: pointer;
  }
}
</style>
