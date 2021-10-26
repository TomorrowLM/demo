import React, { useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Modal, Steps, Button, message, Form, Tabs, Card, Checkbox, Row, Col, Divider, Input, Upload, TreeSelect, Select, DatePicker, List, Switch, InputNumber, Tooltip, Radio } from 'antd';
import { KeepAlive } from 'react-activation';
import { Access, useAccess, history, Link } from 'umi';
import { CloseOutlined, DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined, ClusterOutlined, DragOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styles from './index.less';
import { getTaskList, getCustomerPublishTask, getAgentList, getCommonQuestion, getCommonQuestionTemplate, getCommonQuestionTemplateDetail, addTask, updateTask, insertTaskSecond, getAreaInfo, getTaskInfo, getTaskAgentInfo, queryQuestion, updateTaskSecond, deleteMyTemplate, getVerificationCode } from './service';
import { formatTreeValue, assTree, formatData, formatTreeData } from '@/utils/utils';
import { getTreeValue, agentFormat } from './utils';
import { taskTypeOptions, questionTypeOptions, typeOptions, answerVerification, photoSource, watermarkSource, tiOption, tiXuanze, tiWenben, tiPaizhao, tiShiping, tiDingwei, tis } from './const.d';
import copy from 'copy-to-clipboard';
import moment from 'moment';
import Editor from '@/components/Editor'
import UploadImage from '@/components/UploadImage'
import UploadImagess2 from '@/components/UploadImagess2'
import { createBrowserHistory } from 'history';
import TaskPreview from '@/components/TaskPreview'

import { useAliveController } from 'react-activation';

const rhistory = createBrowserHistory();

const { RangePicker } = DatePicker;
const { Step } = Steps;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { SHOW_PARENT, SHOW_ALL } = TreeSelect;

const steps = [
  {
    title: '任务属性'
  },
  {
    title: '编辑问卷'
  },
  // {
  //   title: '保存任务'
  // },
];

var qm;
var INPUT_KEY_INDEX = 0;
var INPUT_KEY_VALUE = new Date().getTime();
var AGENT_INDEX = 0;
var sD = moment().format("YYYY-MM-DD");
var eD = moment().add(1, 'months').add(-1, 'days').format("YYYY-MM-DD");
function uniKey() {
  return "key-" + INPUT_KEY_VALUE + INPUT_KEY_INDEX++;
}
function rand() {
  return Math.floor(Math.random() * (8999)) + 1000;
}
function getTiOption(otherFlag?: string | undefined) {
  let newTipOption = Object.assign({}, tiOption)
  if (otherFlag) {
    newTipOption.otherFlag = otherFlag
    newTipOption.optionContent = "其它"
  }
  let option = JSON.parse(JSON.stringify(newTipOption));
  return option;
}

export default () => {
  const { projectId, projectName, customerId, taskId } = history.location.query;
  const access = useAccess();
  const previewRef = useRef();
  const [loading, setLoading] = useState<boolean>(true);
  const [current, setCurrent] = useState(0);
  const [agentSet, setAgentSet] = useState<Array<any>>([]);
  const [taskSaved, setTaskSaved] = useState<Boolean>(false);
  const [taskStatus, setTaskStatus] = useState('0');
  const [questionDisabled, setQuestionDisabled] = useState(false);

  const { getCachingNodes, dropScope } = useAliveController();
  const cachingNodes: any = getCachingNodes ? getCachingNodes() : [];

  const closeTab = () => {
    dropTab(history.location.pathname + history.location.search)
    if (window.jumpTaskPath) {
      history.push(window.jumpTaskPath)
      window.jumpTaskPath = false
    }
  }

  const dropTab = (targetKey: any) => {
    const { name, id } = cachingNodes.find((node: any) => node.id.slice(0, node.id.length - 2) === targetKey);
    // 如果关闭激活中的 KeepAlive Tab，需要先离开当前路由
    // 触发 KeepAlive unactivated 后再进行 drop
    if (location.pathname + location.search === id.slice(0, id.length - 2)) {
      const unlisten = history.listen(() => {
        setTimeout(() => {
          dropScope(name);
        }, 60)
      })
      unlisten();
      if (cachingNodes.length > 1) {
        // 前往排除当前 node 后的最后一个 tab
        const lastNode = cachingNodes.filter((node: { name: any; }) => node.name !== name).pop();
        history.push(
          lastNode.id.slice(0, lastNode.id.length - 2) || ''
        )
      }
    } else {
      dropScope(name);
    }
  }


  const [task, setTask] = useState<Object>();

  const [customerPublishTaskData, setCustomerPublishTaskData] = useState<Array<any>>([]);
  const [agentListData, setAgentListData] = useState<Array<any>>([]);
  const [commonQuestionData, setCommonQuestionData] = useState<Array<any>>([]);
  const [treeData, setTreeData] = useState<Array<any>>([]);
  const [commonQuestionTemplateData, setCommonQuestionTemplateData] = useState<Array<any>>([]);

  const [questionParams, setQuestionParams] = useState<any>();
  const [questions, setQuestions] = useState<Array<any>>([]);
  const [selQuestionIndex, setSelQuestionIndex] = useState<number>();
  const [questionNames, setQuestionNames] = useState<Array<any>>([]);
  const [questionByt, setQuestionByt] = useState<number>(0);
  const [questionYct, setQuestionYct] = useState<number>(0);
  const [questionT, setQuestionT] = useState<number>(0);
  const [excludeType, setExcludeType] = useState();

  const [dragIndex, setDragIndex] = useState<number>(0);
  const [verificationCode, setVerificationCode] = useState<any>()


  const loadDatas = () => {
    getAreaInfo().then(res => {
      // console.log(formatTreeData(res.data, ''))
      setTreeData(formatTreeData(res.data, ''))
    })
    getCustomerPublishTask(customerId).then(res => {
      if (res.code == 200) {
        let td = assTree(res.data);
        setCustomerPublishTaskData(td);
      } else {
        message.error("加载任务点失败")
      }
    })
    if (!taskId) {
      getAgentList().then(res => {
        if (res.code == 200) {
          let td = formatData(res.data, { "agentId": "value", "agentName": "label" });
          td = agentFormat(td, [])
          setAgentListData(td);
          addAgent(-1, td);
        }
      })
    }
    getCommonQuestion().then(res => {
      if (res.code == 200) {
        setCommonQuestionData(res.data);
      } else {
        message.error("加载常用题目失败")
      }
    })
    getCommonQuestionTemplate().then(res => {
      if (res.code == 200) {
        setCommonQuestionTemplateData(res.data);
      } else {
        message.error("加载模板题目失败")
      }
    })
    if (taskId) {
      Promise.all([getTaskInfo({ taskId }), getTaskAgentInfo(taskId), queryQuestion(taskId), getAgentList()]).then(rs => {
        // console.log(rs)
        if (rs[0].code == 200) {
          let ts = rs[0].data;
          ts['execEndDate'] = ts['execEndDateStr'];
          ts['execStartDate'] = ts['execStartDateStr'];
          ts['putEndDate'] = ts['putEndDateStr'];
          ts['putStartDate'] = ts['putStartDateStr'];
          setTaskStatus(ts.taskStatus)
          setQuestionDisabled(ts.taskStatus != '0')
          setTask(ts)
        } else {
          message.error("加载任务失败")
        }
        if (rs[1].code == 200) {
          setAgentSet(rs[1].data);
          if (rs[3].code == 200) {
            let td = formatData(rs[3].data, { "agentId": "value", "agentName": "label" });
            td = agentFormat(td, rs[1].data)
            setAgentListData(td);
          }
        } else {
          message.error("加载代理失败")
        }
        if (rs[2].code == 200) {
          let qs = rs[2].data.monitorTask
          qs['isAllowBack'] = qs['allowBack'] | '0';
          qs['isCircleFlag'] = qs['circleFlag'] | '0';
          qs['isOneQuestion'] = qs['oneQuestion'] | '0';
          setQuestionParams(qs)
          let qn = rs[2].data.questions
          qn.map((e, index) => {
            if (e['monitorTaskQuestionOptions']) {
              e['options'] = e['monitorTaskQuestionOptions'];
            }
          })
          countQuestion(qn)
          setQuestions(qn)
        } else {
          message.error("加载问卷失败")
        }

        setLoading(false)
      })
    } else {
      setTask({
        agentSet: [],
        brand: '',
        tapeSwitch: 0,
        excludeType: '0',
        excludeTasks: undefined,
        execEndDate: (eD + ' 00:00:00'),
        execStartDate: (sD + ' 00:00:00'),
        mainPic: '',
        projectId: projectId,
        putEndDate: eD,
        putStartDate: sD,
        taskName: '',
        taskType: (customerId == '1' ? '1' : customerId == '2' ? '3' : '4')
      })
      setQuestionParams({ auditSettle: '', circleQuestion: '0', circleTimes: '1', isAllowBack: '1', isCircleFlag: '0', isOneQuestion: '1', projectId: projectId, taskId: '', taskName: '', taskRequire: '', taskType: '', questions: '' })
      setLoading(false)
    }
  }

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const addAgent = (index: number, agentListData: any[]) => {
    // let data = td ? td : agentListData;
    let newAgentSet = JSON.parse(JSON.stringify(agentSet))
    let agent = '';
    // if (data.length > 0) {
    //   let agentIndex = AGENT_INDEX % data.length;
    //   agent = data[agentIndex].value;
    //   AGENT_INDEX++
    // }
    for (let i = 0; i < agentListData.length; i++) {
      if (!agentListData[i].disabled) {
        agent = agentListData[i].value
        agentListData[i].disabled = true
        break;
      }
    }
    getVerificationCode().then(res => {
      if (res.code == 200) {
        let na = { agentId: agent, inviteCode: res.data, areaInfo: '' };
        newAgentSet.splice(index + 1, 0, na);
        setAgentSet(newAgentSet);
      } else {
        message.error(res.msg)
      }
    })
  }
  const removeAgent = (index: number) => {
    let newAgentSet = JSON.parse(JSON.stringify(agentSet))
    console.log(newAgentSet)
    newAgentSet.splice(index, 1);
    setAgentSet(newAgentSet);
  }
  const refreshAgent = () => {
    let newAgentSet = JSON.parse(JSON.stringify(agentSet))
    setAgentSet(newAgentSet);
  }

  const countQuestion = (newQuestions: any[]) => {
    let byt = 0;
    let yct = 0;
    let t = 0;
    let newQuestionNames = [];
    newQuestions.forEach(item => {
      t++;
      if (item.mustAnswerFlag === "1") {
        byt++;
      }
      if (item.hideFlag === "1") {
        yct++;
      }
      if (item.options && item.options.length > 0) {
        item.options.forEach((optionItem: { [x: string]: string; }, index: number) => {
          optionItem['optionOrder'] = "" + (index + 1)

        })
      }
      newQuestionNames.push({ questionTitle: item.questionTitle, mustAnswerFlag: item.mustAnswerFlag });
    });
    setQuestionByt(byt);
    setQuestionYct(yct);
    setQuestionT(t);
    setQuestionNames(newQuestionNames);

    newQuestions.map((e, index) => {
      e['questionQ'] = 'Q' + (index + 1)
      e['questionV'] = (index + 1)
      // 每道题都有唯一的id
      if (typeof e['id'] == 'undefined') {
        e['id'] = String(rand())
      }
    })
  }


  const addQuestion = (question: object) => {

    if (questionDisabled) return
    question = JSON.parse(JSON.stringify(question));
    if (question['commonTitle']) {
      let template = JSON.parse(JSON.stringify(tis[question['commonType']]));
      template['questionTitle'] = question['commonTitle'];
      template['commonId'] = question['commonId'];
      let commonQuestionOptions = question['commonQuestionOptions'];
      if (commonQuestionOptions && commonQuestionOptions.length > 0) {
        template['options'] = [];
        commonQuestionOptions.forEach((item: { [x: string]: any; }) => {
          let option = {
            "optionContent": item["optionTitle"],
            "optionOrder": item["optionOrder"],
            "optionAdd": "",
            "addType": "",
            "jumpQuestionId": '',
            "otherFlag": "0"
          };
          template['options'].push(option);
        });
      }
      question = template;
    }
    let newQuestions = JSON.parse(JSON.stringify(questions))

    if (selQuestionIndex != undefined) {
      newQuestions.splice(selQuestionIndex + 1, 0, question);
    } else {
      newQuestions.push(question);
    }
    console.log(selQuestionIndex, newQuestions)
    countQuestion(newQuestions);
    setQuestions(newQuestions);
  }
  const removeQuestion = (index: number) => {
    if (questionDisabled) return
    let newQuestions = JSON.parse(JSON.stringify(questions))
    newQuestions.splice(index, 1);
    countQuestion(newQuestions);
    setQuestions(newQuestions);
  }
  const addQuestionByTemplate = (templateId: any) => {
    if (questionDisabled) return
    getCommonQuestionTemplateDetail(templateId).then(res => {
      if (res.code == 200) {
        setQuestionParams(undefined)
        let newQuestionParams = JSON.parse(JSON.stringify(questionParams))

        newQuestionParams.isAllowBack = res.data.monitorTask.allowBack | '1'
        newQuestionParams.auditSettle = res.data.monitorTask.auditSettle
        newQuestionParams.isCircleFlag = res.data.monitorTask.circleFlag | '0'
        newQuestionParams.circleQuestion = res.data.monitorTask.circleQuestion | '0'
        newQuestionParams.circleTimes = res.data.monitorTask.circleTimes | '1'
        newQuestionParams.isOneQuestion = res.data.monitorTask.oneQuestion | '1'
        newQuestionParams.taskRequire = res.data.monitorTask.taskRequire

        setQuestionParams(newQuestionParams)

        let newQuestions = new Array()
        res.data.questions.forEach((item: { [x: string]: { optionContent: string; optionOrder: number; optionAdd: string; addType: string; jumpQuestionId: string; otherFlag: string; }[]; questionType: string; options: string | any[] | undefined; }) => {
          if (item.questionType == '1') {
            if (item['monitorTaskQuestionOptions']) {
              item["options"] = item['monitorTaskQuestionOptions']
              delete item['monitorTaskQuestionOptions']
            }

            if (item.options == undefined || item.options.length == 0) {
              item["options"] = [{
                "optionContent": "",
                "optionOrder": 1,
                "optionAdd": "",
                "addType": "",
                "jumpQuestionId": '',
                "otherFlag": "0"
              }];
            }
          }
          newQuestions.push(item);
        });
        countQuestion(newQuestions);
        setQuestions(newQuestions);
      } else {
        message.error(res.msg)
      }
    })
  }


  const addQuestionOption = (index: number, optionIndex: number, option?: any) => {
    let newQuestions = JSON.parse(JSON.stringify(questions))
    if (option) {
      if (Array.isArray(option)) {//批量添加选项
        // 其它选项只能是最后一个 并且其它选项只能有一个
        if (newQuestions[index]["options"][optionIndex].otherFlag == 1) {
          newQuestions[index]["options"] = newQuestions[index]["options"].slice(0, optionIndex).concat(option).concat(newQuestions[index]["options"].slice(optionIndex, optionIndex + 1))
        } else {
          newQuestions[index]["options"] = newQuestions[index]["options"].concat(option);
        }

      } else {//单个添加
        newQuestions[index]["options"].splice(optionIndex, 0, option);
      }
    } else {
      newQuestions[index]["options"].splice(optionIndex, 1);
    }
    // console.log(newQuestions[index]["options"], option)
    countQuestion(newQuestions);
    setQuestions(newQuestions);
  }
  const questionRefresh = () => {
    let newQuestions = JSON.parse(JSON.stringify(questions))
    countQuestion(newQuestions);
    setQuestions(newQuestions);
  }

  useEffect(() => {
    AGENT_INDEX = 0;
    loadDatas();
  }, []);

  const handleImageUploadChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
      setImg(info.file.originFileObj);
    }
  }


  const onFinish0 = (values: any) => {
    let agentSetStr = JSON.stringify(agentSet);
    task.agentSet = agentSetStr;

    if (taskId || taskSaved) {
      updateTask(task).then(res => {
        if (res.code == 200) {
          task.taskId = res.data.taskId;
          questionParams.taskId = res.data.taskId;
          questionParams.taskName = task.taskName;
          questionParams.taskType = task.taskType;
          message.success("更新任务成功")
          window.taskReload = true
          next();
        } else {
          message.error("更新任务失败：" + res.msg)
        }
      })
    } else {
      addTask(task).then(res => {
        if (res.code == 200) {
          task.taskId = res.data.taskId;
          questionParams.taskId = res.data.taskId;
          questionParams.taskName = task.taskName;
          questionParams.taskType = task.taskType;
          message.success("新增任务成功")
          window.taskReload = true
          setTaskSaved(true)
          next();
        } else {
          message.error("新增任务失败：" + res.msg)
        }
      })
    }
  };

  const onFinish1 = (values: any) => {
    if (questionByt <= 0) {
      message.error("至少有一道必选题")
      return;
    }
    let picNum = 0;
    questions.map((item, index) => {
      if (item.questionType != '1' && item.mustAnswerFlag == '1') {
        picNum++;
      }
    })
    if (picNum <= 0) {
      message.error("至少有一道视频或拍照必选题")
      return;
    }

    let blankNum = 0;
    questions.map((item, index) => {
      if (item.questionTitle == '') {
        message.error('Q' + (index + 1) + ' 的标题为空')
        blankNum++
      }
      if (item.questionType == '1') {
        item.options.map((option, oi) => {
          if (option.optionContent == '') {
            message.error('Q' + (index + 1) + ' 的第' + (oi + 1) + '个选项为空')
            blankNum++
          }
        })
      }
    })
    if (blankNum > 0) {
      return;
    }


    questionParams.questions = JSON.stringify(questions)
    if (taskId) {
      updateTaskSecond(questionParams).then(res => {
        if (res.code == 200) {
          message.success("更新问卷成功")
          // closeTab()
          history.push('/adv/projectManager/addTask?projectId=' + projectId + '&projectName=' + projectName + '&customerId=' + customerId)
        } else {
          message.error("更新问卷失败：" + res.msg)
        }
      })
    } else {
      insertTaskSecond(questionParams).then(res => {
        if (res.code == 200) {
          message.success("保存问卷成功")
          // closeTab()
          history.push('/adv/projectManager/addTask?projectId=' + projectId + '&projectName=' + projectName + '&customerId=' + customerId)
        } else {
          message.error("保存问卷失败：" + res.msg)
        }
      })
    }
  };

  const questionCircleChanged = (e) => {
    questionParams.isCircleFlag = e ? '1' : '0'
    if (e) {
      qm = Modal.confirm({
        className: 'noButtonsModal',
        title: '循环题',
        closable: true,
        content: (
          <Form onFinish={params => {
            questionParams.circleQuestion = params.circleQuestion1 + ',' + params.circleQuestion2
            questionParams.circleTimes = params.circleTimes
            qm.destroy()
          }}>
            <Form.Item label="循环题目" style={{ marginBottom: 0 }}>
              <Form.Item
                name="circleQuestion1"
                style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                rules={[{ required: true, message: '请选择循环题目' }]}>
                <Select options={formatData(questions, { "questionQ": "label", "questionV": "value" })} />
              </Form.Item>
              <span style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}>
                到
              </span>
              <Form.Item
                name="circleQuestion2"
                style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                rules={[{ required: true, message: '请选择循环题目' }]}>
                <Select options={formatData(questions, { "questionQ": "label", "questionV": "value" })} />
              </Form.Item>
            </Form.Item>
            <Form.Item
              label="循环次数"
              name="circleTimes"
              rules={[{ required: true, message: '请输入循环次数' }]}>
              <InputNumber min={1} max={100} />
            </Form.Item>

            <Form.Item style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit" >
                确定
              </Button>
              &nbsp;&nbsp;
              <Button type="default" onClick={() => { qm.destroy() }}>
                关闭
              </Button>
            </Form.Item>
          </Form>
        ),
      });
    } else {
      questionParams.circleQuestion = ''
      questionParams.circleTimes = ''
    }
  }


  const dragStart = (e: any, index: number) => {
    console.error("di: " + index)
    setDragIndex(index)
  }
  const dragOver = (e: any) => {
    e.preventDefault();
  }
  const drop = (e: any, index: number) => {
    console.error("di: " + dragIndex + " i: " + index)
    if (dragIndex != index) {
      let newQuestions = JSON.parse(JSON.stringify(questions))
      let fromQuestion = newQuestions[dragIndex]
      let toQuestion = newQuestions[index]
      newQuestions[index] = fromQuestion
      newQuestions[dragIndex] = toQuestion
      countQuestion(newQuestions);
      // console.log(newQuestions)
      //如果选择题移动后，需判定其逻辑设置是否符合正常逻辑
      if (dragIndex > index) {
        if (newQuestions[dragIndex]['questionType'] == '1') {
          newQuestions[dragIndex]['options'] = [...jumpQuestionHandel(newQuestions[dragIndex]['options'], newQuestions, dragIndex)]
        }
      } else {
        if (newQuestions[index]['questionType'] == '1') {
          newQuestions[index]['options'] = [...jumpQuestionHandel(newQuestions[index]['options'], newQuestions, index)]
        }
      }
      // console.log(newQuestions)
      setQuestions(newQuestions);
    }
  }
  /**
   * 当题目变更的时候逻辑设置不符合情况处理
   */
  const jumpQuestionHandel = (monitorTaskQuestionOptions: any, newQuestions: any, operationIndex: number) => {
    let jumpQuestions: any = newQuestions.slice(operationIndex + 1)
    monitorTaskQuestionOptions.forEach((option: any, index: number) => {
      if (option.jumpQuestionId) {
        let isJump = false
        jumpQuestions.forEach((jumpQuestion: any, jumpQuestionIndex: number) => {
          if (option.jumpQuestionId == jumpQuestion.id) {
            isJump = true
          }
        })
        if (!isJump) {
          option.jumpQuestionId = null
        }
      }
    })
    return monitorTaskQuestionOptions
  }
  const deleteTemplate = (id: any) => {
    deleteMyTemplate(id).then(res => {
      if (res.code == 200) {
        message.success('删除模板成功')
        getCommonQuestionTemplate().then(res => {
          if (res.code == 200) {
            setCommonQuestionTemplateData(res.data);
          } else {
            message.error("加载模板题目失败")
          }
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  // 格式化数据
  const formatDataQuestions = (data: Array<any>) => {
    console.log(data)
    const item: Array<any> = [];
    data.forEach((list: any) => {
      const newData: any = {};
      newData['label'] = list['questionQ']+'、'+list['questionTitle'];
      newData["value"] = list['questionId'] || list["id"];
      item.push(newData);
    });
    return item;
  };
  const selectAgent = (e: any, index: number) => {
    agentSet[index].agentId = e
    setAgentListData(agentFormat(agentListData, agentSet))
    setAgentSet(agentSet)
  }
  // 代理指定城市
  const selectTreeData = (value: any, label: any, index: number) => {
    console.log(value, label, formatTreeValue(value, treeData))
    agentSet[index].areaInfo = value.length == 0 ? "" : JSON.stringify(formatTreeValue(value, treeData))
    let newAgentSet = JSON.parse(JSON.stringify(agentSet))
    setAgentSet(newAgentSet)
  }

  const tProps = {
    treeData,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,// SHOW_ALL,
    showSearch: true,
    filterTreeNode: (inputValue: string, treeNode: any) => {
      if (treeNode.title.indexOf(inputValue) != -1) {
        return true
      }
    },
    placeholder: '请选择',
  };

  const fileOnChange = (e: any, index: number) => {
    const { file: { status, response } } = e;
    if (status === 'done' && response) {
      console.log('done')
      if (response.code === 200) {
        console.log('onSuccess', response, agentSet[index].areaInfo)
        agentSet[index].areaInfo = JSON.stringify((agentSet[index].areaInfo ? JSON.parse(agentSet[index].areaInfo) : []).concat(response.data))
        let newAgentSet = JSON.parse(JSON.stringify(agentSet))
        setAgentSet(newAgentSet)
      } else if (response.msg && response.msg.length > 0) {
        message.error(response.msg);
      }
    }
  }
  return (
    <PageContainer title={false} className={styles.mg}>
      {/* <KeepAlive name={taskId ? "修改任务" : "新建任务"} id={history.location.pathname + history.location.search} saveScrollPosition="screen"> */}
      <div className={styles.filterHead} id="area">
        <Steps current={current} style={{ width: '55%', margin: "0 auto" }}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        {loading ? <div className="steps-content" style={{ padding: 160 }}>加载中...</div> :
          <div className="steps-content" style={{ padding: 20 }}>
            <div style={{ display: current == 0 ? 'block' : 'none' }}>
              <Form onFinish={onFinish0}>
                <Divider orientation="left">任务设置</Divider>
                <Row gutter={120}>
                  <Col className="gutter-row" span={12}>
                    <Form.Item label={<span><i className={styles.red}>*</i> 任务名称</span>} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                      <Form.Item
                        name="taskName"
                        initialValue={task.taskName}
                        style={{ display: 'inline-block' }}
                        rules={[{ required: true, message: '请输入任务名称' }]}
                      >
                        <Input key={uniKey()} onChange={e => { task.taskName = e.target.value }} style={{ width: 260 }} />
                      </Form.Item>
                      <Tooltip title={<img src="https://cdnfiles.kanbotong.net/test/kbt-console/1614838462486_1614914810028.png" style={{ width: '100%' }} />} className={styles.agnetpic}>
                        <a href="javascript:;" style={{ margin: '0 8px', display: 'inline-block' }}>
                          示例
                        </a>
                      </Tooltip>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <Form.Item label={[<span><i className={styles.red}>*</i> 任务类型</span>]} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                      <Form.Item
                        name="taskType"
                        initialValue={task.taskType}
                        rules={[{ required: true, message: '请选择任务类型' }]}
                        style={{ display: 'inline-block' }}
                      >
                        <Select key={uniKey()} disabled={questionDisabled} options={taskTypeOptions[customerId]} onChange={e => { task.taskType = e }} style={{ width: 320 }} />
                      </Form.Item>
                      <Tooltip title="京东任务类型细分为线下门店和户外广告，其余客户暂无细分类型">
                        <a href="javascript:;" style={{ margin: '0 8px' }}>
                          ?
                        </a>
                      </Tooltip>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={120}>
                  <Col className="gutter-row" span={12}>
                    <Form.Item label={[<span><i className={styles.red}>*</i> 品牌</span>]} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                      <Form.Item
                        name="brand"
                        initialValue={task.brand}
                        rules={[{ required: true, message: '请输入品牌' }]}
                        style={{ display: 'inline-block' }}
                      >
                        <Input key={uniKey()} onChange={e => { task.brand = e.target.value }} style={{ width: 260 }} />
                      </Form.Item>
                      <Tooltip title="例如：京东">
                        <a href="javascript:;" style={{ margin: '0 8px' }}>
                          ?
                        </a>
                      </Tooltip>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <Form.Item label={[<span><i className={styles.red}>*</i> 投放周期</span>]} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                      <Form.Item
                        name="putDate"
                        initialValue={[moment(task.putStartDate, 'YYYY-MM-DD'), moment(task.putEndDate, 'YYYY-MM-DD')]}
                        rules={[{ required: true, message: '请选择投放周期' }]}
                        style={{ display: 'inline-block' }}
                      >
                        <RangePicker key={uniKey()}
                          format="YYYY-MM-DD"
                          style={{ width: 320 }}
                          onChange={(ds, dss) => { task.putStartDate = dss[0]; task.putEndDate = dss[1]; }} />
                      </Form.Item>
                      <Tooltip title="投放周期即检查目标存在的开始和结束日期">
                        <a href="javascript:;" style={{ margin: '0 8px' }}>
                          ?
                        </a>
                      </Tooltip>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={120}>
                  <Col className="gutter-row" span={12}>
                    <Form.Item label={[<span><i className={styles.red}>*</i> 主图</span>]} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                      <Form.Item
                        name="mainPic"
                        style={{ display: 'inline-block' }}
                        initialValue={task.mainPic}
                        rules={[{ required: true, message: '请上传主图' }]}
                      >
                        <UploadImage key={uniKey()} imageUrl={task.mainPic} onChange={e => { task.mainPic = e }} >
                        </UploadImage>
                      </Form.Item>
                      <Tooltip title={<img src="https://cdnfiles.kanbotong.net/test/kbt-console/1614838462486_1614914810028.png" style={{ width: '100%' }} />}>
                        <a href="javascript:;" style={{ margin: '0 8px', display: 'inline-block' }}>
                          示例
                        </a>
                      </Tooltip>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <Form.Item label={[<span><i className={styles.red}>*</i> 执行周期</span>]} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                      <Form.Item
                        name="mainPic"
                        style={{ display: 'inline-block' }}
                        name="execDate"
                        initialValue={[moment(task.execStartDate, 'YYYY-MM-DD HH:mm:ss'), moment(task.execEndDate, 'YYYY-MM-DD HH:mm:ss')]}
                        rules={[{ required: true, message: '请选择执行周期' }]}
                      >
                        <RangePicker key={uniKey()}
                          showTime={{ format: 'HH:mm:ss' }}
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: 320 }}
                          onChange={(ds, dss) => { task.execStartDate = dss[0]; task.execEndDate = dss[1] }}
                        />
                      </Form.Item>
                      <Tooltip title="执行周期即检查目标开始和结束的时间，超过该时间任务将被自动下架">
                        <a href="javascript:;" style={{ margin: '0 8px' }}>
                          ?
                        </a>
                      </Tooltip>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={120}>
                  <Col className="gutter-row" span={12}>
                    <Form.Item label={[<span><i className={styles.red}>*</i> 全程录音</span>]} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                      <Form.Item
                        name="tapeSwitch"
                        initialValue={task.tapeSwitch}
                        style={{ display: 'inline-block' }}
                      >
                        <Radio.Group onChange={(e: any) => { task.tapeSwitch = e.target.value }}>
                          <Radio value={0}>不开启</Radio>
                          <Radio value={1}>开启</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Form.Item>

                  </Col>
                  <Col className="gutter-row" span={12}>
                    {customerId != '1' ? <Form.Item
                      label="排除点位方式"
                      name="excludeType"
                      initialValue={task.excludeType}
                      style={{ marginLeft: 8 }}
                      labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}
                    >
                      <Radio.Group key={uniKey()} onChange={e => { task.excludeType = e.target.value }}>
                        <Radio value={'0'}>点位</Radio>
                        <Radio value={'1'}>小区</Radio>
                      </Radio.Group>
                    </Form.Item> : null}
                    <Form.Item
                      label="排除点位"
                      name="excludeTasks"
                      initialValue={task.excludeTasks ? task.excludeTasks.split(',') : []}
                      style={{ marginLeft: 8 }}
                      labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                      <TreeSelect key={uniKey()}
                        treeData={customerPublishTaskData}
                        treeCheckable={true}
                        showCheckedStrategy={SHOW_ALL}
                        placeholder='请选择'
                        style={{ width: 320 }}
                        onChange={e => { task.excludeTasks = e.toString() }}
                      ></TreeSelect>
                    </Form.Item>
                  </Col>
                </Row>
                <Divider orientation="left">代理设置</Divider>
                <Row gutter={120} justify="end" style={{ padding: "0 0 10px 0" }}>
                  <Col span={6} >
                    <Button type="primary" href='/adconsole/task/download_city'>省市模板下载</Button>
                  </Col>
                </Row>
                {
                  agentSet.map((item, index) => {
                    return <Row gutter={120}>
                      <Col span={5} style={{ paddingRight: "0" }}>
                        <Form.Item
                          label="代理名称">
                          <Select key={uniKey()} options={agentListData} defaultValue={item.agentId} onChange={(e) => { selectAgent(e, index) }} />
                        </Form.Item>
                      </Col>
                      <Col span={4} style={{ paddingRight: "0" }}>
                        <Form.Item
                          label="邀请码">
                          <Input key={uniKey()} disabled={true} value={item.inviteCode} />
                        </Form.Item>
                      </Col>
                      <Col span={7} style={{ paddingRight: "0" }}>
                        <Form.Item
                          label="省市">
                          <TreeSelect
                            // key={uniKey()}
                            {...tProps}
                            value={getTreeValue(item.areaInfo)}
                            onChange={(value, label, extra) => { selectTreeData(value, label, index) }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={2} style={{ paddingRight: "0", paddingLeft: "10px", }}>
                        <Upload
                          name="file_upload"
                          accept=".xls,.xlsx"
                          action="/adconsole/task/import"
                          onChange={e => fileOnChange(e, index)}
                          maxCount={1}
                        >
                          <Button type="primary">省市批量上传</Button>
                        </Upload>
                      </Col>
                      <Col span={6} style={{ paddingRight: "0" }}>
                        <Form.Item>
                          <Button onClick={() => { addAgent(index, agentListData) }} className="agent-btn">新增</Button>
                          {/* <Button onClick={()=>{copy(item.code);  message.success('复制成功');}} className="agent-btn" style={{display:questionDisabled?'none':'inline'}}>复制</Button> */}
                          <Button onClick={() => { removeAgent(index) }} className="agent-btn" disabled={agentSet.length == 1}>删除</Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  })
                }
                <div className="steps-action">
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      下一步
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
            <div style={{ display: current == 1 ? 'block' : 'none' }}>
              <Form onFinish={onFinish1}>
                <Row gutter={20}>
                  <Col className="gutter-row" span={5}>
                    <Tabs type="card">
                      <TabPane tab="常用题" key="1">
                        <List
                          split={false}
                          dataSource={commonQuestionData}
                          renderItem={item => <List.Item><Button disabled={questionDisabled} type="text" onClick={() => { addQuestion(item) }}>{item.commonName}</Button></List.Item>}
                        />
                      </TabPane>
                      <TabPane tab="题型" key="2">
                        <List
                          split={false}>
                          <List.Item><Button disabled={questionDisabled} type="text" onClick={() => { addQuestion(tiXuanze) }}>选择题</Button></List.Item>
                          <List.Item><Button disabled={questionDisabled} type="text" onClick={() => { addQuestion(tiWenben) }}>文本题</Button></List.Item>
                          <List.Item><Button disabled={questionDisabled} type="text" onClick={() => { addQuestion(tiPaizhao) }}>拍照题</Button></List.Item>
                          <List.Item><Button disabled={questionDisabled} type="text" onClick={() => { addQuestion(tiShiping) }}>视频题</Button></List.Item>
                          <List.Item><Button disabled={questionDisabled} type="text" onClick={() => { addQuestion(tiDingwei) }}>定位题</Button></List.Item>
                        </List>
                      </TabPane>
                      <TabPane tab="模板" key="3">
                        <div><b>共享模板</b></div>
                        <List
                          split={false}
                          dataSource={commonQuestionTemplateData['share']}
                          renderItem={item => <List.Item><Button disabled={questionDisabled} type="text" onClick={() => { addQuestionByTemplate(item.templateId) }}>{item.templateName}</Button></List.Item>} />
                        <div><br /><br /><b>我的模板</b></div>
                        <List
                          split={false}
                          dataSource={commonQuestionTemplateData['self']}
                          renderItem={item => <List.Item>
                            <Button disabled={questionDisabled} type="text" onClick={() => { addQuestionByTemplate(item.templateId) }}>{item.templateName == null ? ' - ' : item.templateName}</Button>
                            <Button type="text" onClick={e => { deleteTemplate(item.templateId) }} icon={<CloseOutlined />}></Button>
                          </List.Item>} />
                      </TabPane>
                    </Tabs>
                  </Col>
                  <Col className="gutter-row" span={14} style={{ height: "760px", overflowY: "auto" }}>
                    {questionParams ?
                      [<Form.Item
                        label="任务要求"
                        name="taskRequire"
                        className={styles.labelW}
                        initialValue={questionParams.taskRequire}
                        rules={[{ required: true, message: '请输入任务要求', type: 'string' }]}
                        labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}
                      >
                        <Editor disabled={questionDisabled} defaultValue={questionParams.taskRequire} key={uniKey()} onChange={e => { questionParams.taskRequire = e }}></Editor>
                      </Form.Item>,
                      <Form.Item
                        label="审核与结算"
                        name="auditSettle"
                        initialValue={questionParams.auditSettle}
                        rules={[{ required: true, message: '请输入审核与结算', type: 'string' }]}
                        labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}
                      >
                        <Editor disabled={questionDisabled} defaultValue={questionParams.auditSettle} key={uniKey()} onChange={e => { questionParams.auditSettle = e }}></Editor>
                      </Form.Item>] : null
                    }
                    <Form.Item
                      label="  "
                      colon={false}
                      rules={[{ required: true, message: '请选择问题' }]}>
                      {
                        questions.map((item, index) => {
                          let question;
                          switch (item.questionType) {
                            // 选择题
                            case "1":
                              question = [<List
                                split={false}
                                dataSource={item.options}
                                renderItem={(itemOption: any, optionIndex: number) => {
                                  return (<List.Item>
                                    <Row align="middle"  onClick={(e) => {e.stopPropagation()}}>
                                      <Col flex={1}><Checkbox disabled={questionDisabled} style={{ width: '35px' }}></Checkbox>&nbsp;</Col>
                                      {itemOption.otherFlag == "1" ? itemOption.optionContent :
                                        <Col flex={2}>
                                          <Input disabled={questionDisabled} key={uniKey()} defaultValue={itemOption.optionContent}
                                            onChange={e => {
                                              let reg = /\+|\#|\$|\【|\】|\{|\}|\&|\|/g
                                              if (reg.test(e.target.value)) {
                                                itemOption.optionContent = itemOption.optionContent
                                                message.error("请不要输入特殊字符！")
                                                setQuestions(JSON.parse(JSON.stringify(questions)))
                                              } else {
                                                itemOption.optionContent = e.target.value
                                              }
                                            }} style={{ width: '253px', marginRight: '10px' }}></Input>
                                        </Col>}
                                      <Col flex={3}>
                                        {itemOption.otherFlag == "1" ? "" : <Button disabled={questionDisabled} onClick={() => { addQuestionOption(index, optionIndex + 1, getTiOption()); }} type="text" shape="circle" icon={<PlusCircleOutlined />} />}
                                        <Button disabled={questionDisabled} onClick={() => { addQuestionOption(index, optionIndex); }} type="text" shape="circle" icon={<MinusCircleOutlined />} />
                                        {/* <Button disabled={questionDisabled} type="text" shape="circle" icon={<PictureOutlined />} /> */}
                                        {itemOption.otherFlag == "1" ? "" : <Button id={'jumpButton' + item.id + '' + optionIndex} disabled={questionDisabled || (index == (questions.length - 1))} type="text" shape="circle" icon={<ClusterOutlined />} onClick={e => {
                                          qm = Modal.confirm({
                                            className: 'noButtonsModal',
                                            title: '跳转到指定题目',
                                            closable: true,
                                            content: (
                                              <Form onFinish={params => {
                                                itemOption.jumpQuestionId = params.jumpQuestionId
                                                let btn = document.getElementById('jumpButton' + item.id + '' + optionIndex);
                                                if (btn) {
                                                  let color = (itemOption.jumpQuestionId == null || itemOption.jumpQuestionId == '') ? 'inherit' : '#7979f5'
                                                  btn.style.color = color
                                                }
                                                qm.destroy()
                                              }}>
                                                <Form.Item
                                                  label="题目"
                                                  name="jumpQuestionId"
                                                  initialValue={itemOption.jumpQuestionId}>
                                                  <Select options={formatDataQuestions(questions.slice(index + 1))} style={{ width: "260px" }} allowClear={true} />
                                                </Form.Item>
                                                <Form.Item style={{ textAlign: "right" }}>
                                                  <Button type="primary" htmlType="submit" >
                                                    确定
                                                  </Button>
                                                  &nbsp;&nbsp;
                                                  <Button type="default" onClick={() => { qm.destroy() }}>
                                                    关闭
                                                  </Button>
                                                </Form.Item>
                                              </Form>
                                            ),
                                            okButtonProps: { style: { display: "none" } },
                                            cancelButtonProps: { style: { display: "none" } }
                                          });
                                        }} style={{ color: (itemOption.jumpQuestionId == null || itemOption.jumpQuestionId == '') ? 'inherit' : '#7979f5' }} />}
                                      </Col>
                                    </Row>
                                  </List.Item>)
                                }
                                } />,
                              <Form.Item
                                label="">
                                <Row> 
                                  <Col span={20}>
                                    <Button type="primary"
                                      disabled={questionDisabled}
                                      onClick={e => {
                                        e.stopPropagation()
                                        qm = Modal.confirm({
                                          className: 'noButtonsModal',
                                          title: '批量增加选项',
                                          closable: true,
                                          content: (
                                            <Form onFinish={params => {
                                              // console.log(params)
                                              let addOptionsList = params.optionsStr.split("\n").map((optionItem: any, optionIndex: number) => {
                                                let newOlption = getTiOption()
                                                newOlption.optionContent = optionItem
                                                return newOlption
                                              })
                                              addQuestionOption(index, item.options.length - 1, addOptionsList);
                                              qm.destroy()
                                            }}>
                                              <Form.Item
                                                label="选项"
                                                name="optionsStr"
                                              >
                                                <TextArea rows={4}></TextArea>
                                              </Form.Item>
                                              <Form.Item style={{ textAlign: "right" }}>
                                                <Button type="primary" htmlType="submit" >确定</Button>
                                                &nbsp;&nbsp;
                                                <Button type="default" onClick={() => { qm.destroy() }}>关闭</Button>
                                              </Form.Item>
                                            </Form>
                                          ),
                                          okButtonProps: { style: { display: "none" } },
                                          cancelButtonProps: { style: { display: "none" } }
                                        });
                                      }} >
                                      批量增加选项
                                    </Button>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button type="primary" disabled={questionDisabled ||item.options.length>0&&item.options[item.options.length - 1].otherFlag&&item.options[item.options.length - 1].otherFlag == 1} onClick={(e) =>{e.stopPropagation(); addQuestionOption(index, item.options.length, getTiOption("1"))}}>
                                      增加其他选项
                                    </Button>
                                  </Col>
                                </Row>
                              </Form.Item>,
                              <Form.Item
                                label="类型">
                                <Row >
                                  <Col span={10}>
                                    <Select onClick={(e) => {e.stopPropagation()}} disabled={questionDisabled} options={questionTypeOptions} key={uniKey()} defaultValue={item.selectDisplayType} onChange={e => { item.selectDisplayType = e; }}></Select>
                                  </Col>
                                </Row>
                              </Form.Item>]
                              break;

                              {/* 文本题 开始 */ }
                            case "2":
                              question = [
                                <Form.Item
                                  label="类型">
                                  <Row >
                                    <Col span={10}>
                                      <Select onClick={(e) => {e.stopPropagation()}} disabled={questionDisabled} options={typeOptions} key={uniKey()} defaultValue={item.textDisplayType} onChange={e => { item.textDisplayType = e; }}></Select>
                                    </Col>
                                  </Row>
                                </Form.Item>,
                                <Form.Item
                                  label="答案验证">
                                  <Row>
                                    <Col span={10}>
                                      <Select onClick={(e) => {e.stopPropagation()}} disabled={questionDisabled} options={answerVerification} key={uniKey()} defaultValue={item.answerCheck} onChange={e => { item.answerCheck = e; }}></Select>
                                    </Col>
                                  </Row>
                                </Form.Item>,
                                <Form.Item
                                  label="字数限制">
                                  <Input.Group>
                                    <Row gutter={8}>
                                      <Col span={5}>
                                        <InputNumber onClick={(e) => {e.stopPropagation()}} disabled={questionDisabled} key={uniKey()} defaultValue={item.minWordNum} onChange={e => { item.minWordNum = e; }} />
                                      </Col>
                                      <Col span={5}>
                                        <InputNumber onClick={(e) => {e.stopPropagation()}} disabled={questionDisabled} key={uniKey()} defaultValue={item.maxWordNum} onChange={e => { item.maxWordNum = e; }} />
                                      </Col>
                                    </Row>
                                  </Input.Group>
                                </Form.Item>]
                              break;
                              {/* 文本题 结束 */ }

                              {/* 拍照题 开始 */ }
                            case "3":
                              question = [
                                <Form.Item
                                  label="上传图片"
                                >
                                  <UploadImagess2 key={uniKey()} disabled={questionDisabled} imageUrl={item.picDemo} onChange={e => { item.picDemo = e }}>
                                  </UploadImagess2>
                                </Form.Item>,
                                <Form.Item
                                  label="照片来源">
                                  <Row>
                                    <Col span={8}>
                                      <Select onClick={(e) => {e.stopPropagation()}} disabled={questionDisabled} options={photoSource} key={uniKey()} defaultValue={item.picSource} onChange={e => { item.picSource = e; }}></Select>
                                    </Col>
                                  </Row>
                                </Form.Item>,
                                <Form.Item
                                  label="水印来源">
                                  <Row>
                                    <Col span={8}>
                                      <Select onClick={(e) => {e.stopPropagation()}} disabled={questionDisabled} options={watermarkSource} key={uniKey()} defaultValue={item.picWatermarkSource} onChange={e => { item.picWatermarkSource = e; }}></Select>
                                    </Col>
                                  </Row>
                                </Form.Item>,
                                <Form.Item
                                  label="照片数量限制">
                                  <Input.Group>
                                    <Row gutter={8}>
                                      <Col span={5}>
                                        <InputNumber onClick={(e) => {e.stopPropagation()}} disabled={questionDisabled} key={uniKey()} defaultValue={item.minPicNum} onChange={e => { item.minPicNum = e; }} />
                                      </Col>
                                      <Col span={5}>
                                        <InputNumber onClick={(e) => {e.stopPropagation()}} disabled={questionDisabled} key={uniKey()} defaultValue={item.maxPicNum} onChange={e => { item.maxPicNum = e; }} />
                                      </Col>
                                    </Row>
                                  </Input.Group>
                                </Form.Item>]
                              break;
                              {/* 拍照题 结束 */ }

                              {/* 拍照题 开始 */ }
                            case "4":
                              question = [
                                <Form.Item
                                  label="上传视频"
                                  valuePropName="fileList"
                                >
                                  <UploadImage disabled={questionDisabled} type="video"
                                    key={uniKey()}
                                    imageUrl={item.videoDemo}
                                    onChange={e => { item.videoDemo = e }}
                                  >
                                  </UploadImage>
                                </Form.Item>,
                                <Form.Item
                                  label="视频来源">
                                  <Row>
                                    <Col span={8}>
                                      <Select onClick={(e) => {e.stopPropagation()}} disabled={questionDisabled} options={photoSource} key={uniKey()} defaultValue={item.videoSource} onChange={e => { item.videoSource = e; }}></Select>
                                    </Col>
                                  </Row>
                                </Form.Item>,
                                <Form.Item
                                  label="水印来源">
                                  <Row>
                                    <Col span={8}>
                                      <Select onClick={(e) => {e.stopPropagation()}} disabled={questionDisabled} options={watermarkSource} key={uniKey()} defaultValue={item.videoWatermarkSource} onChange={e => { item.videoWatermarkSource = e; }}></Select>
                                    </Col>
                                  </Row>
                                </Form.Item>,
                                <Form.Item
                                  label="视频数量限制">
                                  <Input.Group>
                                    <Row gutter={8}>
                                      <Col span={5}>
                                        <InputNumber onClick={(e) => {e.stopPropagation()}} disabled={questionDisabled} key={uniKey()} defaultValue={item.minVideoNum} onChange={e => { item.minVideoNum = e; }} />
                                      </Col>
                                      <Col span={5}>
                                        <InputNumber onClick={(e) => {e.stopPropagation()}} disabled={questionDisabled} key={uniKey()} defaultValue={item.maxVideoNum} onChange={e => { item.maxVideoNum = e; }} />
                                      </Col>
                                    </Row>
                                  </Input.Group>
                                </Form.Item>,
                                <Form.Item
                                  label="视频时长限制">
                                  <Input.Group>
                                    <Row gutter={8}>
                                      <Col span={5}>
                                        <InputNumber onClick={(e) => {e.stopPropagation()}} disabled={questionDisabled} key={uniKey()} defaultValue={item.minVideoDuration} onChange={e => { item.minVideoDuration = e; }} />
                                      </Col>
                                      <Col span={5}>
                                        <InputNumber onClick={(e) => {e.stopPropagation()}} disabled={questionDisabled} key={uniKey()} defaultValue={item.maxVideoDuration} onChange={e => { item.maxVideoDuration = e; }} />
                                      </Col>
                                    </Row>
                                  </Input.Group>
                                </Form.Item>]
                              break;
                              {/* 拍照题 结束 */ }
                              {/* 定位题 开始 */ }
                            case "6":
                              question = [
                                <Form.Item
                                  label="获取位置">
                                  <Row>
                                    <Col span={10}>
                                      <Button onClick={(e) => {e.stopPropagation()}} disabled icon={<EnvironmentOutlined />}>获取位置</Button>
                                    </Col>
                                  </Row>
                                </Form.Item>
                              ]
                              break;
                              {/* 定位题 结束 */ }
                          }
                          return <Card type="inner"
                            key={'k' + index}
                            draggable={true}
                            onDragStart={(e) => dragStart(e, index)}
                            onDragOver={(e) => dragOver(e)}
                            onDrop={(e) => drop(e, index)}
                            onClick={() => {
                              if (selQuestionIndex != undefined) {
                                if (selQuestionIndex == index) {
                                  setSelQuestionIndex(undefined)
                                } else {
                                  setSelQuestionIndex(index)
                                }
                              } else {
                                setSelQuestionIndex(index)
                              }

                            }}
                            style={{ marginBottom: '20px', border: selQuestionIndex === index ? '1px solid rgba(226,36,60,1)' : '1px solid #f0f0f0' }}
                            title={[<Input
                              onClick={(e) => { e.stopPropagation() }}
                              disabled={questionDisabled}
                              addonBefore={'Q' + (index + 1)} key={uniKey()}
                              defaultValue={item.questionTitle}
                              onChange={e => {
                                let reg = /\+|\#|\$|\【|\】|\{|\}|\&|\|/g
                                // console.log(e.target.value, item.questionTitle)
                                if (reg.test(e.target.value)) {
                                  item.questionTitle = item.questionTitle
                                  message.error("请不要输入特殊字符！")
                                  setQuestions(JSON.parse(JSON.stringify(questions)))
                                } else {
                                  item.questionTitle = e.target.value;
                                }
                              }}
                              onBlur={e => { countQuestion(questions); }}
                              placeholder="请输入内容"
                              style={{ width: "410px" }}></Input>]}
                            extra={[<Checkbox onClick={(e) => { e.stopPropagation() }} disabled={questionDisabled} key={uniKey()} checked={item.mustAnswerFlag == '1'}
                              onChange={e => { item.mustAnswerFlag = e.target.checked ? '1' : '0'; countQuestion(questions); }}>必答</Checkbox>,
                            <Checkbox onClick={(e) => { e.stopPropagation() }} disabled={questionDisabled} key={uniKey()} checked={item.hideFlag == '1'} onChange={e => { item.hideFlag = e.target.checked ? '1' : '0'; countQuestion(questions); }}>隐藏</Checkbox>,
                            <Button disabled={questionDisabled} icon={<DragOutlined />} onClick={(e) => { e.stopPropagation() }}></Button>,
                            <Button disabled={questionDisabled} icon={<DeleteOutlined />} onClick={(e) => { e.stopPropagation(); removeQuestion(index) }} style={{ marginLeft: "5px" }}></Button>]}>
                            <div><Input onClick={(e) => {
                              e.stopPropagation()
                            }} disabled={questionDisabled} addonBefore="备注" key={uniKey()} defaultValue={item.note} onChange={e => {item.note = e.target.value }} placeholder="请输入答案判断标准等提示" style={{ width: "410px", marginBottom: '20px' }}></Input></div>
                            <div>{question}</div>
                          </Card>
                        })
                      }
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={5}>
                    <Tabs type="card">
                      <TabPane tab="大纲" key="1">
                        <div>必答 {questionByt}/{questionT} 题,隐藏 {questionYct}/{questionT} 题</div>
                        <List
                          split={false}
                          dataSource={questionNames}
                          renderItem={(item, index) => <List.Item><span style={{ color: 'red' }}>{item.mustAnswerFlag == '1' ? '*' : ''}</span> {'Q' + (index + 1) + ' ' + ((item.questionTitle || item.questionTitle != null) ? item.questionTitle : '')}</List.Item>} />
                      </TabPane>
                      <TabPane tab="设置" key="2">
                        {questionParams ?
                          [<Form.Item
                            label="一页一题"
                            initialValue={questionParams.isOneQuestion == '1'}
                          >
                            <Switch disabled={questionDisabled} key={uniKey()} defaultChecked={questionParams.isOneQuestion == '1'} onChange={e => { questionParams.isOneQuestion = e ? '1' : '0'; }} />
                          </Form.Item>,
                          <Form.Item
                            label="允许回退"
                            initialValue={questionParams.isAllowBack == '1'}
                          >
                            <Switch disabled={questionDisabled} key={uniKey()} defaultChecked={questionParams.isAllowBack == '1'} onChange={e => { questionParams.isAllowBack = e ? '1' : '0'; }} />
                          </Form.Item>,
                          <Form.Item
                            label="循环题目"
                            initialValue={questionParams.isCircleFlag == '1'}
                          >
                            <Switch disabled={questionDisabled} key={uniKey()} defaultChecked={questionParams.isCircleFlag == '1'} onChange={questionCircleChanged} />
                          </Form.Item>] : null}
                      </TabPane>
                    </Tabs>
                  </Col>
                </Row>
                <div className="steps-action">
                  <Form.Item>
                    <Button type="primary" onClick={prev}>
                      上一步
                    </Button>
                    &nbsp;&nbsp;
                    {questionDisabled ? null : (
                      <Button type="primary" htmlType="submit" >
                        保存
                      </Button>
                    )}
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
        }
        <TaskPreview previewRef={previewRef}></TaskPreview>
      </div>
      {/* </KeepAlive> */}
    </PageContainer>
  )
}
