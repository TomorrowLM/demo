import React, { useEffect, useState } from 'react';
import { Card, Select, Row, Col, } from 'antd';
import { submitData, questionListItem } from './data.d';
import { defaultData, luojiguanxiEnum } from './const.d';
import { optionInfo } from './service';
import styles from './index.less';
import SelectTags from '@/components/SelectTags';
import { formatEnumToOptions, formatListToOptions, uniKey } from '@/utils/utils'
import { DragHandle } from "./components";
import { MinusIcon, PlusIcon, CopyIcon } from "@/components/MyIcon"
import { Label } from 'bizcharts';
interface RuleOneProps {
  deliverState: number,
  parentItem: any,
  parentIndex: number,
  csvState: string,
  questionList: Array<questionListItem>,
  submitData: submitData,
  setSubmitData: (value: any,handleRepeat?:boolean) => void,
}
const RuleOne: React.FC<RuleOneProps> = (props) => {
  const { parentItem, parentIndex, csvState, deliverState, questionList, submitData, setSubmitData } = props
  const getOptionInfo = async (qid: string, fn?: any) => {
    var res = await optionInfo({
      qid
    })
    fn(formatListToOptions(res.data, "name", "code"))
  }
  return (
    <Row key={uniKey()} style={{ margin: '8px 0' }}>
      <Col flex="1">
        <Card style={{position:"relative", margin: '0 0 0 90px', border: parentItem.repeatId && parentItem.repeatId.length > 0 ? '1px solid rgba(226,36,60,1)' : '1px solid #f0f0f0' }}>
          当{parentItem.questions.map((item: any, index: number) => {
            return <Row className={styles.row} key={"form-list-parent" + parentIndex + 'form-list' + index}>
              &nbsp;
              <Select disabled={csvState == '0'|| csvState == '2' || deliverState == 2 || deliverState == 3} showSearch optionFilterProp="label" allowClear placeholder="请选择题目"
                options={questionList}
                style={{ width: "280px" }}
                defaultValue={item.value}
                onChange={(e, option: any) => {
                  var rule: any = submitData['rule1']
                  if (e) {
                    option.title = option.subtitle
                    delete option.subtitle
                    rule['ruleGroup'][parentIndex]['questions'][index] = { ...rule['ruleGroup'][parentIndex]['questions'][index], ...option }
                    rule['ruleGroup'][parentIndex]['questions'][index].option = []
                    getOptionInfo(option.qid, (list: any) => {
                      rule['ruleGroup'][parentIndex]['questions'][index].optionList = [...list]
                      setSubmitData({ ...submitData, rule1: { ...rule } },true)
                    })
                  } else {
                    rule['ruleGroup'][parentIndex]['questions'][index].value = ''
                    rule['ruleGroup'][parentIndex]['questions'][index].option = []
                    rule['ruleGroup'][parentIndex]['questions'][index].optionList = []
                    setSubmitData({ ...submitData, rule1: { ...rule } },true)
                  }
                }}
              />
              <Select disabled={csvState == '0'|| csvState == '2' || deliverState == 2 || deliverState == 3}
                showSearch optionFilterProp="label"
                allowClear placeholder="选择"
                style={{ width: "100px" }}
                defaultValue='选择'
                options={[{label: '选择',value: '选择',title: '选择', choose: 1},{label: '未选择',value: '未选择',title: '未选择', choose: 2}]}
                defaultValue={item.choose == 1?"选择":"未选择"}
                onChange={(e, option: any) => {
                  console.log(e, option, submitData)
                  var rule: any = submitData['rule1']
                  console.log(option)
                  if (e) {
                    rule['ruleGroup'][parentIndex]['questions'][index] = { ...rule['ruleGroup'][parentIndex]['questions'][index] }
                    rule['ruleGroup'][parentIndex]['questions'][index].choose = option.choose
                    setSubmitData({ ...submitData, rule1: { ...rule } },true)
                  } else {
                    rule['ruleGroup'][parentIndex]['questions'][index].value = ''
                    rule['ruleGroup'][parentIndex]['questions'][index].option = []
                    rule['ruleGroup'][parentIndex]['questions'][index].optionList = []
                    setSubmitData({ ...submitData, rule1: { ...rule } },true)
                  }
                }}
              />
              <SelectTags
                disabled={csvState == '0'|| csvState == '2' || deliverState == 2 || deliverState == 3}
                title={'选项'}
                placeholder={"请选择选项"}
                options={formatListToOptions(item.optionList, "name", "code")}
                value={formatListToOptions(item.option, "name", "code")}
                onChange={(value: any) => {
                  item.option = [...value]
                  setSubmitData({ ...submitData },true)
                }}
              />
              <Select style={{ width: "60px" }}
                disabled={csvState == '0'|| csvState == '2' || deliverState == 2 || deliverState == 3}
                options={formatEnumToOptions(luojiguanxiEnum)}
                defaultValue={item.lj}
                onChange={(e, option) => {
                  var questions: any = parentItem['questions']
                  let newDefalutData = JSON.parse(JSON.stringify(defaultData))
                  // debugger;
                  if (item.lj === '0' && (e === '1' || e === '2')) {//或 且情况下  自动增加一条
                    item.lj = e
                    questions.splice(index + 1, 0, newDefalutData['rule1']['ruleGroup'][0]['questions'][0])
                  } else {
                    questions[index].lj = e
                    if (e === '0') {
                      questions.splice(index+1, questions.length-index)
                    }
                  }
                  setSubmitData({ ...submitData },true)
                }}></Select>
              &nbsp;
            </Row>
          })}
          标记数据
          <div style={{position:"absolute",top:"0",left:"-18px"}}>{parentIndex+1}、</div>
        </Card>
      </Col>
      {csvState == '0'|| csvState == '2' || deliverState == 2 || deliverState == 3 ? '' : <Col flex="135px">
        <span className={styles.icon}>
          {submitData['rule1']['ruleGroup'].length === 1 && parentIndex === 0 ? '' : <MinusIcon style={{ cursor: "pointer" }} onClick={() => {
            if (parentItem['isRepeat']) {
              delete parentItem['isRepeat']
            }
            var rule: any = submitData.rule1
            rule.ruleGroup.splice(parentIndex, 1)
            setSubmitData({ ...submitData, 'rule1': { ...rule } },true)
          }} />}&nbsp;&nbsp;
          <PlusIcon style={{ cursor: "pointer" }} onClick={() => {
            var rule: any = submitData.rule1
            let newDefalutData = JSON.parse(JSON.stringify(defaultData))
            newDefalutData['rule1']['ruleGroup'][0].id = uniKey()
            rule.ruleGroup.splice(parentIndex + 1, 0, { ...newDefalutData['rule1']['ruleGroup'][0] })
            setSubmitData({ ...submitData, 'rule1': { ...rule } })
          }} />&nbsp;&nbsp;
          <CopyIcon style={{ cursor: "pointer" }} onClick={() => {
            var rule: any = submitData.rule1
            if(!rule['ruleGroup'][parentIndex]['id']){
              rule['ruleGroup'][parentIndex]['id']= uniKey()
            }
            let newtData = JSON.parse(JSON.stringify(rule['ruleGroup'][parentIndex]))
            newtData['id'] = uniKey()
            if (newtData['repeatId']) {
              delete newtData['repeatId']
            }
            rule.ruleGroup.splice(parentIndex + 1, 0, { ...newtData })
            setSubmitData({ ...submitData, 'rule1': { ...rule } })
          }} />&nbsp;&nbsp;
          <DragHandle />
        </span>
      </Col>}
    </Row>

  )
}
export default RuleOne
