<template>
  <div>
    <span>dashboard</span>
    <!-- <button @click="()=>{data = data+1}">{{data}}</button> -->
    <div class="echart" ref="echart" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";
import * as echarts from "echarts";
@Component({})
export default class Access extends Vue {
  myChart: any = null;
  option = {
    title: {
      show: true,
      text: "Main Title",
      subtext: "Sub Title",
      left: "right",
      bottom: "10",
      textStyle: {
        fontSize: 12,
      },
      subtextStyle: {
        fontSize: 20,
      },
    },
    legend: {},
    grid: {
      show: false,
    },
    tooltip: {},
    dataset: {
      source: [
        ["product", "2012", "2013", "2014", "2015"],
        ["Matcha Latte", 41.1, 30.4, 65.1, 53.3],
        ["Milk Tea", 86.5, 92.1, 85.7, 83.1],
        ["Cheese Cocoa", 24.1, 67.2, 79.5, 86.4],
      ],
    },
    xAxis: [
      { type: "category", gridIndex: 0 },
      { type: "category", gridIndex: 1 },
    ],
    yAxis: [{ gridIndex: 0 }, { gridIndex: 1 }],
    series: [
      // 这几个系列会出现在第一个直角坐标系中，每个系列对应到 dataset 的每一行。
      { type: "bar", seriesLayoutBy: "row" },
      { type: "bar", seriesLayoutBy: "row" },
      { type: "bar", seriesLayoutBy: "row" },
      // 这几个系列会出现在第二个直角坐标系中，每个系列对应到 dataset 的每一列。
      { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
      { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
      { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
      { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
    ],
  };

  data = 0;

  mounted() {
    this.myChart = echarts.init(document.getElementsByClassName("echart")[0]);
    this.myChart.setOption(this.option);
  }

  updated() {
    console.log(this.$refs.echart, 20000);
  }
}
</script>