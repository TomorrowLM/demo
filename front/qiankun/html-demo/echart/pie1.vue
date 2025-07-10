<style type="text/scss" lang="scss">
// 子组件宽高由父组件包裹层决定
.dt-pie-box {
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

<template>
  <div>
    <div v-if="dataSource.length > 0" class="dt-pie-box" :id="container"></div>
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
import { splitNum } from "../util";
// 按需引入
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/pie");
require("echarts/lib/component/title");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/legend");

export default {
  name: "DtPie",
  props: {
    // 存在多个图表，需传不同的id
    id: {
      type: String,
      default: "chartPie",
    },
    // 图表背景色，默认透明
    bgColor: {
      type: String,
      default: "transparent",
    },
    // 自定义颜色
    colorList: {
      type: String,
      default: ["#2b85e4", "rgba(20, 201, 201, 1)"],
    },
    dataSource: {
      type: Array,
      default: [],
    },
    barTitle: {
      type: String,
      default: "",
    },
    // 传入radius时展示饼图
    radius: {
      type: String,
      default: "50%",
    },
    // 传入radiusList时展示圆环图
    radiusList: {
      type: Array,
      default: [],
    },
    // label的行高
    lineHeight: {
      type: Number,
      default: 33,
    },
  },
  data() {
    return {
      container: this.id,
      chart: null,
      htmlFontSize: document.documentElement.style.fontSize,
    };
  },
  components: {},
  watch: {
    // 数据变化，加载数据
    dataSource: {
      handler(val) {
        console.log("dataSource", val);
        this.init();
      },
      deep: true,
    },
  },
  computed: {
    fontSize: function () {
      return Number(this.htmlFontSize.replace(/px/, "")) || 32;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    async init() {
      if (!this.dataSource.length) return;
      await this.$nextTick();
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById(this.container));
      this.chart.resize({
        // width: window.innerWidth * 0.82,
        width: "auto",
        height: window.innerWidth * 0.76,
      });
      let sum = 0;
      this.dataSource.forEach((element) => {
        sum += element.value;
      });
      let option = {
        backgroundColor: this.bgColor,
        title: {
          show: !!this.barTitle,
          text: this.barTitle,
          left: "center",
          bottom: 0,
          textStyle: {
            color: "rgba(25,31,37,0.56)",
            fontSize: 14,
            lineHeight: 14,
          },
        },
        tooltip: {
          show: false,
        },
        legend: {
          show: true,
          left: "center",
          itemWidth: 10,
          itemHeight: 10,
          icon: "circle",
        },
        series: [
          {
            name: this.title,
            type: "pie",
            radius: this.radiusList.length ? this.radiusList : this.radius,
            color: this.colorList,
            labelLine: {
              normal: {
                length: 10, // 标签引导线第一段长度为0
                length2: 80, // 标签引导线第二段长度为80
                lineStyle: {
                  type: "solid", // 标签引导线为实线
                },
              },
            },
            label: {
              normal: {
                align: "center",
                padding: [0, -80],
                formatter: function (params, ticket, callback) {
                  if (sum == 0) {
                    return `{a|${params.name + " "}}\n{b|${splitNum(
                      params.value
                    )}} / {b|0.00%}`;
                  } else {
                    return `{a|${params.name + " "}}\n{b|${splitNum(
                      params.value
                    )}}{b|${params.data.unit ? params.data.unit : ""}} / {b|${(
                      (params.value / sum) *
                      100
                    ).toFixed(2)}%}`;
                  }
                },
                rich: {
                  a: {
                    fontSize: 12,
                    color: "#191F25",
                    align: "center",
                    lineHeight: this.lineHeight,
                  },
                  b: {
                    fontSize: 12,
                    color: "#191F25",
                    align: "center",
                    lineHeight: this.lineHeight,
                    fontFamily: "DINAlternate-Bold",
                  },
                },
              },
            },
            itemStyle: {
              borderWidth: this.radiusList.length ? 0 : 1,
              borderColor: "#fff",
            },
            data: this.dataSource,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      console.log("option", option);
      // 使用刚指定的配置项和数据显示图表。
      this.chart.setOption(option);
    },
  },
};
</script>
