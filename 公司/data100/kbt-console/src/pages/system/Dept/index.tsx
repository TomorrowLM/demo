import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useRef } from 'react';
import { Access, useAccess } from 'umi';
import { Button, message, Modal } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateModal from '@/components/CreateModal';
import GeneralForm from '@/components/Form';
import { handleTree, assTree, isXsScreen } from '@/utils/utils';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import proTableSettings from '../../../../config/proTableSettings';
import { TableListItem } from './data.d';
import { columns, formColumns } from './const.d';
import { getDeptList, systemDept, deleteSystemDept } from './service';

const { confirm } = Modal;

export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [modalTitle, setModalTitle] = useState<string>('');
  const [editDeptId, setEditDeptId] = useState<string>('');
  const [expandedRowKeys, setExpandedRowKeys] = useState<Array<string>>([]);
  const [initialValues, setInitialValues] = useState<Object>({ status: '0' });
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalType, handleModalType] = useState<string>('');
  const [generalFormColumns, handleGeneralFormColumns] = useState<Array<any>>(formColumns);

  const addDept = (record?: any) => {
    setModalTitle('新增部门')
    generalFormColumns[0].disabled = false;
    handleGeneralFormColumns(formColumns);
    if (record) {
      setInitialValues({ parentId: record.deptId, status: '0' })
    } else {
      setInitialValues({ parentId: undefined, status: '0' })
    }
    handleModalVisible(true);
    handleModalType('POST');
  }

  const editDept = (record: any) => {
    setModalTitle('修改部门')
    if (record.parentId === 0) {
      generalFormColumns[0].disabled = true;
      handleGeneralFormColumns(generalFormColumns);
    }
    const { deptId, parentId, deptName, email, leader, orderNum, phone, status } = record;
    setEditDeptId(deptId);
    setInitialValues({ parentId, deptName, email, leader, orderNum, phone, status })
    handleModalVisible(true);
    handleModalType('PUT');
  }

  const deleteDept = (record: any) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除名称为 "${record.deptName}" 的数据项?`,
      onOk: async () => {
        await deleteSystemDept(record.deptId);
        message.success('删除成功');
        actionRef.current?.reload();
      }
    });
  }

  const columnsData: ProColumns<TableListItem>[] = [ ...columns, {
    title: '操作',
    width: isXsScreen ? 90 : 180,
    key: 'option',
    valueType: 'option',
    fixed: 'right',
    hideInTable: !access.canPermissions('system:dept:add') && !access.canPermissions('system:dept:edit') && !access.canPermissions('system:dept:remove'),
    render: (_, record) => [
      <Access key='add' accessible={access.canPermissions('system:dept:add')}>
        <a onClick={() => { addDept(record); }}><PlusOutlined /> { isXsScreen ? null : '新增' }</a>
      </Access>,
      <Access key='edit' accessible={access.canPermissions('system:dept:edit')}>
        <a onClick={() => { editDept(record); }}><EditOutlined /> { isXsScreen ? null : '修改' }</a>
      </Access>,
      <Access key='delete' accessible={access.canPermissions('system:dept:remove')}>
        { record.parentId !== 0 && <a onClick={() => { deleteDept(record); }}><DeleteOutlined /> { isXsScreen ? null : '删除' }</a> }
      </Access>
    ],
  }]

  const onFinish = async (values: any) => {
    await systemDept(createModalType, createModalType === 'POST' ? values : { ...values, deptId: editDeptId });
    handleModalVisible(false);
    message.success(`${ createModalType === 'POST' ? '新增' : '编辑' }成功`);
    actionRef.current?.reload();
  }

  return (
    <PageContainer title={false}>
      <CreateModal onCancel={() => handleModalVisible(false)} title={modalTitle} modalVisible={createModalVisible}>
        <GeneralForm initialValues={initialValues} columns={generalFormColumns} onFinish={(values => onFinish(values))}/>
      </CreateModal>
      <ProTable<TableListItem>
        size="small"
        columns={columnsData}
        actionRef={actionRef}
        request={async (params) => {
          const { data } = await getDeptList(params);
          const rowKeys: Array<string> = [];
          data.forEach((item: any) => { rowKeys.push(item.deptId) });
          setExpandedRowKeys([...expandedRowKeys, ...rowKeys]);
          const handleTreeData = handleTree(data, 'deptId');
          generalFormColumns[0].options = assTree(handleTreeData, { deptId: 'value', deptName: 'title' });
          return Promise.resolve({
            data: handleTreeData,
            success: true,
          });
        }}
        scroll={{ x: 'max-content' }}
        rowKey="deptId"
        pagination={false}
        expandable={{
          expandedRowKeys,
          onExpand: (expanded, record) => {
            const { deptId }: any = record
            if (!expanded) {
              expandedRowKeys.splice(expandedRowKeys.findIndex((id: string) => id === deptId), 1)
              setExpandedRowKeys([...expandedRowKeys])
            } else {
              setExpandedRowKeys([...expandedRowKeys, deptId])
            }
          }
        }}
        dateFormatter="string"
        headerTitle="部门管理"
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
        options={false}
        toolBarRender={() => [
          <Access key='add2' accessible={access.canPermissions('system:dept:add')}>
             <Button type="primary" onClick={() => { addDept() }} icon={<PlusOutlined />}>新增</Button>
          </Access>
        ]}
      />
    </PageContainer>
  );
};