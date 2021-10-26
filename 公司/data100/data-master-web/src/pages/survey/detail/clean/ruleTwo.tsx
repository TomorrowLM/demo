import React, { useEffect, useState } from 'react';
// import { Access, useAccess, Link, history } from 'umi';
import { Card, Select, Row, Col, InputNumber } from 'antd';
import { submitData, questionListItem } from './data.d';
import { defaultData, optionNumEnum } from './const.d';
import { optionInfo, } from './service';
import styles from './index.less';
import { formatEnumToOptions, formatListToOptions, uniKey } from '@/utils/utils'
import { DragHandle } from "./components";
import { MinusIcon, PlusIcon, CopyIcon } from "@/components/MyIcon"
interface RuleOneProps {
  item: any,
  index: number,
  csvState: string,
  deliverState: number,
  questionList: Array<questionListItem>,
  submitData: submitData,
  setSubmitData: (value: any,handleRepeat?:boolean) => void,
}
const RuleOne: React.FC<RuleOneProps> = (props) => {
  const { item, index, csvState, deliverState, questionList, submitData, setSubmitData } = props
  const getOptionInfo = async (qid: string, fn?: any) => {
    var res = await optionInfo({
      qid
    })
    fn(formatListToOptions(res.data, "name", "code"))
  }
  return (
    <Row key={uniKey()} style={{ margin: '8px 0' }}>
      <Col flex="1">
        <Card style={{ position:"relative",margin: '0 0 0 90px', border:item.repeatId && item.repeatId.length > 0 ?'1px solid rgba(226,36,60,1)':'1px solid #f0f0f0' }}>
          <Row className={styles.row} >
            当&nbsp;
            <Select disabled={csvState == '0'|| csvState == '2' || deliverState == 2 || deliverState == 3} showSearch optionFilterProp="label" allowClear placeholder="请选择题目" options={questionList.filter((item: any) => item.type !== '0')} style={{ width: "280px" }}
              defaultValue={item.value}
              // value={item.value}
              onChange={(e, option: any) => {
                // console.log(e, option)
                var rule: any = submitData['rule2']
                if (e) {
                  option.title = option.subtitle
                  delete option.subtitle
                  rule['questions'][index] = { ...rule['questions'][index], ...option }
                  getOptionInfo(option.qid, (list: any) => {
                    rule['questions'][index].optionList = [...list]
                    setSubmitData({ ...submitData, rule2: { ...rule } },true)
                  })
                }
              }}
            >
            </Select>
            &nbsp;选项个数&nbsp;
            <Select style={{ width: "90px" }}
              disabled={csvState == '0'|| csvState == '2' || deliverState == 2 || deliverState == 3}
              placeholder="请选择"
              options={formatEnumToOptions(optionNumEnum)}
              defaultValue={item.bj}
              onChange={(e, option) => {
                var rule: any = submitData['rule2']
                rule['questions'][index].bj = e
                setSubmitData({ ...submitData, 'rule2': { ...rule } },true)
              }}></Select>
            &nbsp;&nbsp;
            <InputNumber value={item.number} disabled={csvState == '0'|| csvState == '2' || deliverState == 2 || deliverState == 3} style={{ width: "80px" }} size="middle" min={0} max={item.optionList ? item.optionList.length : 0} defaultValue={item.number} onChange={(e: any) => {
              var rule: any = submitData['rule2']
              rule['questions'][index].number = e
              setSubmitData({ ...submitData, 'rule2': { ...rule } },true)
            }} />
            <span style={{color:"rgba(226,36,60,1)"}}>（选项总个数：{item.optionList ? item.optionList.length : 0}）</span>
            &nbsp;标记数据
          </Row>
          <div style={{position:"absolute",top:"0",left:"-18px"}}>{index+1}、</div>
        </Card>
      </Col>
      {csvState == '0'|| csvState == '2' || deliverState == 2 || deliverState == 3 ? '' : <Col flex="135px">
        <span className={styles.icon}>
          {submitData['rule2']['questions'].length === 1 && index === 0 ? '' : <MinusIcon style={{ cursor: "pointer" }} onClick={() => {
            // remove('rule2', index)
            submitData['rule2']['questions'].splice(index, 1)
            setSubmitData({ ...submitData },true)
          }} />}&nbsp;&nbsp;
          <PlusIcon style={{ cursor: "pointer" }} onClick={() => {
            // add('rule2', index)
            let newDefalutData = JSON.parse(JSON.stringify(defaultData))
            newDefalutData['rule2']['questions'][0]['id'] =  uniKey()
            submitData['rule2']['questions'].splice(index + 1, 0, { ...newDefalutData['rule2']['questions'][0] })
            setSubmitData({ ...submitData })
          }} />
          &nbsp;&nbsp;
          <CopyIcon style={{ cursor: "pointer" }} onClick={() => {
            var rule: any = submitData.rule2
            if(!rule['questions'][index]['id']){
              rule['questions'][index]['id']=uniKey()
            }
            let newtData = JSON.parse(JSON.stringify(rule['questions'][index]))
            newtData['id'] = uniKey()
            if (newtData['repeatId']) {
              delete newtData['repeatId']
            }
            rule.questions.splice(index + 1, 0, { ...newtData })
            setSubmitData({ ...submitData, 'rule2': { ...rule } })
          }} />&nbsp;&nbsp;
          <DragHandle />
        </span>
      </Col>}
    </Row>

  )
}
export default RuleOne
