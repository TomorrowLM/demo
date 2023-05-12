import React from "react";
import { zhexiang as data } from "./data";
import { Chart } from "@antv/g2";
import { useEffect } from "react";

export default () => {
  useEffect(() => {
    const chart = new Chart({
      container: "zhexiang",
      autoFit: true,
      height: 200,
      padding: [30, 20, 70, 30],
    });

    chart.data(data);
    //度量（Scale）用于定义数据的类型和展示方式
    chart.scale({
      nlp: {
        min: 0,
        max: 100,
      },
      blockchain: {
        min: 0,
        max: 10,
      },
    });
    //坐标轴配置
    chart.axis("nlp", false); // 不展示 'nlp' 字段对应的坐标轴

    //图表底部展示配置
    chart.legend({
      custom: true,
      items: [
        {
          name: "blockchain",
          value: "blockchain",
          marker: {
            symbol: "line",
            style: { stroke: "#1890ff", lineWidth: 2 },
          },
        },
        {
          name: "nlp",
          value: "nlp",
          marker: {
            symbol: "line",
            style: { stroke: "#2fc25b", lineWidth: 2 },
          },
        },
      ],
    });

    //position适用于直角坐标系，设置坐标轴的位置, label在折线上展示nlp的值。
    chart.line().position("date*blockchain").color("#1890ff").label("nlp");
    chart.line().position("date*nlp").color("#2fc25b");
    //特殊数据点标注
    chart.annotation().dataMarker({
      top: true,
      position: ["2015-01-25", 3],
      text: {
        content: "特殊数据点标注",
        style: {
          textAlign: "center",
        },
      },
      line: {
        // length: 30,
      },
    });
    chart.removeInteraction("legend-filter"); // 自定义图例，移除默认的分类图例筛选交互
    chart.render();
    // });
  }, []);
  return <div id="zhexiang"></div>;
};
