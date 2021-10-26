import React, { useEffect, useState } from 'react';
// import styles from "./index.less"
import { Table, Input, InputNumber } from 'antd';
import { analysisMethodsEnum, weightColumnsData } from "./const.d"

import { PlusOutlined, PlusCircleOutlined, MinusCircleOutlined, } from '@ant-design/icons';
import { formatEnumToOptions } from "@/utils/utils"
import defaultSettings from '../../../../../../config/defaultSettings';

interface WeightSetProps {
  optionList: Array<any>,
  weightChange: (optionList: any) => void
  // addQuestion: any,
  // rule: any,
  // method: string,
  // delQuestion: (ruleIndex: number, method: string) => void,
  // delMethods: (method: string) => void,
}

/* 分析方法 */
const Index: React.FC<WeightSetProps> = (props) => {
  const { optionList, weightChange } = props
  const [columnsData, setColumnsData] = useState<any>([])
  const [newOptionList, setNewOptionList] = useState<any>(JSON.parse(JSON.stringify(optionList)))
  // const [modalVisible, setModalVisible] = useState<boolean>(false)

  const sortWeight = () => {
    let sortOptionList = JSON.parse(JSON.stringify(newOptionList))
    newOptionList.forEach((option:any,index:number)=>{
      option['weight']= sortOptionList[sortOptionList.length-1-index]['weight']
    })
    setNewOptionList([...newOptionList])
    weightChange([...newOptionList])
  }
  useEffect(() => {

    setColumnsData(weightColumnsData((text: string, record: any, index: number) => {
      return <InputNumber<string>  min="0" stringMode precision={3} value={text} onChange={(value) => {
        newOptionList[index]['weight'] = value
        setNewOptionList(newOptionList)
        weightChange([...newOptionList])
      }} />
    }, () => {
      return <div>
        <span>权重</span>
        <img style={{width:"14px",marginLeft:"15px"}} src={require("@/assets/iconImages/sort@2x.png")} alt="" onClick={sortWeight} />
      </div>
    }))
  }, [])

  const onChangeMethods = (e: any) => {

  }

  return (
    <Table
      columns={columnsData}
      pagination={false}
      dataSource={newOptionList}
    />



  );
};

export default Index;
