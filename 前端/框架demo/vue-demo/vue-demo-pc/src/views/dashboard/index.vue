<template>
  <div>
    <span>dashboard</span>
    <!-- <button @click="()=>{data = data+1}">{{data}}</button> -->
    <div class="box">
      <a-card title="折线图" :bordered="false" style="width: 9rem">
        <div class="echart echart1" style="width: 9rem"></div>
      </a-card>
      <a-card title="省图" :bordered="false" style="width: 5rem">
        <div class="echart echart2"></div>
      </a-card>
      <a-card title="国家地图" :bordered="false" style="width: 6rem">
        <div class="echart echart3" style="width: 6rem"></div>
      </a-card>
      <div id="map" style="width:1200px;height:500px;"></div>
    </div>
  </div>
</template>

<script lang='ts'>
import * as echarts from "echarts";
import { Component, Vue } from "vue-property-decorator";
import { echart1, echart2, echart3 } from "./data";
import "./file/china";
import "./file/guangdong";

@Component({})
export default class Access extends Vue {
  myChart1: any = null;
  myChart2: any = null;
  myChart3: any = null;

  mounted() {
    this.myChart1 = echarts.init(document.getElementsByClassName("echart1")[0]);
    this.myChart1.setOption(echart1());
    this.myChart2 = echarts.init(document.getElementsByClassName("echart2")[0]);
    this.myChart2.setOption(echart2());
    this.myChart3 = echarts.init(document.getElementsByClassName("echart3")[0]);
    this.myChart3.setOption(echart3());
    //自适应
    window.addEventListener("resize", this.onresize);
    //绑定事件
    this.myChart1.on("legendselectchanged", (ev: any) => {
      console.log("ev", ev);
    });

    // 百度地图API功能
    let BMap = window.BMap;
    let BMAP_NORMAL_MAP = window.BMAP_NORMAL_MAP;
    let BMAP_HYBRID_MAP = window.BMAP_HYBRID_MAP;

    let map = new BMap.Map("map"); // 创建Map实例
    map.centerAndZoom(new BMap.Point(104.06, 30.67), 12); // 初始化地图,设置中心点坐标和地图级别
    //添加地图类型控件
    map.addControl(
      new BMap.MapTypeControl({
        mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],
      })
    );
    map.setCurrentCity("成都"); // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

    console.log(window);
  }

  updated() {
    console.log(this.$refs.echart, 20000);
  }

  onresize() {
    this.myChart1.resize();
    this.myChart2.resize();
    this.myChart3.resize();
  }
}
</script>

<style lang="scss">
// .test {
//   width: 5rem;
//   height: 5rem;
//   background: #ffe;
// }
.box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.echart {
  width: 5rem;
  height: 5rem;
}
.ant-card-body {
  padding: 0;
}
//百度logo隐藏
.BMap_cpyCtrl {
  display: none;
}
.anchorBL {
  display: none;
}
</style>