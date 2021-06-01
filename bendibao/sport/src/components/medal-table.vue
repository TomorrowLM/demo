<template>
  <div>
    <div class="total">
      <div class="total-icon" v-for="(v, i) in iconText" :key="i">
        <img v-bind:src="icon[i]" />
        <span>{{ v }}</span>
      </div>
    </div>


    <div class="list">
      <div v-for="(v, i) in modalList" :key="i">
        <div>{{ v[0] }}</div>
        <div>{{ v[1] }}</div>
        <div>{{ v[2] }}</div>
        <div>{{ v[3] }}</div>
        <div>{{ v[4] }}</div>
      </div>
    </div>
    <div>查看更多</div>
  </div>
</template>

<script>
import "./../css/modal-table.css";
import { List } from "vant";
export default {
  data: function () {
    return {
      iconText: ["省份", "金牌", "银牌", "铜牌", "总计"],
      url: "../static/铜牌.png",
      icon: [
        require("../static/省份.png"),
        require("../static/金牌.png"),
        require("../static/银牌.png"),
        require("../static/铜牌.png"),
      ],
      loading: false,
      finished: false,
      modalList: [["广东省", 36, 2275, 2275, 7]],
    };
  },
  components: { [List.name]: List },
  beforeMount() {
    let initialList = this.modalList[0];
    for (let i = 0; i < 14; i++) {
        console.log(initialList)
      this.modalList.push(initialList);
    }
    console.log(this.modalList);
  },
  methods: {

  },
};
</script>
