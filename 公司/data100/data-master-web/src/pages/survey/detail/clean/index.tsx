import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import { Access, useAccess, Link, history } from 'umi';
import { Card, Form, Button, Radio, Select, Row, Col, Modal, message, InputNumber, Input } from 'antd';
import { RedoOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { submitData } from './data.d';
import { stateEnum, defaultData, radioEnum, luojiguanxiEnum, optionNumEnum } from './const.d';
import { copyRuleGroup, questionInfo, dataReportNumByRuleGroup, showRule, saveRule, refershSurveyStructure, cleanState, cleanData, dataDelivery, dataDeliveryRevoke, uploadAnswerCsv, getDownloadCSVFileStatus, textQuestionInfo, putCSVInfo, delCSVInfo, submitScoreToPrw } from './service';
import { useDebounceFn } from 'ahooks';
import OssFileUpload, { AccessType, FileUploadProps, OssFileType } from "@/components/FileUpload/OssFileUpload";
import { FileUploadInfo } from "@/components/FileUpload/interface";
import { formatEnumToOptions, formatListToOptions, uniKey } from '@/utils/utils'
import OperationLog, { LogType } from "@/components/button/OperationLog";
import permissionConfig from "../../../../../config/permissionConfig";
import CleanTab from "./cleanTab";
import { CopyIcon } from "@/components/MyIcon"
import DraggableContainer from "./DraggableContainer"
import { SortableContainer, SortableElement, } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import RuleOne from "./ruleOne"
import RuleTwo from "./ruleTwo"
import RuleThree from "./ruleThree"
import RuleFour from "./ruleFour"
import RuleFive from "./ruleFive"
import defaultSettings from '../../../../../config/defaultSettings';
import "./index.less";
import RepeatRadio from "./repeatRadio"

const { confirm } = Modal;
const { uniqBy } = require('lodash');

const Index: React.FC = (props: any) => {
  const copyRef = useRef();
  const [form] = Form.useForm();
  const [submitData, setSubmitData] = useState<submitData | undefined>()
  const [questionList, setQuestionList] = useState<any>([])
  const [showLogModule, setShowLogModule] = useState(false)
  const operationPermission = useAccess().canPermissions(permissionConfig.dataClean.permissionLog)
  const [questionList2, setQuestionList2] = useState<any>([])//矩阵题列表
  const [questionList5, setQuestionList5] = useState<any>([])//文本题列表
  const [surveyGroup, setSurveyGroup] = useState<string>(history.location.query.surveyGroup)
  const [ruleGroupId, setRuleGroupId] = useState<string>('')

  const [sid, setSid] = useState<string>(history.location.query.sid)
  const [deliverState, setdeliverState] = useState<number>(-1)//1:未交付 2：交付中 3：交付完毕 4：交付失败 Score
  const [state, setState] = useState<number>(-1)//1:未清洗  2：清洗中 3：清洗完毕 4：清洗失败
  const [csvState, setCsvState] = useState<string>('')//0已同步问卷结构&打包中 ；1完成 2已同步问卷结构&未拉取数据 3：未同步问卷结构&未拉取数据
  const [creditScoreStatus, setCreditScoreStatus] = useState<string>()//0未提交  1 已提交
  const [csvLoading, setCsvLoading] = useState<boolean>(false)
  const [operType, setOperType] = useState<string>()//操作类型（1拉取 2上传） null代表未拉取也未上传过
  const [fileName, setFileName] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')//最后拉取的时间
  const [downloadUrl, setDownloadUrl] = useState<string>('')
  const [deliverScore, setDeliverScore] = useState<string>('')//交付分数
  const [delivervisible, setDelivervisible] = useState<boolean>(false)
  const [stopCleanGroup, setStopCleanGroup] = useState<boolean>(false)//是否禁用tab清洗组
  const [downloadvisible, setDownloadvisible] = useState<boolean>(false); //点击下载是否展示弹窗
  // console.log(history)
  // 清洗失败  未清洗 显示标记按钮
  useEffect(() => {
    geCSVFiletDownloadStatus()
  }, [])
  /**
   * 获取拉取问卷结构的状态
   */
  const geCSVFiletDownloadStatus = () => {

    getDownloadCSVFileStatus({
      surveyGroup,
      sid,
    }).then(res => {
      setFileName(res.data.fileName)
      setCsvState(res.data.status)
      setOperType(operType)
      setEndTime(res.data.endTime)
      setCsvLoading(false)
      if(res.data.status == 1){
        setStopCleanGroup(false)
      }else if(res.data.status == 0){
        setStopCleanGroup(true)
      }else if(res.data.status == 3){
        setStopCleanGroup(true)
      }else if(res.data.status == 2){
        setStopCleanGroup(false)
      }
    })
  }
  /**
   * 获取清洗组详情
   * @param ruleGroupId
   */
  const getDetailData = (ruleGroupId: string) => {
    Promise.all([showRule({
      groupId: surveyGroup,
      ruleGroupId
    }), questionInfo({
      groupId: surveyGroup,
      qtype: "",
      optionFlag: '1'
    }), questionInfo({
      groupId: surveyGroup,
      qtype: "2",
      optionFlag: "1"
    }), textQuestionInfo({ groupId: surveyGroup, })]).then((res) => {
      if (res[0].data) {
        if (!res[0].data.rule5) {
          res[0].data.rule5 = JSON.parse(JSON.stringify(defaultData)).rule5
        }
        setSubmitData({ ...res[0].data })
      } else if (!res[0].data) {
        setSubmitData({ ...JSON.parse(JSON.stringify(defaultData)), groupId: surveyGroup, ruleGroupId })
        saveRule({ ...JSON.parse(JSON.stringify(defaultData)), groupId: surveyGroup, ruleGroupId })
      }
      setQuestionList(formatListToOptions(res[1].data, "questionName", "title", "subQuestionCode", 'questionName'))
      setQuestionList2(formatListToOptions(res[2].data, "questionName", "title", "subQuestionCode", 'questionName'))
      setQuestionList5(formatListToOptions(res[3].data, "questionName", "title", "subQuestionCode", 'questionName'))
    })
  }
  /**
   * 保存清洗组
   */
  const saveRules = (submitData: any, fn?: () => void) => {
    console.log(submitData)
    if (state == 2 || state == 3) {//清洗中，清洗完成 弹框提示
      confirm({
        title: '该清洗组已经完成数据标记。修改需重新标记数据，是否修改？',
        icon: <ExclamationCircleOutlined />,
        content: '',
        onOk() {
          if (fn)
            fn()
          saveRule({
            ...submitData
          }).then((res) => {
            setState(1)
          })
        },
        onCancel() {
        },
      });
    } else {
      if (fn)
        fn()
      setSubmitData({ ...submitData })
      useDebounceSaveRules.run(submitData)
    }
  }
  const useDebounceSaveRules = useDebounceFn((submitData) => {
    saveRule({
      ...submitData
    })
  }, {
    wait: 1000,
  })

  const optionSort = (list: any, name: string) => {
    list.sort((a: any, b: any) => {
      if (a[name] > b[name]) {
        return 1
      }
      if (a[name] == b[name]) {
        return 0
      }
      if (a[name] < b[name]) {
        return -1
      }
    })
  }
  const findRepeat = (arr: any, submitDataArr: any) => {
    let isMessage = false
    for (var i = 0; i < arr.length; i++) {
      submitDataArr[i]['repeatId'] = []
      if (arr[i]['repeatId']) {
        delete arr[i]['repeatId']
      }
      if (arr[i]['id']) {
        delete arr[i]['id']
      }
      for (var j = 0; j < arr.length; j++) {
        if (arr[j]['repeatId']) {
          delete arr[j]['repeatId']
        }
        if (arr[j]['id']) {
          delete arr[j]['id']
        }
        if (i !== j) {
          if (JSON.stringify(arr[i]) === JSON.stringify(arr[j])) {
            submitDataArr[i]['repeatId'].push(submitDataArr[j]['id'])
            isMessage = true
            break;
          }
          console.log(arr, JSON.stringify(arr[i]) === JSON.stringify(arr[j]), j, i)
        }

      }
    }
    return isMessage
  }
  /**
   * 标记
   * @returns
   */
  const submitRule = async () => {
    //  当选择是的情况下   下面必须有条件
    try {
      if (submitData['rule1']['state'] === '1') {
        submitData['rule1']['ruleGroup'].forEach((ruleGroup: any, ruleGroupIndex: number) => {
          ruleGroup.questions.forEach((question: any, questionIndex: number) => {
            if (question.option.length === 0) {
              message.info("当选择是时，条件必填，请完善逻辑限制的条件")
              throw new Error('')
            }
          })
        })
      }
      if (submitData['rule2']['state'] === '1') {
        submitData['rule2']['questions'].forEach((question: any, questionIndex: number) => {
          if (question['bj'] === '' || question['qid'] === '') {
            message.info("当选择是时，条件必填，请完善选项个数限制的条件")
            throw new Error('')
          }
        })
      }
      if (submitData['rule3']['state'] === '1') {
        submitData['rule3']['questions'].forEach((question: any, questionIndex: number) => {
          if (question['optionList'] == undefined || question['optionList'] && question['optionList'].length === 0) {
            message.info("当选择是时，条件必填，请完善选项个数限制的条件")
            throw new Error('')
          }
        })
      }
      if (submitData['rule4']['state'] === '1') {
        submitData['rule4']['ruleGroup'].forEach((ruleGroup: any, ruleGroupIndex: number) => {
          if (ruleGroup['questions'].length === 0) {
            message.info("当选择是时，条件必填，请完善数据重复的条件")
            throw new Error('')
          } else if (ruleGroup['questions'].length === 1) {
            message.info("数据重复至少选择2道题才能点击标记")
            throw new Error('')
          }
        })
      }
      if (submitData['rule5']['state'] === '1') {
        submitData['rule5']['ruleGroup'].forEach((ruleGroup: any, ruleGroupIndex: number) => {
          if (ruleGroup['questions'].length === 0) {
            message.info("当选择是时，条件必填，请完善文本题重复的条件")
            throw new Error('')
          }
        })
      }
    } catch (error) {
      if (error) {
        return
      }
    }
    // 查重复并且标红
    let newSubmitData: any = JSON.parse(JSON.stringify(submitData))
    let isMessage = 0
    if (newSubmitData['rule1']['state'] === '1') {
      newSubmitData['rule1']['ruleGroup'].forEach((ruleGroup: any, ruleGroupIndex: number) => {
        ruleGroup.questions.forEach((question: any, questionIndex: number) => {
          optionSort(question.option, 'code')
        })
      })
      if (findRepeat(newSubmitData['rule1']['ruleGroup'], submitData['rule1']['ruleGroup'],)) {
        isMessage += 1
      }
    }

    if (newSubmitData['rule2']['state'] === '1') {
      if (findRepeat(newSubmitData['rule2']['questions'], submitData['rule2']['questions'],)) {
        isMessage += 1
      }
    }
    if (newSubmitData['rule3']['state'] === '1') {
      if (findRepeat(newSubmitData['rule3']['questions'], submitData['rule3']['questions'],)) {
        isMessage += 1
      }
    }
    if (newSubmitData['rule4']['state'] === '1') {
      debugger;
      newSubmitData['rule4']['ruleGroup'].forEach((ruleGroup: any, ruleGroupIndex: number) => {
        optionSort(ruleGroup.questions, 'qid')
      })
      if (findRepeat(newSubmitData['rule4']['ruleGroup'], submitData['rule4']['ruleGroup'],)) {
        isMessage += 1
      }
    }
    if (newSubmitData['rule5']['state'] === '1') {
      debugger;
      newSubmitData['rule5']['ruleGroup'].forEach((ruleGroup: any, ruleGroupIndex: number) => {
        optionSort(ruleGroup.questions, 'qid')
      })
      if (findRepeat(newSubmitData['rule5']['ruleGroup'], submitData['rule5']['ruleGroup'],)) {
        isMessage += 1
      }
    }
    setSubmitData({ ...submitData })
    console.log(isMessage, submitData, newSubmitData)
    if (isMessage > 0) {
      message.info('清洗规则中存在重复项，请去重后再标记')
      return;
    }
    cleanData({ groupId: surveyGroup, ruleGroupId }).then(() => {
      getCleanState(ruleGroupId)
    })
  }

  /**
   * 获取清洗组的清洗状态
   * @param ruleGroupId
   * @param fn
   */
  const getCleanState = async (ruleGroupId: string) => {
    const { data, code } = await cleanState({ groupId: surveyGroup, ruleGroupId })
    setState(data.state)
    setdeliverState(Number(data.deliverState))
    setCreditScoreStatus(data.creditScoreStatus)
    setDownloadUrl(data.manualUrl ? data.manualUrl : data.url)
  }
  // 点击清洗组tab
  const tabClick = (ruleGroupId: string) => {
    // console.log(ruleGroupId)
    setRuleGroupId(ruleGroupId)
    getDetailData(ruleGroupId)
    getCleanState(ruleGroupId)
  }
  /**
   * 获取所有清洗组清洗状态：用于判定拉取问卷结构时是否弹框提示
   *
   */
  const getSurveyCleanState = async (fn?: any) => {
    const { data, code } = await cleanState({ groupId: surveyGroup })
    let new_surveyState: number
    if (code == 200) {
      if (data.cleanedCount == 0 && data.cleaningCount == 0) {
        new_surveyState = 1
      } else {
        new_surveyState = 2
      }
      if (fn)
        fn(new_surveyState)
    }
  }

  /**
   * 重置
   */
  const reset = () => {
    let newData = JSON.parse(JSON.stringify(defaultData))
    // setSubmitData({ ...newData, groupId: surveyGroup, ruleGroupId })
    saveRules({ ...newData, groupId: surveyGroup, ruleGroupId })
  }

  /**
   * 拉取问卷结构
   * @param data
   */
  const refershSurvey = (new_surveyState: number) => {
    if (new_surveyState == 1) {//所有组未清洗和清洗失败可以拉取问卷结构
      refershSurveyStructure({ surveyGroup: surveyGroup, sid: sid }).then(() => {
        message.success("操作成功")
        geCSVFiletDownloadStatus()
        if (ruleGroupId !== '') {
          getDetailData(ruleGroupId)
        }
      })
    } else {
      confirmModal(() => {
        refershSurveyStructure({ surveyGroup: surveyGroup, sid: sid }).then((res) => {
          if (res.code == 200) {
            message.success("操作成功")
            geCSVFiletDownloadStatus()
            if (ruleGroupId !== '') {
              getCleanState(ruleGroupId)
              getDetailData(ruleGroupId)
            }
          }
        })
      })
      // confirm({
      //   title: '此问卷已经完成数据清洗。重新更新数据，之前已经交付的清洗数据和数据报告将自动撤回，是否更新？',
      //   icon: <ExclamationCircleOutlined />,
      //   content: '',
      //   onOk() {
      //     dataDeliveryRevoke({ groupId: surveyGroup }).then(() => {//不传清洗组参数代表撤回所有清洗组
      //       refershSurveyStructure({ surveyGroup: surveyGroup, sid: sid }).then((res) => {
      //         if (res.code == 200) {
      //           message.success("操作成功")
      //           // geCSVFiletDownloadStatus()
      //           if (ruleGroupId !== '') {
      //             getCleanState(ruleGroupId)
      //             getDetailData(ruleGroupId)
      //           }
      //         }
      //       })
      //     })
      //   },
      //   onCancel() {
      //   },
      // });
    }
  }

  const confirmModal = (fn: any) => {
    return confirm({
      title: '此问卷已经完成数据清洗。重新更新数据，之前已经交付的清洗数据和数据报告将自动撤回，是否更新？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk() {
        dataDeliveryRevoke({ groupId: surveyGroup }).then(() => {//不传清洗组参数代表撤回所有清洗组
          fn()
        })
      },
      onCancel() {
      },
    });
  }

  const beforeDelCSVInfo = (new_surveyState: number) => {
    if (new_surveyState == 1) {//所有组未清洗和清洗失败可以拉取问卷结构
      delCSVInfo({ sid, surveyGroup }).then(() => {
        message.success("操作成功")
        geCSVFiletDownloadStatus()
        if (ruleGroupId !== '') {
          getDetailData(ruleGroupId)
        }
      })
    } else {
      confirmModal(() => {
        delCSVInfo({ sid, surveyGroup }).then((res) => {
          if (res.code == 200) {
            message.success("操作成功")
            geCSVFiletDownloadStatus()
            if (ruleGroupId !== '') {
              getCleanState(ruleGroupId)
              getDetailData(ruleGroupId)
            }
          }
        })
      })
    }
  }
  /**
 * 拉取or上传
 * @param info 
 */
  const get_putCSVInfo = (type: string, fileUrl?: any) => {
    if (type == '1') {
      setCsvLoading(true)
    }
    putCSVInfo({
      surveyGroup: surveyGroup,
      sid,
      fileUrl: fileUrl,
      operType: type
    }).then((res) => {
      setCsvLoading(false)
      if (res.code == 200) {
        message.success("操作成功")
        geCSVFiletDownloadStatus()
        getCleanState(ruleGroupId)
      } else {
        message.error(res.msg)
      }
    })
  }
  // 上传文件成功
  const uploadFileSuccessCsv = (info: FileUploadInfo) => {
    get_putCSVInfo('2', info.url)
  }
  /**
   * 交付
   */
  const deliver = () => {
    dataDelivery({ groupId: surveyGroup, fraction: deliverScore, ruleGroupId }).then((res) => {//分数
      if (res.code == 200) {
        message.success("操作成功")
        setDelivervisible(false)
        getCleanState(ruleGroupId)
      }
    })
  }
  /**
   * 下载
   */
  const download = () => {
    window.location.href = downloadUrl;
  }
  /**
   * 撤销交付
   */
  const deliverRevoke = () => {
    dataReportNumByRuleGroup({ groupId: surveyGroup, ruleGroupId }).then((res) => {
      confirm({
        title: <h3 style={{ fontWeight: "bold", textAlign: 'center' }}>温馨提示</h3>,
        icon: '',
        content: `该清洗组下有${res.data.totalNum}份数据报告，其中已交付数据报告${res.data.deliveredNum}份，撤回后，将从数据报告列表消失，是否撤回交付？`,
        cancelText: "取消",
        okText: "撤回",
        onOk() {
          // flag:1不撤回清洗状态 
          dataDeliveryRevoke({ groupId: surveyGroup, ruleGroupId,flag:1 }).then((res) => {
            if (res.code == 200) {
              message.success("操作成功")
              getCleanState(ruleGroupId)
            }
          })
        },
        onCancel() {

        },
      });
    });
  }

  /**
   * 人工扣分
   * @param info
   */
  const onFileUploadSuccess = (info: FileUploadInfo) => {
    uploadAnswerCsv({
      groupId: surveyGroup,
      ruleGroupId,
      csvrl: info.url
    }).then((res) => {
      if (res.code == 200) {
        message.success("操作成功")
        getCleanState(ruleGroupId)
      }
    })
  }
  const onFileUploadFailed = (info: string) => {
    message.error(info)
  }

  // 创建操作日志button
  function creatOperationButton() {
    if (!operationPermission) {
      return null
    }
    return <div style={{ marginRight: '10px', display: 'inline' }}>
      <Button
        onClick={() => {
          setShowLogModule(true)
        }}
      >操作日志
      </Button>
      <OperationLog logType={LogType.dataClear} uId={`${surveyGroup}:${ruleGroupId}`}
        showModule={showLogModule}
        onCancel={() => {
          setShowLogModule(false)
        }} />
    </div>
  }
  /**
   * 处理重复的id
   * @param handleData 要处理的数据
   * @param item 当前操作数据
   */
  const handleRepeatId = (handleData: any, item: any) => {
    if (item['repeatId'] && item['repeatId'].length > 0) {
      handleData.forEach((ruleGroup: any) => {
        if (ruleGroup['repeatId']) {
          ruleGroup['repeatId'] = ruleGroup['repeatId'].filter((repeatId: string) => repeatId !== item.id)
        }
      })
    }
    delete item['repeatId']
  }
  const SortableItem = SortableElement((props: any) => <div>{props.children}</div>);
  const SortableList1 = SortableContainer(({ items }: any) => {
    return (
      <div>
        {items.map((item: any, index: number) => (
          <SortableItem key={`item-${item}-${index}`} index={index} value={item} >
            <RuleOne
              parentItem={item}
              parentIndex={index}
              deliverState={deliverState}
              csvState={csvState}
              questionList={questionList}
              submitData={submitData}
              setSubmitData={(value: any, handleRepeat?: boolean) => {
                // console.log(value)
                saveRules(value, () => {
                  if (handleRepeat) {
                    handleRepeatId(value['rule1']['ruleGroup'], item)
                  }
                })
              }}
            ></RuleOne>
          </SortableItem>
        ))}
      </div>
    );
  });
  const SortableList2 = SortableContainer(({ items }: any) => {
    return (
      <div>
        {items.map((item: any, index: number) => (
          <SortableItem key={`item-${item}-${index}`} index={index} value={item} >
            <RuleTwo
              item={item}
              index={index}
              deliverState={deliverState}
              csvState={csvState}
              questionList={questionList}
              submitData={submitData}
              setSubmitData={(value: any, handleRepeat?: boolean) => {
                saveRules(value, () => {
                  if (handleRepeat) {
                    handleRepeatId(value['rule2']['questions'], item)
                  }
                })
              }}
            ></RuleTwo>
          </SortableItem>
        ))}
      </div>
    );
  });
  const SortableList3 = SortableContainer(({ items }: any) => {
    return (
      <div>
        {items.map((item: any, index: number) => (
          <SortableItem key={`item-${item}-${index}`} index={index} value={item} >
            <RuleThree
              item={item}
              index={index}
              deliverState={deliverState}
              csvState={csvState}
              questionList={questionList2}
              submitData={submitData}
              setSubmitData={(value: any, handleRepeat?: boolean) => {
                saveRules(value, () => {
                  if (handleRepeat) {
                    handleRepeatId(value['rule3']['questions'], item)
                  }
                })
              }}
            ></RuleThree>
          </SortableItem>
        ))}
      </div>
    );
  });
  const SortableList4 = SortableContainer(({ items }: any) => {
    return (
      <div>
        {items.map((item: any, index: number) => (
          <SortableItem key={`item-${item}-${index}`} index={index} value={item} >
            <RuleFour
              item={item}
              index={index}
              deliverState={deliverState}
              csvState={csvState}
              questionList={questionList}
              submitData={submitData}
              setSubmitData={(value: any, handleRepeat?: boolean) => {
                saveRules(value, () => {
                  if (handleRepeat) {
                    handleRepeatId(value['rule4']['ruleGroup'], item)
                  }
                })
              }}
            ></RuleFour>
          </SortableItem>
        ))}
      </div>
    );
  });
  const SortableList5 = SortableContainer(({ items }: any) => {
    return (
      <div>
        {items.map((item: any, index: number) => (
          <SortableItem key={`item-${item}-${index}`} index={index} value={item} >
            <RuleFive
              item={item}
              index={index}
              deliverState={deliverState}
              csvState={csvState}
              questionList={questionList5}
              submitData={submitData}
              setSubmitData={(value: any, handleRepeat?: boolean) => {
                saveRules(value, () => {
                  if (handleRepeat) {
                    handleRepeatId(value['rule5']['ruleGroup'], item)
                  }
                })
              }}
            ></RuleFive>
          </SortableItem>
        ))}
      </div>
    );
  });

  const csvStateText = () => {
    if (csvState == '3') {
      return "未同步问卷结构"
    } else if (csvState == '2') {
      return "已同步未拉取"
    } else if (csvState == '0') {
      return "已同步更新中"
    } else if (csvState == '1') {
      return "已完成"
    } else {
      return ""
    }
  }
  const prwRevoke = () => {
    if (state == 3) {
      return confirm({
        title: <h3 style={{ fontWeight: "bold", textAlign: 'center' }}>只能交付一次且不可撤回，是否交付？</h3>,
        icon: '',
        content: ``,
        cancelText: "取消",
        okText: "确定",
        onOk() {
          submitScoreToPrw({ groupId: surveyGroup, ruleGroupId }).then((res) => {
            if (res.code == 200) {
              message.success("操作成功")
              getCleanState(ruleGroupId)
            } else {
              message.error(res.msg)
            }
          })
        },
        onCancel() {

        },
      });
    } else {
      message.info("交付尚未完成请耐心等待")
      getCleanState(ruleGroupId)
    }

  }
  const fileTimeText = () => {
    if (csvState == '0' || csvState == '1') {
      return `最后${operType == '2' ? '上传' : '拉取'}时间：${endTime}`
    } else {
      return ""
    }
  }
  /**
   * 回调上传文件upload
   * @param result 
   */
  const returnStopGroup:(result:boolean)=>void = (result) => {
    setStopCleanGroup(result)
  }
  return (
    <div>
      <Modal
        visible={delivervisible}
        title={<h3 style={{ fontWeight: "bold", textAlign: 'center' }}>交付数据</h3>}
        onOk={deliver}
        closable={true}
        onCancel={() => {
          setDelivervisible(false)
        }}
      >
        <div>
          <strong style={{fontSize:"14px"}}>分数：</strong>
          <div style={{ margin:"15px 0" }}>选择&nbsp;&nbsp;<Input style={{ width: "100px" }} onChange={(e) => {
            setDeliverScore(e.target.value)
          }} />&nbsp;&nbsp;分以上的数据进行交付
          </div>
          {/* <h3 style={{ fontWeight: "bold", marginTop: "5px" }}>以上的数据进行交付</h3> */}
          <div className="download">
            <RepeatRadio></RepeatRadio>
          </div>
        </div>
      </Modal>
      <Modal
        visible={downloadvisible}
        title={<h3 style={{ fontWeight: "bold", textAlign: 'center' }}>下载数据</h3>}
        onOk={ download }
        closable={true}
        onCancel={() => {
          setDownloadvisible(false)
        }}
      >
        <div className="download">
          <RepeatRadio></RepeatRadio>
        </div>
      </Modal>
      <Row justify="space-between">
        <Col>
          <h3>清洗规则设置
            <Button type="primary" style={{ marginLeft: "10px" }}
              onClick={() => {
                getSurveyCleanState(refershSurvey)
                setStopCleanGroup(false)
                // if (csvState == '0') {//拉取中 刷新
                //   geCSVFiletDownloadStatus()
                // } else {
                //   getSurveyCleanState(refershSurvey)
                // }
              }}>{csvState == '3' ? '同步问卷结构' : "更新问卷结构"}</Button>&nbsp;&nbsp;
            {csvState == '3' ? '' : <span><Button loading={csvLoading} icon={<RedoOutlined />} type="primary" style={{ marginLeft: "10px" }}
              onClick={() => {
                if (csvState == '0') {//拉取中 刷新
                  setCsvLoading(true)
                  geCSVFiletDownloadStatus()
                } else if (csvState == '3') {
                  message.info("您尚未同步问卷结构，请先同步问卷结构")
                } else if (csvState == '1') {
                  if (fileName != null && fileName !== '') {
                    message.info("答题数据已存在，请先清除")
                    return
                  }
                  get_putCSVInfo('1')//已经清除或未拉取状态下一定是已经撤回了交付
                } else if (csvState == '2') {
                  get_putCSVInfo('1')
                  setStopCleanGroup(true)
                }
              }}>{csvState == '0' ? '刷新' : '拉取'}</Button>&nbsp;&nbsp;
              <OssFileUpload uploadFailed={onFileUploadFailed} uploadSuccess={uploadFileSuccessCsv}
                ossFileType={OssFileType.clean} accept={[AccessType.csv]} returnStopGroupStatus={returnStopGroup}>
                <Button icon={<UploadOutlined />} type="primary" style={{ marginLeft: "10px" }} onClick={(e) => {
                  if (csvState == '0') {//拉取中 刷新
                    e.stopPropagation()
                    message.info("数据拉取中，不可上传")
                  } else if (csvState == '3') {
                    e.stopPropagation()
                    message.info("您尚未同步问卷结构，请先同步问卷结构")
                  } else if (csvState == '1') {
                    if (fileName != null && fileName !== '') {
                      e.stopPropagation()
                      message.info("答题数据已存在，请先清除")
                    }
                  }
                }}>上传</Button>
              </OssFileUpload>&nbsp;&nbsp;</span>}
            {csvStateText()}/{fileTimeText()}&nbsp;&nbsp;
            {/* ;${operType=='2'?`上传文件:${fileName}`:''} */}
            {csvState == '2' ? "" : fileName ? <Button style={{ color: defaultSettings.primaryColor }} onClick={() => {
              getSurveyCleanState(beforeDelCSVInfo)
            }}>清除</Button> : ''}
          </h3>
        </Col>
        <Col>
          {
            creatOperationButton()
          }
        </Col>
      </Row>
      <CleanTab surveyId={surveyGroup} csvState={csvState}
        tabClick={tabClick}
        copyRef={copyRef}
        stopCleanGroup={stopCleanGroup}
      >
        <Row justify="space-between">
          <Col></Col>
          <Col>
            {state== 3 ? <Button type="primary" disabled={creditScoreStatus==='1'} onClick={prwRevoke}>{creditScoreStatus==='1'?'拼任务信誉分已交付':'拼任务信誉分交付'}</Button> : ''} &nbsp;
            <Button disabled={csvState != '1'} onClick={() => {
              copyRuleGroup({
                groupId: surveyGroup,
                ruleGroupId,
              }).then((res) => {
                if (res.code === 200) {
                  message.success("复制成功")
                  setRuleGroupId(res.data)
                  copyRef.current && copyRef.current.copyRule()
                }
              })
            }}>复制</Button>&nbsp;&nbsp;
            {deliverState == 1 ? <OssFileUpload uploadFailed={onFileUploadFailed} uploadSuccess={onFileUploadSuccess} ossFileType={OssFileType.clean}>
              <Button disabled={csvState == '0' || csvState == '2'} type="primary" >人工扣分</Button>
            </OssFileUpload> : ''}&nbsp;
            {deliverState == 2 || deliverState == 3 ? '' : state == 3 ?
              <Button type="primary" disabled={deliverState == 2 || deliverState == 3 || csvState == '0'} onClick={() => { setDelivervisible(true) }}>交付数据</Button> : ''}&nbsp;
            {deliverState == 2 || deliverState == 3 ? <Button style={{ background: "#ddd" }} onClick={deliverRevoke}>撤回交付</Button> : ''}


          </Col>
        </Row>
        {submitData ? <Form form={form} autoComplete="off" initialValues={submitData}>
          {/* 选项逻辑限制-----开始 */}
          <Card style={{ margin: '8px 0' }}>
            <Form.Item colon={false} label={<div style={{ width: "80px", textAlign: "left" }}>选项逻辑限制：</div>}>
              <Radio.Group disabled={csvState == '0' || csvState == '2' || deliverState == 2 || deliverState == 3}
                onChange={e => {
                  saveRules(submitData, () => {
                    submitData['rule1'].state = e.target.value
                    if (e.target.value === '0') {
                      submitData['rule1']['ruleGroup'] = JSON.parse(JSON.stringify(defaultData))['rule1']['ruleGroup']
                      submitData['rule1']['ruleGroup'][0]['id'] = uniKey()
                    }
                  })
                }} value={submitData['rule1'].state}>
                {formatEnumToOptions(radioEnum).map(({ value, label }, radioIndex) => {
                  return <Radio key={uniKey()} value={value}>{label}</Radio>
                })}
              </Radio.Group>
            </Form.Item>
            {submitData['rule1'].state == '1' ? submitData['rule1'].ruleGroup && submitData['rule1'].ruleGroup.length > 0 ?
              <SortableList1 items={submitData['rule1'].ruleGroup} useDragHandle disableAutoscroll
                onSortEnd={({ oldIndex, newIndex }: any) => {
                  if (oldIndex !== newIndex) {
                    saveRules(submitData, () => {
                      submitData['rule1'].ruleGroup = arrayMoveImmutable(submitData['rule1'].ruleGroup, oldIndex, newIndex)
                    })
                  }
                }}
              />
              : "" : ''}
          </Card>
          {/* 选项逻辑限制-----结束 */}

          {/* 选项个数限制：-----开始 */}
          {/* rule2逻辑个数限制:只支持多选和阵列 type  0 单选 1 多选 2 阵列*/}
          <Card style={{ margin: '8px 0' }}>
            <Form.Item colon={false} label={<div style={{ width: "80px", textAlign: "left" }}>选项个数限制：</div>}>
              <Radio.Group disabled={csvState == '0' || csvState == '2' || deliverState == 2 || deliverState == 3}
                onChange={e => {
                  saveRules(submitData, () => {
                    submitData['rule2'].state = e.target.value
                    if (e.target.value === '0') {
                      submitData['rule2']['questions'] = JSON.parse(JSON.stringify(defaultData))['rule2']['questions']
                      submitData['rule2']['questions'][0]['id'] = uniKey()
                    }
                  })
                }} value={submitData['rule2'].state}>
                {formatEnumToOptions(radioEnum).map(({ value, label }, radioIndex) => {
                  return <Radio key={uniKey()} value={value}>{label}</Radio>
                })}
              </Radio.Group>
            </Form.Item>
            {submitData['rule2'].state == '1' ? submitData['rule2']['questions'] && submitData['rule2']['questions'].length > 0 ?
              <SortableList2 items={submitData['rule2']['questions']} useDragHandle disableAutoscroll
                onSortEnd={({ oldIndex, newIndex }: any) => {
                  if (oldIndex !== newIndex) {
                    saveRules(submitData, () => {
                      submitData['rule2']['questions'] = arrayMoveImmutable(submitData['rule2']['questions'], oldIndex, newIndex)
                    })
                  }
                }}
              />
              : "" : ''}
          </Card>
          {/* 选项个数限制：-----结束 */}


          {/* 矩阵题选项相同限制 -----开始*/}
          <Card style={{ margin: '8px 0' }}>
            <Form.Item colon={false} label={<div style={{ width: "80px", height: "48px", whiteSpace: "break-spaces", textAlign: "left" }}>矩阵题选项<br />相同限制：</div>} >
              <Radio.Group disabled={csvState == '0' || csvState == '2' || deliverState == 2 || deliverState == 3}
                onChange={e => {
                  saveRules(submitData, () => {
                    submitData['rule3'].state = e.target.value
                    if (e.target.value === '0') {
                      submitData['rule3']['questions'] = JSON.parse(JSON.stringify(defaultData))['rule3']['questions']
                      submitData['rule3']['questions'][0]['id'] = uniKey()
                    }
                  })
                }}
                value={submitData['rule3'].state}>
                {formatEnumToOptions(radioEnum).map(({ value, label }, radioIndex) => {
                  return <Radio key={uniKey()} value={value}>{label}</Radio>
                })}
              </Radio.Group>
            </Form.Item>
            {submitData['rule3'].state == '1' ? submitData['rule3']['questions'] && submitData['rule3']['questions'].length > 0 ?
              <SortableList3 items={submitData['rule3']['questions']} useDragHandle disableAutoscroll
                onSortEnd={({ oldIndex, newIndex }: any) => {
                  if (oldIndex !== newIndex) {
                    saveRules(submitData, () => {
                      submitData['rule3']['questions'] = arrayMoveImmutable(submitData['rule3']['questions'], oldIndex, newIndex)
                    })
                  }
                }}
              />
              : "" : ''}
          </Card>
          {/* 矩阵题选项相同限制 -----结束 */}

          {/* 数据重复（单条数据）:只支持多选和单选并且每条选择题目类型必须相同 type  0 单选 1 多选 2 阵列*/}
          <Card style={{ margin: '8px 0' }}>
            <Form.Item colon={false} label={<div style={{ width: "80px", height: "48px", whiteSpace: "break-spaces", textAlign: "left" }}>数据重复：<br />单条数据：</div>} >
              <Radio.Group disabled={csvState == '0' || csvState == '2' || deliverState == 2 || deliverState == 3}
                onChange={e => {
                  saveRules(submitData, () => {
                    submitData['rule4'].state = e.target.value
                    if (e.target.value === '0') {
                      submitData['rule4']['ruleGroup'] = JSON.parse(JSON.stringify(defaultData))['rule4']['ruleGroup']
                      submitData['rule4']['ruleGroup'][0]['id'] = uniKey()
                    }
                  })
                }} value={submitData['rule4'].state}>
                {formatEnumToOptions(radioEnum).map(({ value, label }, radioIndex) => {
                  return <Radio key={uniKey()} value={value}>{label}</Radio>
                })}
              </Radio.Group>
            </Form.Item>
            {submitData['rule4'].state == '1' ? submitData['rule4']['ruleGroup'] && submitData['rule4']['ruleGroup'].length > 0 ?
              <SortableList4 items={submitData['rule4']['ruleGroup']} useDragHandle disableAutoscroll
                onSortEnd={({ oldIndex, newIndex }: any) => {
                  if (oldIndex !== newIndex) {
                    saveRules(submitData, () => {
                      submitData['rule4']['ruleGroup'] = arrayMoveImmutable(submitData['rule4']['ruleGroup'], oldIndex, newIndex)
                    })
                  }
                }}
              />
              : "" : ''}
          </Card>
          {/* 数据重复（单条数据） -----结束*/}

          {/* 数据重复（多条数据）:只支持多选和单选并且每条选择题目类型必须相同 type  0 单选 1 多选 2 阵列*/}
          <Card style={{ margin: '8px 0' }}>
            <Form.Item colon={false} label={<div style={{ width: "80px", height: "48px", whiteSpace: "break-spaces", textAlign: "left" }}>数据重复：<br />多条数据：</div>} >
              <Radio.Group disabled={csvState == '0' || csvState == '2' || deliverState == 2 || deliverState == 3}
                onChange={e => {
                  saveRules(submitData, () => {
                    submitData['rule4'].state = e.target.value
                    if (e.target.value === '0') {
                      submitData['rule4']['ruleGroup'] = JSON.parse(JSON.stringify(defaultData))['rule4']['ruleGroup']
                      submitData['rule4']['ruleGroup'][0]['id'] = uniKey()
                    }
                  })
                }} value={submitData['rule4'].state}>
                {formatEnumToOptions(radioEnum).map(({ value, label }, radioIndex) => {
                  return <Radio key={uniKey()} value={value}>{label}</Radio>
                })}
              </Radio.Group>
            </Form.Item>
            {submitData['rule4'].state == '1' ? submitData['rule4']['ruleGroup'] && submitData['rule4']['ruleGroup'].length > 0 ?
              <SortableList4 items={submitData['rule4']['ruleGroup']} useDragHandle disableAutoscroll
                onSortEnd={({ oldIndex, newIndex }: any) => {
                  if (oldIndex !== newIndex) {
                    saveRules(submitData, () => {
                      submitData['rule4']['ruleGroup'] = arrayMoveImmutable(submitData['rule4']['ruleGroup'], oldIndex, newIndex)
                    })
                  }
                }}
              />
              : "" : ''}
          </Card>
          {/* 数据重复（多条数据） -----结束*/}

          {/* 文本题重复:只支持多选和单选并且每条选择题目类型必须相同 type  0 单选 1 多选 2 阵列*/}
          <Card style={{ margin: '8px 0' }}>
            <Form.Item colon={false} label={<div style={{ width: "80px", textAlign: "left" }}>文本题重复：</div>} >
              <Radio.Group disabled={csvState == '0' || csvState == '2' || deliverState == 2 || deliverState == 3}
                onChange={e => {
                  saveRules(submitData, () => {
                    submitData['rule5'].state = e.target.value
                    if (e.target.value === '0') {
                      submitData['rule5']['ruleGroup'] = JSON.parse(JSON.stringify(defaultData))['rule5']['ruleGroup']
                      submitData['rule5']['ruleGroup'][0]['id'] = uniKey()
                    }
                  })
                }} value={submitData['rule5'].state}>
                {formatEnumToOptions(radioEnum).map(({ value, label }, radioIndex) => {
                  return <Radio key={uniKey()} value={value}>{label}</Radio>
                })}
              </Radio.Group>
            </Form.Item>
            {submitData['rule5'].state == '1' ? submitData['rule5']['ruleGroup'] && submitData['rule5']['ruleGroup'].length > 0 ?
              <SortableList5 items={submitData['rule5']['ruleGroup']} useDragHandle disableAutoscroll
                onSortEnd={({ oldIndex, newIndex }: any) => {
                  if (oldIndex !== newIndex) {
                    saveRules(submitData, () => {
                      submitData['rule5']['ruleGroup'] = arrayMoveImmutable(submitData['rule5']['ruleGroup'], oldIndex, newIndex)
                    })
                  }
                }}
              />
              : "" : ''}
          </Card>
          {/* 数据重复 -----结束*/}
        </Form> : ""}

        {/* 未交付数据 ( 未清洗||清洗失败：展示 重置、标记按钮  清洗中：重置、刷新按钮  清洗完成：重置、标记和下载)  已交付：下载*/}
        <Row justify='end' style={{ marginTop: "20px", lineHeight: "28px" }} >
          {stateEnum[state + '']}&nbsp;&nbsp;&nbsp;&nbsp;
          {deliverState == 1 ?
            (state == 1 || state == 4 ?
              <div>
                <Button disabled={csvState == '0' || csvState == '2'} type="primary" onClick={reset}>重置</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <Button disabled={csvState == '0' || csvState == '2'} type="primary" onClick={submitRule}>标记</Button>
              </div>
              : state == 2 ?
                <div>
                  <Button disabled={csvState == '0' || csvState == '2'} type="primary" onClick={reset}>重置</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button disabled={csvState == '0' || csvState == '2'} type="primary" onClick={() => getCleanState(ruleGroupId)}>刷新</Button>
                </div> :
                <div>
                  <Button disabled={csvState == '0' || csvState == '2'} type="primary" onClick={reset}>重置</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button disabled={csvState == '0' || csvState == '2'} type="primary" onClick={submitRule}>标记</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button disabled={csvState == '0' || csvState == '2'} onClick={() => { setDownloadvisible(true); }}>下载</Button>
                </div>
            ) : <Button disabled={csvState == '0' || csvState == '2'} onClick={() => { setDownloadvisible(true); }}>下载</Button>}
        </Row>
      </CleanTab>
    </div>

  )
}
export default Index
