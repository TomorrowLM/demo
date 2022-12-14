/**
 * 柱状图
 */
import React from "react";
import { zhuzhuang as data } from "./data";
import { Chart } from "@antv/g2";
import DataSet from "@antv/data-set";
import { useEffect } from "react";

export default function Zhuzhuang() {
  useEffect(() => {
    console.log(data);
    const ds = new DataSet();
    const dv = ds.createView().source(data); //创建并返回一个数据视图实例。
    dv.transform({
      type: "map",
      callback: (row) => {
        row.year = parseInt(row.year, 10);
        return row;
      },
    }).transform({
      type: "regression",
      method: "polynomial",
      fields: ["year", "value"],
      bandwidth: 0.7,
      as: ["Year", "Value"],
    });

    const chart = new Chart({
      container: "zhuzhuang",
      autoFit: true,
      height: 200,
      padding: [25, 40],
    });

    //度量（Scale）用于定义坐标轴内容的类型和展示方式
    chart.scale({
      year: {
        alias: "时间", // 别名
        range: [0.05, 0.75], //设置坐标系两端留白
      },
      value: {
        alias: "数量",
        // ticks: [0, 100, 200, 300, 400, 500, 600], //设置坐标轴数值范围
        //设置坐标轴数值范围
        min: 0,
        max: 1000,
        tickCount: 10, //设置坐标轴刻度线个数
        // tickInterval: 200, //设置坐标轴刻度线间距
        formatter: (val) => `￥${val}`, //格式化
      },
    });
    //scale 度量的名字控制着坐标轴的标题内容
    // chart.scale("year", {

    // });
    // chart.scale("value", {

    // });
    //只用于控制坐标轴的外观配置
    chart.axis("year", {
      // tickLine: null, //刻度线
      title: {
        style: {
          fill: "#1890ff",
        },
      },
    });
    chart.axis("value", {
      // tickLine: null, //刻度线
      title: {
        style: {
          fill: "#1890ff",
        },
      },
    });
    // 图例配置
    chart.legend("year", {
      position: "top",
    }); // 只更改 x 维度对应的图例的显示位置

    //
    chart.tooltip({
      showMarkers: false, // 不展示 tooltip markers
    });
    chart.interaction("active-region"); // 使用 active-region 交互行为

    //创建子 view
    const view1 = chart.createView();
    view1.data(data);
    view1.interval().position("year*value").style({
      fillOpacity: 1,
    });

    const view2 = chart.createView();
    view2.axis(false);
    view2.data(dv.rows);
    view2
      .line()
      .position("Year*Value")
      .style({
        stroke: "#969696",
        lineDash: [3, 3],
      })
      .tooltip(false);
    view2.annotation().text({
      content: "趋势线",
      position: ["min", "min"],
      style: {
        fill: "#8c8c8c",
        fontSize: 14,
        fontWeight: 300,
      },
      offsetY: -140,
    });
    chart.render();
    // });
  }, []);
  return <div id="zhuzhuang"></div>;
}
