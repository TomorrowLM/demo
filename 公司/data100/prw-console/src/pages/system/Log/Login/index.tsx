import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import React, { useEffect, useState, useRef } from 'react';
import { Space, Button, message, Modal } from 'antd';
import { Access, useAccess } from 'umi';
import { getDicts } from '@/services/dicts';
import { DeleteOutlined, SearchOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { formatDictData } from '@/utils/utils';
// import ExportButton from '@/components/ExportButton';
import proTableSettings from '../../../../../config/proTableSettings';
import { getLoginlogList, deleteLoginlog, logininforClean } from './service';
import { TableListItem } from './data.d';
import { columns } from './const.d';
import styles from './index.less';

const { confirm } = Modal;

export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [batchDeleteKeys, setBatchDeleteKeys] = useState<Array<any>>([]);
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>([]);
  // const [queryParams, setQueryParams] = useState<any>({});

  useEffect(() => {
    Promise.all([getDicts('sys_common_status')]).then(([commonStatus]) => {
      const commonStatusEnum = formatDictData(commonStatus.data);
      setColumnsData(columns(
        {
          title: '登录状态',
          width: 100,
          dataIndex: 'status',
          align: 'left',
          valueEnum: commonStatusEnum
        }
      ))
    })
  }, []);

  const batchDeleteLoginLog = (onCleanSelected: Function) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除所选的数据项?`,
      onOk: async () => {
        await deleteLoginlog(batchDeleteKeys.join());
        message.success('删除成功');
        actionRef.current?.reload();
        onCleanSelected();
      }
    });
  };

  const clean = () => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认清空所有的操作日志?`,
      onOk: async () => {
        await logininforClean();
        message.success('清空成功');
        actionRef.current?.reload();
      }
    });
  };

  return (
    <PageContainer title={false}>
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
          // setQueryParams(prs);
          const { rows, total } = await getLoginlogList(prs);
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
        headerTitle="登录日志"
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
              <Access key='batchDelete' accessible={access.canPermissions('monitor:logininfor:remove')}>
                <Button danger type="link" onClick={() => batchDeleteLoginLog(onCleanSelected)}>
                  批量删除
                </Button>
              </Access>
            </Space>
          );
        }}
        options={false}
        toolBarRender={() => [
          // <Access key='export' accessible={access.canPermissions('system:logininfor:export')}>
          //   <ExportButton params={queryParams} path='monitor/logininfor/export' />
          // </Access>,
          <Access key='clean' accessible={access.canPermissions('monitor:logininfor:remove')}>
            <Button type="primary" danger onClick={() => clean()} icon={<DeleteOutlined />}>清空</Button>
          </Access>
        ]}
      />
    </PageContainer>
  );
};