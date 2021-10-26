import React, { useEffect, useState } from 'react';
import { Access, useAccess, Link, history } from 'umi';
import { Card, Select, Row, Col } from 'antd';
import { submitData, questionListItem } from './data.d';
import { stateEnum, defaultData,} from './const.d';
import {  optionInfo, } from './service';
import styles from './index.less';
import {  formatListToOptions, uniKey } from '@/utils/utils'
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
        <Card style={{position:"relative", margin: '0 0 0 90px', border:item.repeatId && item.repeatId.length > 0 ?'1px solid rgba(226,36,60,1)':'1px solid #f0f0f0' }}>
          <Row className={styles.row} >
            当&nbsp;
            <Select disabled={csvState == '0'|| csvState == '2' || deliverState == 2 || deliverState == 3} allowClear showSearch optionFilterProp="label" placeholder="请选择题目" style={{ width: "280px" }}
              options={questionList.filter((item: any) => item.type === '2')}
              defaultValue={item.value}
              onChange={(e, option: any) => {
                // console.log(e, option)
                var rule: any = submitData['rule3']
                if (e) {
                  option.title = option.subtitle
                  delete option.subtitle
                  rule['questions'][index] = { ...rule['questions'][index], ...option }
                  getOptionInfo(option.qid, (list: any) => {
                    rule['questions'][index].optionList = [...list]
                    setSubmitData({ ...submitData, rule3: { ...rule } },true)
                  })
                }
              }}
            >
            </Select>
            &nbsp;所有选项相同时，标记数据
          </Row>
          <div style={{position:"absolute",top:"0",left:"-18px"}}>{index+1}、</div>
        </Card>
      </Col>
      {csvState == '0'|| csvState == '2' || deliverState == 2 || deliverState == 3 ? '' : <Col flex="135px">
        <span className={styles.icon}>
          {submitData['rule3']['questions'].length === 1 && index === 0 ? '' : <MinusIcon style={{ cursor: "pointer" }} onClick={() => {
            // remove('rule3', index)
            submitData['rule3']['questions'].splice(index, 1)
            setSubmitData({ ...submitData },true)
          }} />}&nbsp;&nbsp;
          <PlusIcon style={{ cursor: "pointer" }} onClick={() => {
            let newDefalutData = JSON.parse(JSON.stringify(defaultData))
            newDefalutData['rule3']['questions'][0]['id'] =  uniKey()
            submitData['rule3']['questions'].splice(index + 1, 0, { ...newDefalutData['rule3']['questions'][0] })
            setSubmitData({ ...submitData })
          }} /> &nbsp;&nbsp;
          <CopyIcon style={{ cursor: "pointer" }} onClick={() => {
            var rule: any = submitData.rule3
            if(!rule['questions'][index]['id']){
              rule['questions'][index]['id']=uniKey()
            }
            let newtData = JSON.parse(JSON.stringify(rule['questions'][index]))
            newtData['id'] = uniKey()
            if (newtData['repeatId']) {
              delete newtData['repeatId']
            }
            rule.questions.splice(index + 1, 0, { ...newtData })
            setSubmitData({ ...submitData, 'rule3': { ...rule } })
          }} />&nbsp;&nbsp;
          <DragHandle />
        </span>
      </Col>}
    </Row>
  )
}
export default RuleOne
