import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import { Access, useAccess, Link, history, IndexModelState, ConnectProps, Loading, connect, useDispatch } from 'umi';
import { Modal, Row, Col, message, Button, PageHeader } from 'antd';

import { CheckOutlined, DownloadOutlined, MoreOutlined, LeftOutlined, CloseCircleOutlined } from '@ant-design/icons';
import defaultSettings from '../../../../../config/defaultSettings';
// import { KeepAlive, useAliveController } from 'react-activation';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
// import proTableSettings from '../../../../config/proTableSettings';
import { TableListItem, QueryParams } from './data.d';
import { columns, menuList, downloadFormColumns, spssFormColumns } from './const.d';
import { selectDownLoadSurveyList, downLoadSurveyReport, deleteDownLoadSurveyList } from './service';
import styles from './index.less';
import EditTable from "@/pages/survey/list/EditTable"
import DropdownOperate from "@/components/DropdownOperate";
import GeneralForm from '@/components/Form';
import CreateModal from "@/components/CreateModal"
import { sign_md5 } from "@/utils/utils"
const { confirm } = Modal;
const initParams: object = {}
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
  console.log(rightContent,)

  const { refreshTime } = rightContent

  const actionRef = useRef<ActionType>();
  const memberModalRef: any = useRef(null)

  const [columnsData, setColumnsData] = useState<Array<any>>([])
  // const [refreshTime, setRefreshTime] = useState<string>('')
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const [currentSid, setCurrentSid] = useState<string>('')
  const [currentSurveyGroup, setCurrentSurveyGroup] = useState<string>('')
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [initialValues, setInitialValues] = useState<Object>(initParams);
  const [generalFormColumns, handleGeneralFormColumns] = useState<Array<any>>([]);

  const setRefreshTime = (refreshTime: string) => {
    dispatch({
      type: 'rightContent/setRefreshTime',
      payload: {
        refreshTime,
        // reload
      }
    })
  };



  const updateSurveyInfo = async (record: any) => {
    console.log(record)
    const { sid, surveyGroup, updateTime } = record
    refreshSurveyInfo({
      refreshTime: updateTime,
      sid, surveyGroup
    }).then(() => {
      reload()
    })
  }
  useEffect(() => {
    // console.log(menuList)
    // getMembers('00')


    let columnData = columns((record: any) => {
      return <Button disabled={!(record.status == 1)} type="text" style={{ color: defaultSettings.primaryColor }} icon={<DownloadOutlined />} onClick={() => {
        window.location.href = record.fileUrl
      }}>下载</Button>
    }, (record: any) => {
      if (record.status == 1) {
        return <CheckOutlined style={{ color: defaultSettings.primaryColor }} />
      } else {
        return '打包中'
      }

    }, (record: any) => {
      return <DropdownOperate menuList={menuList(() => {
        confirm({
          title: '确定删除该条数据?',
          icon: '',
          content: '',
          onOk() {
            deleteDownLoadSurveyList({ downloadId: record.downloadId }).then((res) => {
              message.success("操作成功")
              reload()
            })
          },
        });

      })} position={"bottomRight"} trigger={['click']}>
        <Button type="text" icon={<MoreOutlined style={{ color: defaultSettings.primaryColor, fontWeight: "bold" }} />}></Button>
      </DropdownOperate>
    })
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
  const onFinish = async (values: any) => {

    if (modalTitle === "导出数据") {
      if(values['converty']&&values['converty'][0]==1){
        values['converty'] = values['converty'][0]
      }else{
        values['converty'] = 0
      }
      if(values['exportTime']&&values['exportTime'][0] ==1){
        values['exportTime'] = values['exportTime'][0]
      }else{
        values['exportTime'] = 0
      }
      
      const res = await downLoadSurveyReport({ ...values, sid: history.location.query.sid, surveyGroup: history.location.query.surveyGroup });
      if (res.code == 200) {
        message.success(`操作成功`);
        actionRef.current?.reload();
      }

      handleModalVisible(false);
    } else {
      window.location.href = `/surveycoolApi${values.downloadType}?sid=${history.location.query.sid}&userId=${localStorage.getItem('adminId')}&completionState=${values.completionState}&isDownGroupData=${values.isDownGroupData}&${sign_md5()}`
      handleModalVisible(false);
    }

  }

  return (
    <div className={styles.pages}>
      <PageHeader backIcon={<LeftOutlined />} title='导出数据列表' onBack={() => window.history.back()} />
      <CreateModal onCancel={() => handleModalVisible(false)} title={modalTitle} modalVisible={createModalVisible}>
        <GeneralForm initialValues={initialValues} columns={generalFormColumns} onFinish={(values => onFinish(values))} />
      </CreateModal>
      <Row style={{ marginBottom: "10px" }}>
        <Col>
          <Button type="primary" style={{ borderRadius: "6px" }} onClick={() => {
            setModalTitle("导出数据")
            handleGeneralFormColumns(downloadFormColumns())
            handleModalVisible(true)
          }}>导出数据</Button>&nbsp;&nbsp;
          <Button type="primary" style={{ borderRadius: "6px" }} onClick={() => {
            setModalTitle("SPSS导出")
            handleGeneralFormColumns(spssFormColumns())
            handleModalVisible(true)
          }}>SPSS导出</Button>
        </Col>
      </Row>

      <ProTable<TableListItem>
        size="small"
        columns={columnsData}
        actionRef={actionRef}
        request={async (params: any) => {
          const paramsData = getQueryParams(params);
          // setQueryParams(paramsData);
          paramsData.surveyGroup = history.location.query.surveyGroup
          paramsData.sid = history.location.query.sid
          const { data }: any = await selectDownLoadSurveyList(paramsData)
          return Promise.resolve({
            data: data.downloadList,
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
        // search={{
        //   labelWidth: 90,
        //   span: proTableSettings.defaultColConfig,
        //   optionRender: ({ searchText, resetText }, { form }) => [
        //     <Button key="rest" onClick={() => {
        //       form?.resetFields();
        //       form?.submit();
        //     }} icon={<RedoOutlined />}>{ resetText }</Button>,
        //     <Button type="primary" key="search" onClick={() => {
        //       form?.submit();
        //     }} icon={<SearchOutlined />}>{ searchText }</Button>,
        //   ],
        // }}
        // options={false}
        options={{ setting: true, density: false, reload: true, fullScreen: false }}
        toolBarRender={() => [
          // <Access key='add' accessible={access.canPermissions('project:survey:add')}>
          // <Button type='primary' key='refresh' onClick={() => {
          //   refreshSurveyList({
          //     refreshTime,
          //   })
          // }} icon={<RedoOutlined />}>拉取</Button>,
          // </Access>,
          // <Access key='download' accessible={access.canPermissions('project:survey:downloadList')}>
          //   <DownloadButton params={queryParams} path='surveyManager/survey/download_list' text='下载列表' />
          // </Access>
        ]}
      />
    </div >
  )
}
export default connect(
  ({ rightContent, loading }: { rightContent: IndexModelState; loading: Loading }) => ({
    rightContent,
    loading: loading.models.index,
  }),
)(Listpage)