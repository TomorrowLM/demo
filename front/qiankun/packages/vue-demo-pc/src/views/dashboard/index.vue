<template>
  <div>
    <span>dashboard</span>
    <!-- <button @click="()=>{data = data+1}">{{data}}</button> -->
    <div>
      <a-card title="折线图" :bordered="false" style="width: 9rem">
        <div class="echart echart1" style="width: 9rem"></div>
      </a-card>
    </div>
    <div class="box">
      <a-card title="省图" :bordered="false" style="width: 5rem">
        <div class="echart echart2"></div>
      </a-card>
      <a-card title="国家地图" :bordered="false" style="width: 15rem">
        <div class="echart echart3" style="width: 15rem"></div>
      </a-card>
      <a-card title="国家分布图" :bordered="false" style="width: 6rem">
        <div class="echart echart4" style="width: 6rem"></div>
      </a-card>
      <div id="map" style="width: 1200px; height: 500px"></div>
    </div>
  </div>
</template>

<script lang="ts">
import * as echarts from 'echarts';
import 'echarts/extension/bmap/bmap';
// 请确保在引入百度地图扩展之前已经引入百度地图 JS API 脚本并成功加载
// https://api.map.baidu.com/api?v=3.0&ak=你申请的AK
import { Component, Vue } from 'vue-property-decorator';
import { echart1, echart2, echart3 } from './data';
import './file/china';
import './file/guangdong';

@Component({})
export default class Dashboard extends Vue {
  myChart1: any = null;
  myChart2: any = null;
  myChart3: any = null;
  myChart4: any = null;

  mounted() {
    //注册地图到echarts中  这里的 "china" 要与地图数据的option中的geo中的map对应
    this.myChart1 = echarts.init(document.getElementsByClassName('echart1')[0] as any);
    this.myChart1.setOption(echart1());
    this.myChart2 = echarts.init(document.getElementsByClassName('echart2')[0] as any);
    this.myChart2.setOption(echart2());
    // this.myChart3 = echarts.init(document.getElementsByClassName('echart3')[0] as any);
    // this.myChart3.setOption(echart3());
    // this.myChart4 = echarts.init(document.getElementsByClassName('echart4')[0] as any);
    // this.myChart4.setOption(echart3());
    //自适应
    window.addEventListener('resize', this.onresize);
    this.baidu();
    // //绑定事件
    // this.myChart1.on('legendselectchanged', (ev: any) => {
    //   console.log('ev', ev);
    // });
  }

  updated() {
    console.log(this.$refs.echart, 20000);
  }

  baidu() {
    // // 百度地图API功能
    // let BMap = window.Map;
    // let BMAP_NORMAL_MAP = window.MAP_NORMAL_MAP;
    // let BMAP_HYBRID_MAP = window.MAP_HYBRID_MAP;
    // let map = new Map.Map('map'); // 创建Map实例
    // map.centerAndZoom(new Map.Point(104.06, 30.67), 12); // 初始化地图,设置中心点坐标和地图级别
    // //添加地图类型控件
    // map.addControl(
    //   new Map.MapTypeControl({
    //     mapTypes: [MAP_NORMAL_MAP, MAP_HYBRID_MAP],
    //   })
    // );
    // map.setCurrentCity('成都'); // 设置地图显示的城市 此项是必须设置的
    // map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    // console.log(window);
  }

  onresize() {
    this.myChart1.resize();
    this.myChart2.resize();
    // this.myChart3.resize();
    // this.myChart4.resize();
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
