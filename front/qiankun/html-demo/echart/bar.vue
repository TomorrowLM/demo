<template>
  <div>
    <div v-if="seriesData.length > 0" class="bar-container" :id="barId"></div>
    <div class="empty" v-else>
      <img
        src="https://dop-oss-prod.dingtax.cn/image/202108/dafb015aab9c41e80c2c97024442052f4zthgi.png"
        alt=""
      />
      <span> 暂无数据</span>
    </div>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/bar");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/grid");
require("echarts/lib/component/legend");
export default {
  name: "DtBar",
  components: {},
  props: {
    barId: {
      type: String,
      default: "dtBar",
    },
    seriesData: {
      type: Array,
      default: () => [],
    },
    xData: {
      type: Array,
      default: () => [],
    },
    legend: {
      type: Array,
      default: () => [],
    },
    xRotate: {
      type: Number,
      default: 0,
    },
    colors: {
      type: Array,
      default: () => ["#1890FF", "#00C49F"],
    },
    axisDirection: {
      type: String,
      default: "horizontal",
    },
    xAxis: {
      type: Object,
      default: () => {},
    },
    yAxis: {
      type: Object,
      default: () => {},
    },
    grid: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      htmlFontSize: document.documentElement.style.fontSize,
      chart: null,
    };
  },
  computed: {
    fontSize: function () {
      return Number(this.htmlFontSize.replace(/px/, "")) || 32;
    },
  },
  watch: {
    // 数据变化，加载数据
    seriesData() {
      this.chart && this.chart.clear();
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (!this.seriesData.length) return;
      console.log(this.seriesData, "this.seriesData");
      await this.$nextTick();
      this.chart = echarts.init(document.getElementById(this.barId));
      this.chart.resize({
        // width: window.innerWidth * 0.82,
        width: document.getElementsByClassName("bar-container")[0].offsetWidth,
        height: window.innerWidth * 0.76,
      });
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none", // shadow
            // lineStyle: {
            //   color: "rgba(0,0,0,0.65)",
            // },
          },
        },
        color: this.colors,
        legend: {
          show: false,
        },
        grid: {
          left: "0",
          right: "32",
          bottom: "12",
          top: "16",
          containLabel: true,
          ...this.grid,
        },
        xAxis: {
          type: this.axisDirection === "horizontal" ? "category" : "value",
          data: this.axisDirection === "horizontal" ? this.xData : [],
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            rotate: this.xRotate || 0,
            show: true,
          },
          ...this.xAxis,
        },
        yAxis: {
          type: this.axisDirection === "vertical" ? "category" : "value",
          data: this.axisDirection === "vertical" ? this.xData : [],
          axisLabel: {
            color: "rgba(25,31,37,1)",
            fontSize: 12,
            lineHeight: 14,
            margin: 9,
            formatter: function (value) {
              return value ? value + "个" : "";
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(233, 233, 233, 1)",
              type: "dashed",
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          ...this.yAxis,
        },
        series: [
          {
            type: "bar",
            // barWidth: "50px",
            barWidth: "38%",
            data: this.seriesData,
            label: {
              show: true,
              position: this.axisDirection === "vertical" ? "right" : "top", // 标签位置，可以是 'top', 'inside', 'insideTop', 'insideBottom' 等
              formatter: "{c}个", // 显示具体数值
            },
          },
        ],
      };
      console.log(option, this.colors, "<<<<<<<<<<<<<optionBar1");
      this.chart.setOption(option);
    },
    // 给数字每三位加','号
    splitNum(num) {
      let reg = /(?=(\B)(\d{3})+$)/g;
      let result = num.toString().replace(reg, ",");
      return result;
    },
  },
};
</script>
<style lang="scss" scoped>
.bar-container {
  width: 100%;
  height: 100%;
}
.empty {
  height: 562 / 3;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  color: #7c7d82;

  img {
    width: 50%;
    height: 50%;
  }
}
</style>
