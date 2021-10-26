import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useRef } from 'react';
import { Access, useAccess } from 'umi';
import  * as Icon from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateModal from '@/components/CreateModal';
import GeneralForm from '@/components/Form';
import { handleTree, assTree, isXsScreen } from '@/utils/utils';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import proTableSettings from '../../../../config/proTableSettings';
import { getMenuList, systemMenu, deleteSystemMenu } from './service';
import { columns, formColumns, otherFormColumns, frameUrlColumn } from './const.d';
import { TableListItem } from './data.d';
import './index.less';

const { confirm } = Modal;
const initParams: object = { status: '0', menuType: 'M', isFrame: '1', visible: '0' }

export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [modalTitle, setModalTitle] = useState<string>('');
  const [editMenuId, setEditMenuId] = useState<string>('');
  const [initialValues, setInitialValues] = useState<Object>(initParams);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalType, handleModalType] = useState<string>('');
  const [generalFormColumns, handleGeneralFormColumns] = useState<Array<any>>([...formColumns, ...otherFormColumns.M]);

  const addMenu = (record?: any) => {
    setModalTitle('新增菜单');
    formColumns[1].disabled = false;
    handleGeneralFormColumns([ ...formColumns, ...otherFormColumns.M ]);
    if (record) {
      setInitialValues({ parentId: record.menuId, ...initParams });
    } else {
      setInitialValues({ parentId: 0, ...initParams });
    }
    handleModalVisible(true);
    handleModalType('POST');
  }

  const editMenu = (record: any) => {
    setModalTitle('编辑菜单');
    const { menuId, menuType, isFrame } = record;
    const copyOtherFormColumns = JSON.parse(JSON.stringify(otherFormColumns));
    setEditMenuId(menuId);
    generalFormColumns.splice(2);
    generalFormColumns[1].disabled = true;
    const index = copyOtherFormColumns[menuType].findIndex((item: any) => item.name === 'isFrame');
    if (index !== -1 && isFrame === '0') {
      copyOtherFormColumns[menuType].splice(index + 1, 0, frameUrlColumn)
    }
    handleGeneralFormColumns([ ...generalFormColumns, ...copyOtherFormColumns[menuType] ]);
    setInitialValues({ ...record });
    handleModalVisible(true);
    handleModalType('PUT');
  }

  const deleteMenu = (record: any) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除名称为 "${record.menuName}" 的数据项?`,
      onOk: async () => {
        await deleteSystemMenu(record.menuId);
        message.success('删除成功');
        actionRef.current?.reload();
      }
    });
  }

  const columnsData: ProColumns<TableListItem>[] = columns({
    title: '图标',
    width: 100,
    dataIndex: 'icon',
    align: 'left',
    search: false,
    render: (_: any) => [
      Icon[_] ? React.createElement(Icon[_], { key: _ }) : ''
    ]
  },{
    title: '操作',
    width: isXsScreen ? 90 : 190,
    key: 'option',
    valueType: 'option',
    fixed: 'right',
    hideInTable: !access.canPermissions('system:menu:add') && !access.canPermissions('system:menu:edit') && !access.canPermissions('system:menu:remove'),
    render: (_: any, record: any) => [
      <Access key='add' accessible={access.canPermissions('system:menu:add')}>
        <a onClick={() => { addMenu(record); }}><PlusOutlined /> { isXsScreen ? null : '新增' }</a>
      </Access>,
      <Access key='edit' accessible={access.canPermissions('system:menu:edit')}>
        <a onClick={() => { editMenu(record); }}><EditOutlined /> { isXsScreen ? null : '修改' }</a>
      </Access>,
      <Access key='delete' accessible={access.canPermissions('system:menu:remove')}>
        <a onClick={() => { deleteMenu(record); }}><DeleteOutlined /> { isXsScreen ? null : '删除' }</a>
      </Access>
    ],
  });

  const onFinish = async (values: any) => {
    await systemMenu(createModalType, createModalType === 'POST' ? values : { ...values, menuId: editMenuId });
    handleModalVisible(false);
    message.success(`${ createModalType === 'POST' ? '新增' : '编辑' }成功`);
    actionRef.current?.reload();
  }

  const onValuesChange = (changedValues: any) => {
    if (Object.keys(changedValues)[0] === 'menuType') {
      generalFormColumns.splice(2);
      handleGeneralFormColumns([ ...generalFormColumns, ...otherFormColumns[changedValues.menuType] ]);
    } else if (Object.keys(changedValues)[0] === 'isFrame') {
      const index = generalFormColumns.findIndex(item => item.name === 'isFrame');
      if (changedValues.isFrame === '0') {
        generalFormColumns.splice(index + 1, 0, frameUrlColumn)
      } else {
        generalFormColumns.splice(index + 1, 1)
      }
      handleGeneralFormColumns([ ...generalFormColumns ]);
    }
  }

  return (
    <PageContainer title={false}>
      <CreateModal onCancel={() => handleModalVisible(false)} title={modalTitle} modalVisible={createModalVisible}>
        <GeneralForm initialValues={initialValues} columns={generalFormColumns} onFinish={(values => onFinish(values))} onValuesChange={(changedValues: any) => onValuesChange(changedValues)}/>
      </CreateModal>
      <ProTable<TableListItem>
        size="small"
        columns={columnsData}
        actionRef={actionRef}
        request={async (params) => {
          const { data } = await getMenuList(params);
          const firstParent = { menuName: '主类目', menuId: 0 }
          const handleTreeData = handleTree(data, 'menuId')
          const generalFormColumnsData: any = assTree([{
            ...firstParent,
            children: handleTreeData
          }], { menuId: 'value', menuName: 'title' })
          generalFormColumns[0].options = generalFormColumnsData
          return Promise.resolve({
            data: handleTreeData,
            success: true,
          });
        }}
        scroll={{ x: 'max-content' }}
        rowKey="menuId"
        pagination={false}
        dateFormatter="string"
        headerTitle="菜单管理"
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
          <Access key='add2' accessible={access.canPermissions('system:menu:add')}>
            <Button type="primary" onClick={() => { addMenu() }} icon={<PlusOutlined />}>新增</Button>
          </Access>
        ]}
      />
    </PageContainer>
  );
};