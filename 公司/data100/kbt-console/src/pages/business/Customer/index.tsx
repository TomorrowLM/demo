import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import { Link, Access, useAccess, history, useModel } from 'umi';
import { KeepAlive, useAliveController } from 'react-activation';
import { Space, Button, message, Modal, Tree } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateModal from '@/components/CreateModal';
import GeneralForm from '@/components/Form';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, RedoOutlined, ExclamationCircleOutlined, BarChartOutlined } from '@ant-design/icons';
import { assTree, isXsScreen } from '@/utils/utils';

import proTableSettings from '../../../../config/proTableSettings';
import { getCustomerList, insertCustomer, getCustomerDetailData, deleteCustomerData, getTradeTree, updateCustomer } from './service';
import { columns, customerFormColumns } from './const.d';
import { TableListItem } from './data.d';
import styles from './index.less';

const { confirm } = Modal;
const initParams: object = { status: '0', isAllSurvey: 0, isAllSymposium: 0, isAllDuocai: 0, isAllMroc: 0 }
let tradeTreeData: Array<any> = [];

export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [editCustomerId, setEditcustomerId] = useState<string>('');
  const [selectDeptId, setSelectDeptId] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [initialValues, setInitialValues] = useState<Object>(initParams);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalType, handleModalType] = useState<string>('');
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>([]);
  const [generalFormColumns, handleGeneralFormColumns] = useState<Array<any>>([]);
  const [batchDeleteKeys, setBatchDeleteKeys] = useState<Array<any>>([]);
  const [deptTreeselect] = useState<Array<any>>([]);
  const { getCachingNodes } = useAliveController();
  const cachingNodes = getCachingNodes ? getCachingNodes() : [];

  const getCustomerData = async (customerId?: number, record?: any) => {
    handleGeneralFormColumns(customerFormColumns(tradeTreeData));
    if (customerId != undefined) {
      const { customerId, customerName, email, mobile, trade } = record
      setInitialValues({ customerId, customerName, email, mobile, trade })
    } else {
      setInitialValues(initParams);
    }
  }
  const addCustomer = async () => {
    await getCustomerData();
    setModalTitle('新增客户');
    handleModalVisible(true);
    handleModalType('POST');
  }

  const editCustomer = async (record: any) => {
    const { customerId } = record;
    await getCustomerData(customerId, record);
    setModalTitle('编辑用户');
    setEditcustomerId(customerId);
    handleModalVisible(true);
    handleModalType('PUT');
  }
  const deleteCustomer = (record: any) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除名称为 "${record.customerName}" 的数据项?`,
      onOk: async () => {
        let res = await deleteCustomerData(record.customerId);
        if (res.code == 200) {
          message.success('删除成功');
          actionRef.current?.reload();
        }

      }
    });
  }
  const batchDeleteUser = (onCleanSelected: Function) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除所选的数据项?`,
      onOk: async () => {
        let res = await deleteCustomerData(batchDeleteKeys.join());
        if (res.code == 200) {
          message.success('删除成功');
          actionRef.current?.reload();
          onCleanSelected();
        }
      }
    });
  }

  const onSelect = (selectedKeys: any) => {
    setSelectDeptId(selectedKeys[0]);
    actionRef.current?.reload();
  };
  const getCustomerdetail = (record: any) => {
    // console.log("客户数据", record, history)
    history.push({
      pathname: `/business/customer/customerDetail`,
      search: `?customerId=${record.customerId}`,
    })
  }
  useEffect(() => {
    const { location } = history;
    const curCaching: number = cachingNodes.findIndex(item => item.id.slice(0, item.id.length - 2) === location.pathname + location.search);
    if (curCaching === -1) {
      Promise.all([getTradeTree()]).then(([tradeTree]) => {
        const { data } = tradeTree;
        tradeTreeData = assTree(JSON.parse(data), { id: 'key', label: 'title' });
      })
    }
    setColumnsData(columns({
      title: '操作',
      width: isXsScreen ? 60 : 200,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      hideInTable: !access.canPermissions('business:customer:edit') && !access.canPermissions('business:customer:remove') && !access.canPermissions('business:customer:edit'),
      render: (_: any, record: any) => [
        <Access key='reset' accessible={access.canPermissions('business:customer:detail')}>
          <a onClick={() => { getCustomerdetail(record) }}><BarChartOutlined />{isXsScreen ? null : '客户数据'}</a>
        </Access>,
        <Access key='edit' accessible={access.canPermissions('business:customer:edit')}>
          <a onClick={() => { editCustomer(record); }}><EditOutlined /> {isXsScreen ? null : '修改'}</a>
        </Access>,

        <Access key='delete' accessible={access.canPermissions('business:customer:remove')}>
          {!record.admin && <a onClick={() => { deleteCustomer(record); }}><DeleteOutlined />  {isXsScreen ? null : '删除'}</a>}
        </Access>,

      ],
    }))

  }, []);
  const onFinish = async (values: any) => {
    if (editCustomerId && editCustomerId != 'undefined') {
      await updateCustomer({ ...values, customerId: editCustomerId });
    } else {
      await insertCustomer(values);
    }

    message.success(`${createModalType === 'POST' ? '新增' : '编辑'}成功`);

    actionRef.current?.reload();
    handleModalVisible(false);
  }
  return (
    <PageContainer title={false}>
      <CreateModal onCancel={() => handleModalVisible(false)} title={modalTitle} modalVisible={createModalVisible}>
        <GeneralForm initialValues={initialValues} columns={generalFormColumns} onFinish={(values => onFinish(values))} />
      </CreateModal>
      <KeepAlive name="客户管理" id={history.location.pathname} saveScrollPosition="screen">
        <ProTable<TableListItem>
          size="small"
          className={styles.proTableBox}
          columns={columnsData}
          actionRef={actionRef}
          rowSelection={{}}
          request={async (params: any) => {
            // console.log(params)
            const prs = params;
            prs.current = params.current;
            prs.roleIds = prs.roleIds ? prs.roleIds.join(',') : '';
            prs.mobile = params.mobile
            const { data } = await getCustomerList({ ...prs, deptId: selectDeptId });
            return Promise.resolve({
              data: data.customerList,
              total: data.total,
              success: true,
            });
          }}
          scroll={{ x: 'max-content' }}
          rowKey="customerId"
          pagination={{
            showQuickJumper: true,
            current: Number(process.env.CURRENT),
            pageSize: Number(process.env.PAGE_SIZE)
          }}
          dateFormatter="string"
          headerTitle="客户管理"
          search={{
            labelWidth: 100,
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
          tableRender={(_, dom) => (
            <div className={styles.tableBox}>
              <div className={styles.tree}>
                {
                  deptTreeselect.length ? <Tree
                    style={{ padding: '20px 0 20px 10%' }}
                    defaultExpandAll
                    onSelect={onSelect}
                    treeData={deptTreeselect}
                  /> : ''
                }
              </div>
              <div className={styles.table}>
                {dom}
              </div>
            </div>
          )}
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
                <Access key='batchDelete' accessible={access.canPermissions('system:user:remove')}>
                  <Button danger type="link" onClick={() => batchDeleteUser(onCleanSelected)}>
                    批量删除
                </Button>
                </Access>
              </Space>
            );
          }}
          options={false}
          toolBarRender={() => [
            <Access key='add' accessible={access.canPermissions('system:user:add')}>
              <Button type="primary" onClick={() => { addCustomer() }} icon={<PlusOutlined />}>新增</Button>
            </Access>
          ]}
        />
      </KeepAlive>
    </PageContainer>
  );
}