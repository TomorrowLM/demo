import { PageContainer } from '@ant-design/pro-layout';
import { Link, Access, useAccess } from 'umi';
import React, { useState, useRef } from 'react';
import { Space, Button, message, Modal } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateModal from '@/components/CreateModal';
import GeneralForm from '@/components/Form';
// import ExportButton from '@/components/ExportButton';
import { isXsScreen } from '@/utils/utils';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import proTableSettings from '../../../../config/proTableSettings';
import { columns, dictFormColumns } from './const.d';
import { TableListItem } from './data.d';
import { getDictList, systemDict, deleteSystemDict } from './service';
import styles from './index.less';

const { confirm } = Modal;
const initParams: object = { status: '0' }

export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [editDictId, setEditDictId] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [initialValues, setInitialValues] = useState<Object>(initParams);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalType, handleModalType] = useState<string>('');
  const [batchDeleteKeys, setBatchDeleteKeys] = useState<Array<any>>([]);
  // const [queryParams, setQueryParams] = useState<any>({});

  const addDict = async () => {
    setModalTitle('新增字典');
    setInitialValues({ ...initParams });
    handleModalVisible(true);
    handleModalType('POST');
  }

  const editDict = async (record: any) => {
    const { dictId, dictName, dictType, status, remark } = record;
    setModalTitle('编辑字典');
    setEditDictId(dictId);
    setInitialValues({ dictName, dictType, status, remark });
    handleModalVisible(true);
    handleModalType('PUT');
  }

  const deleteDict = (record: any) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除名称为 "${record.dictName}" 的数据项?`,
      onOk: async () => {
        await deleteSystemDict(record.dictId);
        message.success('删除成功');
        actionRef.current?.reload();
      }
    });
  }

  const batchDeleteDict = (onCleanSelected: Function) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除所选的数据项?`,
      onOk: async () => {
        await deleteSystemDict(batchDeleteKeys.join());
        message.success('删除成功');
        actionRef.current?.reload();
        onCleanSelected();
      }
    });
  }

  const columnsData: ProColumns<TableListItem>[] = columns({
    title: '字典类型',
    width: 100,
    dataIndex: 'dictType',
    align: 'left',
    render: (_: any) => <Link to={{
      pathname: '/system/dict/details',
      state: { dictType: _ },
    }}>{_}</Link>,
  },{
    title: '操作',
    width: isXsScreen ? 60 : 180,
    key: 'option',
    valueType: 'option',
    fixed: 'right',
    hideInTable: !access.canPermissions('system:dict:edit') && !access.canPermissions('system:dict:remove'),
    render: (_: any, record: any) => [
      <Access key='edit' accessible={access.canPermissions('system:dict:edit')}>
        <a onClick={() => { editDict(record); }}><EditOutlined /> { isXsScreen ? null : '修改' }</a>
      </Access>,
      <Access key='delete' accessible={access.canPermissions('system:dict:remove')}>
        <a onClick={() => { deleteDict(record); }}><DeleteOutlined /> { isXsScreen ? null : '删除' }</a>
      </Access>
    ],
  });

  const onFinish = async (values: any) => {
    await systemDict(createModalType, createModalType === 'POST' ? values : { ...values, dictId: editDictId });
    message.success(`${ createModalType === 'POST' ? '新增' : '编辑' }成功`);
    actionRef.current?.reload();
    handleModalVisible(false);
  }

  return (
    <PageContainer title={false}>
      <CreateModal onCancel={() => handleModalVisible(false)} title={modalTitle} modalVisible={createModalVisible}>
        <GeneralForm initialValues={initialValues} columns={dictFormColumns} onFinish={(values => onFinish(values))} />
      </CreateModal>
      <ProTable<TableListItem>
        size="small"
        className={styles.proTableBox}
        columns={columnsData}
        actionRef={actionRef}
        rowSelection={{}}
        request={async (params: any) => {
          const prs = params;
          prs.pageNum = params.current;
          delete prs.current;
          // setQueryParams(prs);
          const { rows, total } = await getDictList(prs);
          return Promise.resolve({
            data: rows,
            total,
            success: true,
          });
        }}
        scroll={{ x: 'max-content' }}
        rowKey="dictId"
        pagination={{
          showQuickJumper: true,
          current: Number(process.env.CURRENT),
          pageSize: Number(process.env.PAGE_SIZE)
        }}
        dateFormatter="string"
        headerTitle="字典管理"
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
              <Access key='batchDelete' accessible={access.canPermissions('system:dict:remove')}>
                <Button danger type="link" onClick={() => batchDeleteDict(onCleanSelected)}>
                  批量删除
                </Button>
              </Access>
            </Space>
          );
        }}
        options={false}
        toolBarRender={() => [
          // <Access key='export' accessible={access.canPermissions('system:dict:export')}>
          //   <ExportButton params={queryParams} path='system/dict/export' />
          // </Access>,
          <Access key='add' accessible={access.canPermissions('system:dict:add')}>
            <Button type="primary" onClick={() => { addDict() }} icon={<PlusOutlined />}>新增</Button>
          </Access>
        ]}
      />
    </PageContainer>
  );
};