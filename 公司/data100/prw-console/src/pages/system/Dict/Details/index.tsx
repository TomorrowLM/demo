import { PageContainer } from '@ant-design/pro-layout';
import { history, Access, useAccess } from 'umi';
import React, { useEffect, useState, useRef } from 'react';
import { Space, Button, message, Modal, Select } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateModal from '@/components/CreateModal';
import GeneralForm from '@/components/Form';
// import ExportButton from '@/components/ExportButton';
import { formatData, isXsScreen } from '@/utils/utils';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import proTableSettings from '../../../../../config/proTableSettings';
import { TableListItem } from './data.d';
import { columns, dictFormColumns } from './const.d';
import { getDictDataList, systemDictData, deleteSystemDictData } from './service';
import { getDictList } from '../service';
import styles from './index.less';

const { confirm } = Modal;
const initParams: object = { status: '0' }

export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [editDictCode, setEditDictCode] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [initialValues, setInitialValues] = useState<Object>(initParams);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalType, handleModalType] = useState<string>('');
  const [batchDeleteKeys, setBatchDeleteKeys] = useState<Array<any>>([]);
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>([]);
  // const [queryParams, setQueryParams] = useState<any>({});

  const addDict = async () => {
    setModalTitle('新增字典');
    setInitialValues({ ...initParams });
    handleModalVisible(true);
    handleModalType('POST');
  }

  const editDict = async (record: any) => {
    const { dictCode, dictLabel, dictValue, dictSort, dictType, status, fieldType, remark } = record;
    setModalTitle('编辑字典');
    setEditDictCode(dictCode);
    setInitialValues({ dictLabel, dictValue, dictSort, dictType, status, fieldType, remark });
    handleModalVisible(true);
    handleModalType('PUT');
  }

  const deleteDict = (record: any) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除名称为 "${record.dictName}" 的数据项?`,
      onOk: async () => {
        await deleteSystemDictData(record.dictCode);
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
        await deleteSystemDictData(batchDeleteKeys.join());
        message.success('删除成功');
        actionRef.current?.reload();
        onCleanSelected();
      }
    });
  }

  const onFinish = async (values: any) => {
    await systemDictData(createModalType, createModalType === 'POST' ? values : { ...values, dictCode: editDictCode });
    message.success(`${ createModalType === 'POST' ? '新增' : '编辑' }成功`);
    actionRef.current?.reload();
    handleModalVisible(false);
  }

  useEffect(() => {
    getDictList().then(res => {
      const options = formatData(res.rows, { dictType: 'value', dictName: 'label' });
      setColumnsData(columns(
        {
          title: '字典名称',
          dataIndex: 'dictType',
          hideInTable: true,
          renderFormItem: (_: any, { type, defaultRender, ...rest }: any) => {
            return <Select options={options} defaultValue={history.location.state.dictType} {...rest} placeholder='请选择' />;
          },
        },
        {
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
        }
      ))
    })
  }, []);

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
          prs.pageNum = params.current
          delete prs.current
          // setQueryParams({ dictType: history.location.state.dictType, ...prs });
          const { rows, total } = await getDictDataList({ dictType: history.location.state.dictType, ...prs });
          return Promise.resolve({
            data: rows,
            total,
            success: true,
          });
        }}
        scroll={{ x: 'max-content' }}
        rowKey="dictCode"
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
              <Access key='batchDelete' accessible={access.canPermissions('system:user:remove')}>
                <Button danger type="link" onClick={() => batchDeleteDict(onCleanSelected)}>
                  批量删除
                </Button>
              </Access>
            </Space>
          );
        }}
        options={false}
        toolBarRender={() => [
          // <Access key='export' accessible={access.canPermissions('system:user:export')}>
          //   <ExportButton params={queryParams} path='system/dict/export' />
          // </Access>,
          <Access key='add' accessible={access.canPermissions('system:user:add')}>
            <Button type="primary" onClick={() => { addDict() }} icon={<PlusOutlined />}>新增</Button>
          </Access>
        ]}
      />
    </PageContainer>
  );
};