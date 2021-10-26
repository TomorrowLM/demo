import React, {useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Link, Access, useAccess,history } from 'umi';
import { Button, message, Modal, Tooltip } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { KeepAlive, useAliveController } from 'react-activation';
import CreateModal from '@/components/CreateModal';
import { formatDataToEnum } from '@/utils/utils';
import emitter from '@/utils/events';
import GeneralForm from '@/components/Form';
import { TableListItem } from './data';
import { columns, customerFormColumns } from './const.d';
// import { isXsScreen } from '@/utils/utils';
import { PlusOutlined,  EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons';
import { getCustomerList } from '@/pages/service';
import { getProjectList, handleProject, handleDeleteProject} from './service';
import proTableSettings from '../../../../config/proTableSettings';

const { confirm } = Modal;
let curColumnsData: Array<any> = [];
let copyActionRef: any = null;
let curFormColumns: any = null;

/**
 * 处理查询与下载列表时的参数
 * @param params
 */
const getQueryParams = (params: any): QueryParams => {
  const { current, pageSize, customerIds, projectName, startTime, endTime, creatUser} = params;
  return {
    current,
    pageSize,
    customerIds: customerIds || '',
    projectName: projectName || '',
    startTime: startTime || '',
    endTime: endTime || '',
    creatUser: creatUser|| '',
  }
}

export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [modalTitle, setModalTitle] = useState<string>('');
  const [editProjectId, setEditProjectId] = useState<string>('');
  const [expandedRowKeys, setExpandedRowKeys] = useState<Array<string>>([]);
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>(curColumnsData);
  const [queryParams, setQueryParams] = useState<QueryParams>();
  const [initialValues, setInitialValues] = useState<Object>({ status: '0' });
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalType, handleModalType] = useState<string>('');
  const [generalFormColumns, handleGeneralFormColumns] = useState<Array<any>>(formColumns);
  const { getCachingNodes } = useAliveController();
  const cachingNodes = getCachingNodes ? getCachingNodes() : [];
  // const [isLoaded, setIsLoaded] = useState<Boolean>(false);
  const reload = () => {
    const current = actionRef.current || copyActionRef.current;
    current?.reload();
  }
  const [formColumns, setFormColumns] = useState<Array<any>>([]);

  const addProject = (record?: any) => {
    setModalTitle('新增')
    handleModalVisible(true);
    handleModalType('PUT');
  }

  const editProject = (record: any) => {
    setModalTitle('修改')
    const { projectId, customerId, projectName } = record;
    setEditProjectId(projectId);
    setInitialValues({ projectId, customerId, projectName })
    handleModalVisible(true);
    handleModalType('PUT');
  }

  const deleteProject = (record: any) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除项目名称为 "${record.projectName}" 的数据项?`,
      onOk: async () => {
        await handleDeleteProject(record);
        message.success('删除成功');
        actionRef.current?.reload();
      }
    });
  }

  const option = {
    title: '操作',
    width: 80,
    key: 'option',
    valueType: 'option',
    fixed: 'right',
    render: (_: any, record: any) => [
      // <Access key='details' accessible={access.canPermissions('adv:project:projectDetails')}>
      //   <Link to={{
      //     pathname: `/adv/approvalCenter/viewReport`,
      //     search: `?projectId=${record.projectId}&source=projectManager&customerId=${record.customerId}`,
      //   }}>
      //     <Tooltip title='项目报表' getPopupContainer={(triggerNode: any) => triggerNode.parentElement}><EyeOutlined /></Tooltip>
      //   </Link>
      // </Access>,
      <Access key='addTask' accessible={access.canPermissions('adv:addTask')}>
        <Link to={{
          pathname: `/adv/projectManager/addTask`,
          search: `?projectId=${record.projectId}&projectName=${record.projectName}&customerId=${record.customerId}`,
        }}>
          <Tooltip title='任务列表' getPopupContainer={(triggerNode: any) => triggerNode.parentElement}><EyeOutlined /></Tooltip>
        </Link>
      </Access>,
      <Access key='edit' accessible={access.canPermissions('adv:project:edit')}>
        <a onClick={() => { editProject(record); }}>
        <Tooltip title='修改' getPopupContainer={(triggerNode: any) => triggerNode.parentElement}><EditOutlined /></Tooltip>
        </a>
      </Access>,
      <Access key='delete' accessible={access.canPermissions('adv:project:delete')}>
        <a onClick={() => { deleteProject(record); }}>
        <Tooltip title='删除' getPopupContainer={(triggerNode: any) => triggerNode.parentElement}><DeleteOutlined /></Tooltip>
        </a>
      </Access>
    ],
  }

  const onFinish = async (values: any) => {
    await handleProject(createModalType, modalTitle === '新增' ? values : { ...values, projectId: editProjectId });
    handleModalVisible(false);
    message.success(`${modalTitle}成功`);
    actionRef.current?.reload();
  }

  useEffect(() => {
    const { location } = history;
    const curCaching: number = cachingNodes.findIndex(item => item.id.slice(0, item.id.length - 2) === location.pathname + location.search);
    if (curCaching === -1) {
      emitter.addListener('projectListReload', () => {
        reload();
      });
      Promise.all([getCustomerList()]).then(([customer]) => {
        let customerEumn=formatDataToEnum(customer.data, 'customerName', 'customerId');
        curColumnsData = columns(customerEumn)
        let customerOption=[];
        for (let key in customerEumn) {
          customerOption.push({'label':customerEumn[key]['text'],'value':key});
        }
        curFormColumns=customerFormColumns(customerOption)
        setFormColumns(curFormColumns)
        setColumnsData([...curColumnsData,option])
      })
    } else {
      setFormColumns(curFormColumns)
      setColumnsData([...curColumnsData,option])
    }

    return () => {
      if (actionRef.current) {
        copyActionRef = actionRef;
      }
    }
  }, []);

  return (
    <PageContainer title={false}>
    <CreateModal onCancel={() => handleModalVisible(false)} title={modalTitle} modalVisible={createModalVisible}>
      <GeneralForm initialValues={initialValues} columns={formColumns} onFinish={(values => onFinish(values))}/>
    </CreateModal>
      <KeepAlive name="项目管理" id={ history.location.pathname + history.location.search } saveScrollPosition="screen">
        <ProTable<TableListItem>
        size="small"
        columns={columnsData}
        actionRef={actionRef}
        search={{
          labelWidth: 100,
          span: proTableSettings.defaultColConfig,
        }}
        request={async (params: any) => {
          const paramsData = getQueryParams(params);
          setQueryParams(paramsData);
          const { data }: any = await getProjectList(paramsData)
          return Promise.resolve({
            data: data.projectList,
            total: data.total,
            success: true,
          });
        }}
        rowKey="id"
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
        dateFormatter="string"
        headerTitle="项目管理"
        toolBarRender={() => [
          <Access key='add' accessible={access.canPermissions('adv:add')}>
            <Button type="primary" onClick={() => { addProject() }} icon={<PlusOutlined />}>新增</Button>
          </Access>
        ]}
        />
      </KeepAlive>
    </PageContainer>
  )
}
