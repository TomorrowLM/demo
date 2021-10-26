import { PageContainer } from '@ant-design/pro-layout';
import { Access, useAccess } from 'umi';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import React, { useEffect, useState, useRef } from 'react';
import { Space, Button, message, Modal } from 'antd';
import { getDicts } from '@/services/dicts';
import { DeleteOutlined, ZoomInOutlined, SearchOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { formatDictData, isXsScreen } from '@/utils/utils';
// import ExportButton from '@/components/ExportButton';
import CreateModal from '@/components/CreateModal';
import GeneralDescriptions from '@/components/Descriptions';
import proTableSettings from '../../../../../config/proTableSettings';
import { TableListItem } from './data.d';
import { columns, descriptionsColumns } from './const.d';
import { getOperlogList, deleteOperlog, operlogClean } from './service';
import styles from './index.less';

const { confirm } = Modal;

export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [batchDeleteKeys, setBatchDeleteKeys] = useState<Array<any>>([]);
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>([]);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [currentOperData, setCurrentOperData] = useState<object>({});
  // const [queryParams, setQueryParams] = useState<any>({});

  useEffect(() => {
    Promise.all([getDicts('sys_oper_type'), getDicts('sys_common_status')]).then(([operType, commonStatus]) => {
      const businessTypeEnum = formatDictData(operType.data);
      const commonStatusEnum = formatDictData(commonStatus.data);
      const viewDetailed = (record: any) => {
        const obj = record;
        obj.businessTypeName = businessTypeEnum[record.businessType].text
        obj.statusName = commonStatusEnum[record.status].text
        handleModalVisible(true);
        setCurrentOperData(obj);
      }
      setColumnsData(columns(
        {
          title: '操作类型',
          width: 100,
          dataIndex: 'businessType',
          align: 'left',
          valueEnum: businessTypeEnum
        },
        {
          title: '操作状态',
          width: 100,
          dataIndex: 'status',
          align: 'left',
          valueEnum: commonStatusEnum
        },
        {
          title: '操作',
          width: isXsScreen ? 50 : 100,
          key: 'option',
          valueType: 'option',
          fixed: 'right',
          render: (_: any, record: any) => [
            <Access key='details' accessible={access.canPermissions('monitor:operlog:list')}>
              <a onClick={() => { viewDetailed(record) }}><ZoomInOutlined /> { isXsScreen ? null : '详细' }</a>
            </Access>
          ],
        }
      ))
    })
  }, []);

  const batchDeleteOperLog = (onCleanSelected: Function) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除所选的数据项?`,
      onOk: async () => {
        await deleteOperlog(batchDeleteKeys.join());
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
        await operlogClean();
        message.success('清空成功');
        actionRef.current?.reload();
      }
    });
  };

  return (
    <PageContainer title={false}>
      <CreateModal onCancel={() => handleModalVisible(false)} title='操作日志详情' modalVisible={createModalVisible}>
        <GeneralDescriptions data={currentOperData} columns={descriptionsColumns} />
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
          const { rows, total } = await getOperlogList(prs);
          return Promise.resolve({
            data: rows,
            total,
            success: true,
          });
        }}
        scroll={{ x: 'max-content' }}
        rowKey="operId"
        pagination={{
          showQuickJumper: true,
          current: Number(process.env.CURRENT),
          pageSize: Number(process.env.PAGE_SIZE)
        }}
        dateFormatter="string"
        headerTitle="操作日志"
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
          return <Space key='tableAlert' size={24}>
            <span>已选 {selectedRowKeys.length} 项</span>
          </Space>
        }}
        tableAlertOptionRender={(props) => {
          const { onCleanSelected } = props;
          return (
            <Space key='tableAlertOption'>
              <Button key='cancel' type="link" onClick={onCleanSelected}>
                取消选择
              </Button>
              <Access key='batchDelete' accessible={access.canPermissions('monitor:operlog:remove')}>
                <Button danger type="link" onClick={() => batchDeleteOperLog(onCleanSelected)}>
                  批量删除
                </Button>
              </Access>
            </Space>
          );
        }}
        options={false}
        toolBarRender={() => [
          // <Access key='export' accessible={access.canPermissions('system:config:export')}>
          //   <ExportButton params={queryParams} path='monitor/operlog/export' />
          // </Access>,
          <Access key='clean' accessible={access.canPermissions('monitor:operlog:remove')}>
            <Button type="primary" danger onClick={() => clean()} icon={<DeleteOutlined />}>清空</Button>
          </Access>
        ]}
      />
    </PageContainer>
  );
};