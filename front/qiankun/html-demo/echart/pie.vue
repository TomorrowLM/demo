<template>
  <div :id="id" class="pie-chart"></div>
</template>

<script>
// 引入 ECharts 核心模块和饼图组件
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/pie");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/grid");
require("echarts/lib/component/legend");
require("echarts/lib/component/graphic");

export default {
  name: "PieChart",
  props: {
    pieData: {
      type: Object,
      default: () => ({})
    },
    id: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      chart: null,
      color: [
        {
          label: "机构职责",
          color: "#0f46a0"
        },
        {
          label: "双重预防机制",
          color: "#03a8f2"
        },
        {
          label: "安全制度",
          color: "#1763c0"
        },
        {
          label: "应急管理",
          color: "#28b5f4"
        },
        {
          label: "教育培训",
          color: "#1a74d2"
        },
        {
          label: "事故管理",
          color: "#4fc0f6"
        },
        {
          label: "安全投入",
          color: "#1d88e2"
        },
        {
          label: "其他",
          color: "#7fd3f9"
        }
      ]
    };
  },
  computed: {
    totalText() {
      return (
        this.pieData.reduce((acc, curr) => acc + curr.value, 0) + "\n" + "总计"
      );
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.id, this.pieData, this.totalText, 123);
      this.initChart();
      // 监听 legend 选中事件，动态更新中间总数
      if (this.chart) {
        this.chart.on('legendselectchanged', this.handleLegendSelectChanged);
      }
    });
  },
  beforeDestroy() {
    // 销毁图表实例，避免内存泄漏
    if (this.chart) {
      this.chart.off('legendselectchanged', this.handleLegendSelectChanged); // 移除事件监听
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    initChart() {
      // 获取DOM元素
      const chartDom = document.getElementById(this.id);
      if (!chartDom) {
        console.error("找不到图表容器元素");
        return;
      }

      // 初始化图表
      this.chart = echarts.init(chartDom);

      // 检查数据是否存在
      if (!this.pieData) {
        console.warn("饼图数据不存在");
        return;
      }

      // 生成图例数据
      const legendData = this.pieData.map(item => item.name);

      this.chart.setOption({
        title: {
          show: true,
          text: this.title,
          left: "left",
          top: 20,
          textStyle: {
            fontSize: 16,
            fontWeight: "bold"
          }
        },
        graphic: {
          type: "text",
          left: "center",
          top: "middle",
          style: {
            text: this.totalText || "", // 中间显示的文字
            rich: {
              a: {
                fontSize: 24,
                fontWeight: "bold",
                color: "#1d88e2"
              },
              b: {
                fontSize: 14,
                color: "#999",
                margin: [24, 0, 0, 0]
              }
            },
            fill: "#1C2228", // 文字颜色
            font: "bold 20px Microsoft YaHei",
            textAlign: "center", // 水平居中
            textVerticalAlign: "middle" // 垂直居中
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)"
          // show: false, /* 初始时不显示tooltip */
          // showContent: false /* 初始时不显示内容 */
        },
        legend: {
          orient: "horizontal",
          left: "0%",
          bottom: "0%",
          icon: "circle",
          itemWidth: 12,
          itemHeight: 12,
          data: legendData
        },
        series: [
          {
            // name: "异常户数",
            type: "pie",
            data: this.pieData,
            radius: ["40%", "50%"],
            center: ["50%", "50%"],
            label: {
              show: false // 设置为false以隐藏标签
            },
            itemStyle: {
              color: params => {
                // params.name 是当前扇区的 name
                return this.color.find(item => params.name.includes(item.label))
                  .color;
              }
            }
            // width: "60%",
            // height: "80%",
            // itemStyle: {
            //   // 根据value值设置颜色，增强对比度
            //   color: function(params) {
            //     const value = params.value;
            //     const maxValue = 10; // 最大值为10
            //     // 用平方增强对比度
            //     const ratio = Math.pow(value / maxValue, 2);
            //     // 最深颜色 rgb(29, 136, 226)
            //     const deepR = 29;
            //     const deepG = 136;
            //     const deepB = 226;
            //     // 最浅颜色 rgb(179, 227, 250)
            //     const lightR = 179;
            //     const lightG = 227;
            //     const lightB = 250;
            //     const currentR = Math.round(
            //       deepR + (lightR - deepR) * (1 - ratio)
            //     );
            //     const currentG = Math.round(
            //       deepG + (lightG - deepG) * (1 - ratio)
            //     );
            //     const currentB = Math.round(
            //       deepB + (lightB - deepB) * (1 - ratio)
            //     );
            //     return `rgb(${currentR}, ${currentG}, ${currentB})`;
            //   }
            // }
          }
        ]
      });
    },
    /**
     * 处理 legend 选中变化事件，动态更新中间总数
     * @param {Object} params 事件参数
     */
    handleLegendSelectChanged(params) {
      // params.selected 是一个对象，key为legend名，value为是否选中
      const selected = params.selected;
      // 只统计当前选中的数据
      const currentData = this.pieData.filter(item => selected[item.name]);
      const total = currentData.reduce((acc, curr) => acc + curr.value, 0);
      // 更新中间的文字
      if (this.chart) {
        this.chart.setOption({
          graphic: {
            style: {
              text: total + '\n总计'
            }
          }
        });
      }
    }
  },
  watch: {
    // 监听数据变化，重新渲染图表
    pieData: {
      handler(newVal) {
        if (newVal && this.chart) {
          this.initChart();
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.pie-container {
  width: 400px;
  height: 100%;
  margin: 0 auto; /* 居中显示 */
  overflow: auto;
}

.pie-chart {
  // width: 100%;
  // height: 100%;
  width: 400px;
  height: 400px;
  margin: 0 auto; /* 居中显示 */
}
</style>
