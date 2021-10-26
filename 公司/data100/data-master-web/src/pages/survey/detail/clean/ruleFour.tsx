import React, { useEffect, useState } from 'react';
import { Access, useAccess, Link, history } from 'umi';
import { Card, Row, Col, } from 'antd';
import { submitData, questionListItem } from './data.d';
import { stateEnum, defaultData, } from './const.d';
import { optionInfo, } from './service';
import styles from './index.less';
import SelectTags from '@/components/SelectTags';
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
  setSubmitData: (value: any, handleRepeat?: boolean) => void,
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
        <Card style={{ position:"relative",margin: '0 0 0 90px', border: item.repeatId && item.repeatId.length > 0 ? '1px solid rgba(226,36,60,1)' : '1px solid #f0f0f0' }}>
          <Row className={styles.row} >
            <SelectTags
              disabled={csvState == '0' || csvState == '2' || deliverState == 2 || deliverState == 3}
              title={'当'}
              placeholder={"请选择题目"}
              options={questionList.filter((list: any) => {
                if (item.questions.length > 0) {
                  return list.type === item.questions[0].type
                } else {
                  return list.type === '0' || list.type === '1'
                }
              })}
              value={item.questions}
              getOptionInfo={getOptionInfo}
              onChange={(value: any) => {
                var rule: any = submitData['rule4']
                rule['ruleGroup'][index]['questions'] = [...value]
                setSubmitData({ ...submitData }, true)
              }}
            />
            &nbsp;所有选项相同时，标记数据&nbsp;
          </Row>
          <div style={{position:"absolute",top:"0",left:"-18px"}}>{index+1}、</div>
        </Card>
      </Col>
      {csvState == '0' || csvState == '2' || deliverState == 2 || deliverState == 3 ? '' : <Col flex="135px">
        <span className={styles.icon}>
          {submitData['rule4']['ruleGroup'].length === 1 && index === 0 ? '' : <MinusIcon style={{ cursor: "pointer" }} onClick={() => {
            var rule: any = submitData.rule4
            rule.ruleGroup.splice(index, 1)
            setSubmitData({ ...submitData, 'rule4': { ...rule } }, true)
          }} />}&nbsp;&nbsp;
          <PlusIcon style={{ cursor: "pointer" }} onClick={() => {
            var rule: any = submitData.rule4
            let newDefalutData = JSON.parse(JSON.stringify(defaultData))
            newDefalutData['rule4']['ruleGroup'][0].id = uniKey()
            rule.ruleGroup.splice(index + 1, 0, { ...newDefalutData['rule4']['ruleGroup'][0] })
            setSubmitData({ ...submitData, 'rule4': { ...rule } })
          }} />&nbsp;&nbsp;
          <CopyIcon style={{ cursor: "pointer" }} onClick={() => {
            var rule: any = submitData.rule4
            if (!rule['ruleGroup'][index]['id']) {
              rule['ruleGroup'][index]['id'] = uniKey()
            }
            let newtData = JSON.parse(JSON.stringify(rule['ruleGroup'][index]))
            newtData['id'] = uniKey()
            if (newtData['repeatId']) {
              delete newtData['repeatId']
            }
            rule.ruleGroup.splice(index + 1, 0, { ...newtData })
            setSubmitData({ ...submitData, 'rule4': { ...rule } })
          }} />&nbsp;&nbsp;
          <DragHandle />
        </span>
      </Col>}
    </Row>

  )
}
export default RuleOne
