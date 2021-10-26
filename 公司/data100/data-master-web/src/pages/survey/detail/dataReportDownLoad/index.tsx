// import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Access, useAccess, history } from 'umi';

import { Select, Button, Row, Col, Alert } from 'antd';
import { crossAnalysisOne, crossAnalysisTwo, saveCrossAnalysisOne, saveCrossAnalysisTwo, showCrossAnalysis, approeDeliver, revokeDeliver, crossAnalysisTwoTime, crossAnalysisOneTime, crossAnalysisForQueue } from '../dataReport/analysis/service';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import defaultSettings from '../../../../../config/defaultSettings';
import styles from './index.less';

var dataLists: any = []
const ReportDataDownLoad: React.FC = () => {
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
    },
    {
      title: '',
      width: "22px",
      dataIndex: "x2",
      children: []
    }
  ]
  const access = useAccess()
  const [editId, setEditId] = useState<string>(history.location.query.editId)
  const [columnData, setColumnData] = useState<any>(defaultColumnData)
  const [approvalUser, setApprovalUser] = useState<Array<any>>([])
  const [dataList, setDataList] = useState<Array<any>>([])
  const [questionList, setQuestionList] = useState<any>([])
  const [questionLists, setQuestionLists] = useState<any>([])
  const [questiony, setQuestiony] = useState<any>([]) //Y轴题
  const [questionx, setQuestionx] = useState<any>([]) //Y轴题
  const [reportName, setReportName] = useState<string>('') // x y
  const [selectValue, setSelectValue] = useState<Array<string>>(['1', '2', '3'])

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
      children: text,
      props: {
        rowSpan: rowSpan,//选项长度
        colSpan: colSpan,//横跨的列数
      },
    }
  }
  const columnDataRnder1 = (text: any, record: any, index: number, questionx: any, questiony: any) => {
    return text
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
        columnData[1]['render'] = (text: any, record: any, index: number) => text

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
                title: option2.name,
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
              title: question2['questionName'],
              children: question2_children
            })
          })
          //
          question1_children.push({
            title: option1.name,
            dataIndex: `${questionx[0]['qid']}_${questionx[0]['subQuestionCode']}_${option1.code}`,
            children: option1_children
          })
        })

        columnData[2] = { //questionx[0]
          title: questionx[0]['questionName'],
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
              title: option['name'],
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
            title: question['questionName'],
            dataIndex: `${question.qid}_${question.subQuestionCode}`,
            children: question_children
          })
        })

        columnData[2].children = questionx_children
        // columnData[2]['title'] = addButtonXX('x1')

      }
      columnData[0]['render'] = (text: any, record: any, index: number) => columnDataRnder0(text, record, index, questionx, questiony)
      columnData[1]['render'] = (text: any, record: any, index: number) => text
      setColumnData([...columnData])
    }
  }
  useEffect(() => {


    showCrossAnalysis({
      id: editId,
      totalShow: 0
    }).then(({ data }) => {


      setQuestiony(data.info.questiony)
      setQuestionx(data.info.questionx)

      questionxTocolumnData(data.info.questionx, data.info.questiony)
      setReportName(data.name)
      if (data.info.answerList) {
        dataLists = data.info.answerList
        setDataList(data.info.answerList)
      }
    })


  }, [])
  useEffect(() => {
    questionxTocolumnData(questionx, questiony)
  }, [selectValue])
  const handleChange = (e: any) => {
    setSelectValue(e)
  }
  return (
    <div >
      <Row justify="space-between">
        <Col>
          <div className={styles.reportTitle}>
            {reportName}
          </div>
        </Col>
        <Col>
          <Select
            style={{ width: selectValue.length < 2 ? 150 : ((selectValue.length - 1) * 80 + 120) + "px" }}
            value={selectValue}
            mode="multiple"
            showArrow
            onChange={handleChange}
            options={[{ label: "显示选项加总", value: "1" }, { label: "展示数量", value: "2" }, { label: "展示百分比", value: "3" }]}
          ></Select>&nbsp;&nbsp;
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
        </Col>
      </Row>
      <div style={{ margin: "20px 0 0" }}>
        <div><Alert
          message="报告生成下载文件需要事件，请耐心等待，报告列表呈现后方可下载"
          description=""
          type="warning"
          showIcon
        /></div>
        <ProTable
          className='table2excel virtual-table'
          rowKey="id"
          size="small"
          bordered
          dataSource={dataList}
          columns={columnData}
          scroll={{ x: 'max-content', y: window.screen.height - 600 }}
          pagination={false}
          dateFormatter="string"
          headerTitle=""
          search={false}
          options={false}
          toolBarRender={() => [

          ]}
        />
      </div>
    </div>
  );
};

export default ReportDataDownLoad
