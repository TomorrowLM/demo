import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import { Access, useAccess, Link, history } from 'umi';
import { Button, Badge, Popconfirm, Radio, message, Tooltip, Dropdown, Menu, Modal } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined, SearchOutlined, RedoOutlined, RetweetOutlined, EditOutlined, SendOutlined, CopyOutlined, SnippetsOutlined, FormOutlined, DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { KeepAlive, useAliveController } from 'react-activation';
import DownloadButton from '@/components/DownloadButton';
// import CreateModal from '@/components/CreateModal';
// import OperLog from '@/components/OperLog';
// import { formatDataToEnum } from '@/utils/utils';
// import emitter from '@/utils/events';
// import { getDepartmentList, getCreateAdminList } from '@/pages/service';
import proTableSettings from '../../../../config/proTableSettings';
import { TableListItem, QueryParams } from './data.d';
// import { columns, statusValueEnum, toppingValueEnum } from './const.d';
// import { getSurveyList, changeStatus, getReinviteUserNum, reinvitePush, changeIsTop } from './service';
import styles from './index.less';

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
    // await changeStatus({ surveyId, status: editStatus });
    // message.success('修改成功');
    // reload();
  }

  /**
   * 更改项目置顶状态
   * @param surveyId 项目ID
   */
  const editProjectTop = async (surveyId: string) => {
    // await changeIsTop({ surveyId, isTop, surveyChannelCode: 0 });
    // message.success('修改成功');
    // reload();
  }

  /**
   * 重新邀请
   * @param surveyId 问卷ID
   */
  const queryReinviteUser = async (surveyId: string) => {
    // const { data } = await getReinviteUserNum({ surveyId });
    // confirm({
    //   title: `可重新邀请人数：${data}人`,
    //   icon: <ExclamationCircleOutlined />,
    //   content: '注：前置问卷甄别用户',
    //   okText: '发送',
    //   onOk: async () => {
    //     const { msg } = await reinvitePush({ surveyId });
    //     message.success(msg);
    //   }
    // });
  }

  useEffect(() => {

  }, []);

  return (
    <PageContainer title={false}>
      {/* <CreateModal width={800} onCancel={() => handleModalVisible(false)} title={title} modalVisible={createModalVisible}>
        <Modify surveyId={editSurveyId} type={type} onSuccess={() => handleModalVisible(false)} />
      </CreateModal> */}
      <KeepAlive name="项目列表" id={ history.location.pathname + history.location.search } saveScrollPosition="screen">
        <div>页面</div>
        {/* <ProTable<TableListItem>
          size="small"
          className={styles.proTableBox}
          columns={columnsData}
          actionRef={actionRef}Browserslist: caniuse-lite is outdated. Please run:
npx browserslist@latest --update-db
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
              }} icon={<RedoOutlined />}>{ resetText }</Button>,
              <Button type="primary" key="search" onClick={() => {
                form?.submit();
              }} icon={<SearchOutlined />}>{ searchText }</Button>,
            ],
          }}
          options={false}
          toolBarRender={() => [
            <Access key='add' accessible={access.canPermissions('project:survey:add')}>
              <Button type='primary' onClick={() => {setTitle('新增问卷');setType('');setEditSurveyId('');handleModalVisible(true);}} icon={<PlusOutlined />}>新增</Button>
            </Access>,
            <Access key='download' accessible={access.canPermissions('project:survey:downloadList')}>
              <DownloadButton params={queryParams} path='surveyManager/survey/download_list' text='下载列表' />
            </Access>
          ]}
        /> */}
      </KeepAlive>
    </PageContainer>
  );
};