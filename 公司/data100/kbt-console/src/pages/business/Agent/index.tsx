import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import { Link, Access, useAccess, history, useModel } from 'umi';
import { KeepAlive } from 'react-activation';
import { Space, Button, message, Modal, Tree, Select, Input } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateModal from '@/components/CreateModal';
import GeneralForm from '@/components/Form';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, RedoOutlined, ExclamationCircleOutlined, BarChartOutlined } from '@ant-design/icons';
import { assTree, isXsScreen } from '@/utils/utils';

import proTableSettings from '../../../../config/proTableSettings';
import { agentUser, deletesAgent, updateAgent, insertAgent } from './service';
import { columns, formColumns } from './const.d';
import { TableListItem } from './data.d';
import styles from './index.less';

const { confirm } = Modal;
const { Option } = Select;

const initParams: object = { fstatus: '0', isAllSurvey: 0, isAllSymposium: 0, isAllDuocai: 0, isAllMroc: 0 }
// let tradeTreeData: Array<any> = [];
const getQueryParams = (params: any) => {
  const { pageSize, field, keyword, pageNo } = params;
  return {
    pageNo: pageNo || 1,
    pageSize,
    field: field || '',
    keyword: keyword || '',
  }
}
const getAgentParams = (params: any) => {
  const { agentName, email, mobile, company } = params;
  return {
    agentName: agentName || "",
    email: email || "",
    mobile: mobile || "",
    company: company || "",
  }
}
export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [editAgentId, setEditAgentId] = useState<string>('');
  const [selectDeptId, setSelectDeptId] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [initialValues, setInitialValues] = useState<Object>(initParams);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalType, handleModalType] = useState<string>('');
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>(columns('', ''));
  const [generalFormColumns, handleGeneralFormColumns] = useState<Array<any>>([]);
  const [batchDeleteKeys, setBatchDeleteKeys] = useState<Array<any>>([]);
  const [deptTreeselect] = useState<Array<any>>([]);


  const getAgentUser = async (agentId?: number, record?: any) => {
    handleGeneralFormColumns(formColumns());
    if (agentId != undefined) {
      const { agentId, agentName, email, mobile,company } = record
      setInitialValues({ agentId, agentName, email, mobile ,company})
    } else {
      setInitialValues(initParams);
    }
  }
  const add = async () => {
    await getAgentUser();
    setModalTitle('新增代理');
    handleModalVisible(true);
    handleModalType('POST');
  }

  const edit = async (record: any) => {
    const { agentId } = record;
    await getAgentUser(agentId, record);
    setModalTitle('编辑用户');
    setEditAgentId(agentId);
    handleModalVisible(true);
    handleModalType('PUT');
  }

  const batchDeleteUser = (onCleanSelected: Function) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除所选的数据项?`,
      onOk: async () => {
        let res = await deletesAgent(batchDeleteKeys.join());
        if (res.code == 200) {
          message.success('删除成功');
          actionRef.current?.reload();
          onCleanSelected();
        }
      }
    });
  }

  function onSelect(selectedKeys: any) {
    setSelectDeptId(selectedKeys[0]);
    actionRef.current?.reload();
  }
  const getDetail = (record: any) => {
    history.push({
      pathname: `/business/agent/detail`,
      search: `?agentId=${record.agentId}`,
    })
  }

  useEffect(() => {
    const newColumns = columns((fieldProps: any) => {
      return <Select {...fieldProps} style={{ width: 180 }} placeholder="请选择">
        {
          columnsData.map((item: any, index: number) => {
            if (item.isField) {
              return <Option value={item.fieldValue} key={index} >{item.title}</Option>
            }
          })
        }
      </Select>
    }, (fieldProps: any) => {
      return <Input placeholder="请输入关键词" {...fieldProps} />
    })
    setColumnsData([...newColumns, {
      title: '操作',
      width: isXsScreen ? 60 : 200,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      hideInTable: !access.canPermissions('business:agent:edit') && !access.canPermissions('business:agent:remove') && !access.canPermissions('business:agent:detail'),
      render: (_: any, record: any) => [
        <Access key='reset' accessible={access.canPermissions('business:agent:detail')}>
          <a onClick={() => { getDetail(record) }}><BarChartOutlined />{isXsScreen ? null : '代理数据'}</a>
        </Access>,
        <Access key='edit' accessible={access.canPermissions('business:agent:edit')}>
          <a onClick={() => { edit(record); }}><EditOutlined /> {isXsScreen ? null : '修改'}</a>
        </Access>,

        // <Access key='delete' accessible={access.canPermissions('system:user:remove')}>
        //   {!record.admin && <a onClick={() => { deleteCustomer(record); }}><DeleteOutlined />  {isXsScreen ? null : '删除'}</a>}
        // </Access>,
      ],
    }])
  }, []);
  const onFinish = async (values: any) => {
    if (editAgentId && editAgentId != 'undefined') {
      await updateAgent({ ...getAgentParams(values), agentId: editAgentId });
    } else {

      await insertAgent(getAgentParams(values));
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
      <KeepAlive name="代理管理" id={history.location.pathname} saveScrollPosition="screen">
        <ProTable<TableListItem>
          size="small"
          className={styles.proTableBox}
          columns={columnsData}
          actionRef={actionRef}
          rowSelection={{}}
          request={async (params: any) => {
            // console.log(params)
            const prs = getQueryParams(params)
            prs.pageNo = params.current;           
            const { data } = await agentUser({ ...prs });
            return Promise.resolve({
              data: data.data,
              total: data.total,
              success: true,
            });
          }}
          scroll={{ x: 'max-content' }}
          rowKey="agentId"
          pagination={{
            showQuickJumper: true,
            current: Number(process.env.CURRENT),
            pageSize: Number(process.env.PAGE_SIZE)
          }}
          dateFormatter="string"
          headerTitle="代理管理"
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
              <Button type="primary" onClick={() => { add() }} icon={<PlusOutlined />}>新增</Button>
            </Access>
          ]}
        />
      </KeepAlive>
    </PageContainer>
  );
}