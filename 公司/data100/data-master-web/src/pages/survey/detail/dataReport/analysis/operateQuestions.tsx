import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import styles from "./index.less"
import { Button, Row, Col, Collapse, Drawer, Input, Tooltip } from 'antd';
import { PlusOutlined, PlusCircleOutlined, MinusCircleOutlined, CloseCircleFilled, SearchOutlined } from '@ant-design/icons';
import { formatEnumToOptions } from "@/utils/utils"
import defaultSettings from '../../../../../../config/defaultSettings';
const { Panel } = Collapse;

interface AnalysisMethodProps {
  operationVisible: boolean,
  setOperationVisible: (visible: boolean) => void,
  operateQuestionsRef: any,
  changeQuestions: (value: object, position: string) => void,
}
/* 批量操作 */
const OperateQuestions: React.FC<AnalysisMethodProps> = (props) => {
  const { changeQuestions, setOperationVisible, operationVisible, operateQuestionsRef } = props
  const inputRef = useRef<Input>(null);
  const [inputVisibleIndex, setInputVisibleIndex] = useState<string>()
  const [questionPosition, setQuestionPosition] = useState<string>('')
  const [operationQuestions, setOperationQuestions] = useState<Array<any>>([])
  const [operationQuestionsAll, setOperationQuestionsAll] = useState<Array<any>>([])
  useImperativeHandle(operateQuestionsRef, () => ({
    setQuestions: (questions: any, position: string) => {

      setQuestionPosition(position)
      if (position === 'x') {
        if (questions[0]['optionList'][0]['question'] && questions[0]['optionList'][0]['question'] != null && questions[0]['optionList'][0]['question'].length > 0) {//两层
          setOperationQuestions([questions, questions[0]['optionList'][0]['question']])
          setOperationQuestionsAll([questions, questions[0]['optionList'][0]['question']])
          // console.log([questions, questions[0]['optionList'][0]['question']])
        } else {
          setOperationQuestions([questions])
          setOperationQuestionsAll([questions])
        }
      } else {
        setOperationQuestions([questions])
        setOperationQuestionsAll([questions])
      }

    }
  }));
  useEffect(() => {
    if (inputVisibleIndex != null) {
      inputRef.current!.focus();
    }
  }, [inputVisibleIndex])

  const changeQuestionsAll = (e: any, item: any, editItemName: string, operationQuestionIndex: number, type: string, questionItem?: any) => {
    console.log(operationQuestionsAll, operationQuestionIndex)
    operationQuestionsAll[operationQuestionIndex].forEach((question: any, questionIndex: number) => {
      if (editItemName === 'questionName') {
        if (item.value === question.value) {
          if (type === 'edit') {//重命名
            question[editItemName] = e.target.value
            question.label = e.target.value
          } else {//删除
            question.splice(questionIndex, 1)
          }

        }
      } else {
        if (questionItem && questionItem.value === question.value) {
          question.optionList.forEach((option: any, optionIndex: number) => {
            if (item.code === option.code) {
              if (type === 'edit') {//重命名
                option[editItemName] = e.target.value
              } else {
                question.optionList.splice(optionIndex, 1)
              }
            }
          })
        }
      }
    })

    setOperationQuestionsAll([...operationQuestionsAll])
  }
  const questionNameChange = (e: any, item: any, editItemName: string) => {
    item[editItemName] = e.target.value
    setOperationQuestions([...operationQuestions])
  }
  const questionNameSave = (e: any) => {
    setInputVisibleIndex(undefined)
  }
  const editNode = (item: any, index: number, editItemName: string, key: string, operationQuestionIndex: number, questionItem?: any) => {
    return <Row style={{ cursor: "auto", position: 'relative', width: "98%", height: "40px" }}>
      <Col span={24} onClick={(event) => { event.stopPropagation(); }}>
        {inputVisibleIndex === key + editItemName + index ? <Input style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, }}
          ref={inputRef} defaultValue={item[editItemName]} onChange={e => {
            questionNameChange(e, item, editItemName)
            changeQuestionsAll(e, item, editItemName, operationQuestionIndex, 'edit', questionItem)
          }} onPressEnter={questionNameSave} onBlur={questionNameSave} /> :
          <Tooltip title={item[editItemName]}> <div className={`${styles.editText} ${styles.textOverflow}`} onClick={() => {
            setInputVisibleIndex(key + editItemName + index)
          }}>{item[editItemName]}</div></Tooltip>}
      </Col>
    </Row>
  }
  const genExtra = (operationQuestion: any, index: number,) => (
    <img style={{ position: 'absolute', top: 0, right: 0, width: "28px", height: "28px" }} src={require("@/assets/iconImages/methods_del@2x.png")}
      onClick={event => {//删除方法
        event.stopPropagation();
        operationQuestion.splice(index, 1)
        setOperationQuestions([...operationQuestions])

      }}
    />
  );
  const genExpandIcon = (expand?: boolean) => {
    return !expand ? <PlusCircleOutlined style={{ position: "absolute", left: "-8px", color: defaultSettings.primaryColor, }} /> : <MinusCircleOutlined style={{ position: "absolute", left: "-8px", color: defaultSettings.primaryColor, }} />
  }
  const searchList = (value: any) => {
    let new_operationQuestionsAll = JSON.parse(JSON.stringify(operationQuestionsAll))
    new_operationQuestionsAll.forEach((lists: any, i: number) => {
      var newLists: any = []
      lists.forEach((item: any, index: number) => {
        if (item.questionName.toLowerCase().indexOf(value.toLowerCase()) > -1) {
          newLists.push(item)
        }
      })
      new_operationQuestionsAll[i] = newLists
    })
    setOperationQuestions([...new_operationQuestionsAll])
  }
  const formateCheckedList = (checkedLists: any) => {
    checkedLists.forEach((question: any, questionIndex: number) => {
      question['optionList'].forEach((option: any, optionIndex: number) => {
        if (option.question) {
          delete option.question
        }
        option.colList = [
          { name: "数量", dataIndex: `${question.qid}_${question.subQuestionCode}_${option.code}&number` },
          { name: "百分比", dataIndex: `${question.qid}_${question.subQuestionCode}_${option.code}&percent` },
        ]
      })
    })
    return checkedLists
  }
  return (
    <Drawer
      title="操作"
      width={900}
      closable={true}
      destroyOnClose={true}
      onClose={() => {
        setOperationVisible(false)
      }}
      visible={operationVisible}
      footer={<div style={{ display: "flex", justifyContent: "flex-end", padding: "0 30px" }}>
        <Button onClick={() => { setOperationVisible(false) }}>取消</Button>&nbsp;&nbsp;
        <Button onClick={() => {
          console.log(operationQuestionsAll, questionPosition)
          setOperationVisible(false)
          if (questionPosition === 'x') {
            if (operationQuestionsAll.length > 1) {//两层
              if (operationQuestionsAll[0].length === 0 && operationQuestionsAll[1].length > 0) {//两层=》删除第一层 此时数据由两层变为一层那么数据的dataIndex需要改变
                changeQuestions(formateCheckedList(JSON.parse(JSON.stringify(operationQuestionsAll[1]))), questionPosition)
              } else if (operationQuestionsAll[0].length > 0 && operationQuestionsAll[1].length === 0) {//一层=》删除第二层 此时数据由两层变为一层那么数据的dataIndex需要改变
                changeQuestions(formateCheckedList(JSON.parse(JSON.stringify(operationQuestionsAll[0]))), questionPosition)
              } else if (operationQuestionsAll[0].length === 0 && operationQuestionsAll[1].length === 0) {//两层全部删除
                changeQuestions([], questionPosition)
              } else {
                operationQuestionsAll[0][0]['optionList'].forEach((option1: any, option1Index: number) => {
                  option1['question'] = JSON.parse(JSON.stringify(operationQuestionsAll[1]))//多次用到questionx
                  option1['question'].forEach((question2: any, question2Index: number) => {
                    var colList = []
                    question2['optionList'].forEach((option2: any, option2Index: number) => {
                      colList = [
                        { name: "数量", dataIndex: `${operationQuestionsAll[0][0].qid}_${operationQuestionsAll[0][0].subQuestionCode}_${option1.code}&${question2.qid}_${question2.subQuestionCode}_${option2.code}&number` },
                        { name: "百分比", dataIndex: `${operationQuestionsAll[0][0].qid}_${operationQuestionsAll[0][0].subQuestionCode}_${option1.code}&${question2.qid}_${question2.subQuestionCode}_${option2.code}&percent` },
                      ]
                      option2.colList = [...colList]
                    })
                  })
                })
                changeQuestions(JSON.parse(JSON.stringify(operationQuestionsAll[0])), questionPosition)
              }
            } else {//一层
              changeQuestions(JSON.parse(JSON.stringify(operationQuestionsAll[0])), questionPosition)
            }
          } else {
            changeQuestions(JSON.parse(JSON.stringify(operationQuestionsAll[0])), questionPosition)
          }
        }}>确定</Button>
      </div>}
    >
      <Input className={styles.input} placeholder="请输入搜索内容" prefix={<SearchOutlined style={{ fontSize: "18px", color: '#c0c4cc' }} />} onChange={(e) => {
        searchList(e.target.value)
      }} />
      {operationQuestions.map((operationQuestion: any, operationQuestionIndex: number) => {
        return <div className={styles.operateQuestions} key={operationQuestionIndex}>
          {operationQuestions.length > 1 ? <h3>第{operationQuestionIndex == 0 ? '一' : '二'}层</h3> : ''}
          <Collapse style={{ borderRadius: '6px' }} expandIcon={({ isActive }) => genExpandIcon(isActive)} accordion>
            {operationQuestion.map((questionItem: any, questionIndex: number) => {
              return <Panel header={editNode(questionItem, questionIndex, 'questionName', operationQuestionIndex + 'operation', operationQuestionIndex)} key={questionIndex} extra={genExtra(operationQuestion, questionIndex)} key={operationQuestionIndex + 'question' + questionIndex}>
                {questionItem.optionList && questionItem.optionList.length > 0 ? questionItem.optionList.map((optionItem: any, optionIndex: number) => {
                  return <div style={{ borderBottom: "1px dashed #dcdfe6", display: "flex", alignItems: 'center' }} key={operationQuestionIndex + 'question' + questionIndex + 'option' + optionIndex}>
                    {editNode(optionItem, optionIndex, 'name', operationQuestionIndex + "operation" + questionIndex, operationQuestionIndex, questionItem)}
                    {/* <Button type="text" icon={<CloseCircleFilled style={{ color: '#b4bbd1' }} />} onClick={() => {
                      questionItem.optionList.splice(optionIndex, 1)
                      setOperationQuestions([...operationQuestions])
                    }} ></Button> */}
                  </div>
                })
                  : ''}
              </Panel>
            })}
          </Collapse>
        </div>
      })}
    </Drawer>
  );
};

export default OperateQuestions;
