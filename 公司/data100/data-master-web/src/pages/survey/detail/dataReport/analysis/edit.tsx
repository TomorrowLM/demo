import { Input, Row, Col, message, Button, Table, Popover, Empty, Spin, Modal, Drawer, Tooltip } from 'antd';
import { PlusOutlined, LeftOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Link, history, useAccess, Access } from 'umi';
import { useInterval, useDebounceFn, useLockFn } from 'ahooks';
import React, { useState, useEffect, useRef } from 'react';
import CreateModal from "@/components/CreateModal"
import TransferCheckbox from "@/components/TransferCheckbox"
import styles from "./index.less"
import { crossAnalysisOne, crossAnalysisTwo, saveCrossAnalysisOne, saveCrossAnalysisTwo, showCrossAnalysis, approeDeliver, revokeDeliver, crossAnalysisTwoTime, crossAnalysisOneTime, crossAnalysisForQueue } from './service';
import { questionInfo, } from "../../clean/service"
import { analysisMethodsEnum } from "./const.d"
import { formatListToOptions, uniKey } from '@/utils/utils'
import { SpanRect, deliverRuleItem, asyncData } from "./data.d"
import Select from 'antd/es/select';
import ApproveStep from "@/pages/survey/detail/report/detail/approveStep/approveStep"
import AnalysisMethods from "./analysisMethods"
import OperateQuestions from "./operateQuestions"
import OperationLog, { LogType } from "@/components/button/OperationLog";
import permissionConfig from "../../../../../../config/permissionConfig";
import { BaseTable } from 'ali-react-table'

const { confirm } = Modal;
interface EditProps {
  visible: Boolean,
  type: string,//1:数据报告   2：自定义分析
  drawerOk: () => void,//确认添加
  drawerCancel: () => void,//取消
  onClose: (isRefresh?: boolean) => void,
  edit_id: string,
  dataListLegnth: number,
  state: string,
  deliverRule: Array<deliverRuleItem>,
  deliverReportId: number,
  // surveyGroup:string
}
var dataLists: any = []
const Index: React.FC<EditProps> = (props) => {
  const rectMap = new Map<string, SpanRect>()
  const setSpanRect = (dataSource: any) => {//计算虚拟滚动单元格的合并
    let lastTop = 0
    // console.log(dataSource)
    dataSource.forEach((d: any, index: number) => {
      if (index === 0) {
        rectMap.set(d.qname, {
          left: 0,
          right: 1,
          top: lastTop,
          bottom: lastTop + Number(d.optionNumber),
        })
        lastTop += Number(d.optionNumber)
      } else {
        if (d.qtitle + d.subQuestionCode != dataSource[index - 1].qtitle + dataSource[index - 1].subQuestionCode) {
          rectMap.set(d.qname, {
            left: 0,
            right: 1,
            top: lastTop,
            bottom: lastTop + Number(d.optionNumber),
          })
          lastTop += Number(d.optionNumber)
        }
      }
    })
  }

  const defaultColumnData = [
    {
      name: "",
      code: "qname",
      width: 0,
      align: 'center',
      // fixed: "left",
      lock: true,
      // getCellProps: (text: any, record: any, index: number) => {
      //   console.log(text, record, index)
      //   return {
      //     rowSpan: record.optionNumber,
      //   }
      // },
      getSpanRect: (value: any,) => {
        // console.log(rectMap.get(value))
        return rectMap.get(value)
      }
    },
    {
      name: "",
      align: 'center',
      lock: true,
      code: "optionName",
      width: 0,
      // fixed: "left",
      // render: (text: any, record: any, index: number) => {
      //   return record.isEdit && record.isEdit === 1 ? beforeEditNameNode(text, index, 'y_option') : record.isEdit === 2 + 'y_option' ? editNameNode(text, index, 'y_option') : text
      // }
    },
    {
      width: 30,
      name: <div style={{ textAlign: "center" }}> <Button type="text" icon={<PlusCircleOutlined />} onClick={() => {
        addQustion('x2', questionx, questionLists)
      }}>添加题目</Button></div>,
      code: "x2",
      align: 'center',
      render: () => {
        if (questionx.length === 0 && questiony.length === 0) {
          return <div style={{ padding: "100px 0" }}><Empty description='请选择题目' image={require("@/assets/empty@2x.png")} /></div>
        }
      },
      children: []
    },
  ]

  const { onClose, edit_id, type, dataListLegnth, deliverRule, deliverReportId } = props;
  // type:1数据报告  2：自定义分析
  const analysisMethodsRef = useRef();
  const operateQuestionsRef = useRef();
  const inputRef = useRef<Input>(null);
  const access = useAccess()
  const [showLogModule, setShowLogModule] = useState(false)
  const logPermission = useAccess().canPermissions(permissionConfig.dataReport.permissionLog)
  const [editId, setEditId] = useState<string>(edit_id)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [surveyGroup, setSurveyGroup] = useState<string>(history.location.query.surveyGroup)
  const [columnData, setColumnData] = useState<any>(defaultColumnData)
  const [approvalUser, setApprovalUser] = useState<Array<any>>([])
  const [dataList, setDataList] = useState<Array<any>>([])
  const [questionList, setQuestionList] = useState<any>([])
  const [questionLists, setQuestionLists] = useState<any>([])
  const [allDisabled, setAllDisabled] = useState<boolean>(false)
  const [checkedLists, setCheckedLists] = useState<any>([]) //选中的题
  const [questiony, setQuestiony] = useState<any>([]) //Y轴题
  const [questionx, setQuestionx] = useState<any>([]) //Y轴题
  const [interval, setInterval] = useState<any>(null);
  const [showReBackDialog, setShowReBackDialog] = useState(false)
  const [intervalNumber, setIntervalNumber] = useState<number>(0);
  const [questionIsEdit, setQuestionIsEdit] = useState<boolean>(false)
  const [spinning, setSpinning] = useState<boolean>(false)
  const [position, setPosition] = useState<string>('') // x y
  const [reportName, setReportName] = useState<string>('') // x y
  const [totalShow, setTotalShow] = useState('0') //0:展示总数 1：隐藏总数
  const [state, setState] = useState<string>(props.state + '')//交付状态 1：未交付  2：审批中  3：已交付  4：交付驳回  5：交付撤销
  const [selectValue, setSelectValue] = useState<Array<string>>(['1', '2', '3'])
  const [reportState, setReportState] = useState<string>() // 报告生成状态 1 未生成 2 生成中 3 生成完毕
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false) //添加分析方法
  const [rules, setRules] = useState<any>({ useRule: '0', npsRule: null, meanRule: null, top3Rule: null, top2Rule: null, bottom3Rule: null, bottom2Rule: null })//分析方法
  const [ruleGroupId, setRuleGroupId] = useState<number>()//清洗组id

  const [operationVisible, setOperationVisible] = useState<boolean>(false) //批量操作
  const [operationQuestion, setOperationQuestion] = useState<any>([]) //操作的题
  const getQuestionList = async () => {
    const { code, data } = await questionInfo({
      groupId: history.location.query.surveyGroup,
      qtype: "",
      optionFlag: '0'//0 需要 1不需要
    })
    if (code == 200) {
      setQuestionList(formatListToOptions(data, "questionName", "title", "subQuestionCode"))
      setQuestionLists(formatListToOptions(data, "questionName", "title", "subQuestionCode"))
    }
  }


  const addQustion = (type: string, questionx: any, questionLists: Array<any>) => {
    console.log(type, questionx, questionLists)
    debugger;
    if (type === 'y') {
      formatQuestionLists(questiony, 'y', questionLists)
    } else {
      formatQuestionLists(questionx, 'x', questionLists)
    }
    setModalVisible(true)
    setPosition(type)
  }

  const getShowCrossAnalysis = async (editId: string, fn?: any) => {
    const { code, data } = await showCrossAnalysis({
      id: editId,
      totalShow: totalShow
    })
    if (code === 200) {
      setState(data.state + '')
      setReportState(data.reportState)
      if (fn) {//重新渲染列表
        fn(data.state + '')
      }
      if (data.approvalUser) {
        setApprovalUser([data.applyUser, ...data.approvalUser])
      }
    }
  }



  useEffect(() => {
    questionxTocolumnData(questionx, questiony, dataList)
  }, [selectValue])

  const formatQuestionLists = (question: any, type: string, questionLists: any) => {
    debugger;
    if (questionLists.length > 0) {
      let questionAll: any = []
      if (type === 'x') {
        if (question.length > 0) {
          if (question[0]['optionList'][0]['question'] && question[0]['optionList'][0]['question'] != null && question[0]['optionList'][0]['question'].length > 0) {//两层
            questionAll = [question[0], ...question[0]['optionList'][0]['question']]
          } else {
            questionAll = question
          }
        }
      } else {
        questionAll = question
      }

      let disabledNum = 0
      questionLists.forEach((item: any, index: number) => {
        item.disabled = false;
        [...questionAll].forEach((questionItem: any, questionIndex: number) => {
          if (item.value == questionItem.title + '-' + questionItem.subQuestionCode) {
            item.disabled = true
            disabledNum += 1
          }
        })
      })
      setAllDisabled(disabledNum === questionLists.length)
      setQuestionLists([...questionLists])
      console.log(questionLists, question, type)
    }
  }
  const columnDataRnder0 = (text: any, record: any, index: number, questionx: any, questiony: any, asyncData: asyncData,) => {
    return text
    // 1.3版本之前的重命名和删除功能  不要删除此代码
    // if (['2', '3'].includes(asyncData.state)) {
    //   return text
    // } else {
    //   if (record.isEdit && record.isEdit === 1) {
    //     return beforeEditNameNode(asyncData, questionx, questiony, text, index, 'y_question')
    //   } else if (record.isEdit && record.isEdit === 2 + 'y_question') {
    //     return editNameNode(asyncData, questionx, questiony, text, index, 'y_question')
    //   } else {
    //     return operationButton(asyncData, questionx, questiony, text, index, 'y')
    //   }
    // }
  }
  const columnDataRnder1 = (text: any, record: any, index: number, questionx: any, questiony: any, asyncData: asyncData) => {
    return text
    // 1.3版本之前的重命名和删除功能  不要删除此代码
    // return record.isEdit && record.isEdit === 1 && !(index > 0 && record.qid + record.subQuestionCode !== dataLists[index - 1].qid + dataLists[index - 1].subQuestionCode) && !Object.values(analysisMethodsEnum).includes(record.optionName)&&record.optionName!=='总数' ? beforeEditNameNode(asyncData, questionx, questiony, text, index, 'y_option') : record.isEdit === 2 + 'y_option' ?
    //   editNameNode(asyncData, questionx, questiony, text, index, 'y_option') : text
  }
  const questionxTocolumnData = (questionx: any, questiony: any, dataList: any, asyncDatas?: asyncData,) => {

    let asyncData: asyncData
    if (!asyncDatas) {
      asyncData = {
        ruleGroupId,
        reportName,
        state,
        questionLists,
      }
    } else {
      asyncData = { ...asyncDatas, questionLists: asyncDatas.questionLists ? asyncDatas.questionLists : questionLists }
    }
    if (questiony.length > 0) {
      setSpanRect(dataList)
      columnData[0].getSpanRect = (value: any,) => {
        return rectMap.get(value)
      }
    }

    if (questionx.length === 0) {
      setColumnData([{
        name: "",
        code: "qname",
        width: 0,
        align: 'center',
        lock: true,
        getSpanRect: (value: any,) => {
          return rectMap.get(value)
        }
      },
      {
        name: "",
        align: 'center',
        lock: true,
        code: "optionName",
        width: 0,
      },
      {
        width: 30,
        name: <div style={{ textAlign: "center" }}> <Button type="text" icon={<PlusCircleOutlined />} onClick={() => {
          addQustion('x2', questionx, asyncData['questionLists'])
        }}>添加题目</Button></div>,
        code: "x2",
        align: 'center',
        render: () => {
          return <div style={{ padding: "100px 0" }}><Empty description='请选择题目' image={require("@/assets/empty@2x.png")} /></div>
        },
        children: []
      },])
      if (questiony.length === 0) {
        setDataList([{ optionName: '', qname: '' }])
        dataLists = [{ optionName: '', qname: '' }]
        // columnData[0].width = 0
        // columnData[1].width = 0
        // columnData[2].name = <div style={{ textAlign: "center" }}> <Button type="text" icon={<PlusCircleOutlined />} onClick={() => {
        //   addQustion('x2')
        // }}>添加题目</Button></div>,
        //   columnData[2].children = []
        // columnData[2].render = () => {
        //   return <div style={{ padding: "100px 0" }}><Empty description='请选择题目' image={require("@/assets/empty@2x.png")} /></div>
        // },

      } else {
        if (selectValue.includes('2') && selectValue.includes('3')) {
          columnData[2].children = [
            {
              name: "数量",
              code: "number",
              align: 'center',
              width: 60,
            },
            {
              name: "百分比",
              align: 'center',
              code: "percent",
              width: 60,
            },
          ]
        } else if (selectValue.includes('2') && !selectValue.includes('3')) {
          columnData[2].children = [
            {
              name: "数量",
              align: 'center',
              code: "number",
              width: 60,
            },
          ]
        } else if (!selectValue.includes('2') && selectValue.includes('3')) {
          columnData[2].children = [
            {
              name: "百分比",
              align: 'center',
              code: "percent",
              width: 60,
            },
          ]
        } else {
          columnData[2].children = []
        }
        columnData[0].width = 80
        columnData[1].width = 100
        columnData[0]['render'] = (text: any, record: any, index: number) => columnDataRnder0(text, record, index, questionx, questiony, asyncData)
        columnData[1]['render'] = (text: any, record: any, index: number) => columnDataRnder1(text, record, index, questionx, questiony, asyncData)
        setColumnData([...columnData])
      }

    } else if (questionx[0]['optionList'] && questionx[0]['optionList'].length > 0) {
      columnData[0].width = 80
      columnData[1].width = 100
      if (questionx[0]['optionList'][0]['question'] && questionx[0]['optionList'][0]['question'].length > 0) {//两层
        let question1_children: any = []
        let question1_optionList: Array<any> = questionx[0]['optionList']
        question1_optionList.forEach((option1: any, option1Index: number) => {
          let option1_children: any = []
          option1['question'].forEach((question2: any, question2Index: number) => {

            let question2_children: any = []
            question2['optionList'].forEach((option2: any, option2Index: number) => {
              let option2_children: any = []
              const { colList } = option2
              colList.forEach((col: any, colIndex: number) => {

                if (col['dataIndex'].indexOf('number') > -1) {//数量
                  if (selectValue.includes('2')) {
                    option2_children.push(
                      { name: col.name, code: col.dataIndex, width: 60, align: 'center', hideInTable: !selectValue.includes('2') }
                    )
                  }
                }
                if (col['dataIndex'].indexOf('percent') > -1) {//
                  if (selectValue.includes('3')) {
                    option2_children.push(
                      { name: col.name, code: col.dataIndex, width: 60, align: 'center', hideInTable: !selectValue.includes('3') }
                    )
                  }
                }
              })
              question2_children.push({
                width: 120,
                align: 'center',
                name: option2.name,
                // name: option2.isEdit ? option2.isEdit === 1 ? beforeEditNameNode(asyncData, questionx, questiony, option2['name'], question2Index, 'x2', option2Index) : editNameNode(asyncData, questionx, questiony, option2['name'], question2Index, 'x2', option2Index) : option2.name,
                code: `${questionx[0]['qid']}_${questionx[0]['subQuestionCode']}_${option1.code}&${question2.qid}_${question2.subQuestionCode}_${option2.code}`,
                children: option2_children
              })
            })
            if (selectValue.includes('1')) {
              question2_children.unshift({
                width: 120,
                name: "总数",
                align: 'center',
                code: `${questionx[0]['qid']}_${questionx[0]['subQuestionCode']}_${option1.code}&${question2.qid}_${question2.subQuestionCode}_total`,
                children: function () {
                  if (selectValue.includes('2') && selectValue.includes('3')) {
                    return [{
                      name: "数量",
                      width: 60,
                      align: 'center',
                      code: `${questionx[0]['qid']}_${questionx[0]['subQuestionCode']}_${option1.code}&${question2.qid}_${question2.subQuestionCode}_total&number`,
                    },
                    {
                      name: "百分比",
                      width: 60,
                      align: 'center',
                      code: `${questionx[0]['qid']}_${questionx[0]['subQuestionCode']}_${option1.code}&${question2.qid}_${question2.subQuestionCode}_total&percent`,
                    }]
                  } else if (selectValue.includes('2') && !selectValue.includes('3')) {
                    return [{
                      name: "数量",
                      width: 60,
                      align: 'center',
                      code: `${questionx[0]['qid']}_${questionx[0]['subQuestionCode']}_${option1.code}&${question2.qid}_${question2.subQuestionCode}_total&number`,
                    }]
                  } else if (!selectValue.includes('2') && selectValue.includes('3')) {
                    return [{
                      name: "百分比",
                      width: 60,
                      align: 'center',
                      code: `${questionx[0]['qid']}_${questionx[0]['subQuestionCode']}_${option1.code}&${question2.qid}_${question2.subQuestionCode}_total&percent`,
                    }]
                  } else {
                    return []
                  }
                }()
              })

            }
            //
            option1_children.push({
              align: 'center',
              name:question2['questionName'],
              // name: question2['isEdit'] ? question2['isEdit'] === 1 ? beforeEditNameNode(asyncData, questionx, questiony, question2['questionName'], question2Index, 'x2') : editNameNode(asyncData, questionx, questiony, question2['questionName'], question2Index, 'x2') : operationButton(asyncData, questionx, questiony, question2['questionName'], question2Index, 'x2'),
              code: `${questionx[0]['qid']}_${questionx[0]['subQuestionCode']}_${option1.code}&${question2.qid}_${question2.subQuestionCode}`,
              children: question2_children
            })
          })
          //
          question1_children.push({
            align: 'center',
            name:option1.name,
            // name: option1.isEdit ? option1.isEdit === 1 ? beforeEditNameNode(asyncData, questionx, questiony, option1['name'], 0, 'x1', option1Index) : editNameNode(asyncData, questionx, questiony, option1['name'], 0, 'x1', option1Index) : option1.name,
            code: `${questionx[0]['qid']}_${questionx[0]['subQuestionCode']}_${option1.code}`,
            children: option1_children
          })
        })
        columnData[2] = { //questionx[0]
          // width: 120,
          align: 'center',
          name: questionx[0]['questionName'],
          // name: questionx[0]['isEdit'] ? questionx[0]['isEdit'] === 1 ? beforeEditNameNode(asyncData, questionx, questiony, questionx[0]['questionName'], 0, 'x1') : editNameNode(asyncData, questionx, questiony, questionx[0]['questionName'], 0, 'x1') : operationButton(asyncData, questionx, questiony, questionx[0]['questionName'], 0, 'x1'),
          code: 'x1',
          children: question1_children
        }
        columnData[3] = {
          width: 30,
          lock: true,
          align: 'right',
          name: addButtonX('x2', asyncData.state, questionx, asyncData['questionLists']),
          code: "addButtonX",
          render: () => {
            return ''
          }
        }
      } else if (questionx[0]['optionList'][0]['colList']) {//一层
        columnData[0].width = 80
        columnData[1].width = 100
        // debugger;
        let questionx_children: any = []
        questionx.forEach((question: any, questionIndex: number) => {
          let question_children: any = []
          question.optionList.forEach((option: any, optionIndex: number) => {
            let option_children: any = []
            option.colList.forEach((col: any, colIndex: number) => {
              if (col['dataIndex'].indexOf('number') > -1) {//数量
                if (selectValue.includes('2')) {
                  option_children.push(
                    { name: col.name, code: col.dataIndex, width: 60, align: 'center', hideInTable: !selectValue.includes('2') }
                  )
                }

              }
              if (col['dataIndex'].indexOf('percent') > -1) {//百分比
                if (selectValue.includes('3')) {
                  option_children.push(
                    { name: col.name, code: col.dataIndex, width: 60, align: 'center', hideInTable: !selectValue.includes('3') }
                  )
                }
              }
            })
            question_children.push({
              width: 120,
              align: 'center',
              name:option.name,
              // name: option.isEdit ? option.isEdit === 1 ? beforeEditNameNode(asyncData, questionx, questiony, option['name'], questionIndex, 'x2', optionIndex) : editNameNode(asyncData, questionx, questiony, option['name'], questionIndex, 'x2', optionIndex) : option.name,
              code: `${question.qid}_${question.subQuestionCode}_${option.code}`,
              children: option_children
            })
          })
          if (selectValue.includes('1')) {
            question_children.unshift({
              width: 120,
              name: "总数",
              align: 'center',
              code: `${question.qid}_${question.subQuestionCode}_total`,
              hideInTable: !selectValue.includes('1'),
              children: function () {
                if (selectValue.includes('2') && selectValue.includes('3')) {
                  return [{
                    name: "数量",
                    width: 60,
                    align: 'center',
                    code: `${question.qid}_${question.subQuestionCode}_total&number`,
                  },
                  {
                    name: "百分比",
                    width: 60,
                    align: 'center',
                    code: `${question.qid}_${question.subQuestionCode}_total&percent`,
                  }]
                } else if (selectValue.includes('2') && !selectValue.includes('3')) {
                  return [{
                    name: "数量",
                    width: 60,
                    align: 'center',
                    code: `${question.qid}_${question.subQuestionCode}_total&number`,
                  }]
                } else if (!selectValue.includes('2') && selectValue.includes('3')) {
                  return [{
                    name: "百分比",
                    width: 60,
                    align: 'center',
                    code: `${question.qid}_${question.subQuestionCode}_total&percent`,
                  }]
                } else {
                  return []
                }
              }()
            })
          }
          questionx_children.push({
            width: 120,
            align: 'center',
            name:question['questionName'],
            // name: question['isEdit'] ? question['isEdit'] === 1 ? beforeEditNameNode(asyncData, questionx, questiony, question['questionName'], questionIndex, 'x2') : editNameNode(asyncData, questionx, questiony, question['questionName'], questionIndex, 'x2') : operationButton(asyncData, questionx, questiony, question.questionName, questionIndex, 'x2'),
            code: `${question.qid}_${question.subQuestionCode}`,
            children: question_children
          })
        })
        columnData[2].children = questionx_children
        columnData[2]['name'] = addButtonXX('x1', asyncData.state,questionx, asyncData['questionLists'])
        columnData[3] = {
          width: 30,
          lock: true,
          align: 'right',
          name: addButtonX('x2', asyncData.state, questionx, asyncData['questionLists']),
          code: "addButtonX",
          // className: styles.td_border,
          render: () => {
            return ''
          }
        }
      }
      columnData[0]['render'] = (text: any, record: any, index: number) => columnDataRnder0(text, record, index, questionx, questiony, asyncData)
      columnData[1]['render'] = (text: any, record: any, index: number) => columnDataRnder1(text, record, index, questionx, questiony, asyncData)
      setColumnData([...columnData])
    }
  }
  const confirmModal = () => {
    return confirm({
      title: <h3 >温馨提示</h3>,
      icon: "",
      content: <div >
        <p>本次结果生成时间预计超过30秒，是否继续等待？</p>
        <span style={{ color: 'red', fontSize: "12px" }}>*点击【返回列表】后，可在计算完成后重新进入查看结果</span>
      </div>,
      okText: '返回列表',
      cancelText: '继续等待',
      onOk: async () => {
        onClose(true)
      },
      onCancel: () => {
        //定时器2s调用一次接口
        setInterval(3000);
        setSpinning(true)
      }
    })
  }

  useInterval(() => {
    let i = intervalNumber + 1
    setIntervalNumber(i)
    if (i === 10) {
      setIntervalNumber(0)
      setInterval(null);
      setSpinning(false)
      onClose(true)
    }
    showCrossAnalysis({
      id: editId,
      totalShow: totalShow
    }).then(({ code, data }) => {
      if (code === 200) {
        if (data.reportState === '3') {
          if (data.info.answerList.length === 0) {
            setDataList([{ optionName: '', qname: '' }])
            dataLists = [{ optionName: '', qname: '' }]
          } else {
            dataLists = data.info.answerList
            setDataList(data.info.answerList)
            setSpanRect(data.info.answerList)
          }

          setSpinning(false)
          setReportState(data.reportState)
          setInterval(null);
        } else {
          setInterval(3000);
        }
      }
    })
  }
    , interval, { immediate: false })
  const crossAnalysisTime = (questionx: any, questiony: any, newRules: any, fn: any) => {
    let reqParams = {
      id: editId,
      groupId: surveyGroup,
      questionx: questionx,
      questiony: questiony,
      totalShow: totalShow,
      type: type,//1数据分析  2：自定义分析
      crossAnalysisRule: newRules
    }
    let crossAnalysisTimeMethods: any
    if (questionx.length > 0) {
      if (questionx[0]['optionList'][0]['question'] && questionx[0]['optionList'][0]['question'] != null && questionx[0]['optionList'][0]['question'].length > 0) {//两层
        crossAnalysisTimeMethods = crossAnalysisTwoTime
      } else if (questionx[0]['optionList'][0]['colList']) {
        crossAnalysisTimeMethods = crossAnalysisOneTime
      }
    } else {
      crossAnalysisTimeMethods = crossAnalysisOneTime
    }
    crossAnalysisTimeMethods(reqParams).then((res: any) => {
      if (res.data === 0) {//0弹框提示
        crossAnalysisForQueue(reqParams).then(res => {
          if (res.code === 200) {
            confirmModal()
          }
        })

      } else {//直接计算报告
        fn()
      }
    })
  }
  const crossAnalysisMethods = (questionx: any, questiony: any, newRules: any, id: string) => {
    let params = {
      groupId: surveyGroup,
      id: id,
      questionx: questionx,
      questiony: questiony,
      totalShow: totalShow,
      type: type,//1数据分析  2：自定义分析
      crossAnalysisRule: newRules
    }
    let reqMethods: any
    if (questiony.length > 0) {
      if (questionx.length > 0) {
        if (questionx[0]['optionList'][0]['question'] && questionx[0]['optionList'][0]['question'] != null && questionx[0]['optionList'][0]['question'].length > 0) {//两层
          reqMethods = crossAnalysisTwo
        } else if (questionx[0]['optionList'][0]['colList']) {//一层
          reqMethods = crossAnalysisOne
        }
      } else if (questionx.length === 0) {
        reqMethods = crossAnalysisOne
      }
      crossAnalysisTime(questionx, questiony, newRules, () => {
        reqMethods(params).then((res: any) => {
          dataLists = res.data.answerList
          setDataList(res.data.answerList)
          setSpanRect(res.data.answerList)
          getShowCrossAnalysis(id)
        })
      })
    } else {//x y数据均为空
      if (questionx.length === 0) {
        setDataList([{ optionName: '', qname: '' }])
        dataLists = [{ optionName: '', qname: '' }]
      }
    }
  }

  const getDataLists = (questionx: any, questiony: any, newRules: any, isSave: boolean, asyncData?: asyncData) => {
    const saveReqRule: any = newRules ? { ...newRules } : { ...rules }
    saveReport(saveReqRule, questionx, questiony, asyncData)
  }

  const saveReportDebounce = useDebounceFn((rules: any, questionx: any, questiony: any) => {
    saveReport(rules, questionx, questiony)
  }, {
    wait: 1000,
  })

  useEffect(() => {
    if (editId !== '') {
      Promise.all([
        questionInfo({
          groupId: history.location.query.surveyGroup,
          qtype: "",
          optionFlag: '0'//0 需要 1不需要
        }),
        showCrossAnalysis({
          id: editId,
          totalShow: totalShow
        })
      ]).then(([res, { data }]) => {
        let newRules = { useRule: '0', npsRule: null, meanRule: null, top3Rule: null, top2Rule: null, bottom3Rule: null, bottom2Rule: null }
        if (data.info.crossAnalysisRule) {
          newRules = data.info.crossAnalysisRule
          setRules({ ...newRules })
        }
        let questionLists_format = formatListToOptions(res.data, "questionName", "title", "subQuestionCode")
        setQuestionList(questionLists_format)
        setQuestionLists(questionLists_format)
        setQuestiony(data.info.questiony)
        setQuestionx(data.info.questionx)
        setReportState(data.reportState)
        setReportName(data.name)
        setRuleGroupId(Number(data.ruleGroupId))
        setState(data.state + '')
        if (data.info.answerList) {
          if (data.info.answerList.length > 0) {
            dataLists = data.info.answerList
            setDataList(data.info.answerList)
          } else {
            dataLists = [{ optionName: '', qname: '' }]
            setDataList([{ optionName: '', qname: '' }])
          }

          questionxTocolumnData(data.info.questionx, data.info.questiony, data.info.answerList, { state: data.state + '', reportName: data.name, ruleGroupId: Number(data.ruleGroupId), questionLists: questionLists_format })
        } else {
          questionxTocolumnData(data.info.questionx, data.info.questiony, [], { state: data.state + '', reportName: data.name, ruleGroupId: Number(data.ruleGroupId), questionLists: questionLists_format })
        }

        if (data.approvalUser) {
          setApprovalUser([data.applyUser, ...data.approvalUser])
        }
      })
    } else {
      getQuestionList()
      setReportName('新建数据报告' + (dataListLegnth + 1))
      if (type == '1') {
        setRuleGroupId(deliverRule[0].ruleGroupId)
      } else {
        setRuleGroupId(deliverReportId)
      }
      setDataList([{ optionName: '', qname: '' }])
      dataLists = [{ optionName: '', qname: '' }]
    }
  }, [])

  // 删除按钮
  const delData = (asyncData: asyncData, questionx: any, questiony: any, index: number, operationType: string) => {
    debugger;
    if (operationType == 'x1') {//删除第一层数据 第一层只有一道题 内层数据结构需要改变 如dataIndex的值
      formateCheckedList(questionx[0]['optionList'][0]['question'])
      setQuestionx([...questionx[0]['optionList'][0]['question']])
      getDataLists(questionx[0]['optionList'][0]['question'], questiony, rules, true, asyncData)
    } else if (operationType === 'x2') {//删除第二层
      if (questionx[0]['optionList'][0]['colList']) {//只有第二层有数据  第一层无数据
        if (questionx.length > 1) {

        } else {//只有一条数据
          columnData[2]['name'] = addButtonXX('x2', asyncData.state,questionx, asyncData['questionLists'])//需改正
          columnData[2]['children'] = []
          columnData[0]['render'] = (text: any, record: any, index: number) => columnDataRnder0(text, record, index, questionx, questiony, asyncData)
          columnData[1]['render'] = (text: any, record: any, index: number) => columnDataRnder1(text, record, index, questionx, questiony, asyncData)
          setColumnData([...columnData])
        }
        questionx.splice(index, 1)
      } else if (questionx[0]['optionList'][0]['question']) {//有两层数据

        if (questionx[0]['optionList'][0]['question'].length > 1) {
          questionx[0]['optionList'].forEach((option1: any, option1Index: number) => {
            option1['question'].splice(index, 1)
            // columnData[2]['children']['children'].splice(index,1)
          })

        } else {//第一层数据变为第二层 并且结构要改变
          questionx[0]['optionList'].forEach((option1: any, option1Index: number) => {
            delete option1.question
            option1.colList = [
              { name: "数量", dataIndex: `${questionx[0].qid}_${questionx[0].subQuestionCode}_${option1.code}&number` },
              { name: "百分比", dataIndex: `${questionx[0].qid}_${questionx[0].subQuestionCode}_${option1.code}&percent` },
            ]
          })

        }
      }
      getDataLists(questionx, questiony, rules, true, asyncData)
      setQuestionx([...questionx])
    } else if (operationType === 'y') {//删除
      questiony.forEach((questionyItem: any, questionyIndex: number) => {
        if (dataLists[index]['qtitle'] + '-' + dataLists[index]['subQuestionCode'] === questionyItem.value) {
          questiony.splice(questionyIndex, 1)
        }
      })

      if (questiony.length === 0) {
        setColumnData([...defaultColumnData])
        setDataList([{ x2: '', qname: '' }])
        dataLists = [{ x2: '', qname: '' }]
      }
      Object.keys(analysisMethodsEnum).forEach((key: string) => {
        if (rules[key] && rules[key].length > 0) {
          rules[key].forEach((rule_question: any, ruleIndex: number) => {
            if (questiony.filter((question: any) => question.value === rule_question.value).length === 0) {
              rules[key].splice(ruleIndex, 1)
            }
          })
        }
      })
      getDataLists(questionx, questiony, rules, true, asyncData)
      setRules({ ...rules })
      // y轴数据删除  分析方法中已添加的题对应也删除
      setQuestiony([...questiony])
    }

  }

  const checkedListsToDataList = (checkedLists: any) => {
    let newDataLists: any = []
    var i = 0
    checkedLists.forEach((item: any, index: any) => {
      let newDataList = {}
      item.optionList.forEach((option: any, optionIndex: number) => {
        newDataList = {
          id: uniKey() + i++,
          qid: item.qid,
          qname: item.questionName,
          subQuestionCode: item.subQuestionCode,
          qtitle: item.title,
          optionName: option.name,
          optionNumber: totalShow == '0' ? item.optionList.length + 1 : item.optionList.length,//此计算方式是未添加分析方法，尚需完善，目前不影响功能
          [`${item.qid}_${item.subQuestionCode}_${option.code}`]: '',
        }
        newDataLists.push(newDataList)
      })
      if (totalShow == '0') {//0:展示总是  1：隐藏
        newDataLists.push({
          id: i++,
          qid: item.qid,
          qname: item.questionName,
          qtitle: item.title,
          subQuestionCode: item.subQuestionCode,
          optionName: "总数",
          optionNumber: totalShow == '0' ? item.optionList.length + 1 : item.optionList.length,
          [`${item.qid}_${item.subQuestionCode}`]: '',
        })
      }
    })
    return newDataLists
  }
  const formateCheckedList = (checkedLists: any) => {
    checkedLists.forEach((question: any, questionIndex: number) => {
      question['optionList'].forEach((option: any, optionIndex: number) => {
        option.colList = [
          { name: "数量", dataIndex: `${question.qid}_${question.subQuestionCode}_${option.code}&number` },
          { name: "百分比", dataIndex: `${question.qid}_${question.subQuestionCode}_${option.code}&percent` },
        ]
      })
    })
  }
  const modalHandOk = () => {
    // console.log(position, questionx, checkedLists)
    setModalVisible(false)
    if (position === 'x1') {//添加第一层
      checkedLists[0]['optionList'].forEach((option1: any, option1Index: number) => {
        option1['question'] = JSON.parse(JSON.stringify(questionx))//多次用到questionx
        option1['question'].forEach((question2: any, question2Index: number) => {
          var colList = []
          question2['optionList'].forEach((option2: any, option2Index: number) => {
            colList = [
              { name: "数量", dataIndex: `${checkedLists[0].qid}_${checkedLists[0].subQuestionCode}_${option1.code}&${question2.qid}_${question2.subQuestionCode}_${option2.code}&number` },
              { name: "百分比", dataIndex: `${checkedLists[0].qid}_${checkedLists[0].subQuestionCode}_${option1.code}&${question2.qid}_${question2.subQuestionCode}_${option2.code}&percent` },
            ]
            option2.colList = [...colList]
          })
        })
      })
      setQuestionx([...checkedLists])
      getDataLists(checkedLists, questiony, rules, true)
    } else if (position === 'x2') {//添加第二层
      if (questionx.length === 0) {
        // console.log(checkedLists)
        formateCheckedList(checkedLists)
        questionx.push(...checkedLists)
      } else {
        if (questionx[0]['optionList'][0]['question']) {//两层 添加x2
          questionx[0]['optionList'].forEach((option1: any, option1Index: number) => {
            option1['question'].push(...JSON.parse(JSON.stringify(checkedLists)))//多次用到checkedLists  所以需要深克隆
            option1['question'].forEach((question2: any, question2Index: number) => {
              if (question2Index >= option1['question'].length - checkedLists.length) {//只需要执行新加入的数据
                question2['optionList'].forEach((option2: any, option2Index: number) => {
                  var colList = []
                  colList = [
                    { name: "数量", dataIndex: `${questionx[0].qid}_${questionx[0].subQuestionCode}_${option1.code}&${question2.qid}_${question2.subQuestionCode}_${option2.code}&number` },
                    { name: "百分比", dataIndex: `${questionx[0].qid}_${questionx[0].subQuestionCode}_${option1.code}&${question2.qid}_${question2.subQuestionCode}_${option2.code}&percent` },
                  ]
                  option2.colList = [...colList]
                })
              }
            })
          })
        } else if (questionx[0]['optionList'][0]['colList']) {//只一层 添加x2
          formateCheckedList(checkedLists)
          questionx.push(...checkedLists)
        }
      }
      setQuestionx([...questionx])
      getDataLists(questionx, questiony, rules, true)
    } else {
      const newcheckedLists = JSON.parse(JSON.stringify(checkedLists))
      questiony.push(...newcheckedLists)
      debugger;
      // var newQuestiony = JSON.parse(JSON.stringify(questiony))
      dataLists.push(...checkedListsToDataList(JSON.parse(JSON.stringify(checkedLists))))
      setQuestiony([...questiony])
      getDataLists(questionx, questiony, rules, true)
    }
    setCheckedLists([])
  }

  const beforeEdit = (asyncData: asyncData, questionx: any, questiony: any, name: string, index: number, operationType: string, isEdit: number, optionIndex?: number) => {//点击重命名   变为带编辑按钮的 //optionIndex：没有传值 待变改变的是选项
    setQuestionIsEdit(true)
    if (operationType === "x1") {//isEdit 1:点击重命名之后展示的状态  2：点击编辑按钮展示的状态  点击确定或者取消按钮  则删除isEdit 属性
      if (optionIndex == undefined) {
        questionx[0].isEdit = isEdit
      }
      if (optionIndex != undefined) {
        questionx[0]['optionList'][optionIndex].isEdit = isEdit
      } else {
        questionx[0]['optionList'].forEach((option: any,) => {
          option.isEdit = isEdit
        })
      }
      questionxTocolumnData(questionx, questiony, dataList, asyncData)
      setQuestionx([...questionx])
    } else if (operationType === "x2") {
      if (questionx[0]['optionList'][0]['question']) {//两层数据
        questionx[0]['optionList'].forEach((option1: any,) => {
          if (optionIndex == undefined) {
            option1['question'][index].isEdit = isEdit
          }
          if (optionIndex != undefined) {//修改选项
            option1['question'][index]['optionList'][optionIndex]['isEdit'] = isEdit
          } else {//点击重命名 选项的状态也需要改变
            if (isEdit === 1) {
              option1['question'][index]['optionList'].forEach((option2: any,) => {
                option2.isEdit = isEdit
              })
            }

          }
        })
      } else if (questionx[0]['optionList'][0]['colList']) {//一层数据
        if (optionIndex == undefined) {
          questionx[index].isEdit = isEdit
        }
        if (optionIndex != undefined) {//修改选项
          questionx[index]['optionList'][optionIndex]['isEdit'] = isEdit
        } else {
          if (isEdit === 1) {
            questionx[index]['optionList'].forEach((option2: any,) => {
              option2.isEdit = isEdit
            })
          }
        }
      }
      questionxTocolumnData(questionx, questiony, dataList, asyncData)
      setQuestionx([...questionx])
    } else if (operationType === "y") {//点击重命名
      // console.log(index, questiony)
      for (var i = 0; i < dataLists[index]['optionNumber']; i++) {
        dataLists[index + i]['isEdit'] = isEdit
      }
      setDataList([...dataLists])
      setSpanRect(dataLists)
    } else if (operationType === "y_question" || operationType === "y_option") {
      dataLists[index]['isEdit'] = isEdit + operationType
      setDataList([...dataLists])
      setSpanRect(dataLists)
    }
  }

  const editFinish = (asyncData: asyncData, questionx: any, questiony: any, name: string, index: number, operationType: string, handleStatus: string, optionIndex?: number) => {

    if (operationType === "x1") {//isEdit 1:点击重命名之后展示的状态  2：点击编辑按钮展示的状态  点击确定或者取消按钮  则删除isEdit 属性
      delete questionx[0]['isEdit']
      questionx[0]['optionList'].forEach((option: any,) => {
        delete option.isEdit
      })
      if (handleStatus === 'ok') {
        if (optionIndex != undefined) {
          questionx[0]['optionList'][optionIndex]['name'] = name
        } else {
          questionx[0]['questionName'] = name
        }
        setQuestionIsEdit(false)
      }
      setQuestionx([...questionx])
      saveReport(rules, questionx, questiony, asyncData)
    } else if (operationType === "x2") {
      if (questionx[0]['optionList'][0]['question']) {//两层数据
        questionx[0]['optionList'].forEach((option1: any, option1Index: any) => {
          delete option1['question'][index].isEdit
          option1['question'][index]['optionList'].forEach((option2: any,) => {
            delete option2.isEdit
          })
          if (handleStatus === 'ok') {
            if (optionIndex != undefined) {
              option1['question'][index]['optionList'][optionIndex]['name'] = name
            } else {
              option1['question'][index]['questionName'] = name
            }
            setQuestionIsEdit(false)
          }
        })
      } else if (questionx[0]['optionList'][0]['colList']) {//一层数据
        delete questionx[index].isEdit
        questionx[index]['optionList'].forEach((option2: any,) => {
          delete option2.isEdit
        })
        if (handleStatus === 'ok') {
          if (optionIndex != undefined) {
            questionx[index]['optionList'][optionIndex]['name'] = name
          } else {
            questionx[index]['questionName'] = name
          }
          setQuestionIsEdit(false)
        }
      }
      setQuestionx([...questionx])
      saveReport(rules, questionx, questiony, asyncData)
    } else if (operationType === "y_question" || operationType === "y_option") {
      for (var i = 0; i < Number(dataLists[index]['optionNumber']); i++) {
        if (operationType === "y_question") {
          dataLists[index + i].qname = name
          delete dataLists[index + i]['isEdit']
        }

      }
      if (operationType === "y_option") {
        dataLists[index]['optionName'] = name
        delete dataLists[index]['isEdit']
      }
      setDataList([...dataLists])
      setSpanRect(dataLists)
      if (handleStatus === 'ok') {
        questiony.forEach((questionyItem: any, questionyIndex: number) => {
          if (dataLists[index]['qtitle'] + '-' + dataLists[index]['subQuestionCode'] === questionyItem.value) {
            if (operationType === "y_question") {
              questiony[questionyIndex]['questionName'] = name
              questiony[questionyIndex]['label'] = name
              Object.keys(analysisMethodsEnum).forEach((key: string) => {//分析方法中的题目名称也修改
                if (rules[key] && rules[key].length > 0) {
                  rules[key].forEach((rule_question: any, ruleIndex: number) => {
                    if (questiony[questionyIndex]['value'] === rule_question['value']) {
                      rule_question['questionName'] = name
                      rule_question['label'] = name
                    }
                  })
                }
              })
            } else if (operationType === "y_option") {
              questiony[questionyIndex]['optionList'].forEach((optionyItem: any, optionyIndex: number) => {
                if (optionyItem.code === dataLists[index]['optionCode']) {
                  questiony[questionyIndex]['optionList'][optionyIndex]['name'] = name
                  Object.keys(analysisMethodsEnum).forEach((key: string) => {//分析方法中的选项名称也修改
                    if (rules[key] && rules[key].length > 0) {
                      rules[key].forEach((rule_question: any, ruleIndex: number) => {
                        if (questiony[questionyIndex]['value'] === rule_question['value']) {
                          rule_question['optionList'][optionyIndex]['name'] = name
                        }
                      })
                    }
                  })
                }
              })
            }
          }
        })
        setRules({ ...rules })
        setQuestiony([...questiony])
        saveReport(rules, questionx, questiony, asyncData)
        setQuestionIsEdit(false)
      } else {//取消
      }
    }
  }

  const operationButton = (asyncData: asyncData, questionx: any, questiony: any, name: string, index: number, operationType: string) => {//x1:第一层删除  x2：第二层删除 y:y轴删除
    debugger;
    if ((type === '1' && access.canPermissions('list:detail:dataReport:analysis:edit') || type === '2' && access.canPermissions('list:detail:dataReport:analysisCustomer:edit')) && (asyncData.state != '3' && asyncData.state != '2')) {
      if (operationType === 'y' && questiony.length === 0) {
        return name
      } else {
        return <div className={styles.operation}
        >
          <div className={styles.questionName}><div>{name}</div></div>
          <ul >
            <li><Button style={{ color: "#fff" }} type="text" icon={<img style={{ width: "14px", margin: "0 10px 0 0" }} src={require("../../../../../assets/iconImages/edit@2x.png")} />} onClick={(e) => {
              e.stopPropagation()
              beforeEdit(asyncData, questionx, questiony, name, index, operationType, 1)
            }}
            >重命名</Button></li>
            <li><Button onClick={(e) => {
              e.stopPropagation()
              delData(asyncData, questionx, questiony, index, operationType)
            }} style={{ color: "#fff" }} type="text" icon={<img style={{ width: "14px", margin: "0 10px 0 0" }} src={require("../../../../../assets/iconImages/del@2x.png")} />}>删除</Button></li>
          </ul>
        </div>
      }
    } else {
      return name
    }
  }

  const editNameNode = (asyncData: asyncData, questionx: any, questiony: any, name: string, index: number, operationType: string, optionIndex?: number) => {//如果有该项  则是重命名选项
    if (type === '1' && access.canPermissions('list:detail:dataReport:analysis:edit') || type === '2' && access.canPermissions('list:detail:dataReport:analysisCustomer:edit')) {
      var newName = name
      return <div>
        <Input defaultValue={name} onChange={(e: any) => {
          newName = e.target.value
        }} onClick={(e) => {
          e.stopPropagation()
        }} />
        <div>
          <Button className="edit_question" type='primary' style={{ borderRadius: "6px" }} onClick={e => {
            e.stopPropagation()
            editFinish(asyncData, questionx, questiony, newName, index, operationType, "ok", optionIndex)
          }}>确定</Button>
          <Button className="edit_question" type='default' style={{ borderRadius: "6px" }} onClick={(e) => {
            e.stopPropagation()
            editFinish(asyncData, questionx, questiony, newName, index, operationType, "cacel", optionIndex)
          }}>取消</Button>
        </div>
      </div>
    } else {
      return name
    }
  }

  const beforeEditNameNode = (asyncData: asyncData, questionx: any, questiony: any, name: string, index: number, operationType: string, optionIndex?: number) => {//没有传值 待变改变的是选项
    if (type === '1' && access.canPermissions('list:detail:dataReport:analysis:edit') || type === '2' && access.canPermissions('list:detail:dataReport:analysisCustomer:edit')) {
      return <div>
        <span>{name}</span>&nbsp;&nbsp;
        <img src={require('@/assets/iconImages/edit@2x.png')} style={{ width: "16px", cursor: "pointer" }} onClick={(e) => {
          e.stopPropagation()
          beforeEdit(asyncData, questionx, questiony, name, index, operationType, 2, optionIndex)
        }} />
      </div>
    } else {
      return name
    }
  }

  const operateButton = (question:any,position:string)=>{
    return <Tooltip title="操作"><img onClick={() => {
      setOperationVisible(true)
      operateQuestionsRef.current && operateQuestionsRef.current.setQuestions(JSON.parse(JSON.stringify(question)), position)
    }} style={{ width: "14px",height:"14px", margin: "0 6px", cursor: "pointer"}} src={require("../../../../../assets/iconImages/edit@2x.png")} /></Tooltip>
  }

  const addButtonY = () => {
    if (type === '1' && access.canPermissions('list:detail:dataReport:analysis:edit') || type === '2' && access.canPermissions('list:detail:dataReport:analysisCustomer:edit')) {
      return <div style={{display:"flex",alignItems:"center"}}>
        <Button disabled={state == "3" || state == '2'} className="add_question" type="text" icon={<PlusCircleOutlined />} style={{ width: "100px", height: "100%" }} onClick={() => {
          addQustion('y', questiony, questionLists)
        }}>添加题目</Button>
        {operateButton(questiony,"y")}
      </div>
    } else {
      return ''
    }
  }

  const addButtonX = (positionType: string, _state: string, questionx: any, questionLists: any) => {
    let isQuestionx_15 = false
    // console.log(questionx)
    if (questionx.length > 0) {
      if (questionx[0]['optionList'][0]['question'] && questionx[0]['optionList'][0]['question'].length > 0) {//两层
        isQuestionx_15 = (questionx[0]['optionList'][0]['question'].length > 14)
      } else if (questionx[0]['optionList'][0]['colList']) {//一层
        isQuestionx_15 = (questionx.length > 14)
      }
    }
    if (type === '1' && access.canPermissions('list:detail:dataReport:analysis:edit') || type === '2' && access.canPermissions('list:detail:dataReport:analysisCustomer:edit')) {
      return <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <Button disabled={['2', '3'].includes(_state) || isQuestionx_15} className="add_question" type="text" icon={<PlusCircleOutlined />} style={{ padding: '0', minHeight: "90px", }} onClick={() => {
          addQustion(positionType, questionx, questionLists)
        }}><div style={{ width: "20px", writingMode: 'vertical-lr', margin: "3px auto 0" }}>添加题目</div></Button>
        {operateButton(questionx,"x")}
      </div>

    } else {
      return ''
    }
  }
  const addButtonXX = (positionType: string, _state: string,  questionx: any,questionLists: any) => {
    if (type === '1' && access.canPermissions('list:detail:dataReport:analysis:edit') || type === '2' && access.canPermissions('list:detail:dataReport:analysisCustomer:edit')) {
      return <div className="add_question"> <Button disabled={['2', '3'].includes(_state)} type="text" icon={<PlusCircleOutlined />} onClick={() => {
        addQustion(positionType, questionx, questionLists)
      }}>添加题目</Button></div>
    } else {
      return ''
    }
  }


  const saveCrossAnalysis = async (dataType: number, newRules: any, questionx: any, questiony: any, asyncData?: asyncData) => {//1:一层  2：两层
    // console.log(asyncData, ruleGroupId,state)
    const params = {
      groupId: surveyGroup,
      id: editId,
      questionx: questionx,
      questiony: questiony,
      type: type,//1数据分析  2：自定义分析
      name: asyncData && asyncData.reportName ? asyncData.reportName : reportName,
      crossAnalysisRule: newRules,
      ruleGroupId: asyncData && asyncData.ruleGroupId ? asyncData.ruleGroupId : ruleGroupId
    }
    const request = dataType === 1 ? saveCrossAnalysisOne : saveCrossAnalysisTwo
    request(params).then((res) => {
      // message.success("保存成功")
      if (editId === '') {
        setEditId(res.data.id)
      }
      getShowCrossAnalysis(res.data.id)
      if (res.data.answerList.length === 0) {
        setDataList([{ optionName: '', qname: '' }])
        dataLists = [{ optionName: '', qname: '' }]
        questionxTocolumnData(questionx, questiony, { optionName: '', qname: '' }, asyncData)
      } else {
        dataLists = res.data.answerList
        setDataList(res.data.answerList)
        questionxTocolumnData(questionx, questiony, res.data.answerList, asyncData)
        // setSpanRect(res.data.answerList)
      }

    })
  }

  const handleChange = (e: any) => {
    setSelectValue(e)
    let totalShow = e.includes('1') ? "0" : '1'
    setTotalShow(totalShow)
  }
  const saveReport = (newRules: any, questionx: any, questiony: any, asyncData?: any) => {
    if (questionx.length > 0 && questionx[0]['optionList'][0].question) {//两层
      saveCrossAnalysis(2, newRules, questionx, questiony, asyncData)
    } else {//一层
      saveCrossAnalysis(1, newRules, questionx, questiony, asyncData)
    }
  }
  // 添加操作日志按钮
  function createOperationButton() {
    if (!logPermission) {
      return null
    }
    if (editId == null || `${editId}`.trim() === "") {
      return null
    }
    return <div style={{ marginRight: '10px', display: 'inline' }}>
      <Button
        onClick={() => {
          setShowLogModule(true)
        }}
      >操作日志
      </Button>
      <OperationLog logType={LogType.dataReport} uId={editId}
        showModule={showLogModule}
        onCancel={() => {
          setShowLogModule(false)
        }} />
    </div>
  }

  const editEnd = () => {
    if (questiony.length > 0) {
      dataLists.forEach((item: any) => {
        if (item.isEdit)
          delete item.isEdit
      })
      setDataList([...dataLists])
      // setSpanRect(dataLists)
    }
    if (questionx.length > 0) {//两层
      if (questionx[0]['optionList'][0]['question'] && questionx[0]['optionList'][0]['question'] != null && questionx[0]['optionList'][0]['question'].length > 0) {
        if (questionx[0].isEdit) {
          delete questionx[0].isEdit
        }
        questionx[0]['optionList'].forEach((option1: any) => {
          if (option1.isEdit) {
            delete option1.isEdit
          }
          option1.question.forEach((question2: any) => {
            if (question2.isEdit)
              delete question2.isEdit
            question2['optionList'].forEach((option2: any) => {
              if (option2.isEdit) {
                delete option2.isEdit
              }
            })
          })
        })
      } else if (questionx[0]['optionList'][0]['colList']) {//一层
        questionx.forEach((question2: any) => {
          if (question2.isEdit)
            delete question2.isEdit
          question2['optionList'].forEach((option2: any) => {
            if (option2.isEdit) {
              delete option2.isEdit
            }
          })
        })
      }
      questionxTocolumnData(questionx, questiony, dataLists, { state, reportName, ruleGroupId })
      setQuestionx([...questionx])
    }
    setQuestionIsEdit(false)
  }

  const emptyTableData = (value?: number) => {

    if (questionx.length === 0 && questiony.length === 0) {
      return
    }
    setDataList([{ x2: '', qname: '' }])
    dataLists = [{ x2: '', qname: '' }]
    setQuestionx([])
    setQuestiony([])
    Object.keys(analysisMethodsEnum).forEach((key: string) => {
      rules[key] = null
    })
    questionxTocolumnData([], [], [], { ruleGroupId: value ? value : ruleGroupId, state, reportName })
    saveReport(rules, [], [], { ruleGroupId: value ? value : ruleGroupId, state, reportName })
    setRules({ ...rules })
    analysisMethodsRef.current && analysisMethodsRef.current.emptyRules()
  }
  return (
    <div className={styles.edit} onClick={() => { questionIsEdit ? editEnd() : '' }}>
      <Modal visible={showReBackDialog} title='提示' onCancel={() => {
        setShowReBackDialog(false)
      }} onOk={() => {
        setShowReBackDialog(false)
        revokeDeliver({ id: editId }).then((res) => {
          if (res.code == 200)
            message.success("操作成功")
          getShowCrossAnalysis(editId, (state: string) => {
            questionxTocolumnData(questionx, questiony, dataList, { state, reportName, ruleGroupId })
          })
        })
      }} >撤回交付后，已经交付数据将在客户界面消失，是否撤回？</Modal>
      <Spin size="large" spinning={spinning} tip="努力加载中">
        <Row justify="space-between">
          <Col>
            <div className={styles.reportTitle}>
              <Button type="text" icon={<LeftOutlined style={{ color: "#bbb" }} />} onClick={() => { onClose(true) }}></Button>
              <Input disabled={['2', '3'].includes(state)} style={{ width: "120px" }} placeholder="请填写报告名称" value={reportName} onChange={e => {
                setReportName(e.target.value)
                saveReportDebounce.run(rules, questionx, questiony)
              }} />&nbsp;&nbsp;
              <Button disabled={['2', '3'].includes(state)} type="text" icon={<img style={{ width: "18px", margin: "0 0 0 10px" }} src={require("../../../../../assets/iconImages/keep@2x.png")} />} onClick={() => {
                if (questiony.length === 0) {
                  message.info('请添加表侧题目')
                  return
                }
                if (reportState === '2') {//生成中说明一定是大数据
                  confirmModal()
                } else if (reportState === '1' || reportState === '3') {
                  crossAnalysisMethods(questionx, questiony, rules, editId)
                }
              }}>{reportState === '2' ? '结果生成中' : reportState === '1' ? '生成结果' : reportState === '3' ? "更新结果" : ""}
              </Button>
            </div>
          </Col>
          <Col>
            <Access accessible={type === '1' ? access.canPermissions('list:detail:dataReport:analysis:methods') : access.canPermissions('list:detail:dataReport:analysisCustomer:methods')}>
              <Button icon={<PlusOutlined />} disabled={questiony.length === 0 || ['2', '3'].includes(state)} onClick={() => {
                setDrawerVisible(true)
              }}>添加分析方法</Button>&nbsp;&nbsp;
            </Access>
            {
              createOperationButton()
            }
            <Select
              disabled={['2', '3'].includes(state)}
              style={{ width: selectValue.length < 2 ? 150 : ((selectValue.length - 1) * 80 + 120) + "px" }}
              value={selectValue}
              mode="multiple"
              showArrow
              onChange={handleChange}
              options={[{ label: "显示选项加总", value: "1" }, { label: "展示数量", value: "2" }, { label: "展示百分比", value: "3" }]}
            ></Select>&nbsp;&nbsp;
            <Access accessible={type === '1' ? access.canPermissions('list:detail:dataReport:analysis:download') : access.canPermissions('list:detail:dataReport:analysisCustomer:download')}>
              <Button type='default' onClick={() => {
                if (reportState == '3') {
                  window.location.href = `/api/center-data-show/reprot/exportCrossAnalysis?id=${editId}`
                } else {
                  message.info("生成结果后再下载哦！")
                }

              }}>下载报告</Button>&nbsp;&nbsp;
            </Access>
            <Access accessible={type === '1' ? access.canPermissions('list:detail:dataReport:analysis:delEmpty') : access.canPermissions('list:detail:dataReport:analysisCustomer:delEmpty')}>
              {['2', '3'].includes(state) ? "" : <Button disabled={['2', '3'].includes(state)} type='default' onClick={() => { emptyTableData() }}>全部清空</Button>}&nbsp;&nbsp;
            </Access>
            <Access accessible={type === '1' ? access.canPermissions('list:detail:dataReport:analysis:deliver') : false}>
              {['0', '1', '4', '5'].includes(state) ? <Button type='default' onClick={() => {
                if (reportState != '3') {
                  message.info("报告结果生成后才可以交付！")
                  return
                }
                confirm({
                  title: <h3 >审批流程</h3>,
                  icon: "",
                  content: <ApproveStep list={approvalUser} />,
                  onOk: async () => {
                    approeDeliver({ id: editId, ruleGroupId }).then((res) => {
                      if (res.code == 200) {
                        message.success("操作成功")
                        getShowCrossAnalysis(editId, (state: string) => {
                          questionxTocolumnData(questionx, questiony, dataList, { state, reportName, ruleGroupId })
                        })
                      } else {
                        message.error(res.msg)
                      }
                    })
                  }
                })
              }}>交付报告</Button> : ""}&nbsp;&nbsp;
            </Access>
            <Access accessible={type === '1' ? access.canPermissions('list:detail:dataReport:analysis:deliver') : false}>
              {['2', '3'].includes(state) ? <Button type='default' onClick={() => {
                setShowReBackDialog(true)
              }}>撤销交付  </Button> : ""}&nbsp;&nbsp;
              {state == '2' ? <Popover placement='bottomRight' content={<ApproveStep list={approvalUser} />} title={<div style={{ color: "rgba(144,147,153,1)" }}> 报告审批中，审批流程如下：</div>}>
                <Button type="primary" style={{ background: "rgba(255,174,127,1)", borderRadius: '6px', border: "none" }}>审批中</Button>
              </Popover> : ''}
            </Access>
          </Col>
        </Row>
        {type === '1' && access.canPermissions('list:detail:dataReport:analysis:ruleGroupId') ?
          <Row style={{ margin: "10px 0 0" }}>
            <Col>
              数据来源：<Select
                disabled={['2', '3'].includes(state)}
                value={ruleGroupId}
                style={{ width: "200px" }}
                showArrow
                onChange={(value: number) => {
                  if (reportState == '3') {//已生成报告提示
                    confirm({
                      title: <h3 >温馨提示</h3>,
                      icon: "",
                      content: '切换清洗组后，已经生成的报告将清空，是否切换？',
                      onOk: async () => {
                        setRuleGroupId(value)
                        emptyTableData(value)
                      },
                      onCancel: () => {

                      }
                    })
                  } else {
                    setRuleGroupId(value)
                    emptyTableData(value)
                  }

                }}
                options={formatListToOptions(deliverRule, "ruleGroupName", "ruleGroupId")}
              ></Select>
            </Col>
          </Row> : ''}
        <div className={styles.baseTable}>
          <BaseTable useVirtual={{ horizontal: false, vertical: 'auto' }} style={{ maxHeight: window.screen.height - 400, overflow: 'auto' }}
            dataSource={dataList} columns={columnData} />
          <div>
            {addButtonY()}
          </div>
        </div>
      </Spin>

      <CreateModal width={600} onCancel={() => {
        setModalVisible(false)
        setCheckedLists([])//选择完毕之后  清空选择列表
      }}
        onHandleOk={() => {
          modalHandOk()
        }}
        title='请选择题目' submitText="确定" modalVisible={modalVisible}>

        <TransferCheckbox
          isShowCheckedAll={position === 'y'}//只有y轴 显示全选按钮
          isCheckedAll={allDisabled || position === 'x1' || position === 'x2'}
          // x2位置不能超过15道题,x1位置不能超过1道题 x2位置&&question.length+CheckedLists.length<15 x1位置&&CheckedLists.length<1
          isChecked={position === 'x2' && (questionx.length > 0 && questionx[0]['optionList'][0]['question'] && questionx[0]['optionList'][0]['question'] != null && (questionx[0]['optionList'][0]['question'].length + checkedLists.length) > 14 || (questionx.length + checkedLists.length) > 14) || position === 'x1' && checkedLists.length > 0}
          plainOptions={questionList}
          optionsList={questionLists}
          changeData={(list: any) => {
            setQuestionLists(list)
          }}
          checkedListChange={
            (value: any) => {
              setCheckedLists(JSON.parse(JSON.stringify(value)))
            }
          }
        />
      </CreateModal>
      <Drawer
        title="分析方法"
        width={900}
        closable={true}
        onClose={() => {
          setDrawerVisible(false)
          saveReport({ ...rules }, questionx, questiony)
        }}
        visible={drawerVisible}
        footer={<div style={{ display: "flex", justifyContent: "flex-end", padding: "0 30px" }}>
          <Button type={rules['useRule'] === '0' ? "primary" : "default"} onClick={() => {
            setDrawerVisible(false)
            setRules({ ...rules, useRule: '0' })
            getDataLists(questionx, questiony, { ...rules, useRule: '0' }, true)
          }}>取消应用</Button>&nbsp;&nbsp;
          <Button type={rules['useRule'] === '1' ? "primary" : "default"} onClick={() => {
            setDrawerVisible(false)
            setRules({ ...rules, useRule: '1' })
            getDataLists(questionx, questiony, { ...rules, useRule: '1' }, true)
          }}>应用</Button>
        </div>}
      >
        <AnalysisMethods analysisRef={analysisMethodsRef} question={questiony} rules={rules} changeRules={(value: object) => {
          setRules({ ...value })
        }} />
      </Drawer>

      {/* questions={operationQuestion}  */}
      <OperateQuestions operateQuestionsRef={operateQuestionsRef} operationVisible={operationVisible} setOperationVisible={(visible: boolean) => {
        setOperationVisible(visible)
      }} changeQuestions={(value: any, position: string) => {
        if (position === 'y') {
          setQuestiony([...value])
          saveReport(rules, questionx, [...value])
        }else{
          console.log(value)
          setQuestionx([...value])
          getDataLists([...value], questiony, rules, false)
          // saveReport(rules, [...value], questiony)
        }

      }} />

    </div>

  )
}

export default Index;
