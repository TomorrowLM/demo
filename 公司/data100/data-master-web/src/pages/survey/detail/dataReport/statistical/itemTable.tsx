import React, { useEffect, useState } from 'react';
import { Access, useAccess, Link, history, connect, Loading } from 'umi';
import { Table, Progress } from "antd"
import { columns } from "./const.d"
import defaultSettings from '../../../../../../config/defaultSettings';
/* 文字报告页面 */

interface PageProps {
  // title:string,//表格标题
  dataSourceItem: any,
  index: number
}
const ItemTable: React.FC<PageProps> = (props) => {
  const { dataSourceItem, index } = props
  const [columnsData, setColumnsData] = useState<Array<any>>()
  useEffect(() => {
    setColumnsData(columns((text: string, index: number) => {
      if (index == dataSourceItem.questionList.length - 1) {
        return ''
      } else {
        return <Progress percent={text} strokeColor={defaultSettings.primaryColor} />
      }

    }))
  }, [])


  return (
    <Table
      rowKey='name'
      style={{ margin: "10px 0" }}
      title={() => {
        return <h3 style={{ fontWeight: "bold", color: '#303133', fontSize: "14px" }}>{dataSourceItem.name}</h3>
      }}
      pagination={false}
      dataSource={dataSourceItem.questionList}
      columns={columnsData}
    // summary={()=>{
    //   return <div style={{width:'100%',display:"flex",}}>
    //     <div style={{width:"270px",padding: '12px 8px'}}>本次有效填写人次</div>
    //     <div style={{flex:1,padding: '12px 8px'}}>{dataSourceItem.answerNumber}</div>
    //   </div>
    // }}
    />
  );
};

export default ItemTable