// import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import { Access, useAccess, Link, history, IndexModelState, ConnectProps, Loading, connect } from 'umi';
import {Button, Image, message, Progress} from 'antd';

import {  MoreOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import EditTable from "@/pages/survey/list/EditTable"
import operationLog from "@/assets/operationLog.png"
import DropdownOperate from "@/components/DropdownOperate";
import {isXsScreen} from "@/utils/utils";
import OperationLog, {LogType} from "@/components/button/OperationLog";
import defaultSettings from '../../../../config/defaultSettings';
// import proTableSettings from '../../../../config/proTableSettings';
import { TableListItem, QueryParams } from './data.d';
import { columns, menuList } from './const.d';
import { surveyListInfo, refreshSurveyInfo ,addProjectCardService} from './service';
import styles from './index.less';
import MemberModal from "./memberModal"

import permissionConfig from "../../../../config/permissionConfig";


let copyActionRef: any = null;

/**
 * 处理查询与下载列表时的参数
 * @param params
 */
const getQueryParams = (params: any): QueryParams => {
  const { current, pageSize } = params;
  return {
    current,
    pageSize,
  }
}
interface PageProps extends ConnectProps {
  rightContent: IndexModelState;
  loading: boolean;
}
const Listpage: React.FC<PageProps> = ({ rightContent, dispatch }) => {
  // console.log(rightContent,)
  const permissionLog=useAccess().canPermissions(permissionConfig.surveyList.permissionLog)
  const [showLogModule,setShowLogModule]=useState(false)
  const { refreshTime } = rightContent
  const [showLogSid,setShowLogSid]=useState('')
  const actionRef = useRef<ActionType>();
  const memberModalRef:any = useRef(null)

  const [columnsData, setColumnsData] = useState<Array<any>>([])
  // const [refreshTime, setRefreshTime] = useState<string>('')
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const [currentSid, setCurrentSid] = useState<string>('')
  const [currentSurveyGroup, setCurrentSurveyGroup] = useState<string>('')
  const [searchValue,setSearchValue]=useState<string>('')
  const setRefreshTime = (refreshTime: string) => {
    dispatch({
      type: 'rightContent/setRefreshTime',
      payload: {
        refreshTime,
        reload
      }
    })
  };

  const updateSurveyInfo = async (record: any) => {
    const { sid, surveyGroup, updateTime } = record
    refreshSurveyInfo({
      refreshTime: updateTime,
      sid, surveyGroup
    }).then(() => {
      reload()
    })
  }
  const createCard = async ( params:any ) =>{
    let paramsString= params.search.substr(1);
    paramsString = paramsString.replace(/&/g, '","').replace(/=/g, '":"');
    const paramsObj = `{"${  paramsString  }"}`;
    const {surveyGroup} = JSON.parse(paramsObj);
    await addProjectCardService({ surveyGroupIds:surveyGroup }).then((res)=>{
      if(res.code == 200){
        message.success('添加成功');
      }else{
        // message.error('该问卷已经创建成卡片');
        message.error(res.msg)
      }
    })
  }
  useEffect(() => {
    // console.log(menuList)
    const columnData = columns(
    (record: any, name: string, maxWidth: number) => {
      return <EditTable name={name} text={record[name]} refreshTime={refreshTime} sid={record.sid} reload={reload} maxWidth={maxWidth || 100} />
    }, 
    (record: any) => {

    }, 
    (record: any) => {
      return <Button type="text" style={{ color: defaultSettings.primaryColor }} onClick={() => { updateSurveyInfo(record) }}>拉取</Button>
    }, 
    (record: any) => {
      return <DropdownOperate
        menuList={
        menuList(() => {
        setModalVisible(true)
        setCurrentSid(record.sid)
        setCurrentSurveyGroup(record.surveyGroup)
        console.log(memberModalRef, memberModalRef.current)
        memberModalRef.current.getManagerUser(record.surveyGroup,'1')
        }, 
        createCard,
        `?surveyGroup=${record.surveyGroup}&surveyName=${encodeURIComponent(record.surveyName)}&sid=${record.sid}`
        )}
        position="bottomRight" trigger={['click']}>
        <Button type="text" icon={<MoreOutlined style={{ color: defaultSettings.primaryColor, fontWeight: "bold" }} />} />
      </DropdownOperate>
    },
    (text:any,)=>{
      return <Progress percent={Number(text)} showInfo strokeColor="#01CF97" />
    })
    if (permissionLog){
      // 由于数组第一个有个搜索，所以只能写4了，如果数组有变化，需要改动这个数字
      columnData.splice(4,0,{
        title: '操作日志',
        width: 80,
        dataIndex: 'operationLog',
        align: 'left',
        search: false,
        render:(text, record)=>{
          return <Image src={operationLog} width='18px' height='18px' preview={false} onClick={
            () => {
              setShowLogSid(record.sid)
              setShowLogModule(true)
            }
          }/>
        }
      })
    }
    setColumnsData(columnData)
    return () => {
      if (actionRef.current) {
        copyActionRef = actionRef;
      }
    }
  }, [])

  const reload = () => {
    const current = actionRef.current || copyActionRef.current;
    current?.reload();
  }

  const reloadAndRest = () => {
    const current = actionRef.current || copyActionRef.current;
    current?.reloadAndRest();
  }
  return (
    <div className={styles.pages}>
      <div style={{ position: 'relative', background: "#fff" }}>
        <MemberModal
          ref={memberModalRef}
          fileType="1"
          modalVisible={modalVisible}
          handleModalVisible={(value: boolean) => {
            setModalVisible(value)
          }}
        />
      </div>

      <ProTable<TableListItem>
        size="small"
        columns={columnsData}
        actionRef={actionRef}
        request={async (params: any) => {
          const paramsData = getQueryParams(params);
          paramsData.queryWords=searchValue || ""
          // setQueryParams(paramsData);
          const { data }: any = await surveyListInfo(paramsData)
          setRefreshTime(data.refreshTime)
          return Promise.resolve({
            data: data.surveyList,
            total: data.total,
            success: true,
          });
        }}
        scroll={{ x: 'max-content' }}
        rowKey="surveyGroup"
        pagination={{
          position: ["bottomCenter"],
          showQuickJumper: true,
          current: Number(process.env.CURRENT),
          pageSize: Number(process.env.PAGE_SIZE)
        }}
        dateFormatter="string"
        headerTitle=""
        search={false}
        toolbar={{
          title: ' ',
          search: {
            width:'480px',
            placeholder:'请输入sid或者问卷名称',
            size:"large",
            allowClear:true,
            enterButton:"搜索",
            onSearch: (value: string) => {
              setSearchValue(value)
              reloadAndRest()
            },
          },
          settings: [],
        }}
      />
      <OperationLog logType={LogType.surveyList} uId={showLogSid}
                    showModule={showLogModule}
                    onCancel={() => {
                      setShowLogModule(false)
                    }}/>
    </div >
  )
}
export default connect(
  ({ rightContent, loading }: { rightContent: IndexModelState; loading: Loading }) => ({
    rightContent,
    loading: loading.models.index,
  }),
)(Listpage)
