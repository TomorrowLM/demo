import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useRef } from 'react';
import { Access, useAccess } from 'umi';
import { Space, Button, message, Modal } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateModal from '@/components/CreateModal';
import GeneralForm from '@/components/Form';
// import ExportButton from '@/components/ExportButton';
import { isXsScreen } from '@/utils/utils';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import proTableSettings from '../../../../config/proTableSettings';
import { TableListItem } from './data.d';
import { columns, postFormColumns } from './const.d';
import { getPostList, systemPost, deleteSystemPost } from './service';
import styles from './index.less';

const { confirm } = Modal;
const initParams: object = { status: '0', postSort: '0' }

export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [editPostId, setEditPostId] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [initialValues, setInitialValues] = useState<Object>(initParams);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalType, handleModalType] = useState<string>('');
  const [batchDeleteKeys, setBatchDeleteKeys] = useState<Array<any>>([]);
  // const [queryParams, setQueryParams] = useState<any>({});

  const addPost = async () => {
    setModalTitle('新增岗位');
    setInitialValues({ ...initParams });
    handleModalVisible(true);
    handleModalType('POST');
  }

  const editPost = async (record: any) => {
    const { postId, postName, postCode, postSort, status, remark } = record;
    setModalTitle('编辑岗位');
    setEditPostId(postId);
    setInitialValues({ postName, postCode, postSort, status, remark });
    handleModalVisible(true);
    handleModalType('PUT');
  }

  const deletePost = (record: any) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除名称为 "${record.postName}" 的数据项?`,
      onOk: async () => {
        await deleteSystemPost(record.postId);
        message.success('删除成功');
        actionRef.current?.reload();
      }
    });
  }

  const batchDeletePost = (onCleanSelected: Function) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除所选的数据项?`,
      onOk: async () => {
        await deleteSystemPost(batchDeleteKeys.join());
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
    hideInTable: !access.canPermissions('system:post:edit') && !access.canPermissions('system:post:remove'),
    render: (_, record) => [
      <Access key='edit' accessible={access.canPermissions('system:post:edit')}>
        <a onClick={() => { editPost(record); }}><EditOutlined /> { isXsScreen ? null : '修改' }</a>
      </Access>,
      <Access key='delete' accessible={access.canPermissions('system:post:remove')}>
        <a onClick={() => { deletePost(record); }}><DeleteOutlined /> { isXsScreen ? null : '删除' }</a>
      </Access>
    ],
  }]

  const onFinish = async (values: any) => {
    await systemPost(createModalType, createModalType === 'POST' ? values : { ...values, postId: editPostId });
    message.success(`${ createModalType === 'POST' ? '新增' : '编辑' }成功`);
    actionRef.current?.reload();
    handleModalVisible(false);
  }

  return (
    <PageContainer title={false}>
      <CreateModal onCancel={() => handleModalVisible(false)} title={modalTitle} modalVisible={createModalVisible}>
        <GeneralForm initialValues={initialValues} columns={postFormColumns} onFinish={(values => onFinish(values))} />
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
          const { rows, total } = await getPostList(prs);
          return Promise.resolve({
            data: rows,
            total,
            success: true,
          });
        }}
        scroll={{ x: 'max-content' }}
        rowKey="postId"
        pagination={{
          showQuickJumper: true,
          current: Number(process.env.CURRENT),
          pageSize: Number(process.env.PAGE_SIZE)
        }}
        dateFormatter="string"
        headerTitle="岗位管理"
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
              <Access key='batchDelete' accessible={access.canPermissions('system:post:remove')}>
                <Button danger type="link" onClick={() => batchDeletePost(onCleanSelected)}>
                  批量删除
                </Button>
              </Access>
            </Space>
          );
        }}
        options={false}
        toolBarRender={() => [
          // <Access key='export' accessible={access.canPermissions('system:post:export')}>
          //   <ExportButton params={queryParams} path='system/post/export' />
          // </Access>,
          <Access key='add' accessible={access.canPermissions('system:post:add')}>
            <Button type="primary" onClick={() => { addPost() }} icon={<PlusOutlined />}>新增</Button>
          </Access>
        ]}
      />
    </PageContainer>
  );
};