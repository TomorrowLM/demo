import { Input, Row, Col, message, Button, Table, Popover, Empty, Tooltip, Modal, Drawer } from 'antd';
import { PlusOutlined, LeftOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Link, history, useAccess, Access } from 'umi';
import { useInterval, useDebounceFn, useLockFn } from 'ahooks';
import React, { useState, useEffect, useRef } from 'react';
import CreateModal from "@/components/CreateModal"
import TransferCheckbox from "@/components/TransferCheckbox"
import styles from "./index.less"
import { crossAnalysisOne, crossAnalysisTwo, saveCrossAnalysisOne, saveCrossAnalysisTwo, showCrossAnalysis, approeDeliver, revokeDeliver, crossAnalysisTwoTime, crossAnalysisOneTime, crossAnalysisForQueue } from './service';
import { questionInfo, saveRule } from "../../clean/service"
import { analysisMethodsEnum } from "./const.d"
import { formatListToOptions, uniKey } from '@/utils/utils'

import Select from 'antd/es/select';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ApproveStep from "@/pages/survey/detail/report/detail/approveStep/approveStep"
import AnalysisMethods from "./analysisMethods"
import OperationLog, { LogType } from "@/components/button/OperationLog";
import permissionConfig from "../../../../../../config/permissionConfig";
const { confirm } = Modal;
interface MemberProps {
  visible: boolean,
  type: string,//1:数据报告   2：自定义分析
  drawerOk: () => void,//确认添加
  drawerCancel: () => void,//取消
  onClose: (isRefresh?: boolean) => void,
  edit_id: string,
  dataListLegnth: number,
  // surveyGroup:string
}
var dataLists: any = []
const Index: React.FC<MemberProps> = (props) => {

  const defaultColumnData = [
    {
      title: "",
      dataIndex: "qname",
      width: '50px',
      fixed: "left",
      // render: (text: any, record: any, index: number) => {
      //   console.log(questiony)
      //   // console.log(text, questiony, record, record.qid + record.subQuestionCode, dataLists)
      //   // return text
      //   var colSpan = 0
      //   if (index === 0) {
      //     colSpan = 1
      //   } else {

      //     if (record.qid + record.subQuestionCode === dataLists[index - 1].qid + dataLists[index - 1].subQuestionCode) {
      //       colSpan = 0
      //     } else {
      //       colSpan = 1
      //     }
      //   }
      //   // console.log(colSpan)    style={{ width: "20px",writingMode: 'vertical-lr' }}
      //   var rowSpan = record.optionNumber
      //   return {
      //     children: questiony.length === 0 ? '-' : record.isEdit && record.isEdit === 1 ? beforeEditNameNode(text, index, 'y_question') : record.isEdit === 2 + 'y_question' ? editNameNode(text, index, 'y_question') : operationButton(text, index, 'y'),
      //     props: {
      //       rowSpan: rowSpan,//选项长度
      //       colSpan: colSpan,//横跨的列数
      //     },
      //   }

      // },
    },
    {
      title: "",
      dataIndex: "optionName",
      width: '100px',
      fixed: "left",
      // render: (text: any, record: any, index: number) => {
      //   return record.isEdit && record.isEdit === 1 ? beforeEditNameNode(text, index, 'y_option') : record.isEdit === 2 + 'y_option' ? editNameNode(text, index, 'y_option') : text
      // }
    },
    {
      title: <div style={{ textAlign: "center" }}> <Button type="text" icon={<PlusCircleOutlined />} onClick={() => {
        addQustion('x2')
      }}>添加题目</Button></div>,
      width: "22px",
      dataIndex: "x2",
      render: () => {
        if (questionx.length === 0 && questiony.length === 0) {
          return <div style={{ padding: "100px 0" }}><Empty description='请选择题目' image={require("@/assets/empty@2x.png")} /></div>
        }
      },
      children: []
    }
  ]
  const emptyColumnData = [
    {
      title: "",
      dataIndex: "qname",
      width: '50px',
      render: (text: any, record: any, index: number) => {
        return addButtonY()
      },
    },
    {
      title: <div> <Button type="text" icon={<PlusCircleOutlined />} onClick={() => {
        addQustion('x2')
      }}>添加题目</Button></div>,
      width: "150px",
      dataIndex: "x2",
      render: () => {
        return <div style={{ padding: "100px 0" }}><Empty description='请选择题目' image={require("@/assets/empty@2x.png")} /></div>
      }
    }
  ]
  const { visible, onClose, drawerOk, drawerCancel, edit_id, type, dataListLegnth } = props;
  // type:1数据报告  2：自定义分析
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
  const [checkedLists, setCheckedLists] = useState<any>([]) //选中的题
  const [questiony, setQuestiony] = useState<any>([]) //Y轴题
  const [questionx, setQuestionx] = useState<any>([]) //Y轴题
  const [interval, setInterval] = useState<any>(null);
  const [questionIsEdit, setQuestionIsEdit] = useState<boolean>(false)
  const [position, setPosition] = useState<string>('') // x y
  const [reportName, setReportName] = useState<string>('') // x y
  const [totalShow, setTotalShow] = useState('0') //0:展示总数 1：隐藏总数
  const [state, setState] = useState<any>(0)//交付状态 1：未交付  2：审批中  3：已交付  4：交付驳回  5：交付撤销
  const [selectValue, setSelectValue] = useState<Array<string>>(['1', '2', '3'])
  const [isRequestDetail, setIsRequestDetail] = useState<number>(-1) // 1:请求了详情接口
  const [reportState, setReportState] = useState<string>() // 报告生成状态 1 未生成 2 生成中 3 生成完毕
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false) //添加分析方法
  const [rules, setRules] = useState<any>({ useRule: '0', npsRule: null, meanRule: null, top3Rule: null, top2Rule: null, bottom3Rule: null, bottom2Rule: null })//分析方法
  // const [useRule, setUseRule] = useState<string>('0')
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


  const addQustion = (type: string) => {
    setModalVisible(true)
    setPosition(type)
  }

  const getShowCrossAnalysis = async (editId: string) => {
    const { code, data } = await showCrossAnalysis({
      id: editId,
      totalShow: totalShow
    })
    if (code === 200) {
      setState(data.state)
      setReportState(data.reportState)
      if (data.approvalUser) {
        setApprovalUser([data.applyUser, ...data.approvalUser])
      }
    }
  }



  useEffect(() => {
    questionxTocolumnData(questionx, questiony)
  }, [selectValue])

  useEffect(() => {
    if (questionLists.length > 0) {
      questionLists.forEach((item: any, index: number) => {
        item.disabled = false;
        [...questiony, ...questionx].forEach((questionItem: any, questionIndex: number) => {
          if (item.value == questionItem.title + '-' + questionItem.subQuestionCode) {
            item.disabled = true
          }
        })
      })
      // console.log(questionLists)
      setQuestionLists([...questionLists])
    }
  }, [questionx, questiony])
  const columnDataRnder0 = (text: any, record: any, index: number, questionx: any, questiony: any) => {
    var colSpan = 0
    if (index === 0) {
      colSpan = 1
    } else {

      if (record.qid + record.subQuestionCode === dataLists[index - 1].qid + dataLists[index - 1].subQuestionCode) {
        colSpan = 0
      } else {
        colSpan = 1
      }
    }
    var rowSpan = record.optionNumber
    return {
      children: dataLists.length === 1 && dataLists[0].qname === '' ? '-' : record.isEdit && record.isEdit === 1 ? beforeEditNameNode(questionx, questiony, text, index, 'y_question') : record.isEdit === 2 + 'y_question' ? editNameNode(questionx, questiony, text, index, 'y_question') : operationButton(questionx, questiony, text, index, 'y'),
      props: {
        rowSpan: rowSpan,//选项长度
        colSpan: colSpan,//横跨的列数
      },
    }
  }
  const columnDataRnder1 = (text: any, record: any, index: number, questionx: any, questiony: any) => {
    return record.isEdit && record.isEdit === 1 && !(index === 0 || index > 0 && record.qid + record.subQuestionCode !== dataLists[index - 1].qid + dataLists[index - 1].subQuestionCode) && !Object.values(analysisMethodsEnum).includes(record.optionName) ? beforeEditNameNode(questionx, questiony, text, index, 'y_option') : record.isEdit === 2 + 'y_option' ?
      editNameNode(questionx, questiony, text, index, 'y_option') : text
  }
  const questionxTocolumnData = (questionx: any, questiony: any) => {
    if (questionx.length === 0) {
      if (questiony.length === 0) {
        setColumnData([...defaultColumnData])
      } else {
        columnData[2].children = [
          {
            title: "数量",
            dataIndex: "number",
            hideInTable: !selectValue.includes('2')
          },
          {
            title: "百分比",
            dataIndex: "percent",
            hideInTable: !selectValue.includes('3')
          },
        ]
        columnData[0]['render'] = (text: any, record: any, index: number) => columnDataRnder0(text, record, index, questionx, questiony)
        columnData[1]['render'] = (text: any, record: any, index: number) => columnDataRnder1(text, record, index, questionx, questiony)

        setColumnData([...columnData])
      }
    } else if (questionx[0]['optionList'] && questionx[0]['optionList'].length > 0) {
      if (questionx[0]['optionList'][0]['question']) {//两层
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
                  option2_children.push(
                    { title: col.name, dataIndex: col.dataIndex, hideInTable: !selectValue.includes('2') }
                  )
                }
                if (col['dataIndex'].indexOf('percent') > -1) {//
                  option2_children.push(
                    { title: col.name, dataIndex: col.dataIndex, hideInTable: !selectValue.includes('3') }
                  )
                }
              })
              question2_children.push({
                title: option2.isEdit ? option2.isEdit === 1 ? beforeEditNameNode(questionx, questiony, option2['name'], question2Index, 'x2', option2Index) : editNameNode(questionx, questiony, option2['name'], question2Index, 'x2', option2Index) : option2.name,
                dataIndex: `${questionx[0]['qid']}_${questionx[0]['subQuestionCode']}_${option1.code}&${question2.qid}_${question2.subQuestionCode}_${option2.code}`,
                children: option2_children
              })
            })
            question2_children.unshift({
              title: "总数",
              dataIndex: `${questionx[0]['qid']}_${questionx[0]['subQuestionCode']}_${option1.code}&${question2.qid}_${question2.subQuestionCode}_total`,
              hideInTable: !selectValue.includes('1'),
              children: [{
                title: "数量",
                dataIndex: `${questionx[0]['qid']}_${questionx[0]['subQuestionCode']}_${option1.code}&${question2.qid}_${question2.subQuestionCode}_total&number`,
                hideInTable: !selectValue.includes('2')
              },
              {
                title: "百分比",
                dataIndex: `${questionx[0]['qid']}_${questionx[0]['subQuestionCode']}_${option1.code}&${question2.qid}_${question2.subQuestionCode}_total&percent`,
                hideInTable: !selectValue.includes('3')
              }]
            })
            //
            option1_children.push({
              title: question2['isEdit'] ? question2['isEdit'] === 1 ? beforeEditNameNode(questionx, questiony, question2['questionName'], question2Index, 'x2') : editNameNode(questionx, questiony, question2['questionName'], question2Index, 'x2') : operationButton(questionx, questiony, question2['questionName'], question2Index, 'x2'),
              dataIndex: `${questionx[0]['qid']}_${questionx[0]['subQuestionCode']}_${option1.code}&${question2.qid}_${question2.subQuestionCode}`,
              children: question2_children
            })
          })
          //
          question1_children.push({
            title: option1.isEdit ? option1.isEdit === 1 ? beforeEditNameNode(questionx, questiony, option1['name'], 0, 'x1', option1Index) : editNameNode(questionx, questiony, option1['name'], 0, 'x1', option1Index) : option1.name,
            dataIndex: `${questionx[0]['qid']}_${questionx[0]['subQuestionCode']}_${option1.code}`,
            children: option1_children
          })
        })
        question1_children.push({
          width: "30px",
          fixed: "right",
          title: addButtonX('x2'),
          dataIndex: "addButtonX",
          className: styles.td_border,
          render: () => {
            return ''
          }
        })
        columnData[2] = { //questionx[0]
          title: questionx[0]['isEdit'] ? questionx[0]['isEdit'] === 1 ? beforeEditNameNode(questionx, questiony, questionx[0]['questionName'], 0, 'x1') : editNameNode(questionx, questiony, questionx[0]['questionName'], 0, 'x1') : operationButton(questionx, questiony, questionx[0]['questionName'], 0, 'x1'),
          dataIndex: 'x1',
          children: question1_children
        }
        // console.log(columnData)
      } else if (questionx[0]['optionList'][0]['colList']) {//一层
        let questionx_children: any = []
        questionx.forEach((question: any, questionIndex: number) => {
          let question_children: any = []
          question.optionList.forEach((option: any, optionIndex: number) => {
            let option_children: any = []
            option.colList.forEach((col: any, colIndex: number) => {
              //
              if (col['dataIndex'].indexOf('number') > -1) {//数量
                option_children.push(
                  { title: col.name, dataIndex: col.dataIndex, hideInTable: !selectValue.includes('2') }
                )
              }
              if (col['dataIndex'].indexOf('percent') > -1) {//数量
                option_children.push(
                  { title: col.name, dataIndex: col.dataIndex, hideInTable: !selectValue.includes('3') }
                )
              }
            })
            question_children.push({
              title: option.isEdit ? option.isEdit === 1 ? beforeEditNameNode(questionx, questiony, option['name'], questionIndex, 'x2', optionIndex) : editNameNode(questionx, questiony, option['name'], questionIndex, 'x2', optionIndex) : option.name,
              dataIndex: `${question.qid}_${question.subQuestionCode}_${option.code}`,
              children: option_children
            })
          })
          question_children.unshift({
            title: "总数",
            dataIndex: `${question.qid}_${question.subQuestionCode}_total`,
            hideInTable: !selectValue.includes('1'),
            children: [{
              title: "数量",
              dataIndex: `${question.qid}_${question.subQuestionCode}_total&number`,
              hideInTable: !selectValue.includes('2')
            },
            {
              title: "百分比",
              dataIndex: `${question.qid}_${question.subQuestionCode}_total&percent`,
              hideInTable: !selectValue.includes('3')
            }]
          })
          questionx_children.push({
            title: question['isEdit'] ? question['isEdit'] === 1 ? beforeEditNameNode(questionx, questiony, question['questionName'], questionIndex, 'x2') : editNameNode(questionx, questiony, question['questionName'], questionIndex, 'x2') : operationButton(questionx, questiony, question.questionName, questionIndex, 'x2'),
            dataIndex: `${question.qid}_${question.subQuestionCode}`,
            children: question_children
          })
        })
        questionx_children.push({
          title: addButtonX('x2'),
          width: "30px",
          dataIndex: "x2",
          fixed: "right",
          className: styles.td_border,
          render: () => {
            return ''
          }
        })
        columnData[2].children = questionx_children
        columnData[2]['title'] = addButtonXX('x1')

      }
      columnData[0]['render'] = (text: any, record: any, index: number) => columnDataRnder0(text, record, index, questionx, questiony)
      columnData[1]['render'] = (text: any, record: any, index: number) => columnDataRnder1(text, record, index, questionx, questiony)
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
      okText: '继续等待',
      cancelText: '返回列表',
      onOk: async () => {
        //定时器2s调用一次接口
        setInterval(3000);
      },
      onCancel: () => {
        onClose(true)
      }
    })
  }

  useInterval(()=>{showCrossAnalysis({
      id: editId,
      totalShow: totalShow
    }).then(({ code, data }) => {
      if (code === 200) {
        if(data.reportState==='3'){
          dataLists = data.info.answerList
          setDataList(data.info.answerList)
          setReportState(data.reportState)
          setInterval(null);
        }else{
          setInterval(3000);
        }
      }
    })}
  , interval, { immediate: false })
  const crossAnalysisTime = (questionx: any, questiony: any, newRules: any, fn: any) => {
    let reqParams = {
      id:editId,
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
          getShowCrossAnalysis(id)
        })
      })
    } else {//x y数据均为空
      if (questionx.length === 0) {
        setDataList([{ x2: '', qname: '' }])
        dataLists = [{ x2: '', qname: '' }]
      }
    }
  }

  const getDataLists = (questionx: any, questiony: any, newRules: any, isSave: boolean) => {
    const saveReqRule: any = newRules ? { ...newRules } : { ...rules }
    saveReport(saveReqRule, questionx, questiony)
    questionxTocolumnData(questionx, questiony)

    // if (editId === '') {//从未保存过的情况下
    //   if (isSave) {
    //     saveReport(saveReqRule, questionx, questiony, (id: string) => {
    //       crossAnalysisMethods(questionx, questiony, reqRules, id)
    //     })
    //   }
    // } else {
    //   if (isSave) {
    //     saveReport(saveReqRule, questionx, questiony)
    //   }
    //   crossAnalysisMethods(questionx, questiony, reqRules, editId)
    // }

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
        // getDataLists(data.info.questionx, data.info.questiony, newRules, false)
        let questionLists_format = formatListToOptions(res.data, "questionName", "title", "subQuestionCode")
        setQuestionList(questionLists_format)
        setQuestionLists(questionLists_format)
        setQuestiony(data.info.questiony)
        setQuestionx(data.info.questionx)
        setReportState(data.reportState)
        questionxTocolumnData(data.info.questionx, data.info.questiony)
        setReportName(data.name)
        setState(data.state)
        if (data.info.answerList) {
          dataLists = data.info.answerList
          setDataList(data.info.answerList)
        }

        if (data.approvalUser) {
          setApprovalUser([data.applyUser, ...data.approvalUser])
        }
        questionLists_format.forEach((item: any, index: number) => {
          [...data.info.questiony, ...data.info.questionx].forEach((questionItem: any, questionIndex: number) => {

            if (item.value == questionItem.title + '-' + questionItem.subQuestionCode) {
              item.disabled = true
            }
          })
        })
        setQuestionLists([...questionLists_format])
      })
    } else {
      getQuestionList()
      setReportName('新建数据报告' + (dataListLegnth + 1))
      setDataList([{ x2: '', qname: '' }])
      dataLists = [{ x2: '', qname: '' }]
    }
  }, [])

  // 删除按钮
  const delData = (questionx: any, questiony: any, index: number, operationType: string) => {
    console.log(questionx, index, questiony, operationType, dataLists[index]['optionNumber'])

    if (operationType == 'x1') {//删除第一层数据 第一层只有一道题 内层数据结构需要改变 如dataIndex的值
      formateCheckedList(questionx[0]['optionList'][0]['question'])
      setQuestionx([...questionx[0]['optionList'][0]['question']])
      getDataLists(questionx[0]['optionList'][0]['question'], questiony, rules, true)
    } else if (operationType === 'x2') {//删除第二层
      if (questionx[0]['optionList'][0]['colList']) {//只有第二层有数据  第一层无数据
        if (questionx.length > 1) {

        } else {//只有一条数据
          columnData[2]['title'] = addButtonXX('x2')//需改正
          columnData[2]['children'] = []
          columnData[0]['render'] = (text: any, record: any, index: number) => columnDataRnder0(text, record, index, questionx, questiony)
          columnData[1]['render'] = (text: any, record: any, index: number) => columnDataRnder1(text, record, index, questionx, questiony)
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
      getDataLists(questionx, questiony, rules, true)
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
      getDataLists(questionx, questiony, rules, true)
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

  const beforeEdit = (questionx: any, questiony: any, name: string, index: number, operationType: string, isEdit: number, optionIndex?: number) => {//点击重命名   变为带编辑按钮的 //optionIndex：没有传值 待变改变的是选项
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
      questionxTocolumnData(questionx, questiony)
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
      questionxTocolumnData(questionx, questiony)
      setQuestionx([...questionx])
    } else if (operationType === "y") {//点击重命名
      console.log(index, questiony)
      for (var i = 0; i < dataLists[index]['optionNumber']; i++) {
        dataLists[index + i]['isEdit'] = isEdit
      }
      setDataList([...dataLists])
    } else if (operationType === "y_question" || operationType === "y_option") {
      dataLists[index]['isEdit'] = isEdit + operationType
      setDataList([...dataLists])
    }
  }

  const editFinish = (questionx: any, questiony: any, name: string, index: number, operationType: string, handleStatus: string, optionIndex?: number) => {
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
      }
      setQuestionx([...questionx])
      questionxTocolumnData(questionx, questiony)
      saveReport(rules, questionx, questiony)
      // getDataLists(questionx, questiony, rules, true)
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
        }
      }
      setQuestionx([...questionx])
      questionxTocolumnData(questionx, questiony)
      saveReport(rules, questionx, questiony)
      // getDataLists(questionx, questiony, rules, true)
    } else if (operationType === "y_question" || operationType === "y_option") {
      for (var i = 0; i < dataLists[index]['optionNumber']; i++) {
        if (operationType === "y_question") {
          dataLists[index + i].qname = name
        }
        delete dataLists[index + i]['isEdit']
      }
      if (operationType === "y_option") {
        dataLists[index + i]['optionName'] = name
      }
      setDataList([...dataLists])
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
        saveReport(rules, questionx, questiony)
        // getDataLists(questionx, questiony, rules, true)
      } else {//取消

      }

    }
    // else if (operationType === "y_option") {
    //   if (handleStatus === 'ok') {
    //     questiony.forEach((questionyItem: any, questionyIndex: number) => {
    //       if (dataLists[index]['qtitle'] + '-' + dataLists[index]['subQuestionCode'] === questionyItem.value) {
    //         questiony[questionyIndex]['optionList'].forEach((optionyItem: any, optionyIndex: number) => {
    //           if (optionyItem.code === dataLists[index]['optionCode']) {
    //             questiony[questionyIndex]['optionList'][optionyIndex]['name'] = name
    //             Object.keys(analysisMethodsEnum).forEach((key: string) => {//分析方法中的选项名称也修改
    //               if (rules[key] && rules[key].length > 0) {
    //                 rules[key].forEach((rule_question: any, ruleIndex: number) => {
    //                   if (questiony[questionyIndex]['value'] === rule_question['value']) {
    //                     rule_question['optionList'][optionyIndex]['name'] = name
    //                   }
    //                 })
    //               }
    //             })
    //           }
    //         })
    //       }
    //     })
    //     setRules({ ...rules })
    //   }
    //   setQuestiony([...questiony])
    // }
    setQuestionIsEdit(false)
  }

  const operationButton = (questionx: any, questiony: any, name: string, index: number, operationType: string) => {//x1:第一层删除  x2：第二层删除 y:y轴删除
    if (type === '1' && access.canPermissions('list:detail:dataReport:analysis:edit') || type === '2' && access.canPermissions('list:detail:dataReport:analysisCustomer:edit')) {
      return <div className={styles.operation} style={{ minHeight: operationType === 'y' ? Number(dataLists[index]['optionNumber']) * 29 + 'px' : "auto" }}
      >
        <span>{name}</span>
        <ul >
          <li><Button style={{ color: "#fff" }} type="text" icon={<img style={{ width: "14px", margin: "0 10px 0 0" }} src={require("../../../../../assets/iconImages/edit@2x.png")} />} onClick={(e) => {
            e.stopPropagation()
            beforeEdit(questionx, questiony, name, index, operationType, 1)
          }}
          >重命名</Button></li>
          <li><Button onClick={(e) => {
            e.stopPropagation()
            delData(questionx, questiony, index, operationType)
          }} style={{ color: "#fff" }} type="text" icon={<img style={{ width: "14px", margin: "0 10px 0 0" }} src={require("../../../../../assets/iconImages/del@2x.png")} />}>删除</Button></li>
        </ul>
      </div>
    } else {
      return name
    }
  }

  const editNameNode = (questionx: any, questiony: any, name: string, index: number, operationType: string, optionIndex?: number) => {//如果有该项  则是重命名选项
    console.log(questionx, questiony)
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
            editFinish(questionx, questiony, newName, index, operationType, "ok", optionIndex)
          }}>确定</Button>
          <Button className="edit_question" type='default' style={{ borderRadius: "6px" }} onClick={(e) => {
            e.stopPropagation()
            editFinish(questionx, questiony, newName, index, operationType, "cacel", optionIndex)
          }}>取消</Button>
        </div>
      </div>
    } else {
      return name
    }
  }

  const beforeEditNameNode = (questionx: any, questiony: any, name: string, index: number, operationType: string, optionIndex?: number) => {//没有传值 待变改变的是选项
    if (type === '1' && access.canPermissions('list:detail:dataReport:analysis:edit') || type === '2' && access.canPermissions('list:detail:dataReport:analysisCustomer:edit')) {
      return <div>
        <span>{name}</span>&nbsp;&nbsp;
        <img src={require('@/assets/iconImages/edit@2x.png')} style={{ width: "16px", cursor: "pointer" }} onClick={(e) => {
          e.stopPropagation()
          beforeEdit(questionx, questiony, name, index, operationType, 2, optionIndex)
        }} />
      </div>
    } else {
      return name
    }
  }


  const addButtonY = () => {
    if (type === '1' && access.canPermissions('list:detail:dataReport:analysis:edit') || type === '2' && access.canPermissions('list:detail:dataReport:analysisCustomer:edit')) {
      return <Button className="add_question" type="text" icon={<PlusCircleOutlined />} style={{ width: "100px", height: "100%" }} onClick={() => {
        addQustion('y')
      }}>添加题目</Button>
    } else {
      return ''
    }
  }

  const addButtonX = (positionType: string) => {
    if (type === '1' && access.canPermissions('list:detail:dataReport:analysis:edit') || type === '2' && access.canPermissions('list:detail:dataReport:analysisCustomer:edit')) {
      return <Button className="add_question" type="text" icon={<PlusCircleOutlined />} style={{ padding: '0', width: "100%", minWidth: "30px", height: "100%" }} onClick={() => {
        addQustion(positionType)
      }}><div style={{ width: "20px", writingMode: 'vertical-lr', margin: "auto" }}>添加题目</div></Button>

    } else {
      return ''
    }
  }
  const addButtonXX = (positionType: string) => {
    if (type === '1' && access.canPermissions('list:detail:dataReport:analysis:edit') || type === '2' && access.canPermissions('list:detail:dataReport:analysisCustomer:edit')) {
      return <div className="add_question"> <Button type="text" icon={<PlusCircleOutlined />} onClick={() => {
        addQustion(positionType)
      }}>添加题目</Button></div>
    } else {
      return ''
    }
  }


  const saveCrossAnalysis = async (dataType: number, newRules: any, questionx: any, questiony: any) => {//1:一层  2：两层
    const params = {
      groupId: surveyGroup,
      id: editId,
      questionx: questionx,
      questiony: questiony,
      type: type,//1数据分析  2：自定义分析
      name: reportName,
      crossAnalysisRule: newRules
    }
    const request = dataType === 1 ? saveCrossAnalysisOne : saveCrossAnalysisTwo
    request(params).then((res) => {
      // message.success("保存成功")
      if (editId === '') {
        setEditId(res.data.id)
      }
      getShowCrossAnalysis(res.data.id)
      dataLists = res.data.answerList
      setDataList(res.data.answerList)
      
    })
  }

  const handleChange = (e: any) => {
    setSelectValue(e)
    let totalShow = e.includes('1') ? "0" : '1'
    setTotalShow(totalShow)
  }
  const saveReport = (newRules: any, questionx: any, questiony: any) => {
    if (questionx.length > 0 && questionx[0]['optionList'][0].question) {//两层
      saveCrossAnalysis(2, newRules, questionx, questiony)
    } else {//一层
      saveCrossAnalysis(1, newRules, questionx, questiony)
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
      questionxTocolumnData(questionx, questiony)
      setQuestionx([...questionx])
    }
    setQuestionIsEdit(false)
  }

  return (
    <div className={styles.edit}
      onClick={() => {
        if (questionIsEdit) {
          editEnd()
        }
      }}
    >
      <CreateModal width={600} onCancel={() => {
        setModalVisible(false)
        setCheckedLists([])//选择完毕之后  清空选择列表
      }}
        onHandleOk={() => {
          modalHandOk()
        }}
        title='请选择题目' submitText="确定" modalVisible={modalVisible}>

        <TransferCheckbox
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
      <Row justify="space-between">
        <Col>
          <div className={styles.reportTitle}>
            <Button type="text" icon={<LeftOutlined style={{ color: "#bbb" }} />} onClick={() => {
              onClose(true)
            }}> </Button>
            <Input style={{ width: "120px" }} placeholder="请填写报告名称" value={reportName} onChange={e => {
              setReportName(e.target.value)
              saveReportDebounce.run(rules, questionx, questiony)
            }} />
            <Button type="text" icon={<img style={{ width: "18px", margin: "0 0 0 10px" }} src={require("../../../../../assets/iconImages/keep@2x.png")} />} onClick={() => {
              if (questiony.length === 0) {
                message.info('请添加表侧题目')
              }
              if (reportState === '2') {//生成中说明一定是大数据
                confirmModal()
              } else if (reportState === '1' || reportState === '3') {
                // getDataLists(questionx, questiony, rules, false)
                crossAnalysisMethods(questionx, questiony, rules, editId)
              }
            }}>{reportState === '2' ? '报告生成中' : reportState === '1' ? '生成报告' : reportState === '3' ? "更新报告" : ""}
            </Button>
            {/* <Tooltip title="保存"></Tooltip> */}
          </div>
        </Col>
        <Col>
          <Access accessible={type === '1' ? access.canPermissions('list:detail:dataReport:analysis:methods') : access.canPermissions('list:detail:dataReport:analysisCustomer:methods')}>
            <Button icon={<PlusOutlined />} disabled={questiony.length === 0} onClick={() => {
              setDrawerVisible(true)
            }}>添加分析方法</Button>&nbsp;&nbsp;
          </Access>
          {
            createOperationButton()
          }
          <Select
            style={{ width: selectValue.length < 2 ? 150 : ((selectValue.length - 1) * 80 + 120) + "px" }}
            value={selectValue}
            mode="multiple"
            showArrow
            onChange={handleChange}
            options={[{ label: "显示选项加总", value: "1" }, { label: "展示数量", value: "2" }, { label: "展示百分比", value: "3" }]}
          ></Select>&nbsp;&nbsp;
          <Access accessible={type === '1' ? access.canPermissions('list:detail:dataReport:analysis:download') : access.canPermissions('list:detail:dataReport:analysisCustomer:download')}>
            <Button type='default' onClick={() => {
              $(".table2excel").clone(false).table2excel({
                exclude: ".ant-table-measure-row",//要删除的tr
                delNode: "ul,.add_question,.edit_question",//删除table中干扰元素
                name: "Excel Document Name",
                filename: reportName,//下载excel的表格名称
                exclude_img: true,//是否排除图片
                exclude_links: true,
                exclude_inputs: true
              });
            }}>下载报告</Button>&nbsp;&nbsp;
          </Access>
          <Access accessible={type === '1' ? access.canPermissions('list:detail:dataReport:analysis:delEmpty') : access.canPermissions('list:detail:dataReport:analysisCustomer:delEmpty')}>
            {state == 3 ? "" : <Button type='default' onClick={() => {
              setDataList([{ x2: '', qname: '' }])
              dataLists = [{ x2: '', qname: '' }]
              setQuestionx([])
              setQuestiony([])
              Object.keys(analysisMethodsEnum).forEach((key: string) => {
                // if (rules[key] && rules[key].length > 0) {
                rules[key] = null
                // }
              })
              questionxTocolumnData([], [])
              saveReport(rules, [], [])
              setRules({ ...rules })
            }}>全部清空</Button>}&nbsp;&nbsp;
          </Access>
          <Access accessible={type === '1' ? access.canPermissions('list:detail:dataReport:analysis:deliver') : false}>
            {state == 0 || state == 1 || state == 5 || state == 4 ? <Button type='default' onClick={() => {
              if (editId === '') {
                message.info("请编辑报告哦")
                return
              }

              confirm({
                title: <h3 >审批流程</h3>,
                icon: "",
                content: <ApproveStep list={approvalUser} />,
                onOk: async () => {
                  approeDeliver({ id: editId }).then((res) => {
                    if (res.code == 200) {
                      message.success("操作成功")
                      getShowCrossAnalysis(editId)
                    } else {
                      message.error(res.msg)
                    }
                  })
                }
              })
            }}>交付报告</Button> : ""}&nbsp;&nbsp;
          </Access>
          <Access accessible={type === '1' ? access.canPermissions('list:detail:dataReport:analysis:deliver') : false}>
            {state == 3 || state == 2 ? <Button type='default' onClick={() => {
              revokeDeliver({ id: editId }).then((res) => {
                if (res.code == 200)
                  message.success("操作成功")
                getShowCrossAnalysis(editId)
              })
            }}>撤销交付</Button> : ""}&nbsp;&nbsp;
            {state == 2 ? <Popover placement='bottomRight' content={<ApproveStep list={approvalUser} />} title={<div style={{ color: "rgba(144,147,153,1)" }}> 报告审批中，审批流程如下：</div>}>
              <Button type="primary" style={{ background: "rgba(255,174,127,1)", borderRadius: '6px', border: "none" }}>审批中</Button>
            </Popover> : ''}
          </Access>
        </Col>

      </Row>
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
        <AnalysisMethods question={questiony} rules={rules} changeRules={(value: object) => {
          setRules({ ...value })
        }} />
      </Drawer>
      <div>
        <ProTable
          className='table2excel virtual-table'
          rowKey="id"
          size="small"
          bordered
          dataSource={dataList}
          columns={columnData}
          scroll={{ x: 'max-content', y: window.screen.height - 500 }}
          pagination={false}
          dateFormatter="string"
          headerTitle=""
          search={false}
          options={false}
          toolBarRender={() => [

          ]}
        />
        <div>
          {addButtonY()}
        </div>

      </div>
    </div>

  )
}

export default Index;
