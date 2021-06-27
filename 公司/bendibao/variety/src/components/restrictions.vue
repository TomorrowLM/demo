<template>
  <div class="page">
    <div class="header">
      <img src="../assets/全国限行规定查询.png" alt="" />
      <div class="select-drop">
        <van-dropdown-menu>
          <van-dropdown-item v-model="addressVal" :options="address" />
        </van-dropdown-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { DropdownMenu, DropdownItem } from "vant";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  components: {
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
  },
  data() {
    return {
      addressVal: 0,
      address: [
        { text: "北京", value: 0 },
        { text: "上海", value: 1 },
        { text: "成都", value: 2 },
      ],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped style="../css/restrictions.css"></style>
