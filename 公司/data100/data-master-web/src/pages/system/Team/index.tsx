import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import { Access, useAccess } from 'umi';
import { Space, Button, message, Modal } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateModal from '@/components/CreateModal';
import GeneralForm from '@/components/Form';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { formatData, isXsScreen } from '@/utils/utils';
import proTableSettings from '../../../../config/proTableSettings';
import { TableListItem } from './data.d';
import { columns, teamFormColumns } from './const.d';
import { getTeamList, getUserEnable, systemTeam, deleteSystemTeam } from './service';
import styles from './index.less';

const { confirm } = Modal;
const initParams: object = {}

export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [editTeamId, setEditTeamId] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [initialValues, setInitialValues] = useState<Object>(initParams);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalType, handleModalType] = useState<string>('');
  const [generalFormColumns, handleGeneralFormColumns] = useState<Array<any>>([]);
  const [batchDeleteKeys, setBatchDeleteKeys] = useState<Array<any>>([]);

  useEffect(() => {
    getUserEnable().then(({ data }) => {
      const list = formatData(data, { userId: 'value', nickName: 'label' });
      handleGeneralFormColumns(teamFormColumns(list));
    })
  }, [])

  const addTeam = async () => {
    setModalTitle('新增小组');
    setInitialValues({ ...initParams });
    handleModalVisible(true);
    handleModalType('POST');
  }

  const editTeam = async (record: any) => {
    const { teamId, teamName, teamLeaderId, members } = record;
    setModalTitle('编辑小组');
    setEditTeamId(teamId);
    setInitialValues({ teamName, teamLeaderId, members: members.split(',').map(Number) });
    handleModalVisible(true);
    handleModalType('PUT');
  }

  const deleteTeam = (record: any) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除名称为 "${record.teamName}" 的数据项?`,
      onOk: async () => {
        await deleteSystemTeam(record.teamId);
        message.success('删除成功');
        actionRef.current?.reload();
      }
    });
  }

  const batchDeleteTeam = (onCleanSelected: Function) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除所选的数据项?`,
      onOk: async () => {
        await deleteSystemTeam(batchDeleteKeys.join());
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
    hideInTable: !access.canPermissions('system:team:edit') && !access.canPermissions('system:team:remove'),
    render: (_, record) => [
      <Access key='edit' accessible={access.canPermissions('system:team:edit')}>
        <a onClick={() => { editTeam(record); }}><EditOutlined /> { isXsScreen ? null : '修改' }</a>
      </Access>,
      <Access key='delete' accessible={access.canPermissions('system:team:remove')}>
        <a onClick={() => { deleteTeam(record); }}><DeleteOutlined /> { isXsScreen ? null : '删除' }</a>
      </Access>
    ],
  }]

  const onFinish = async (values: any) => {
    const obj = values;
    obj.members = values.members.join(',');
    await systemTeam(createModalType, createModalType === 'POST' ? values : { ...obj, teamId: editTeamId });
    message.success(`${ createModalType === 'POST' ? '新增' : '编辑' }成功`);
    actionRef.current?.reload();
    handleModalVisible(false);
  }

  return (
    <PageContainer title={false}>
      <CreateModal onCancel={() => handleModalVisible(false)} title={modalTitle} modalVisible={createModalVisible}>
        <GeneralForm initialValues={initialValues} columns={generalFormColumns} onFinish={(values => onFinish(values))} />
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
          const { rows, total } = await getTeamList(prs);
          return Promise.resolve({
            data: rows,
            total,
            success: true,
          });
        }}
        scroll={{ x: 'max-content' }}
        rowKey="teamId"
        pagination={{
          showQuickJumper: true,
          current: Number(process.env.CURRENT),
          pageSize: Number(process.env.PAGE_SIZE)
        }}
        dateFormatter="string"
        headerTitle="小组管理"
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
              <Access key='batchDelete' accessible={access.canPermissions('system:team:remove')}>
                <Button danger type="link" onClick={() => batchDeleteTeam(onCleanSelected)}>
                  批量删除
                </Button>
              </Access>
            </Space>
          );
        }}
        options={false}
        toolBarRender={() => [
          <Access key='add' accessible={access.canPermissions('system:team:add')}>
            <Button type="primary" onClick={() => { addTeam() }} icon={<PlusOutlined />}>新增</Button>
          </Access>
        ]}
      />
    </PageContainer>
  );
};