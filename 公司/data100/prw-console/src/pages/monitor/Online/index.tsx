import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Modal } from 'antd';
import { Access, useAccess } from 'umi';
import { isXsScreen } from '@/utils/utils';
import { SearchOutlined, RedoOutlined, ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import proTableSettings from '../../../../config/proTableSettings';
import { TableListItem } from './data.d';
import { columns } from './const.d';
import { getMonitorOnlineList, deleteMonitorOnline } from './service';
import styles from './index.less';

const { confirm } = Modal;

export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>([]);
  const deleteMonitor = (record: any) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认强退名称为"${record.userName}"的用户?`,
      onOk: async () => {
        await deleteMonitorOnline(record.tokenId);
        message.success('强退成功');
        actionRef.current?.reload();
      }
    });
  };

  useEffect(() => {
    setColumnsData(columns(
      {
        title: '操作',
        width: isXsScreen ? 50 : 180,
        key: 'option',
        valueType: 'option',
        fixed: 'right',
        hideInTable: !access.canPermissions('monitor:online:forceLogout'),
        render: (_: any, record: any) => [
          <Access key='delete' accessible={access.canPermissions('monitor:online:forceLogout')}>
            <a onClick={() => { deleteMonitor(record) }}><DeleteOutlined /> { isXsScreen ? null : '强退' }</a>
          </Access>
        ],
      }
    ))
  }, []);

  return (
    <PageContainer title={false}>
      <ProTable<TableListItem>
        size="small"
        className={styles.proTableBox}
        columns={columnsData}
        actionRef={actionRef}
        request={async (params: any) => {
          const prs = params
          prs.pageNum = params.current
          delete prs.current
          const { rows, total } = await getMonitorOnlineList(prs);
          return Promise.resolve({
            data: rows,
            total,
            success: true,
          });
        }}
        scroll={{ x: 'max-content' }}
        rowKey="infoId"
        pagination={{
          showQuickJumper: true,
          current: Number(process.env.CURRENT),
          pageSize: Number(process.env.PAGE_SIZE)
        }}
        dateFormatter="string"
        headerTitle="在线用户"
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
      />
    </PageContainer>
  );
};