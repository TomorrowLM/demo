<template>
  <div>
    <div>
      <img src="../assets/画板 2.png" alt="" class="header-img" />
    </div>
    <div class="page">
      <div class="show-time">
        <div>
          距离2021-03-28 10:00:00还有
          <hr />
        </div>
        <div class="countdown">
          <div class="day">17</div>
          <div>天</div>
          <div class="time">14</div>
          <div>时</div>
          <div class="minute">03</div>
          <div>分</div>
          <div class="second">00</div>
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
        </div>
        <div>
          3月28日0-24时，31省区市新增确诊15例，均为境外输入病例（广东8例
          ，内蒙古3例，四川2例，上海1例，湖南1例）
        </div>
      </div>

      <div class="show-detail">
        <div class="tab">
          <div>奖牌榜</div>
          <div>全运会</div>
          <div>赛程安排</div>
          <div>西安指南</div>
        </div>
        <div class="total">
          <img src="../static/铜牌.png" />
          <div class="total" v-for="(v, i) in iconText" :key="i">
            <img v-bind:src="icon[i]" />
            <span>{{ v }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../css/sport.css";
import "./../common/rem.js";
export default {
  data: function () {
    return {
      iconText: ["省份", "金牌", "银牌", "铜牌", "总计"],
      url: "../static/铜牌.png",
      icon: [
        "../static/省份.png",
        "../static/金牌.png",
        "../static/银牌.png",
        "../static牌.png",
      ],
    };
  },
  components: {},
};
</script>
