import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useRef } from 'react';
import { Access, useAccess } from 'umi';
import { Space, Button, message, Modal, Switch } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateModal from '@/components/CreateModal';
import GeneralForm from '@/components/Form';
import DownloadButton from '@/components/DownloadButton';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { uniqueTree, isXsScreen } from '@/utils/utils';
import proTableSettings from '../../../../config/proTableSettings';
import { getRoleList, systemRole, deleteSystemRole, changeStatus, getMenuTreeselect, getRoleMenuTreeselect, updateDataScope } from './service';
import { columns, roleFormColumns, jurisdictionFormColumns, deptIdsColumns } from './const.d';
import { TableListItem } from './data.d';
import styles from './index.less';

const { confirm } = Modal;
const initParams: object = { status: '0', roleSort: '0' }

export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [editRoleId, setEditRoleId] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [initialValues, setInitialValues] = useState<Object>(initParams);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [switchLoading, setSwitchLoading] = useState<boolean>(false);
  const [createModalType, handleModalType] = useState<string>('');
  const [generalFormColumns, handleGeneralFormColumns] = useState<Array<any>>([]);
  const [batchDeleteKeys, setBatchDeleteKeys] = useState<Array<any>>([]);
  const [queryParams, setQueryParams] = useState<any>({});
  
  const addRole = async () => {
    const data = await getMenuTreeselect();
    roleFormColumns[3].options = data;
    handleGeneralFormColumns(roleFormColumns)
    setModalTitle('新增角色');
    setInitialValues({ ...initParams });
    handleModalVisible(true);
    handleModalType('POST');
  }

  const editRole = async (record: any) => {
    const { roleId, roleName, roleSort, status, menuIds, remark } = record;
    const data = await getRoleMenuTreeselect(roleId);
    roleFormColumns[3].options = data;
    handleGeneralFormColumns(roleFormColumns);
    const uniqueChild = await uniqueTree(data, menuIds ? menuIds.split(',') : []);
    setModalTitle('编辑角色');
    setEditRoleId(roleId);
    setInitialValues({ roleName, roleSort, status, menuIds: uniqueChild.join(), remark });
    handleModalVisible(true);
    handleModalType('PUT');
  }

  // const editJurisdiction = async (record: any) => {
  //   const { roleId, roleName, roleKey, dataScope, deptIds } = record;
  //   const data = await getRoleDeptTreeselect(roleId);
  //   setModalTitle('分配数据权限');
  //   setEditRoleId(roleId);
  //   deptIdsColumns.options = data;
  //   handleGeneralFormColumns(dataScope === '2' ? [...jurisdictionFormColumns, deptIdsColumns] : jurisdictionFormColumns)
  //   const uniqueChild = await uniqueTree(data, deptIds ? deptIds.split(',') : []);
  //   setInitialValues({ roleName, roleKey, dataScope, deptIds: uniqueChild.join() });
  //   handleModalVisible(true);
  // }

  const deleteRole = (record: any) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除名称为 "${record.roleName}" 的数据项?`,
      onOk: async () => {
        await deleteSystemRole(record.roleId);
        message.success('删除成功');
        actionRef.current?.reload();
      }
    });
  }

  const batchDeleteRole = (onCleanSelected: Function) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除所选的数据项?`,
      onOk: async () => {
        await deleteSystemRole(batchDeleteKeys.join());
        message.success('删除成功');
        actionRef.current?.reload();
        onCleanSelected();
      }
    });
  }

  const columnsData: ProColumns<TableListItem>[] = [ ...columns, {
    title: '操作',
    width: isXsScreen ? 60 : 180,
    key: 'option',
    valueType: 'option',
    fixed: 'right',
    hideInTable: !access.canPermissions('system:role:edit') && !access.canPermissions('system:role:remove'),
    render: (_, record) => [
      <Access key='edit' accessible={access.canPermissions('system:role:edit')}>
        <a onClick={() => { editRole(record); }}><EditOutlined /> { isXsScreen ? null : '修改' }</a>
      </Access>,
      // <Access key='jurisdiction' accessible={access.canPermissions('system:role:edit')}>
      //   <a onClick={() => { editJurisdiction(record); }}><EyeInvisibleOutlined /> 权限</a>
      // </Access>,
      <Access key='delete' accessible={access.canPermissions('system:role:remove')}>
        <a onClick={() => { deleteRole(record); }}><DeleteOutlined /> { isXsScreen ? null : '删除' }</a>
      </Access>
    ],
  }]

  columnsData.splice(2, 0, {
    title: '状态',
    width: 100,
    dataIndex: 'status',
    align: 'left',
    hideInTable: !access.canPermissions('system:role:edit'),
    valueEnum: {
      '0': {
        text: '启用',
      },
      '1': {
        text: '停用',
      },
    },
    render: (_, record: any) => {
      return <Switch key={`status${  record.roleId}`} loading={switchLoading} checkedChildren="启用" unCheckedChildren="停用" checked={record.status === '0'} onClick={(val: boolean) => {
        const onChangeStatus = async () => {
          setSwitchLoading(true)
          try {
            await changeStatus({ roleId: record.roleId, status: val ? '0' : '1' });
            message.success(val ? '启用成功' : '停用成功');
            setSwitchLoading(false)
            actionRef.current?.reload();
          } catch (error) {
            setSwitchLoading(false)
          }
        }
        if (!val) {
          confirm({
            title: '警告',
            icon: <ExclamationCircleOutlined />,
            content: `确认要停用 "${record.roleName}" 的数据项?`,
            onOk: () => {
              onChangeStatus();
            }
          });
        } else {
          onChangeStatus();
        }
      }} />
    }
  },)

  const onValuesChange = (changedValues: any) => {
    if (Object.keys(changedValues)[0] === 'dataScope') {
      if (changedValues.dataScope === '2') {
        handleGeneralFormColumns([...jurisdictionFormColumns, deptIdsColumns])
      } else {
        handleGeneralFormColumns([...jurisdictionFormColumns])
      }
    }
  }

  const onFinish = async (values: any) => {
    if (modalTitle === '分配数据权限') {
      await updateDataScope({ ...values, roleId: editRoleId })
      message.success(`分配数据权限成功`)
    } else {
      await systemRole(createModalType, createModalType === 'POST' ? values : { ...values, roleId: editRoleId });
      message.success(`${ createModalType === 'POST' ? '新增' : '编辑' }成功`);
    }
    actionRef.current?.reload();
    handleModalVisible(false);
  }

  return (
    <PageContainer title={false}>
      <CreateModal onCancel={() => handleModalVisible(false)} title={modalTitle} modalVisible={createModalVisible}>
        <GeneralForm initialValues={initialValues} columns={generalFormColumns} onFinish={(values => onFinish(values))} onValuesChange={(changedValues: any) => onValuesChange(changedValues)} />
      </CreateModal>
      <ProTable<TableListItem>
        size="small"
        className={styles.proTableBox}
        columns={columnsData}
        actionRef={actionRef}
        rowSelection={{}}
        request={async (params: any) => {
          const prs = params;
          prs.pageNum = params.current
          delete prs.current
          setQueryParams(prs);
          const { rows, total } = await getRoleList(prs);
          return Promise.resolve({
            data: rows,
            total,
            success: true,
          });
        }}
        scroll={{ x: 'max-content' }}
        rowKey="roleId"
        pagination={{
          showQuickJumper: true,
          current: Number(process.env.CURRENT),
          pageSize: Number(process.env.PAGE_SIZE)
        }}
        dateFormatter="string"
        headerTitle="角色管理"
        search={{
          labelWidth: 70,
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
        tableAlertRender={({ selectedRowKeys }) => {
          setBatchDeleteKeys(selectedRowKeys)
          return <Space size={24}>
            <span>已选 {selectedRowKeys.length} 项</span>
          </Space>
        }}
        tableAlertOptionRender={(props) => {
          const { onCleanSelected } = props;
          return (
            <Space>
              <Button key='cancel' type="link" onClick={onCleanSelected}>
                取消选择
              </Button>
              <Access key='batchDelete' accessible={access.canPermissions('system:role:remove')}>
                <Button danger type="link" onClick={() => batchDeleteRole(onCleanSelected)}>
                  批量删除
                </Button>
              </Access>
            </Space>
          );
        }}
        options={false}
        toolBarRender={() => [
          <Access key='export' accessible={access.canPermissions('system:role:export')}>
            <DownloadButton text='下载列表' params={queryParams} path='system/role/export' />
          </Access>,
          <Access key='add' accessible={access.canPermissions('system:role:add')}>
            <Button type="primary" onClick={() => { addRole() }} icon={<PlusOutlined />}>新增</Button>
          </Access>
        ]}
      />
    </PageContainer>
  );
};