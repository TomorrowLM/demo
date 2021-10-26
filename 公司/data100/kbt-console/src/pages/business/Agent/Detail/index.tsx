import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import { Access, useAccess, history } from 'umi';
import { Space, Button, message, Modal, Tree, Select, Input } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SearchOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { KeepAlive, useAliveController } from 'react-activation';
import proTableSettings from '../../../../../config/proTableSettings';
import { getAgentDetail, deleteTask, getAgentList } from './service';
import { columns } from './const.d';
import { TableListItem } from './data';
import styles from './index.less';

const { confirm } = Modal;
const { Option } = Select;
let copyActionRef: any = null;
export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [selectDeptId, setSelectDeptId] = useState<string>('');
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>(columns('', ''));
  const [batchDeleteKeys, setBatchDeleteKeys] = useState<Array<any>>([]);
  const [deptTreeselect] = useState<Array<any>>([]);
  const [agentList, setAgentList] = useState<Array<any>>([]);
  const [agentId, setAgentId] = useState<String>(history.location.query.agentId);
  const { getCachingNodes } = useAliveController();
  const cachingNodes = getCachingNodes ? getCachingNodes() : [];

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
  const getAgentListData = async () => {
    let res = await getAgentList()
    setAgentList(res.data)
  }
  useEffect(() => {
    const { location } = history;
    const curCaching: number = cachingNodes.findIndex(item => item.id.slice(0, item.id.length - 2) === location.pathname + location.search);
    if (curCaching === -1) {
      getAgentListData()
    }
    setColumnsData(columns((fieldProps: any) => {
      return <Select style={{ width: 180 }} placeholder="请选择"  {...fieldProps} >
        {
          columnsData.map((item: any, index: number) => {
            if (item.isField) {
              return <Option value={item.fieldValue} key={index} >{item.title}</Option>
            }
          })
        }
      </Select>
    }, (fieldProps: any) => {
      return <Input placeholder="请输入关键词"  {...fieldProps} />
    }))
    return () => {
      if (actionRef.current) {
        copyActionRef = actionRef;
      }
    }
  }, []);

  const agentIdChange = (e: any) => {
    setAgentId(e)
    actionRef.current?.reload();
  }
  const filterOption = (inputValue: any, option: any) => {
    if (option.children.indexOf(inputValue) != -1) {
      return true
    }
  }
  return (
    <PageContainer title={false}>
      <Space style={{ padding: "12px", background: "#fff", marginBottom: "15px", width: "100%" }}>
        <Select style={{ width: 180 }} placeholder="请选择" onChange={e => agentIdChange(e)} value={agentId} showSearch={true} filterOption={filterOption}>
          {
            agentList.map((item: any, index: number) => {
              return <Option value={item.agentId} key={index} >{item.agentName}</Option>
            })
          }
        </Select>
      </Space>
      {/* <KeepAlive name="代理数据" id={history.location.pathname+history.location.search} saveScrollPosition="screen"> */}
        <ProTable<TableListItem>
          size="small"
          className={styles.proTableBox}
          columns={columnsData}
          actionRef={actionRef}
          // rowSelection={{}}
          request={async (params: any) => {
            // console.log("客户详情",params)
            const prs = {
              pageNo: params.current,
              pageSize: params.pageSize,
              agentId: agentId,
              field: params.field || '',
              keyword: params.keyword || '',
            }
            const { data } = await getAgentDetail({ ...prs });
            return Promise.resolve({
              data: data.data,
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
          headerTitle="代理数据"
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
          // tableAlertRender={({ selectedRowKeys }) => {
          //   console.log(selectedRowKeys)
          //   setBatchDeleteKeys(selectedRowKeys)
          //   return <Space size={24}>
          //     <span>已选 {selectedRowKeys.length} 项</span>
          //   </Space>
          // }}
          // tableAlertOptionRender={(props) => {
          //   const { onCleanSelected } = props;
          //   return (
          //     <Space>
          //       <Button key='cancel' type="link" onClick={onCleanSelected}>
          //         取消选择
          //     </Button>
          //       <Access key='batchDelete' accessible={access.canPermissions('system:user:remove')}>
          //         <Button danger type="link" onClick={() => batchDeleteUser(onCleanSelected)}>
          //           批量删除
          //       </Button>
          //       </Access>
          //     </Space>
          //   );
          // }}
          options={false}
          toolBarRender={() => [

          ]}
        />
      {/* </KeepAlive> */}
    </PageContainer>
  );
}