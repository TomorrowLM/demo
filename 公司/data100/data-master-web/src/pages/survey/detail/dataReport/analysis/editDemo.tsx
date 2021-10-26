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
import { BaseTable } from 'ali-react-table'
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

  const dataSource = [
    {
      "qtitle": "S7",
      "233551__total&number": "1684",
      "233551__2&percent": "243.4%",
      "subQuestionCode": "",
      "optionNumber": "8",
      "qtype": "M",
      "ruleOptionCode": "",
      "233551__total&percent": "236.8%",
      "233551__1&number": "793",
      "233551__2&number": "891",
      "qid": "233566",
      "optionCode": "1",
      "qname": "S7-您玩过哪些APP的种果树玩法呢？（注：包括以前玩过的）",
      "id": "e3cbe865386d4f748050e50173daf221",
      "optionName": "总数",
      "233551__1&percent": "229.3%"
    },
    {
      "qtitle": "S7",
      "233551__total&number": "843",
      "233551__2&percent": "49.9%",
      "subQuestionCode": "",
      "optionNumber": "8",
      "qtype": "M",
      "ruleOptionCode": "",
      "233551__total&percent": "50.1%",
      "233551__1&number": "398",
      "233551__2&number": "445",
      "qid": "233566",
      "optionCode": "1",
      "qname": "S7-您玩过哪些APP的种果树玩法呢？（注：包括以前玩过的）",
      "id": "45f9475a11044bb9b49e21b7b11ed7bf",
      "optionName": "支付宝-芭芭农场",
      "233551__1&percent": "50.2%"
    },
    {
      "qtitle": "S7",
      "233551__total&number": "897",
      "233551__2&percent": "53.8%",
      "subQuestionCode": "",
      "optionNumber": "8",
      "qtype": "M",
      "ruleOptionCode": "",
      "233551__total&percent": "53.3%",
      "233551__1&number": "418",
      "233551__2&number": "479",
      "qid": "233566",
      "optionCode": "2",
      "qname": "S7-您玩过哪些APP的种果树玩法呢？（注：包括以前玩过的）",
      "id": "602767f3ce1f4f6eb4d8d1a8fb9cd0c3",
      "optionName": "美团-小美果园（免费领水果）",
      "233551__1&percent": "52.7%"
    },
    {
      "qtitle": "S7",
      "233551__total&number": "1143",
      "233551__2&percent": "70.7%",
      "subQuestionCode": "",
      "optionNumber": "8",
      "qtype": "M",
      "ruleOptionCode": "",
      "233551__total&percent": "67.9%",
      "233551__1&number": "513",
      "233551__2&number": "630",
      "qid": "233566",
      "optionCode": "3",
      "qname": "S7-您玩过哪些APP的种果树玩法呢？（注：包括以前玩过的）",
      "id": "b9da435820404d3bbccd62099c0760bd",
      "optionName": "拼多多-多多果园",
      "233551__1&percent": "64.7%"
    },
    {
      "qtitle": "S7",
      "233551__total&number": "344",
      "233551__2&percent": "21.4%",
      "subQuestionCode": "",
      "optionNumber": "8",
      "qtype": "M",
      "ruleOptionCode": "",
      "233551__total&percent": "20.4%",
      "233551__1&number": "153",
      "233551__2&number": "191",
      "qid": "233566",
      "optionCode": "4",
      "qname": "S7-您玩过哪些APP的种果树玩法呢？（注：包括以前玩过的）",
      "id": "c37e271e4b2a408ca26913609ee318fc",
      "optionName": "京东-东东农场（免费水果）",
      "233551__1&percent": "19.3%"
    },
    {
      "qtitle": "S7",
      "233551__total&number": "534",
      "233551__2&percent": "34.9%",
      "subQuestionCode": "",
      "optionNumber": "8",
      "qtype": "M",
      "ruleOptionCode": "",
      "233551__total&percent": "31.7%",
      "233551__1&number": "223",
      "233551__2&number": "311",
      "qid": "233566",
      "optionCode": "5",
      "qname": "S7-您玩过哪些APP的种果树玩法呢？（注：包括以前玩过的）",
      "id": "21a55057649c441a910e04a35fa19a4a",
      "optionName": "淘宝/天猫-芭芭农场",
      "233551__1&percent": "28.1%"
    },
    {
      "qtitle": "S7",
      "233551__total&number": "226",
      "233551__2&percent": "12.7%",
      "subQuestionCode": "",
      "optionNumber": "8",
      "qtype": "M",
      "ruleOptionCode": "",
      "233551__total&percent": "13.4%",
      "233551__1&number": "113",
      "233551__2&number": "113",
      "qid": "233566",
      "optionCode": "6",
      "qname": "S7-您玩过哪些APP的种果树玩法呢？（注：包括以前玩过的）",
      "id": "dd6c6ebe8ed143ae894bdb14ca445e15",
      "optionName": "QQ-QQ农场",
      "233551__1&percent": "14.2%"
    },
    {
      "qtitle": "S7",
      "233551__total&number": "0",
      "233551__2&percent": "0%",
      "subQuestionCode": "",
      "optionNumber": "8",
      "qtype": "M",
      "ruleOptionCode": "",
      "233551__total&percent": "0%",
      "233551__1&number": "0",
      "233551__2&number": "0",
      "qid": "233566",
      "optionCode": "7",
      "qname": "S7-您玩过哪些APP的种果树玩法呢？（注：包括以前玩过的）",
      "id": "23c330e1da2e492e887c29a824e88d46",
      "optionName": "以上都没有",
      "233551__1&percent": "0%"
    },
    {
      "qtitle": "S7",
      "233551__total&number": "0",
      "233551__2&percent": "0%",
      "subQuestionCode": "",
      "optionNumber": "6",
      "qtype": "M",
      "ruleOptionCode": "",
      "233551__total&percent": "0%",
      "233551__1&number": "0",
      "233551__2&number": "0",
      "qid": "233566",
      "optionCode": "7",
      "qname": "S7-您玩过哪些APP的种果树玩法呢？（注：包括以前玩过的）",
      "id": "444",
      "optionName": "以上都没有",
      "233551__1&percent": "0%"
    },
    {
      "qtitle": "S7",
      "233551__total&number": "0",
      "233551__2&percent": "0%",
      "subQuestionCode": "",
      "optionNumber": "6",
      "qtype": "M",
      "ruleOptionCode": "",
      "233551__total&percent": "0%",
      "233551__1&number": "0",
      "233551__2&number": "0",
      "qid": "233566",
      "optionCode": "7",
      "qname": "S7-您玩过哪些APP的种果树玩法呢？（注：包括以前玩过的）",
      "id": "333",
      "optionName": "以上都没有",
      "233551__1&percent": "0%"
    },
    {
      "qtitle": "S7",
      "233551__total&number": "0",
      "233551__2&percent": "0%",
      "subQuestionCode": "",
      "optionNumber": "6",
      "qtype": "M",
      "ruleOptionCode": "",
      "233551__total&percent": "0%",
      "233551__1&number": "0",
      "233551__2&number": "0",
      "qid": "233566",
      "optionCode": "7",
      "qname": "S7-您玩过哪些APP的种果树玩法呢？（注：包括以前玩过的）",
      "id": "222",
      "optionName": "以上都没有",
      "233551__1&percent": "0%"
    },
    {
      "qtitle": "S7",
      "233551__total&number": "0",
      "233551__2&percent": "0%",
      "subQuestionCode": "",
      "optionNumber": "6",
      "qtype": "M",
      "ruleOptionCode": "",
      "233551__total&percent": "0%",
      "233551__1&number": "0",
      "233551__2&number": "0",
      "qid": "233566",
      "optionCode": "7",
      "qname": "S7-您玩过哪些APP的种果树玩法呢？（注：包括以前玩过的）",
      "id": "111",
      "optionName": "以上都没有",
      "233551__1&percent": "0%"
    }
  ]
  const addQustion = (position: string) => {

  }
  const addButtonX = (positionType: string) => {
    return <Button className="add_question" type="text" icon={<PlusCircleOutlined />} style={{ padding: '0', width: "100%", minWidth: "30px", height: "100%" }} onClick={() => {
      addQustion(positionType)
    }}><div style={{ width: "20px", writingMode: 'vertical-lr', margin: "auto" }}>添加题目</div></Button>
  }
  const columns = [
    {
      name: '',
      width: 150,
      code: 'qname',
      lock: true,
      getCellProps(text: any, record: any, index: number) {
        return {
          rowSpan: 8
        }
      }
    },
    {
      width: 150,
      name: '',
      code: 'optionName',
      lock: true
    },
    {
      name: '添加一层表头',
      code: "x2",
      children: [{
        code: '',
        name: 'S2-您的性别是：',
        align: 'center',
        children: [
          {
            code: '',
            name: "男",
            children: [
              {
                code: '1&number',
                width: 150,
                name: "数量",
              },
              {
                code: '2&percent',
                width: 150,
                name: "百分比",
              },
              {
                code: '233551__1&number',
                width: 150,
                name: "数量",
              },
              {
                code: '233551__1&percent',
                width: 150,
                name: "百分比",
              },
            ]
          },
          {
            code: '',
            name: "女",
            children: [
              {
                code: '1&number',
                width: 150,
                name: "数量",
              },
              {
                code: '2&percent',
                width: 150,
                name: "百分比",
              },
            ]
          },
        ]
      },
     
      ]
    },
    {
      width: '50px',
      name: addButtonX('x2'),
      code: "x2",
      lock:100,
      children: []
    }
    // { code: 'prov', name: '省份', width: 150 },
    // { code: 'confirmed', name: '确诊', width: 100, align: 'right' },
    // { code: 'cured', name: '治愈', width: 100, align: 'right' },
    // { code: 'dead', name: '死亡', width: 100, align: 'right' },
    // { code: 't', name: '最后更新时间', width: 180 },
  ]

  return (
    <div className={styles.edit}>
      <BaseTable style={{ maxHeight: window.screen.height - 500, overflow: 'auto' }}
        useOuterBorder dataSource={dataSource} columns={columns} />
    </div>

  )
}

export default Index;
