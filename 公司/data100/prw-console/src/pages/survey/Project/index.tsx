import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import { Access, useAccess, Link, history } from 'umi';
import { Button, Badge, Popconfirm, Radio, message, Tooltip, Dropdown, Menu, Modal, Checkbox, Select } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined, SearchOutlined, RedoOutlined, RetweetOutlined, EditOutlined, SendOutlined, CopyOutlined, SnippetsOutlined, FormOutlined, DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { KeepAlive, useAliveController } from 'react-activation';
import DownloadButton from '@/components/DownloadButton';
import CreateModal from '@/components/CreateModal';
import OperLog from '@/components/OperLog';
import { formatDataToEnum } from '@/utils/utils';
import emitter from '@/utils/events';
import { getDepartmentList, getCreateAdminList } from '@/pages/service';
import Modify from '../Modify';
import proTableSettings from '../../../../config/proTableSettings';
import { TableListItem, QueryParams } from './data.d';
import { columns, statusValueEnum, toppingValueEnum, reinviteUserEnum } from './const.d';
import { getSurveyList, changeStatus, getReinviteUserNum, reinvitePush, changeIsTop, getSurveyAnswerYears } from './service';
import styles from './index.less';
import defaultSettings from '../../../../config/defaultSettings';
import { formatData } from '@/utils/utils';
const { confirm } = Modal;
let isTop: string = '';
let editStatus: string = '';
let curColumnsData: Array<any> = [];
let copyActionRef: any = null;

/**
 * 处理查询与下载列表时的参数
 * @param params 
 */
const getQueryParams = (params: any): QueryParams => {
  const { current, pageSize, surveyId, slsSurveyId, surveyName, createTime, status, isTop: top, createAdmin: createAdminId, department: departmentCode } = params;
  return {
    current,
    pageSize,
    createAdminId: createAdminId ? createAdminId.join(',') : '',
    departmentCode: departmentCode || '',
    status: status || '',
    isTop: top || '',
    surveyId: surveyId || '',
    surveyName: surveyName || '',
    slsSurveyId: slsSurveyId || '',
    start: createTime ? createTime[0] : '',
    end: createTime ? createTime[1] : ''
  }
}

export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<string>('1'); // 1: 编辑  2: 复制
  const [editSurveyId, setEditSurveyId] = useState<string>('');
  const [answerYear, setAnswerYear] = useState<string>('');
  const [answerYears, setAnswerYears] = useState<Array<any>>();
  const [answerYearVisible, handleModalanswerYearVisible] = useState<boolean>(false);
  const [downloadSurveyId, setDownloadSurveyId] = useState<string>('');

  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>(curColumnsData);
  const [queryParams, setQueryParams] = useState<QueryParams>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [operLogModalVisible, handleOperLogModalVisible] = useState<boolean>(false);
  const { getCachingNodes } = useAliveController();
  const cachingNodes = getCachingNodes ? getCachingNodes() : [];

  const reload = () => {
    const current = actionRef.current || copyActionRef.current;
    current?.reload();
  }

  /**
   * 更改项目状态
   * @param surveyId 问卷ID
   */
  const editProjectStatus = async (surveyId: string) => {
    await changeStatus({ surveyId, status: editStatus });
    message.success('修改成功');
    reload();
  }

  /**
   * 更改项目置顶状态
   * @param surveyId 项目ID
   */
  const editProjectTop = async (surveyId: string) => {
    await changeIsTop({ surveyId, isTop, surveyChannelCode: 0 });
    message.success('修改成功');
    reload();
  }

  const reinviteUserContent = (userNumber: number, reinviteUser: any) => {
    return <div>
      <Checkbox.Group style={{ width: '100%', margin: "10px 0" }} onChange={reinviteUser}>
        <Checkbox value='surveyBeforeScreen'>前置问卷甄别用户</Checkbox>
        <Checkbox value='screen'>主问卷甄别用户</Checkbox>
        <Checkbox value='quota'>配额满用户</Checkbox>
      </Checkbox.Group>
      <div style={{ color: "rgba(208,52,52,0.98)" }}>可重新邀请人数：{userNumber}人</div>
    </div>
  }
  /**
   * 重新邀请
   * @param surveyId 问卷ID
   */
  const queryReinviteUser = async (surveyId: string) => {
    const { data } = await getReinviteUserNum({ surveyId });
    let surveyStatus: any = []
    const confirmModal = confirm({
      title: <div style={{ textAlign: "center" }}>重新邀请</div>,
      icon: '',
      content: reinviteUserContent(0, (value: any) => { reinviteUser(value, data) }),
      okText: '发送',
      onOk: async () => {
        const { msg } = await reinvitePush({ surveyId, surveyStatus: surveyStatus });
        message.success(msg);
      }
    });
    const reinviteUser = (value: any, data: object) => {
      let userNumber = 0
      surveyStatus = []
      value.forEach((item: string) => {
        userNumber += data[item]
        surveyStatus.push(reinviteUserEnum[item])
      })
      confirmModal.update({
        content: reinviteUserContent(userNumber, (value: any) => { reinviteUser(value, data) }),
        onOk: async () => {
          const { msg } = await reinvitePush({ surveyId, surveyStatus: surveyStatus });
          message.success(msg);
        }
      })
    }
  }
  const downloadModal = (surveyId: string) => {
    setDownloadSurveyId(surveyId)
    getSurveyAnswerYears({ surveyId: surveyId }).then(({ data }) => {
      handleModalanswerYearVisible(true)
      setAnswerYears(formatData(data, { value: 'value', key: 'label' }))
      setAnswerYear(data.length>0?data[0].value:'')
    })
  }
  const option = {
    title: '操作',
    width: 130,
    key: 'option',
    valueType: 'option',
    fixed: 'right',
    render: (_: any, record: any) => [
      <Access key='edit' accessible={access.canPermissions('project:survey:edit')}>
        <a onClick={() => { setTitle('编辑问卷'); setType('1'); setEditSurveyId(record.surveyId); handleModalVisible(true); }}><Tooltip title='修改' getPopupContainer={(triggerNode: any) => triggerNode.parentElement}><EditOutlined /></Tooltip></a>
      </Access>,
      <Access key='copy' accessible={access.canPermissions('project:survey:add')}>
        <a onClick={() => { setTitle('复制问卷'); setType('2'); setEditSurveyId(record.surveyId); handleModalVisible(true); }}><Tooltip title='复制' getPopupContainer={(triggerNode: any) => triggerNode.parentElement}><CopyOutlined /></Tooltip></a>
      </Access>,
      <Access key='details' accessible={access.canPermissions('project:survey:surveyLabel')}>
        <Link to={{
          pathname: `/survey/project/push`,
          search: `?surveyId=${record.surveyId}&surveyName=${record.surveyName}`,
        }}><Tooltip title='精准推送' getPopupContainer={(triggerNode: any) => triggerNode.parentElement}><SendOutlined /></Tooltip></Link>
      </Access>,
      <Access key='download' accessible={access.canPermissions('project:survey:downloadList')}>
        <Tooltip title='数据下载' getPopupContainer={(triggerNode: any) => triggerNode.parentElement}><DownloadOutlined style={{ color: defaultSettings.primaryColor }}
          onClick={() => {
            downloadModal(record.surveyId)
          }}
        /></Tooltip>
        {/* <Dropdown overlay={
          <Menu>
            <Menu.Item><DownloadButton params={{ surveyId: record.surveyId }} type="text" showIcon={false} downloadCenter path='surveyManager/survey/download_answer_record' text='答题记录下载' /></Menu.Item>
            <Menu.Item><DownloadButton params={{ surveyId: record.surveyId }} type="text" showIcon={false} downloadCenter path='surveyManager/survey/download_appDetails_record' text='数据监测下载' /></Menu.Item>
          </Menu>
        } placement="bottomLeft"><a><DownloadOutlined /></a></Dropdown> */}
      </Access>,
      <Access key='invitation' accessible={access.canPermissions('project:survey:accuratePush')}>
        <a onClick={() => queryReinviteUser(record.surveyId)}><Tooltip title='重新邀请' getPopupContainer={(triggerNode: any) => triggerNode.parentElement}><RetweetOutlined /></Tooltip></a>
      </Access>,
      <Access key='log' accessible={access.canPermissions('project:survey:log')}>
        <a onClick={() => { setEditSurveyId(record.surveyId); handleOperLogModalVisible(true) }}><Tooltip title='日志'><SnippetsOutlined /></Tooltip></a>
      </Access>
    ],
  }

  useEffect(() => {
    const { location } = history;
    const curCaching: number = cachingNodes.findIndex(item => item.id.slice(0, item.id.length - 2) === location.pathname + location.search);
    if (curCaching === -1) {
      emitter.addListener('projectListReload', () => {
        reload();
      });
      Promise.all([getDepartmentList(), getCreateAdminList({ type: '0' })]).then(([department, createAdmin]) => {
        curColumnsData = columns(
          formatDataToEnum(department.data, 'itemName', 'itemCode'),
          formatDataToEnum(createAdmin.data, 'userName', 'userId'),
          {
            title: '状态',
            width: 100,
            dataIndex: 'status',
            align: 'left',
            order: 7,
            valueEnum: statusValueEnum,
            initialValue: '0',
            hideInTable: !access.canPermissions('project:survey:editStatus'),
            render: (_: any, record: any) => {
              const radio = Object.keys(statusValueEnum).map((key: string) => {
                if (key !== '3') {
                  return <Radio key={`status${key}`} value={key}>{statusValueEnum[key].text}</Radio>
                }
                return null;
              })
              return <div key={`popconfirm${record.surveyId}`}>
                <Badge status={statusValueEnum[record.status].status} text={statusValueEnum[record.status].text} />
                {record.status !== 2 ? <Popconfirm destroyTooltipOnHide onConfirm={() => editProjectStatus(record.surveyId)} title={
                  <div className={styles.popconfirmBox}>
                    <h3>请选择状态：</h3>
                    <Radio.Group defaultValue={`${record.status}`} onChange={(e) => { editStatus = e.target.value }}>
                      {radio}
                    </Radio.Group>
                  </div>
                } icon={<FormOutlined />}>
                  <a style={{ marginLeft: 20 }} onClick={() => { editStatus = record.status }}><FormOutlined /></a>
                </Popconfirm> : null}
              </div>
            }
          },
          {
            title: '创建时间',
            width: 150,
            dataIndex: 'createTime',
            align: 'left',
            valueType: 'dateRange',
            order: 2,
            render: (_: any, record: any) => record.createTime
          },
          {
            title: '是否置顶',
            width: 100,
            dataIndex: 'isTop',
            align: 'left',
            valueEnum: toppingValueEnum,
            order: 1,
            render: (_: any, record: any) => {
              const radio = Object.keys(toppingValueEnum).map((key: string) => {
                return <Radio key={`toppingValueEnum${key}`} value={key}>{toppingValueEnum[key].text}</Radio>
              })
              const isTopCode: string = record.isTop === '是' ? '1' : '0';
              return <div>
                <Badge status={toppingValueEnum[isTopCode].status} text={toppingValueEnum[isTopCode].text} />
                <Access key='isTop' accessible={access.canPermissions('project:survey:top')}>
                  <Popconfirm destroyTooltipOnHide onConfirm={() => editProjectTop(record.surveyId)} title={
                    <div className={styles.popconfirmBox}>
                      <h3>请选择是否置顶：</h3>
                      <Radio.Group defaultValue={isTopCode} onChange={(e) => { isTop = e.target.value }}>
                        {radio}
                      </Radio.Group>
                    </div>
                  } icon={<FormOutlined />}>
                    <a style={{ marginLeft: 20 }} onClick={() => { isTop = isTopCode }}><FormOutlined /></a>
                  </Popconfirm>
                </Access>
              </div>
            }
          },
        )
        setColumnsData([...curColumnsData, option])
      })
    } else {
      setColumnsData([...curColumnsData, option])
    }

    return () => {
      if (actionRef.current) {
        copyActionRef = actionRef;
      }
    }
  }, []);

  return (
    <PageContainer title={false}>
      <Modal
        visible={answerYearVisible}
        closable={true}
        onCancel={()=>{
          handleModalanswerYearVisible(false)
        }}
        footer={[]}
      >
        <div>答题年份：<Select value={answerYear} onChange={(value: string) => {
          setAnswerYear(value)
        }}
          style={{ width: "150px",margin:'20px 0' }} options={answerYears}></Select>
          <div><DownloadButton disabled={answerYears&&answerYears.length===0} downloadCenter params={{ surveyId: downloadSurveyId, table: answerYear }} showIcon={false} path={`surveyManager/survey/download_answer_record`} text='答题记录下载' />&nbsp;&nbsp;&nbsp;&nbsp;<DownloadButton disabled={answerYears&&answerYears.length===0}  downloadCenter params={{ surveyId: downloadSurveyId, table: answerYear }} showIcon={false} path='surveyManager/survey/download_appDetails_record' text='数据监测下载' /></div>
        </div>
      </Modal>
      <OperLog params={{ projectId: editSurveyId, targetType: 1, terminalCode: '0' }} onCancel={() => handleOperLogModalVisible(false)} modalVisible={operLogModalVisible} />
      <CreateModal width={800} onCancel={() => handleModalVisible(false)} title={title} modalVisible={createModalVisible}>
        <Modify surveyId={editSurveyId} type={type} onSuccess={() => handleModalVisible(false)} />
      </CreateModal>
      <KeepAlive name="项目列表" id={history.location.pathname + history.location.search} saveScrollPosition="screen">
        <ProTable<TableListItem>
          size="small"
          className={styles.proTableBox}
          columns={columnsData}
          actionRef={actionRef}
          request={async (params: any) => {
            const paramsData = getQueryParams(params);
            setQueryParams(paramsData);
            const { data }: any = await getSurveyList(paramsData)
            return Promise.resolve({
              data: data.list,
              total: data.total,
              success: true,
            });
          }}
          scroll={{ x: 'max-content' }}
          rowKey="surveyId"
          pagination={{
            showQuickJumper: true,
            current: Number(process.env.CURRENT),
            pageSize: Number(process.env.PAGE_SIZE)
          }}
          dateFormatter="string"
          headerTitle="项目列表"
          search={{
            labelWidth: 90,
            span: proTableSettings.defaultColConfig,
            optionRender: ({ searchText, resetText }, { form }) => [
              <Button key="rest" onClick={() => {
                form?.resetFields();
                form?.submit();
              }} icon={<RedoOutlined />}>{resetText}</Button>,
              <Button type="primary" key="search" onClick={() => {
                form?.submit();
              }} icon={<SearchOutlined />}>{searchText}</Button>,
            ],
          }}
          options={false}
          toolBarRender={() => [
            <Access key='add' accessible={access.canPermissions('project:survey:add')}>
              <Button type='primary' onClick={() => { setTitle('新增问卷'); setType(''); setEditSurveyId(''); handleModalVisible(true); }} icon={<PlusOutlined />}>新增</Button>
            </Access>,
            <Access key='download' accessible={access.canPermissions('project:survey:downloadList')}>
              <DownloadButton params={queryParams} path='surveyManager/survey/download_list' text='下载列表' />
            </Access>
          ]}
        />
      </KeepAlive>
    </PageContainer>
  );
};