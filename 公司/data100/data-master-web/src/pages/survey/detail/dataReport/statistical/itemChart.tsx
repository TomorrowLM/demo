// import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import {chartColor} from "./const.d"
import defaultSettings from '../../../../../../config/defaultSettings';
import { uniKey } from "../../../../../utils/utils"
import {
  Chart,
  Geom,
  Tooltip,
  Coord,
  Label,
} from 'bizcharts';
/* 文字报告页面 */

interface PageProps {
  // title:string,//表格标题
  dataSourceItem: any,
  index: number
}
const ItemTable: React.FC<PageProps> = (props) => {
  const { dataSourceItem, index } = props
 
  return (
    <div key={uniKey()+"chart"+index}>
      <Chart
        // data={formateData(dataSourceItem.questionList)}
        data={dataSourceItem.questionList.slice(0,dataSourceItem.questionList.length-1)}
        forceFit
      >
        <span style={{fontWeight:"bold",color:"#303133",fontSize:"14px",}}>
          {dataSourceItem.name}
        </span>
        <Coord type="theta" />
        <Tooltip showTitle={false} />
        <Geom
          type="intervalStack"
          position={'number'}
          color={["name",chartColor]}
        >
          <Label
          content={["name*percentage", (name, percentage)=>{
            return `${name}：${percentage}%`
          }]}
          />
        </Geom>
      </Chart>
    </div>
  );
};

export default ItemTable