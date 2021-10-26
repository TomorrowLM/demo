import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import { Access, useAccess,history } from 'umi';
import { Space, Button, message, Modal, Tree } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {SearchOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { KeepAlive } from 'react-activation';
import proTableSettings from '../../../../../config/proTableSettings';
import { getCustomerDetail, deleteTask } from './service';
import { columns } from './const.d';
import { TableListItem } from './data';
import styles from './index.less';

const { confirm } = Modal;

export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [selectDeptId, setSelectDeptId] = useState<string>('');
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>([]);
  const [batchDeleteKeys, setBatchDeleteKeys] = useState<Array<any>>([]);
  const [deptTreeselect] = useState<Array<any>>([]);

  const batchDeleteUser = (onCleanSelected: Function) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除所选的数据项?`,
      onOk: async () => {
        let res = await deleteTask(batchDeleteKeys.join());
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

  useEffect(() => {
    setColumnsData(columns())
  }, []);

  return (
    <PageContainer title={false}>
      {/* <KeepAlive name="客户数据" id={history.location.pathname} saveScrollPosition="screen"> */}
        <ProTable<TableListItem>
          size="small"
          className={styles.proTableBox}
          columns={columnsData}
          actionRef={actionRef}
          rowSelection={{}}
          request={async (params: any) => {
            // console.log("客户详情",params)
            const prs = params;
            prs.current = params.current;
            prs.customerId = history.location.query.customerId
            const { data } = await getCustomerDetail({ ...prs });
            return Promise.resolve({
              data: data.customerDetailList,
              total: data.total,
              success: true,
            });
          }}
          scroll={{ x: 'max-content' }}
          rowKey="taskId"
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
            console.log(selectedRowKeys)
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
           
          ]}
        />
      {/* </KeepAlive> */}
    </PageContainer>
  );
}