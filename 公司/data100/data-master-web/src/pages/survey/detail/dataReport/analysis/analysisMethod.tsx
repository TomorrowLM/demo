import React, { useEffect, useState } from 'react';
import styles from "./index.less"
import OssFileUpload, { OssFileType } from "@/components/FileUpload/OssFileUpload";
import CreateModal from "@/components/CreateModal"
import { analysisMethodsEnum } from "./const.d"
import { Button, Row, Col, Collapse, Image, Empty } from 'antd';
import { PlusOutlined, PlusCircleOutlined, MinusCircleOutlined, CloseCircleFilled } from '@ant-design/icons';
import { formatEnumToOptions } from "@/utils/utils"
import defaultSettings from '../../../../../../config/defaultSettings';
import WeightSet from "./weightSet"
const { Panel } = Collapse;

interface AnalysisMethodProps {
  // question:Array<any>,
  addQuestion: any,
  rule: any,
  method: string,
  delQuestion: (ruleIndex: number, method: string) => void,
  delMethods: (method: string) => void,
  editQuestion: (ruleIndex: number, method: string, optionList: any) => void,
}
/* 分析方法 */
const AnalysisMethod: React.FC<AnalysisMethodProps> = (props) => {
  const { addQuestion, rule, method, delQuestion, delMethods, editQuestion } = props

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [weightOptionList, setWeightOptionList] = useState<Array<any>>([])
  const [ruleQuestionIndex, setRuleQuestionIndex] = useState<number>(0)

  useEffect(() => {

  }, [])

  const onChangeMethods = (e: any) => {

  }
  const getHeader = () => {
    return <Row justify="space-between">
      <Col><h3>{analysisMethodsEnum[method]}</h3></Col>
      <Col> <Button icon={<PlusOutlined style={{ color: defaultSettings.primaryColor }} />} type="text" onClick={event => {
        event.stopPropagation();
        addQuestion()
      }}>添加题目</Button></Col>
    </Row>
  }
  const genExtra = () => (
    <img style={{ position: 'absolute', top: 0, right: 0, width: "28px", height: "28px" }} src={require("@/assets/iconImages/methods_del@2x.png")}
      onClick={event => {//删除方法
        event.stopPropagation();
        delMethods(method)
      }}
    />
  );
  const genExpandIcon = (expand?: boolean) => {
    return !expand ? <PlusCircleOutlined style={{ position: "absolute", left: "-8px", color: defaultSettings.primaryColor, }} /> : <MinusCircleOutlined style={{ position: "absolute", left: "-8px", color: defaultSettings.primaryColor, }} />
  }
  return (
    rule == null ? "" : <div className={styles.analysisMethod} key={method + '_collapse'}>
      <Collapse style={{ borderRadius: '6px' }} expandIcon={({ isActive }) => genExpandIcon(isActive)} defaultActiveKey={['1']}>
        <Panel header={getHeader()} key="1" extra={genExtra()}>
          {rule.length > 0 ? rule.map((ruleItem: any, ruleIndex: number) => {
            return <div style={{ borderBottom: "1px dashed #dcdfe6", display: "flex" }}>
              <span style={{ color: '#606266', flex: 1 }}>{ruleItem['questionName']}</span>
              {method === 'meanRule' ? <Button type="text" style={{ color: defaultSettings.primaryColor, }}
                onClick={() => {
                  setModalVisible(true)
                  setWeightOptionList(ruleItem['optionList'])
                  setRuleQuestionIndex(ruleIndex)
                }} >权重设置</Button> : ''}
              <Button type="text" icon={<CloseCircleFilled style={{ color: '#b4bbd1' }} />} onClick={() => {
                delQuestion(ruleIndex, method)
              }} ></Button>
            </div>
          })
            : <Empty />}
        </Panel>
      </Collapse>
      <CreateModal width={600} onCancel={() => {
        setModalVisible(false)
      }}
        onHandleOk={() => {
          setModalVisible(false)
          editQuestion(ruleQuestionIndex, method, weightOptionList)
        }}
        title='权重设置' submitText="确定" modalVisible={modalVisible}>
        <WeightSet optionList={weightOptionList} weightChange={(optionList: any) => {
          setWeightOptionList([...optionList])
        }} />

      </CreateModal>
    </div>

  );
};

export default AnalysisMethod;
