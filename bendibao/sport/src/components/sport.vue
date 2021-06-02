<template>
  <div>
    <div>
      <img src="../static/1.png" alt="" class="header-img" />
    </div>
    <div class="page">
      <div class="show-time">
        <div>
          距离2021-03-28 10:00:00还有
          <hr />
        </div>
        <div class="countdown">
          <div class="day">{{ day }}</div>
          <div>天</div>
          <div class="time">{{ time }}</div>
          <div>时</div>
          <div class="minute">{{ minute }}</div>
          <div>分</div>
          <div class="second">{{ second }}</div>
          <div>秒</div>
        </div>
        <div class="whether">
          <div>2021-03-11</div>
          <div>晴天 5-15°C</div>
          <div>西安市未来三天天气</div>
        </div>
      </div>
      <div class="show-info">
        <div>
          <div>最新消息</div>
          <span>截止2021-03-29</span>
          <router-link :to="{ path: '/info' }" replace class="more">
            更多
          </router-link>
          <van-icon name="arrow" />
        </div>
        <div>
          3月28日0-24时，31省区市新增确诊15例，均为境外输入病例（广东8例
          ，内蒙古3例，四川2例，上海1例，湖南1例）
        </div>
      </div>

      <div class="show-detail">
        <div class="tab">
          <div
            @click="showTotal($event, 0)"
            :class="{ 'tab-select': 0 == tabIndex }"
          >
            奖牌榜
          </div>
          <div
            @click="showTotal($event, 1)"
            :class="{ 'tab-select': 1 == tabIndex }"
          >
            全运会
          </div>
          <div
            @click="showTotal($event, 2)"
            :class="{ 'tab-select': 2 == tabIndex }"
          >
            赛程安排
          </div>
          <div
            @click="showTotal($event, 3)"
            :class="{ 'tab-select': 3 == tabIndex }"
          >
            西安指南
          </div>
        </div>
      </div>
      <medalTable v-show="tabIndex == 0"></medalTable>
      <nationalGames v-show="tabIndex == 1"></nationalGames>
      <plan v-show="tabIndex == 2"> </plan>
      <xian v-show="tabIndex == 3"></xian>
    </div>
  </div>
</template>

<script>
// import "../css/sport.css";

import "./../common/rem.js";
import medalTable from "./medal-table.vue";
import nationalGames from "./nationalGames";
import plan from "./plan";
import xian from "./xian"
import { Icon } from "vant";
let moment = require("moment");
export default {
  data: function () {
    return {
      tabIndex: 0,
      day: 0,
      time: 0,
      minute: 0,
      second: 0,
      now: moment().locale("zh-cn").format("YYYY-MM-DD HH:mm:ss"),
    };
  },
  beforeMount() {
    let _this = this;
    setInterval(function () {
      let t1 = moment().locale("zh-cn").format("YYYY-MM-DD HH:mm:ss");
      let t2 = moment("2021-07-02 14:33:33");
      let t3 = t2.diff(t1, "second"); //计算相差的秒
      let d = Math.floor(Math.floor(Math.floor(t3 / 60) / 60) / 24); //相差的天
      //时
      let t = t3 - d * 24 * 60 * 60;
      t = Math.floor(Math.floor(t / 60) / 60);
      //分
      let m = t3 - d * 24 * 60 * 60 - t * 60 * 60;
      m = Math.floor(m / 60);
      //秒
      let s = t3 - d * 24 * 60 * 60 - t * 60 * 60 - m * 60;
      _this.day = d;
      _this.time = t;
      _this.second = s;
      _this.minute = m;
    }, 1000);
  },
  components: { medalTable, [Icon.name]: Icon, nationalGames,plan ,xian},
  computed: {},
  methods: {
    showTotal(e, index) {
      this.tabIndex = index;
    },
  },
};
</script>
<style scoped src="../css/sport.css"></style>
;
