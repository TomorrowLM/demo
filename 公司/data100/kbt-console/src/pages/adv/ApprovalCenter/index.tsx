import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { Link, Access, useAccess, history, useModel } from 'umi';
import { Button, Space, DatePicker, Tooltip, Radio, Select, TreeSelect, message, Modal, Input, Tag, Row, Col } from 'antd';
import { QuestionCircleOutlined, PictureOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { KeepAlive, useAliveController } from 'react-activation';
import ProProvider from '@ant-design/pro-provider';
import CreateModal from '@/components/CreateModal';
import styles from './index.less';
import moment from 'moment';
import { isXsScreen } from '@/utils/utils';
import emitter from '@/utils/events';
import GeneralForm from '@/components/Form';
import { EyeOutlined } from '@ant-design/icons';
import { QueryParams, TableListItem } from './data.d';
import { columns, formColumns, timeTypeLists, flagEnum } from './const.d';
import { formatDataToEnum } from '@/utils/utils';
import { watermarkAmend, getDateRange, listProject, listStaff, listTask, getCityLevelInfo, getAreaInfo, getPointCount, getPointDetail, systemDept, watermarkAmendOne } from './service';



const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { SHOW_ALL } = TreeSelect;

let renderChartParams = {
  dateType: '3',
  startDate: '',
  endDate: '',
  accountType: '0',
  accountBelongType: '0',
  trendType: '2',
}
let curColumnsData: Array<any> = [];
let copyActionRef: any = null;
let answerIds: number[] = [];

let cacheData = {
  pageNo: 1,
  pageSize: 20,
  projectId: "",
  taskId: "",
  taskList: [],
  projectList: [],
  taskType: "",
  cityLevelList: [],
  treeData: [],
  areaInfoValue: { "planNum": 0, "completeNum": 0, "completeRate": 0, "passNum": 0, "passRate": 0, "failNum": 0, "failPate": 0 },
  staffMobile: "",
  startDate: "",
  endDate: "",
  agentName: "",
  field: "",
  keyword: "",
  firstAuditStatus: "0",
  firstAuditUser: "",
  flag: "0",
  progress: "0",
  secondAuditStatus: "0",
  secondAuditUser: "",
  city: "",
  cityLevel: "",
  province: "",
  curData: "",
  provinceCity: [],
  usersOptions: [],
  pointDetailData: [],
  queryParams: {},
  fastPoint: [],
}
let roleId: string = ""//roleId 1:超级管理员 2：管理员 3：一审 4：二审
let dd: any = new Date()
let nowDate: string = dd.getFullYear() + "-" + (dd.getMonth() + 1) + "-" + dd.getDate()

/**
 * 处理查询与下载列表时的参数
 * @param params
 */

const getQueryParams = (params: any): QueryParams => {
  const { pageSize, agentName, field, firstAuditStatus, firstAuditUser, flag, inviteCode, keyword, pageNo, pointTable, progress, secondAuditStatus, secondAuditUser, staffMobile, startDate, endDate, curTaskValue, city, cityLevel, province } = params;
  return {
    pageNo: pageNo,
    pageSize,
    agentName: agentName || '',
    field: field || '',
    firstAuditStatus: firstAuditStatus || '0',
    firstAuditUser: firstAuditUser || '',
    flag: flag || '0',
    inviteCode: inviteCode || '',
    keyword: keyword || '',
    // pointTable: pointTable || '',
    progress: progress || '0',
    secondAuditStatus: secondAuditStatus || '0',
    secondAuditUser: secondAuditUser || '',
    staffMobile: staffMobile || '',
    startDate: startDate || '',
    endDate: endDate || '',
    taskId: curTaskValue || '',
    city: city || '',
    cityLevel: cityLevel || '',
    province: province || '',

  }
}


function getCity(data: any): string {
  if (data) {
    if (typeof data === "string") {
      return data.startsWith("_") ? undefined : data;
    } else {
      let citys = "";
      data.forEach((city: string) => {
        if (!city.startsWith("_")) {
          if (citys.length > 0) {
            citys += ",";
          }
          citys += city;
        }
      });
      return citys;
    }
    let citys = "";
    data.forEach((city: string) => {
      if (!city.startsWith("_")) {
        if (citys.length > 0) {
          citys += ",";
        }
        citys += city;
      }
    });
    return citys;
  }
  return "";
}

function getProvince(data: any): string {
  if (data) {
    if (typeof data === "string") {
      return data.startsWith("_") ? data.substring(1, data.length) : undefined;
    } else {
      let citys = "";
      data.forEach(city => {
        if (city.startsWith("_")) {
          if (citys.length > 0) {
            citys += ",";
          }
          citys += city.substring(1, city.length);
        }
      });
      return citys;
    }
  } else {
    return "";
  }
}

export default () => {
  const values = useContext(ProProvider);
  const { getCachingNodes } = useAliveController();
  const cachingNodes = getCachingNodes ? getCachingNodes() : [];


  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [hackValue, setHackValue] = useState<Array<any>>([cacheData.startDate ? moment(cacheData.startDate, 'YYYY/MM/DD') : null, cacheData.endDate ? moment(cacheData.endDate, 'YYYY/MM/DD') : null]);//时间空间Moment数组
  const [curData, setCurData] = useState(cacheData.curData || '');
  // const [value, setValue] = useState<Array<any>>([]);//时间控件string数组 

  const [listValue, setListValue] = useState<Array<any>>(cacheData.projectList);//项目
  const [taskValue, setTaskValue] = useState<Array<any>>(cacheData.taskList);

  const [curListValue, setCurListValue] = useState<any>(history.location.query.projectId || cacheData.projectId);//项目ID
  const [curTaskValue, setCurTaskValue] = useState<any>(history.location.query.taskId || cacheData.taskId);
  const [taskType, setTaskType] = useState<string>(history.location.query.taskType || cacheData.taskType);
  const [cityLevelValue, setCityLevelValue] = useState<Array<any>>(cacheData.cityLevelList);
  const [cityLevel, setCityLevel] = useState(cacheData.cityLevel);
  const [areaInfoValue, setAreaInfoValue] = useState<Object>(cacheData.areaInfoValue);
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>(curColumnsData);
  const [treeData, setTreeData] = useState(cacheData.treeData)
  const [provinceCity, setProvinceCity] = useState<Array<any>>(cacheData.provinceCity)
  const [usersOptions, setUsersOptions] = useState<Array<any>>(cacheData.usersOptions);
  const [pointDetailData, setPointDetailData] = useState<Array<any>>(cacheData.pointDetailData);
  const [fastPoint, setFastPoint] = useState<Array<any>>(cacheData.fastPoint);//极速审批所用数据 
  const [queryParams, setQueryParams] = useState<QueryParams>(cacheData.queryParams);

  const [initialValues, setInitialValues] = useState<Object>({ status: '0' });
  const [editProjectId, setEditProjectId] = useState<string>('');
  const [generalFormColumns, handleGeneralFormColumns] = useState<Array<any>>([]);

  const [expandedRowKeys, setExpandedRowKeys] = useState<Array<string>>([]);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalType, handleModalType] = useState<string>('');




  const { initialState, setInitialState } = useModel<any>('@@initialState');
  // const [roleId, setRoleId] = useState<string>('');
  // const [tableTitleLists, setTableTitleLists] = useState<Array<any>>([]);
  const [titleModalVisible, handleTitleModalVisible] = useState<boolean>(false);//
  const [modalFileVisible, handleModalFileVisible] = useState<boolean>(false);//导出问卷弹框
  const [exportType, handleExportType] = useState<string>("1");
  const [modalWatermark, handleModalWatermark] = useState<boolean>(false);
  const [markFlag, handleMarkFlag] = useState<string>("0");//是否打水印
  const [dateFormat, handleDateFormat] = useState<string>("0");//时间格式
  const [watermarkTime, handleWatermarkTime] = useState<any>(null);//自定义时间
  const [watermarkTimeFlag, handleWatermarkTimeFlag] = useState<number>(1);//自定义时间
  const [addressSource, handleAddressSource] = useState<string>("0");//地址来源
  const [watermarkAnswerId, setWatermarkAnswerId] = useState<string>('');

  // 获取时间范围
  const getDateRangeFun = (roleIds: String, isQuery: Boolean) => {

    // getDateRange().then(res => {
    //   // debugger
    //   let newMaxDate: string = ""
    //   let newMinDate: string = ""
    //   if (res.data) {
    //     newMaxDate = res.data.maxDate
    //     newMinDate = res.data.minDate
    //     let maxDate = moment(res.data.maxDate, 'YYYY/MM/DD')
    //     let minDate = moment(res.data.minDate, 'YYYY/MM/DD')
    //     setHackValue([minDate, maxDate])
    //     setCurData('0')
    //     cacheData.curData = '0'
    //     // if (roleIds.indexOf('3') != -1) {
    //     //   getListUserAuditTask(res.data.minDate, res.data.maxDate)
    //     // }
    //   } else {//一审人员未添加任务时没有时间按照当天算
    //     setHackValue([moment(new Date(), 'YYYY/MM/DD'), moment(new Date(), 'YYYY/MM/DD')])
    //     setCurData('0')
    //     cacheData.curData = '0'
    //     newMaxDate = nowDate
    //     newMinDate = nowDate
    //     // if (roleIds.indexOf('3') != -1) {
    //     //   getListUserAuditTask(nowDate, nowDate)
    //     // }
    //   }
    //   getListProjectFun(newMaxDate, newMinDate, isQuery)//项目列表
    //   cacheData.startDate = newMinDate
    //   cacheData.endDate = newMaxDate
    //   if (isQuery) {//从任务列表过来的数据
    //     getListTaskFun(newMaxDate, curListValue, newMinDate, isQuery)//任务列表
    //   }
    // })
    let minDate = moment().day(moment().day() - 90).startOf('day')
    let maxDate = moment().day(moment().day()).endOf('day')
    let newMinDate = moment(minDate).format("YYYY-MM-DD")
    let newMaxDate = moment(maxDate).format("YYYY-MM-DD")
    setHackValue([minDate, maxDate])
    setCurData('0')
    cacheData.curData = '0'
    getListProjectFun(newMaxDate, newMinDate, isQuery)//项目列表
    cacheData.startDate = newMinDate
    cacheData.endDate = newMaxDate
    if (isQuery) {//从任务列表过来的数据
      getListTaskFun(newMaxDate, curListValue, newMinDate, isQuery)//任务列表
    }
  }

  /* 查询项目数据 */
  const getListProjectFun = (maxDate: any | undefined, minDate: any | undefined, isQuery: Boolean) => {
    const paramsData = {
      "endDate": maxDate,
      "startDate": minDate,
      "userId": ""
    }
    listProject(paramsData).then(res => {
      // console.log(res)
      let data = res.data
      JSON.parse(JSON.stringify(listValue))
      JSON.parse(JSON.stringify(taskValue))

      if (data.length > 0) {
        setListValue(data) //项目列表
        cacheData.projectList = data
        if (isQuery) {
          // getListTaskFun(maxDate, curListValue, minDate, isQuery)//任务列表
        } else {
          setCurListValue(data[0].projectId)//获取当前项目
          getListTaskFun(maxDate, data[0].projectId, minDate, isQuery)//任务列表
        }

      } else {
        setListValue([])
        setTaskValue([])
        setCurTaskValue("")
        setCurListValue("")
        setProvinceCity([])
        setCityLevel("")
        setTreeData([])
        setCityLevelValue([])
        actionRef.current?.reload();
      }
    })
  }

  /* 查询项目下的所有任务 */
  const getListTaskFun = (maxDate: string, value: any, minDate: string, isQuery: Boolean) => {
    const paramsData = {
      "endDate": maxDate,
      "projectId": value,
      "startDate": minDate,
      "userId": ""
    }
    listTask(paramsData).then(res => {
      // console.log(res)
      let data = res.data
      if (data.length > 0) {
        let newTaskId = ""
        let newTaskType = ""
        if (isQuery) {
          newTaskId = curTaskValue
          newTaskType = taskType
        } else {
          newTaskId = data[0].taskId
          setCurTaskValue(newTaskId)
          setTaskType(data[0].taskType)
          newTaskType = data[0].taskType
        }
        if (history.location.query.taskId && newTaskId != history.location.query.taskId) {
          history.replace({ pathname: "/adv/approvalCenter" })
        }
        setTaskValue(data)
        cacheData.taskList = data
        getCityLevelInfoFun(newTaskId)//城市级别
        getAreaInfoFun(value, newTaskId)//省市列表加载
        getPointCountFun(minDate, maxDate, newTaskId, provinceCity, cityLevel)
        getStaffFun(newTaskId, newTaskType);
      } else {
        setTaskValue([])
        setCurTaskValue("")
      }
    })
  }

  /* 选择项目数据 */
  const handleProjectChange = (e: any) => {
    setCurListValue(e);
    getListTaskFun(moment(hackValue[1]).format("YYYY-MM-DD"), e, moment(hackValue[0]).format("YYYY-MM-DD"), false)

  }
  const filterOption = (inputValue: any, option: any) => {
    if (option.children.indexOf(inputValue) != -1) {
      return true
    }
  }
  /* 选择项目下的所有任务 */
  const handleTaskChange = (value: any) => {
    setCurTaskValue(value);
    taskValue.forEach((item: any, index: number) => {
      if (item.taskId == value) {
        if (history.location.query.taskId && item.taskId != history.location.query.taskId) {
          history.replace({ pathname: "/adv/approvalCenter" })
        }
        setTaskType(item.taskType)
        getCityLevelInfoFun(value)//城市级别
        getAreaInfoFun(curListValue, value)//省市列表加载
        getPointCountFun(moment(hackValue[0]).format("YYYY-MM-DD"), moment(hackValue[1]).format("YYYY-MM-DD"), value, provinceCity, cityLevel)
        getStaffFun(value, item.taskType)
      }
    })
  }
  // 选择省市
  const handleCityChange = (value: any) => {
    setProvinceCity(value);
    getPointCountFun(moment(hackValue[0]).format("YYYY-MM-DD"), moment(hackValue[1]).format("YYYY-MM-DD"), curTaskValue, value, cityLevel)
  }
  // 选择城市级别
  const handleCityLevelChange = (value: any) => {
    setCityLevel(value.target.value);
    getPointCountFun(moment(hackValue[0]).format("YYYY-MM-DD"), moment(hackValue[1]).format("YYYY-MM-DD"), curTaskValue, provinceCity, value.target.value)
  }

  /* 城市级别*/
  const getCityLevelInfoFun = (curTaskValue: any) => {
    const paramsData = {
      "taskId": curTaskValue,
    }
    getCityLevelInfo(paramsData).then(res => {
      let data = res.data
      setCityLevelValue(data)
      cacheData.cityLevelList = data
      setCityLevel("")

    })
  }
  // 省市数据格式处理
  function areaInfoProcess(parent: any[], data: { [x: string]: any; }[]) {
    data.forEach((item: { [x: string]: any; }) => {
      let key = item['id'];
      if (item['parentId'] === "0") {
        key = "_" + key;
      }
      let treeItem = { 'title': item['label'], 'value': key, 'key': key };
      parent.push(treeItem)
      if (item['children']) {
        treeItem['children'] = [];
        areaInfoProcess(treeItem['children'], item['children'])
      }
    });
  }
  /* 获取报表中心，省市列表，仅展示有基础数据的省市 */
  const getAreaInfoFun = (curListValue: any, curTaskValue: any) => {
    const paramsData = {
      "projectId": curListValue,
      "taskId": curTaskValue
    }
    getAreaInfo(paramsData).then(res => {
      let newTreeData: any[] | ((prevState: undefined) => undefined) | undefined = [];
      if (res.code === 200) {
        areaInfoProcess(newTreeData, res.data)
        setTreeData(newTreeData);
        cacheData.treeData = newTreeData
        setProvinceCity([])
      }
    })
  }

  /* 指标统计接口-计划点位数、完成数、合格数、不合格数 */
  const getPointCountFun = (minDate: string, maxDate: string, curTaskValue: string, provinceCity: any, cityLevel: string) => {
    // console.log(hackValue)
    let city: string = getCity(provinceCity);
    let province: string = getProvince(provinceCity);
    // let dd = hackValue;
    // let maxDate: string = dd.length > 1 ? moment(dd[1]).format("YYYY-MM-DD") : "";
    // let minDate: string = dd.length > 0 ? moment(dd[0]).format("YYYY-MM-DD") : "";
    const paramsData = {
      "endDate": maxDate,
      "startDate": minDate,
      "taskId": curTaskValue,
      "city": city,
      "cityLevel": cityLevel,
      "province": province
    }
    getPointCount(paramsData).then(res => {
      let data = res.data
      if (data) {
        setAreaInfoValue(data)
        cacheData.areaInfoValue = data
        reload()
      }
    })
  }
  const filterTime = async (e: { target: { value: React.setProvinceCityAction<string>; }; }) => {
    // debugger;
    setCurData(e.target.value)
    cacheData.curData = e.target.value
    if (e.target.value === '0') {
      getDateRangeFun(roleId, false)
    } else {
      let maxDate: any = null
      let minDate: any = null
      if (e.target.value === '1') {
        minDate = moment().day(moment().day() - 1).startOf('day')
        maxDate = moment().day(moment().day() - 1).endOf('day')
      } else if (e.target.value === '2') {
        minDate = moment()
        maxDate = moment()
      } else if (e.target.value === '3') {
        minDate = moment().day(moment().day() - 2).startOf('day')
        maxDate = moment()
      } else if (e.target.value === '4') {
        minDate = moment().day(moment().day() - 6).startOf('day')
        maxDate = moment()
      }
      setHackValue([minDate, maxDate])
      getListProjectFun(moment(maxDate).format('YYYY-MM-DD'), moment(minDate).format('YYYY-MM-DD'), false)
    }
  };

  const onChangeTime = (value: any, dateString: any) => {
    if (value) {
      setCurData('')
      cacheData.curData = ''
      setHackValue(value)
      // setValue(dateString)
      getListProjectFun(dateString[1], dateString[0], false)//项目列表
    }
  };


  const reset = () => {
    const current = actionRef.current || copyActionRef.current;
    current?.reset();
  }
  const reload = () => {
    const current = actionRef.current || copyActionRef.current;
    current?.reload();
  }

  // const getListUserAuditTask = async (startDate: string, endDate: string) => {
  //   let res = await listUserAuditTask({
  //     startDate,
  //     endDate
  //   })
  //   handleGeneralFormColumns(formColumns(res.data))
  // }
  // const addTasks = () => {
  //   setModalTitle('添加任务')
  //   handleModalVisible(true);
  //   handleModalType('POST');
  // }

  /* 获取执行人对应的执行点位数量 */
  const getStaffFun = (curTaskValue: any, taskType: string) => {
    const paramsData = {
      "taskId": curTaskValue
    }
    listStaff(paramsData).then(res => {
      let data = res.data
      setUsersOptions(data);
      cacheData.usersOptions = data
      formatColumns(data, taskType)
    })
  }
  const localStorageCommonParams = () => {
    localStorage.setItem("commonParams", JSON.stringify({
      ...queryParams,
      projectId: curListValue,
      listValue: listValue,
      taskValue: taskValue,
      taskType: taskType
    }))
  }
  const option = {
    title: '操作',
    width: 130,
    key: 'option',
    valueType: 'option',
    fixed: 'right',
    render: (_: any, record: any) => [
      <Access key='details' accessible={access.canPermissions('adv:approvalCenter:details')}>
        <Tooltip title='答案审批' getPopupContainer={(triggerNode: any) => triggerNode.parentElement} autoAdjustOverflow={false} placement="leftTop">
          <Button
            type='link'
            icon={<EyeOutlined />}
            onClick={() => {
              window.localStorage.setItem("answerIds", JSON.stringify(answerIds))
              history.push({
                pathname: `/adv/approvalCenter/details`,
                search: `?taskId=${record.parentTaskId}&answerId=${record.answerId}`,
              });
            }}
          >查看</Button>
        </Tooltip>
      </Access>,
      <Access key='waterMark' accessible={access.canPermissions('adv:approvalCenter:waterMark')}>
        <Button
          type='link'
          icon={<PictureOutlined />}
          onClick={() => {
            handleModalWatermark(true)
            setWatermarkAnswerId(record.answerId)
          }}
        >水印修正</Button>
      </Access>
    ],
  }

  const onFinish = async (values: any) => {
    await systemDept(createModalType, createModalType === 'POST' ? values : { ...values, projectId: editProjectId });
    handleModalVisible(false);
    message.success(`${createModalType === 'POST' ? '新增' : '编辑'}成功`);
    actionRef.current?.reload();
  }


  const tProps = {
    treeData,
    value: provinceCity,
    onChange: handleCityChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_ALL,
    showSearch: true,
    filterTreeNode: (inputValue: string, treeNode: any) => {
      //  console.log(treeNode,inputValue)
      if (treeNode.title.indexOf(inputValue) != -1) {
        return true
      }
    },
    placeholder: '请选择',
    style: {
      width: '100%',
    },
  };

  // 初始化数据
  useEffect(() => {
    const { location } = history;
    const curCaching: number = cachingNodes.findIndex(item => item.id.slice(0, item.id.length - 2) === location.pathname + location.search);
    if (curCaching === -1) {
      let roles: any = initialState.currentUser.user.roles
      let roleIds: string = ''
      if (initialState.currentUser.user.isSpecialPowers == 1) {//超级管理员
        roleIds = "1"
      } else {
        roles.forEach((item: any, index: number) => {
          roleIds += item.roleId
        })
      }
      roleId = roleIds
      // setRoleId(roleIds)
      localStorage.setItem("roleIds", roleIds)
      if (curListValue) {
        getDateRangeFun(roleIds, true)
      } else {
        getDateRangeFun(roleIds, false)
      }
    } else {
      setColumnsData([...curColumnsData, option])
      // console.log(cacheData)
    }
    return () => {
      if (actionRef.current) {
        copyActionRef = actionRef;
      }
    }
  }, [])
  const formatColumns = (usersOption: any, taskType: string) => {
    curColumnsData = columns(formatDataToEnum(usersOption, 'mobile', 'mobile'), (fieldProps: any) => {
      return <Select {...fieldProps} placeholder="请选择">
        {
          curColumnsData.map((item: any, index: number) => {
            if(!(item.title=="关键字所属项"||item.title == "关键词")){
              return <Option value={item.dataIndex} key={index} >{item.title}</Option>
            }
          })
        }
      </Select>
    }, (fieldProps: any) => {
      return <Input placeholder="请输入关键词" {...fieldProps} />
    }, taskType)
    setColumnsData([...curColumnsData, option])
    reset()
  }

  const downloadFileOk = async () => {
    handleModalFileVisible(false)
    const { field, staffMobile, startDate, endDate, taskId, cityLevel, province, keyword, progress, firstAuditStatus, secondAuditStatus, city, flag } = queryParams
    window.location.href = `${process.env.PROXY_API}approve/exportPointDetail?exportType=${exportType}&staffMobile=${staffMobile}&startDate=${startDate}&endDate=${endDate}&taskId=${taskId}&cityLevel=${cityLevel}&province=${province}&city=${city}&flag=${flag}&field=${field}&keyword=${keyword}&progress=${progress}&firstAuditStatus=${firstAuditStatus}&secondAuditStatus=${secondAuditStatus}`
  }
  const changeType = (e: any, type: string) => {
    if (type == "exportType") {
      handleExportType(e.target.value)
    } else if (type == "markFlag") {
      handleMarkFlag(e.target.value)
    } else {
      handleWatermarkTimeFlag(e.target.value)
    }
  }

  const watermarkOk = async () => {
    let res
    if (watermarkAnswerId == '') {
      res = await watermarkAmend({ ...queryParams, addressSource, dateFormat, markFlag, watermarkTime,watermarkTimeType:watermarkTimeFlag })
    } else {
      res = await watermarkAmendOne({ ...queryParams, addressSource, dateFormat, markFlag, watermarkTime, answerId: watermarkAnswerId,watermarkTimeType:watermarkTimeFlag })
    }

    if (res.code == 200) {
      message.success("水印修正成功")
      handleModalWatermark(false)
    }
  }
  const selectTime = (e: any) => {
    handleWatermarkTime(null)
    handleDateFormat(e)
  }
  const selectaddressSource = (e: any) => {
    handleAddressSource(e)
  }
  const onChangeDate = (value: any, dateString: any) => {
    console.log(value, dateString)
    handleWatermarkTime(dateString)
  }
  const viewReport = () => {
    window.localStorage.setItem("answerIds", JSON.stringify(answerIds))
    // window.localStorage.setItem("taskData", JSON.stringify({projectId:curListValue,taskId:curTaskValue,taskType:taskType}))
    history.push({
      pathname: `/adv/approvalCenter/viewReport`,
      search: `?taskId=${curTaskValue}&projectId=${curListValue}&taskType=${taskType}`
    });
  }
  const fastApproval = () => {
    if (fastPoint.length == 0) {
      message.info("暂无审批数据")
      return
    }
    window.localStorage.setItem("answerIds", JSON.stringify(answerIds))
    window.localStorage.setItem("fastPoint", JSON.stringify(fastPoint))
    localStorageCommonParams()
    history.push({ pathname: `/adv/approvalCenter/fastApproval` })

  }

  return (
    <PageContainer title={false} className={styles.mg}>
      {/* <CreateModal onCancel={() => handleTitleModalVisible(false)} title={modalTitle} modalVisible={titleModalVisible} >
        {tableTitleLists.map((item: object, index: number) => {
          return <Checkbox key={index} style={{ margin: "5px 15px" }} checked={item.checked} onChange={e => { checkedChange(e, index) }}>{item.label}</Checkbox>
        })}

      </CreateModal> */}


      <Modal
        title="导出问卷"
        visible={modalFileVisible}
        onOk={() => { downloadFileOk() }}
        onCancel={() => { handleModalFileVisible(false) }}
        maskClosable={false}
      >
        <Radio.Group style={{ width: "100%" }} onChange={e => { changeType(e, "exportType") }} value={exportType}>
          <div className={styles.radioStyle}><Radio style={{ width: "100%" }} value="1">东联项目格式 <Tooltip placement="top" title="东联项目格式：即拍照/视频题所有照片或视频自动合成为1列，展示查看链接。"> <QuestionCircleOutlined style={{ color: "red" }} /></Tooltip></Radio></div>
          <div className={styles.radioStyle}> <Radio style={{ width: "100%" }} value="2">连通项目格式 <Tooltip placement="top" title="连通项目格式：即拍照/视频题每张照片/每个视频分列展示文字,参考https://kdocs.cn/l/sQbJRMCuz?f=101,[文档] 连通商户检查 (2).xlsx"> <QuestionCircleOutlined style={{ color: "red" }} /></Tooltip></Radio></div>
          <div className={styles.radioStyle}> <Radio style={{ width: "100%" }} value="3">媒介项目格式</Radio></div>
          <div className={styles.radioStyle}> <Radio style={{ width: "100%" }} value="4">美团格式</Radio></div>
        </Radio.Group>
      </Modal>

      <Modal
        width={800}
        title="水印修正"
        visible={modalWatermark}
        onOk={() => { watermarkOk() }}
        onCancel={() => { handleModalWatermark(false) }}
        maskClosable={false}
      >
        <Row>
          <Col span={4}>水印</Col>
          <Col span={18}>
            <Radio.Group onChange={e => { changeType(e, "markFlag") }} value={markFlag}>
              <Radio value="0">打水印 </Radio>
              <Radio value="1">不打水印</Radio>
            </Radio.Group>
          </Col>
        </Row>
        {markFlag == '0' ? <div>
          <Row style={{ margin: "10px 0" }}>
            <Col span={4}>时间格式</Col>
            <Col span={18}>

              <Select style={{ width: 240 }} value={dateFormat} placeholder="请选择" onChange={e => selectTime(e)}>
                {
                  timeTypeLists.map((item: any, index: number) => {
                    return <Option value={item.value} key={index} >{item.title}</Option>
                  })
                }
              </Select>
            </Col>
          </Row>
          <Row style={{ margin: "10px 0" }}>
            <Col span={4}>水印时间</Col>
            <Col span={16}>
              <Radio.Group onChange={e => { changeType(e, "timeFlag") }} value={watermarkTimeFlag}>
                <Radio value={1}>用户提交时间</Radio>
                <Radio value={3}>用户拍照时间</Radio>
                <Radio value={2}>自定义时间</Radio>
              </Radio.Group>
              {watermarkTimeFlag == 2 ? <DatePicker showTime={dateFormat != '0'} style={{ display: "inline-block", width: "200px" }} format={timeTypeLists[dateFormat].title} value={watermarkTime ? moment(watermarkTime, timeTypeLists[dateFormat].title) : null} onChange={(value, dateString) => { onChangeDate(value, dateString) }} /> : ""}
            </Col>
          </Row>
          <Row style={{ margin: "10px 0" }}>
            <Col span={4}>地址来源</Col>
            <Col span={18}>
              <Select style={{ width: 240 }} value={addressSource} placeholder="请选择" onChange={e => selectaddressSource(e)} >
                {
                  [{ title: "不限", value: "0" }, { title: "使用点位库地址", value: "1" }, { title: "使用实时定位地址", value: "2" }].map((item: any, index: number) => {
                    return <Option value={item.value} key={index} >{item.title}</Option>
                  })
                }
              </Select>
            </Col>
          </Row>
        </div> : ""}
      </Modal>


      {/* <CreateModal onCancel={() => handleModalVisible(false)} title={modalTitle} modalVisible={createModalVisible}>
        <GeneralForm initialValues={initialValues} columns={generalFormColumns} onFinish={(values => onFinish(values))} />
      </CreateModal> */}
      <KeepAlive name="审批中心" id={history.location.pathname} saveScrollPosition="screen">
        <div>
          <div className={styles.filterHead}>
            <Space className={styles.bg1}>
              <div className={styles.pdWid}>时间范围：</div>
              <Radio.Group onChange={filterTime} value={curData} buttonStyle="solid">
                <Radio.Button value="0" className={styles.pad}>全部</Radio.Button>
                <Radio.Button value="1" className={styles.pad}>昨天</Radio.Button>
                <Radio.Button value="2" className={styles.pad}>今天</Radio.Button>
                <Radio.Button value="3" className={styles.pad}>近3天</Radio.Button>
                <Radio.Button value="4" className={styles.pad}>近7天</Radio.Button>
              </Radio.Group>
              <RangePicker
                allowClear={false}
                value={hackValue}
                format="YYYY-MM-DD"
                onChange={onChangeTime} />
              <div className={styles.pos}>
                {/* 一审、二审、管理员均可以导出问卷 */}
                <Access key='downloadSurvey' accessible={access.canPermissions('adv:approvalCenter:downloadSurvey')}>
                  <Button type="primary"
                    onClick={() => { handleModalFileVisible(true) }}
                    className={styles.pos}>导出问卷</Button>
                </Access>
                {/* 一审人员：添加任务 */}
                {/* {roleId.indexOf('3') != -1 ? <Button type="primary"
              onClick={() => { addTasks() }}
            >添加任务</Button> : ''} */}
                {/* 二审人员和管理员能看到查看报告 */}

                {/* {roleId.indexOf('1') != -1 || roleId.indexOf('2') != -1 || roleId.indexOf('4') != -1 ? <Access key='viewReport' accessible={access.canPermissions('adv:approvalCenter:viewReport')}>
                  <Button type="primary" disabled={pointDetailData.length > 0 ? false : true}
                    onClick={() => { viewReport() }}
                  >查看报告</Button></Access> : ""} */}
                <Access key='viewReport' accessible={access.canPermissions('adv:approvalCenter:viewReport')}>
                  <Button type="primary" disabled={pointDetailData.length > 0 ? false : true}
                    onClick={() => { viewReport() }}
                  >查看报告</Button></Access>
              </div>
            </Space>
          </div>
          <div className={styles.filterHead}>
            <Space className={styles.bg1}>
              <div className={styles.pdWid1}>项目：</div>
              <Select value={curListValue} style={{ width: 180 }} onChange={handleProjectChange} showSearch={true} filterOption={filterOption}>
                {
                  listValue.map(item => {
                    return <Option value={item.projectId} key={item.projectId} >{item.projectName}</Option>
                  })
                }
              </Select>
              <div className={styles.pdWid1}>任务：</div>
              <Select value={curTaskValue} style={{ width: 180 }} onChange={handleTaskChange} showSearch={true} filterOption={filterOption}>
                {
                  taskValue.map(item => {
                    return <Option value={item.taskId} key={item.taskId}>{item.taskName}</Option>
                  })
                }
              </Select>
            </Space>
          </div>
          <div className={styles.filterHead}>
            <Space className={styles.bg1}>
              <div className={styles.pdWid}>城市级别：</div>
              <Radio.Group options={cityLevelValue} onChange={handleCityLevelChange} value={cityLevel} optionType="button" buttonStyle="solid">
              </Radio.Group>
              <div className={styles.pdWid1}>省市：</div>
              <div style={{ width: 200 }}>
                <TreeSelect {...tProps} />
              </div>
            </Space>
          </div>
          <div className={styles.filterHead}>
            <ul className={styles.pointCont}>
              {/* taskType 1：京东户外广告， 2：京东线下门店，3：新潮 */}
              {taskType == "3" ? <li>
                <span className={styles.gray}>计划点位数（个）</span>
                <span>{areaInfoValue.planNum ? areaInfoValue.planNum : "-"}</span>
                <span></span>
              </li> : ""}
              <li>
                <span className={styles.gray}>完成数（个）</span>
                <span>{areaInfoValue.completeNum}</span>
                {taskType == "3" ? <span className={styles.gray}>完成率：{(areaInfoValue.completeRate * 100).toFixed(2)}%</span> : ""}
              </li>
              <li>
                <span className={styles.gray}>合格数（个）</span>
                <span>{areaInfoValue.passNum}</span>
                <span className={styles.gray}>合格率：{(areaInfoValue.passRate * 100).toFixed(2)}%</span>
              </li>
              <li>
                <span className={styles.gray}>不合格数（个）</span>
                <span>{areaInfoValue.failNum}</span>
                <span className={styles.gray}>不合格率：{(areaInfoValue.failPate * 100).toFixed(2)}%</span>
              </li>
            </ul>
          </div>

          <ProProvider.Provider
            value={{
              ...values,
              valueTypeMap: {
                phoneNum: {
                  render: (text) => {
                    if (text) {
                      return text.substr(0, 3) + '****' + text.substr(7, 4)
                    } else {
                      return "-"
                    }
                  },
                },
              },
            }}
          >
            <ProTable<TableListItem, Record<string, any>, 'phoneNum'>
              size="small"
              scroll={{ x: 'max-content' }}
              columns={columnsData}
              actionRef={actionRef}

              request={async (params: any) => {
                // console.log(params)
                let city = getCity(provinceCity);
                let province = getProvince(provinceCity);
                let dd = hackValue
                let d1 = dd.length > 1 ? moment(dd[1]).format("YYYY-MM-DD") : "";
                let d2 = dd.length > 0 ? moment(dd[0]).format("YYYY-MM-DD") : "";
                params['city'] = city;
                params['province'] = province;
                params['endDate'] = d1;
                params['startDate'] = d2;
                params['curTaskValue'] = curTaskValue;
                // params['flag']=flag;
                //params['progress']=progress?progress.toString():undefined;
                let firstAuditStatus = params['firstAudit'];
                let secondAuditStatus = params['secondAudit'];
                params['firstAuditStatus'] = firstAuditStatus ? firstAuditStatus.toString() : undefined;
                params['secondAuditStatus'] = secondAuditStatus ? secondAuditStatus.toString() : undefined;
                params['pageNo'] = params['current'];
                params['staffMobile'] = params['mobile'];
                params['field'] = params['field'];
                params['keyword'] = params['keyword'];
                params['cityLevel'] = cityLevel
                const paramsData = getQueryParams(params);
                // JSON.parse(JSON.stringify(paramsData))
                setQueryParams(paramsData);

                if (paramsData['taskId'] && paramsData['taskId'].length > 0) {
                  const { data }: any = await getPointDetail(paramsData)
                  answerIds = data.answerIds;
                  // pointDetailData = data.data
                  setPointDetailData(data.data)
                  setFastPoint(data.fastPoint)
                  Object.assign(cacheData, {
                    ...paramsData,
                    projectId: curListValue,
                    taskList: taskValue,
                    projectList: listValue,
                    taskType: taskType,
                    // cityLevelList: cityLevelValue,
                    // treeData: treeData,
                    // areaInfoValue: { ...areaInfoValue },
                    // usersOptions: usersOptions,
                    provinceCity: [...provinceCity],
                    pointDetailData: data.data,
                    fastPoint: data.fastPoint,
                    queryParams: paramsData
                  })

                  // console.log(cacheData)
                  return Promise.resolve({
                    data: data.data,
                    total: data.total,
                    success: true,
                  });
                }
              }}
              rowKey="pointId"
              expandable={{
                expandedRowKeys,
                onExpand: (expanded, record) => {
                  const { projectId }: any = record
                  if (!expanded) {
                    expandedRowKeys.splice(expandedRowKeys.findIndex((id: string) => id === projectId), 1)
                    setExpandedRowKeys([...expandedRowKeys])
                  } else {
                    setExpandedRowKeys([...expandedRowKeys, projectId])
                  }
                }
              }}
              form={{
                // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                syncToUrl: (values, type) => {
                  if (type === 'get') {
                    return {
                      ...values,
                      created_at: [values.startTime, values.endTime],
                    };
                  }
                  return values;
                },
              }}
              search={{
                labelWidth:"auto",
                defaultCollapsed:false,
                span:{
                  xs: 12,
                  sm: 12,
                  md: 8,
                  lg: 6,
                  xl: 6,
                  xxl: 4,
                },
              }}
              dateFormatter="string"
              headerTitle=""
              options={{ setting: true, density: false, reload: false }}
              toolBarRender={(action) => [
                <Access key='waterMark' accessible={access.canPermissions('adv:approvalCenter:waterMark')}><Button key="primary" type="primary" onClick={() => { handleModalWatermark(true); setWatermarkAnswerId('') }} disabled={pointDetailData.length == 0 ? true : false}>
                  批量水印修正
              </Button></Access>,
                <Access key='fastApproval' accessible={access.canPermissions('adv:approvalCenter:fastApproval')}><Button type="primary" disabled={pointDetailData.length == 0 ? true : false} onClick={fastApproval}>
                  极速审批
              </Button></Access>,
                // <Access key='fastApproval' accessible={access.canPermissions('adv:approvalCenter:fastApproval')}>
                //   </Access>,
                //   <Button key="primary" type="primary" onClick={editTableTitle} disabled={taskValue == "" ? true : false}>
                //     编辑指标
                // </Button>,
              ]}
            />
          </ProProvider.Provider>
        </div>
      </KeepAlive>
    </PageContainer>
  )

}
