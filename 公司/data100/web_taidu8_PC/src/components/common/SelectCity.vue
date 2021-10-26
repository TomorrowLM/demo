<template>
  <div class="sel">
    <ul>
      <li
        :class="[provinceCode==item.id?'actived':'']"
        v-for="item in provinceLists"
        :key="item.id"
        @click.stop="selectProvince(item.childs,item.id,item.value)"
      >
        <span>{{item.value}}</span>
        <span></span>
      </li>
    </ul>
    <ul v-if="isCity">
      <li
        :class="[cityCode==item.id?'actived':'']"
        v-for="item in cityLists"
        :key="item.id"
        @click.stop="selectCity(item.id,item.value)"
      >
        <span>{{item.value}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import common from "../../api/common";

export default {
  name: "selected",
  data() {
    return {
      provinceCode: "",
      provinceLists: [],
      cityLists: [],
      cityCode: "",
      isCity: false,
      selectedData: {} //选中的城市信息
    };
  },
  created() {
    if (this.$parent.basicInfo) {
      this.provinceCode = this.$parent.basicInfo.provinceCode;
      this.cityCode = this.$parent.basicInfo.cityCode;
    }

    common.city_drop_down().then(data => {
      console.log(data);
      this.provinceLists = data.data;
    });
  },
  mounted() {
    console.log(this);
  },
  methods: {
    selectProvince(citys, code, province) {
      // if (this.provinceCode != code) {
        this.cityLists = citys;
        this.provinceCode = code;
        this.isCity = true;
        this.selectedData.province = province;
        this.selectedData.provinceCode = code;
      // }
    },
    selectCity(code, city) {
      // if (this.cityCode != code) {
        this.cityCode = code;
        this.selectedData.city = city;
        this.selectedData.cityCode = code;
        this.$emit("selectedCity", this.selectedData);
      // }
    }
  }
};
</script>
<style lang="scss" scoped>
ul::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
ul::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #7575f9;
}
ul::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}

ul {
  background: #fff;
  padding: 10px 0;
  width: 200px;
  height: 300px;
  box-shadow: 0 0 10px #999;
  overflow-y: auto;
  float: left;
  li {
    cursor: pointer;
    padding: 0 10px;
    font-size: 18px;
    line-height: 40px;
    span:nth-child(2) {
      display: block;
      width: 10px;
      height: 10px;
      border-top: 1px solid #aaa;
      border-right: 1px solid #aaa;
      transform: rotate(45deg);
      float: right;
      margin: 15px 5px 0 0;
    }
    &.actived {
      background: #eee;
    }
  }
}
</style>