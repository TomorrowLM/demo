import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import { Access, useAccess, history, useModel } from 'umi';
import { Button, Space, DatePicker, Tooltip, Radio, Select, TreeSelect, message, Modal, Input, Checkbox, Row, Col, Upload } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { KeepAlive, useAliveController } from 'react-activation';
import CreateModal from '@/components/CreateModal';
import styles from './index.less';
import moment from 'moment';
import { EyeOutlined } from '@ant-design/icons';
import { QueryParams, TableListItem } from './data';
import { columns, formColumns, timeTypeLists, summaryData } from './const.d';
import { formatDataToEnum } from '@/utils/utils';
import { downloadTaskReportZip, getDateRange, listProject, taskReport, listTask, getCityLevelInfo, getAreaInfo, getPointCount, taskReportDetail } from './service';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { SHOW_ALL } = TreeSelect;

// let reportCacheData = {
//   pageNo: 1,
//   pageSize: 20,
//   projectId: "",
//   taskId: "",
//   taskList: [],
//   projectList: [],
//   taskType: "",
//   cityLevelList: [],
//   treeData: [],
//   startDate: "",
//   endDate: "",
//   viewType: "1",
//   field: "",
//   keyword: "",
//   flag: "0",
//   city: "",
//   cityLevel: "",
//   province: "",
//   provinceCity: [],
//   taskReportData: [],
//   queryParams: {}
// }

let curColumnsData: Array<any> = [];
let copyActionRef: any = null;


/**
 * 处理查询与下载列表时的参数
 * @param params
 */

const getQueryParams = (params: any): QueryParams => {
  const { pageSize, field, flag, keyword, pageNo, endDate, startDate, taskId, city, cityLevel, province } = params;
  return {
    pageNo: pageNo || 1,
    pageSize,
    field: field || '',
    flag: flag || '0',
    keyword: keyword || '',
    startDate: startDate || '',
    endDate: endDate || '',
    taskId: taskId || '',
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
  let dd: any = new Date()
  let nowDate: string = dd.getFullYear() + "-" + (dd.getMonth() + 1) + "-" + dd.getDate()

  const actionRef = useRef<ActionType>();
  const access = useAccess();
  // // let taskData =localStorage.getItem("taskData")? JSON.parse(localStorage.getItem("taskData")):{}
  // const [taskType, setTaskType] = useState<any>(  localStorage.getItem("answerIds")?history.location.query.taskType||reportCacheData.taskType:reportCacheData.taskType||history.location.query.taskType);//taskType 0:项目整体 1：京东户外广告， 2：京东线下门店，3：新潮
  // const [taskId, setTaskId] = useState<any>(localStorage.getItem("answerIds")? history.location.query.taskId||reportCacheData.taskId:reportCacheData.taskId||history.location.query.taskId);
  // const [projectId, setProjectId] = useState<any>(localStorage.getItem("answerIds")?history.location.query.projectId||reportCacheData.projectId:reportCacheData.projectId||history.location.query.projectId);

  // // const [taskType, setTaskType] = useState<any>(  localStorage.getItem("answerIds")?taskData.taskType||reportCacheData.taskType:reportCacheData.taskType||taskData.taskType);//taskType 0:项目整体 1：京东户外广告， 2：京东线下门店，3：新潮
  // // const [taskId, setTaskId] = useState<any>(localStorage.getItem("answerIds")? taskData.taskId||reportCacheData.taskId:reportCacheData.taskId||taskData.taskId);
  // // const [projectId, setProjectId] = useState<any>(localStorage.getItem("answerIds")?taskData.projectId||reportCacheData.projectId:reportCacheData.projectId||taskData.projectId);

  // const [provinceCity, setProvinceCity] = useState<Array<any>>(reportCacheData.provinceCity)
  // const [cityLevelValue, setCityLevelValue] = useState<Array<any>>(reportCacheData.cityLevelList);
  // const [cityLevel, setCityLevel] = useState(reportCacheData.cityLevel);
  // const [listValue, setlListValue] = useState<Array<any>>(reportCacheData.projectList);//项目
  // const [taskValue, setlTaskValue] = useState<Array<any>>(reportCacheData.taskList);//任务列表
  // const [startDate, setStartDate] = useState<any>(reportCacheData.startDate);
  // const [endDate, setEndDate] = useState<any>(reportCacheData.endDate);
  // const [viewType, setViewType] = useState<string>(reportCacheData.viewType);//1:单任务 2：项目整体
  // const [taskReportData, setTaskReportData] = useState<any>(reportCacheData.taskReportData || []);
  // const [treeData, setTreeData] = useState(reportCacheData.treeData||[])

  const [taskType, setTaskType] = useState<any>(history.location.query.taskType || '');//taskType 0:项目整体 1：京东户外广告， 2：京东线下门店，3：新潮
  const [taskId, setTaskId] = useState<any>(history.location.query.taskId || '');
  const [projectId, setProjectId] = useState<any>(history.location.query.projectId || '');
  const [provinceCity, setProvinceCity] = useState<Array<any>>([])
  const [cityLevelValue, setCityLevelValue] = useState<Array<any>>([]);
  const [cityLevel, setCityLevel] = useState('');
  const [listValue, setlListValue] = useState<Array<any>>([]);//项目
  const [taskValue, setlTaskValue] = useState<Array<any>>([]);//任务列表
  const [startDate, setStartDate] = useState<any>('');
  const [endDate, setEndDate] = useState<any>('');
  const [viewType, setViewType] = useState<string>('1');//1:单任务 2：项目整体
  const [taskReportData, setTaskReportData] = useState<any>([]);
  const [treeData, setTreeData] = useState([])

  const [exportType, setExportType] = useState<string>("1");
  const [splitField, setSplitField] = useState<any>("city");
  const [require, setRequire] = useState<any>("1");
  const [contentFlag, handleContentFlag] = useState<string>("1");
  const [watermark, handleWatermark] = useState<string>("1");

  const [curData, setCurData] = useState('');
  const [uploadDisable, setUploadDisable] = useState<boolean>(false);

  const [queryParams, setQueryParams] = useState<QueryParams>();
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>(curColumnsData);
  const [expandedRowKeys, setExpandedRowKeys] = useState<Array<string>>([]);
  const [modalTitle, setModalTitle] = useState<string>('');
  const { getCachingNodes } = useAliveController();
  const cachingNodes = getCachingNodes ? getCachingNodes() : [];


  // const { initialState, setInitialState } = useModel<any>('@@initialState');
  // const [roleId, setRoleId] = useState<string>('');//roleId 1:超级管理员 2：管理员 3：一审 4：二审
  const [modalFileVisible, handleModalFileVisible] = useState<boolean>(false);//导出问卷弹框


  const getDateRangeFun = (projectId: string, taskId: string, viewType: string, taskType: string) => {
    setProvinceCity([])
    setCityLevelValue([])
    setCityLevel('')
    setTaskReportData([])
    setTreeData([])
    reload()

    getDateRange({ projectId, taskId }).then(res => {
      // debugger
      if (res.data) {
        setCurData('0')
        setStartDate(res.data.minDate)
        setEndDate(res.data.maxDate)
        if (viewType == "1") {
          getTaskReport("1", "10", projectId, taskId, res.data.minDate, res.data.maxDate, cityLevel, provinceCity)
        }
      } else {//没有时间按照当天算
        setCurData('0')
        setStartDate(nowDate)
        setEndDate(nowDate)
        if (viewType == "1") {
          getTaskReport("1", "10", projectId, taskId, nowDate, nowDate, cityLevel, provinceCity)
        }
      }
      getCityLevelInfoFun(taskId)//城市级别
      formatColumns(viewType, taskType)
    })
  }

  /* 查询项目数据 */
  const getListProjectFun = () => {
    listProject().then(res => {
      let data = res.data
      JSON.parse(JSON.stringify(listValue))
      JSON.parse(JSON.stringify(taskValue))
      if (data.length > 0) {
        setlListValue(data) //项目列表
        getListTaskFun(projectId, false, viewType)//任务列表
      }
    })
  }
  /* 查询项目报告数据 */
  const getTaskReport = (pageNo: string, pageSize: string, projectId: string, taskId: string, startDate: string, endDate: string, cityLevel: string, provinceCity: any) => {
    if(taskType == 4){
      return
    }
    let params: any = {
      pageNo,
      pageSize,
      startDate: startDate,
      endDate: endDate,
      taskId,
      province: provinceCity ? getProvince(provinceCity) : "",
      projectId,
      cityLevel,
      city: provinceCity ? getCity(provinceCity) : "",
    }
    taskReport(params).then(res => {
      let data = res.data
      if (data.data.length > 0) {
        setTaskReportData(summaryData(data.data[0]))
        // reportCacheData.taskReportData = summaryData(data.data[0])
      } else {
        setTaskReportData([])
        // reportCacheData.taskReportData = []
      }
    })
  }
  /* 查询项目下的所有任务 */
  const getListTaskFun = (projectId: any, isTaskId: boolean, viewType: string) => {
    listTask({ "projectId": projectId }).then(res => {
      let data = res.data
      if (data.length > 0) {
        setlTaskValue(data)
        if (isTaskId) {
          if (viewType == "1") {//单任务
            setTaskType(res.data[0].taskType)
            getDateRangeFun(projectId, res.data[0].taskId, viewType, res.data[0].taskType)
          } else {//项目整体 
            getDateRangeFun(projectId, "", viewType, '0')
            setTaskType('0')
          }
          setTaskId(res.data[0].taskId)
        } else {
          data.forEach((item: any, index: number) => {
            if (item.taskId == taskId) {
              setTaskType(item.taskType)
              getDateRangeFun(projectId, taskId, viewType, item.taskType)
            }
          })

        }

      } else {
        setlTaskValue([])
        setTaskId("")
        setTaskType("0")
        setProvinceCity([])
        setCityLevel("")
        setTreeData([])
        setCityLevelValue([])
      }

    })
  }

  /* 选择项目数据 */
  const handleProjectChange = (value: any) => {
    localStorage.removeItem("answerIds")
    setProjectId(value);
    getListTaskFun(value, true, viewType)//获取任务列表
  }

  /* 选择项目下的所有任务 */
  const handleTaskChange = (value: any) => {
    localStorage.removeItem("answerIds")
    setTaskId(value);
    taskValue.forEach((item: any, index: number) => {
      if (item.taskId == value) {
        setTaskType(item.taskType)
        getDateRangeFun(projectId, value, viewType, item.taskType)
      }
    })

  }

  const handleCityChange = (value: any) => {
    localStorage.removeItem("answerIds")
    setProvinceCity(value);
    getTaskReport("1", "10", projectId, taskId, startDate, endDate, cityLevel, value)
    reload()
  }

  const handleCityLevelChange = (value: any) => {
    setCityLevel(value.target.value);
    getTaskReport("1", "10", projectId, taskId, startDate, endDate, value.target.value, provinceCity)
    reload()
  }

  /* 获取审批中心，省市列表 */
  const getCityLevelInfoFun = async (taskId: any) => {
    const paramsData = {
      taskId,
      projectId,
    }
    setCityLevelValue([])
    let res = await getCityLevelInfo(paramsData)
    if (res.data) {
      setCityLevelValue(res.data)
      setCityLevel("")
      getAreaInfoFun(projectId, taskId)//省市列表加载
      // reportCacheData.cityLevelList = res.data
    }

  }

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
  const getAreaInfoFun = (projectId: any, taskId: any) => {
    const paramsData = {
      "projectId": projectId,
      "taskId": taskId
    }
    getAreaInfo(paramsData).then(res => {
      let newTreeData: any[] | ((prevState: undefined) => undefined) | undefined = [];
      if (res.code === 200) {
        areaInfoProcess(newTreeData, res.data)
        setTreeData(newTreeData);
        setProvinceCity([])
        actionRef.current?.reload();
      }
    })
  }

  const filterTime = async (e: { target: { value: React.setProvinceCityAction<string>; }; }) => {

    setCurData(e.target.value)
    if (e.target.value === '0') {
      getDateRangeFun(projectId, taskId, viewType, taskType)
    } else {
      localStorage.removeItem("answerIds")
      let maxDate
      let minDate
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
      // setHackValue([minDate, maxDate])
      setStartDate(moment(minDate).format('YYYY-MM-DD'))
      setEndDate(moment(maxDate).format('YYYY-MM-DD'))
      getTaskReport("1", "10", projectId, taskId, moment(minDate).format('YYYY-MM-DD'), moment(maxDate).format('YYYY-MM-DD'), cityLevel, provinceCity)
      formatColumns(viewType, taskType)
      getCityLevelInfoFun(taskId)//城市级别      
    }
  };

  const onChangeTime = (value: any, dateString: any) => {
    if (value) {
      setCurData('')
      // setHackValue(value)
      setStartDate(dateString[0])
      setEndDate(dateString[1])
      localStorage.removeItem("answerIds")
      getTaskReport("1", "10", projectId, taskId, dateString[0], dateString[1], cityLevel, provinceCity)
      formatColumns(viewType, taskType)
      getCityLevelInfoFun(taskId)//城市级别     
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


  const option = {
    title: '操作',
    width: 130,
    key: 'option',
    valueType: 'option',
    fixed: 'right',
    render: (_: any, record: any) => [
      <Access key='details' accessible={access.canPermissions('adv:approvalCenter:details')}>
        <Tooltip title='答案审批' getPopupContainer={(triggerNode: any) => triggerNode.parentElement}>
          {/* <EyeOutlined />{isXsScreen ? null : '查看' } */}
          <Button
            type='link'
            icon={<EyeOutlined />}
            onClick={() => {
              history.push({
                pathname: `/adv/approvalCenter/details`,
                search: `?taskId=${taskId}&answerId=${record.answer_id}`,
              });
            }}
          >答案详情</Button>
        </Tooltip>
      </Access>
    ],
  }


  const tProps = {
    treeData,
    value: provinceCity,
    onChange: handleCityChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_ALL,
    placeholder: '请选择',
    filterTreeNode: (inputValue: string, treeNode: any) => {
      //  console.log(treeNode,inputValue)
      if (treeNode.title.indexOf(inputValue) != -1) {
        return true
      }
    },
    style: {
      width: '100%',
    },
  };

  // 初始化数据
  useEffect(() => {
    // const { location } = history;
    // const curCaching: number = cachingNodes.findIndex(item => item.id.slice(0, item.id.length - 2) === location.pathname + location.search);
    // console.log(curCaching)
    // if (curCaching === -1) {
    getListProjectFun()
    // } else {

    //   // getTaskReport("1", "10", projectId, taskId, startDate, endDate, cityLevel, provinceCity)
    // }
    return () => {
      if (actionRef.current) {
        copyActionRef = actionRef;
      }
    }
  }, [])
  const formatColumns = (viewType: string, taskType: string) => {
    curColumnsData = columns((fieldProps: any) => {
      return <Select  {...fieldProps} style={{ width: 180 }} placeholder="请选择">
        {
          curColumnsData.slice(0,-2).map((item: any, index: number) => {
            return <Option value={item.dataIndex} key={index} >{item.title}</Option>
          })
        }
      </Select>
    }, (fieldProps: any) => {
      return <Input placeholder="请输入关键词"  {...fieldProps} />
    }, viewType, taskType)
    if (viewType == "2") {
      setColumnsData([...curColumnsData])
    } else {
      setColumnsData([...curColumnsData, option])
    }

  }

  const downloadFileOk = () => {
    handleModalFileVisible(false)
    const { field, keyword, flag, province, city, } = queryParams
    if (contentFlag == '2') {//任务附件
      downloadTaskReportZip({
        contentFlag, startDate, endDate, taskId, cityLevel, province, city, exportType, field, keyword, require, watermark, projectId, splitField, authorization: localStorage.getItem("authorization")
      }).then((res) => {

      })
    } else {
      window.location.href = `${process.env.PROXY_API}task/downloadTaskReportDetail?projectId=${projectId}&contentFlag=${contentFlag}&startDate=${startDate}&endDate=${endDate}&taskId=${taskId}&cityLevel=${cityLevel}&province=${province}&city=${city}&exportType=${exportType}&field=${field}&keyword=${keyword}&require=${require}&splitField=${splitField}&watermark=${watermark}&authorization=${localStorage.getItem("authorization")}`
    }

  }
  const changeType = (e: any, type: string) => {
    if (type == "contentFlag") {
      handleContentFlag(e.target.value)
    } else if (type == "exportType") {
      setExportType(e.target.value)
    } else if (type == "require") {
      setRequire(e.target.value)
    } else if (type == "watermark") {
      handleWatermark(e.target.value)
    }
  }
  const changeSpliteField = (e: any) => {
    setSplitField(e)
  }
  const handleViewType = (e: any) => {
    setViewType(e)
    if (e == 2) {
      setTaskType("0")
    }
    getListTaskFun(projectId, false, e)

  }
  const fileOnChange = (info: any) => {
    if (info.file.status == 'done') {
      // pointPath=info.file.response.data;
      // setUploadDisable(true)
    } else if (info.file.status == 'removed') {
      // pointPath=''
      // setUploadDisable(false)
    }
  }
  const filterOption = (inputValue: any, option: any) => {
    if (option.children.indexOf(inputValue) != -1) {
      return true
    }
  }
  return (
    <PageContainer title={false} className={styles.mg}>
      <Modal
        title="上传"
        visible={modalFileVisible}
        onOk={downloadFileOk}
        onCancel={() => { handleModalFileVisible(false) }}
        maskClosable={false}
      >
        <div>
          <Row style={{ margin: "10px 0" }}>
            <Col span={4}>类型：</Col>
            <Col span={18}>
              <Radio.Group onChange={e => { changeType(e, "contentFlag") }} value={contentFlag}>
                <Radio value="1">京东户外</Radio>
                <Radio value="2">京东线下</Radio>
              </Radio.Group>
            </Col>
          </Row>
          <Row style={{ margin: "10px 0" }}>
            <Col span={4}>文件：</Col>
            <Col span={18}>
              <Upload
                name="file"
                accept=".xls,.xlsx"
                action="/adconsole/point/uploadFile"
                onChange={fileOnChange}
                className={styles.upbtn}
              >
                <Button type="primary" disabled={uploadDisable}>点击上传</Button>
              </Upload>
            </Col>
          </Row>

        </div>

      </Modal>

      <Modal
        title="导出数据"
        visible={modalFileVisible}
        onOk={downloadFileOk}
        onCancel={() => { handleModalFileVisible(false) }}
        maskClosable={false}
      >
        <div>
          <Row style={{ margin: "10px 0" }}>
            <Col span={4}>内容：</Col>
            <Col span={18}>
              <Radio.Group onChange={e => { changeType(e, "contentFlag") }} value={contentFlag}>
                <Radio value="1">基础数据</Radio>
                <Radio value="2">任务附件</Radio>
              </Radio.Group>
            </Col>
          </Row>
          {contentFlag == '2' ? <Row style={{ margin: "10px 0" }}>
            <Col span={4}>水印：</Col>
            <Col span={18}>
              <Radio.Group onChange={e => { changeType(e, "watermark") }} value={watermark}>
                <Radio value="1">带水印</Radio>
                <Radio value="2">不带水印</Radio>
              </Radio.Group>
            </Col>
          </Row> : ""}
          {contentFlag == '2' ? "" : <Row style={{ margin: "10px 0" }}>
            <Col span={4}>要求：</Col>
            <Col span={15}>
              <Radio.Group onChange={e => { changeType(e, "require") }} value={require}>
                <Radio value="1">总表</Radio>
                <Radio value="2">分表</Radio>
              </Radio.Group>
            </Col>
          </Row>}
          {contentFlag == '2' ? <Row style={{ margin: "10px 0" }}>
            <Col span={4}>保存格式:</Col>
            <Col span={18}>
              <Radio.Group style={{ width: "100%" }} onChange={e => { changeType(e, "exportType") }} value={exportType}>
                <Radio style={{ width: "100%" }} value="1">新潮项目格式</Radio>
                <Radio style={{ width: "100%" }} value="2">连通项目格式</Radio>
                <Radio style={{ width: "100%" }} value="3">波司登项目格式</Radio>
                <Radio style={{ width: "100%" }} value="4">通用模板格式</Radio>
              </Radio.Group>
            </Col>
          </Row> : ""}
          {contentFlag == "1" && require == '2' ? <Row style={{ margin: "10px 0" }}>
            <Col span={4}>分表字段:</Col>
            <Col span={18}>

              <Select style={{ width: 240 }} value={splitField} placeholder="请选择" onChange={e => changeSpliteField(e)}>
                {
                  [{ title: "城市", value: "city" }, { title: "级别", value: "city_level" }, { title: "品牌", value: "brand" }].map((item: any, index: number) => {
                    return <Option value={item.value} key={index} >{item.title}</Option>
                  })
                }
              </Select>
            </Col>
          </Row> : ""}
        </div>

      </Modal>
      {/* <KeepAlive name="项目报告" id={history.location.pathname+history.location.search} saveScrollPosition="screen"> */}
      <div>
        <div className={styles.filterHead}>
          <Space className={styles.bg1}>
            <div className={styles.pdWid1}>项目：</div>
            <Select value={projectId} style={{ width: 180, marginRight: "15px" }} onChange={handleProjectChange} showSearch={true} filterOption={filterOption}>
              {
                listValue.map(item => {
                  return <Option value={item.projectId} key={item.projectId} >{item.projectName}</Option>
                })
              }
            </Select>
            {viewType == "1" ? <div className={styles.pdWid1}>任务：</div> : ""}
            {viewType == "1" ? <Select value={taskId} style={{ width: 180 }} onChange={handleTaskChange} showSearch={true} filterOption={filterOption} >
              {
                taskValue.map(item => {
                  return <Option value={item.taskId} key={item.taskId}>{item.taskName}</Option>
                })
              }
            </Select> : ""}
            <div className={styles.pos}>
              {/* <Button type="primary"
              onClick={() => { handleModalFileVisible(true) }}
            >上传</Button> */}
              <Access key='downloadSurvey' accessible={access.canPermissions('adv:approvalCenter:downloadReport')}> {<Button disabled={startDate == '' || viewType == '2'} type="primary" className={styles.pad}
                onClick={() => { handleModalFileVisible(true) }}
              >导出</Button>}</Access>
              {/* {<Button type="primary" className={styles.pad}
              onClick={() => { }}
            >交付</Button>} */}
            </div>
          </Space>
        </div>
        <div className={styles.filterHead}>
          <Space className={styles.bg1}>
            <div>范围：</div>
            <Select value={viewType} style={{ width: 180, marginRight: "15px" }} onChange={handleViewType}>
              {
                [{ value: "1", lable: "单任务" }, { value: "2", lable: "项目整体" }].map(item => {
                  return <Option value={item.value} key={item.value} >{item.lable}</Option>
                })
              }
            </Select>
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
              // value={hackValue}
              value={[startDate ? moment(startDate, 'YYYY/MM/DD') : null, endDate ? moment(endDate, 'YYYY/MM/DD') : null]}
              // onCalendarChange={val => setDates(val)}
              // onOpenChange={onOpenChange}
              format="YYYY-MM-DD"
              onChange={onChangeTime} />

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
        {viewType == "2" ? "" :taskType==4?"": <div className={styles.filterHead}>
          <ul className={styles.pointCont}>
            {taskReportData.map((reportItem: object, reportIndex: number) => {
              return <li key={reportIndex}>
                <span className={styles.gray}>{reportItem.name}</span>
                <span>{reportItem.value}</span>
                {reportItem.rateName == "" ? <span></span> : <span className={styles.gray}>{reportItem.rateName}</span>}
              </li>
            })}
          </ul>
        </div>}


        <ProTable<TableListItem>
          size="small"
          scroll={{ x: 'max-content' }}
          columns={columnsData}
          actionRef={actionRef}
          request={async (params: any) => {
            let city = getCity(provinceCity);
            let province = getProvince(provinceCity);
            let reportParams: any = {
              pageNo: "1",
              pageSize: "10",
              startDate: startDate,
              endDate: endDate,
              taskId,
              province: provinceCity ? getProvince(provinceCity) : "",
              projectId,
              cityLevel,
              city: provinceCity ? getCity(provinceCity) : "",
            }
            if (viewType == "1") {
              params['city'] = city;
              params['province'] = province;
              params['endDate'] = endDate;
              params['startDate'] = startDate;
              params['taskId'] = taskId;
              params['projectId'] = projectId;
              params['flag'] = params['check_result'];
              params['pageNo'] = params['current'];
              params['field'] = params['field'];
              params['keyword'] = params['keyword'];
            }

            const paramsData = getQueryParams(params);
            if (viewType == "1") {
              setQueryParams(paramsData);
            }
            if (startDate && endDate) {
              let res: any = null
              if (viewType == "2") {
                res = await taskReport(reportParams)
                // reportCacheData = { ...reportParams }
              } else {
                res = await taskReportDetail(paramsData)
                // reportCacheData = { ...paramsData }
              }
              const data = res.data

              // reportCacheData.queryParams = paramsData
              // reportCacheData.taskList = taskValue
              // reportCacheData.projectList = listValue
              // reportCacheData.cityLevelList = cityLevelValue
              // reportCacheData.treeData = treeData
              // reportCacheData.viewType = viewType
              // reportCacheData.provinceCity = provinceCity
              // reportCacheData.taskType = taskType
              // reportCacheData.taskReportData = taskReportData
              // console.log(reportCacheData)
              return Promise.resolve({
                data: data.data,
                total: data.total,
                success: true,
              });
            }
          }}
          rowKey="answer_id"
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
          options={{ setting: true, density: false, reload: false }}
          dateFormatter="string"
          headerTitle="项目报告"
          search={viewType == "2" ? false : true}
        // toolBarRender={(action) => [
        //   <Button key="primary" type="primary" onClick={editTableTitle} disabled={taskValue == "" ? true : false}>
        //     编辑指标
        // </Button>,
        // ]}
        />
      </div>
      {/* </KeepAlive> */}
    </PageContainer>
  )

}
