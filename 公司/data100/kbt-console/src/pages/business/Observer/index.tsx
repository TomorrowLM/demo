import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import { Access, useAccess, history } from 'umi';
import { KeepAlive } from 'react-activation';
import { Space, Button, message, Modal, Tree, Select, Input,Switch} from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateModal from '@/components/CreateModal';
import GeneralForm from '@/components/Form';
import UploadButton from '@/components/UploadButton'
import { PlusOutlined, EditOutlined, SearchOutlined, RedoOutlined, ExclamationCircleOutlined,DownloadOutlined } from '@ant-design/icons';
import { assTree, isXsScreen } from '@/utils/utils';

import proTableSettings from '../../../../config/proTableSettings';
import { observerUser, updateObserver, insertObserver,changeObserverState } from './service';
import { columns, formColumns } from './const.d';
import { TableListItem } from './data';
import styles from './index.less';

const { confirm } = Modal;
const { Option } = Select;

const initParams: object = { fstatus: '0', isAllSurvey: 0, isAllSymposium: 0, isAllDuocai: 0, isAllMroc: 0 }
// let tradeTreeData: Array<any> = [];
const getQueryParams = (params: any) => {
  const { pageSize, field, keyword, current } = params;
  return {
    current,
    pageSize,
    field: field || '',
    keyword: keyword || '',
  }
}
const getObserverParams = (params: any) => {
  const { observerName, idNumber, projectName } = params;
  return {
    observerName: observerName || "",
    idNumber: idNumber || "",
    projectName: projectName || "",
    type: 1
  }
}
export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [editObserverId, setEditObserverId] = useState<string>('');
  const [selectDeptId, setSelectDeptId] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [initialValues, setInitialValues] = useState<Object>(initParams);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalType, handleModalType] = useState<string>('');
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>(columns('', ''));
  const [generalFormColumns, handleGeneralFormColumns] = useState<Array<any>>([]);
  const [batchDeleteKeys, setBatchDeleteKeys] = useState<Array<any>>([]);
  const [deptTreeselect] = useState<Array<any>>([]);
  const [switchLoading, setSwitchLoading] = useState<boolean>(false);



  const getObserverUser = async (observerId?: number, record?: any) => {
    handleGeneralFormColumns(formColumns());
    if (observerId != undefined) {
      const { observerId, observerName, idNumber, projectName} = record
      setInitialValues({ observerId, observerName, idNumber, projectName})
    } else {
      setInitialValues(initParams);
    }
  }
  const add = async () => {
    await getObserverUser();
    setModalTitle('新增访问员');
    handleModalVisible(true);
    handleModalType('POST');
  }

  const edit = async (record: any) => {
    const { observerId } = record;
    await getObserverUser(observerId, record);
    setModalTitle('编辑用户');
    setEditObserverId(observerId);
    handleModalVisible(true);
    handleModalType('PUT');
  }


  function onSelect(selectedKeys: any) {
    setSelectDeptId(selectedKeys[0]);
    actionRef.current?.reload();
  }
  const onChangeStatus = async (val: boolean, isBatch: boolean, record: Object, onCleanSelected?: any) => {
    const changeStatus = async () => {
      setSwitchLoading(true)
      try {
        await changeObserverState({ observerId: isBatch? batchDeleteKeys.join():record.observerId, state: val ? '1' : '0' });
        message.success(val ? '启用成功' : '停用成功');
        setSwitchLoading(false)
        actionRef.current?.reload();
        if(isBatch){onCleanSelected()}
      } catch (error) {
        setSwitchLoading(false)
      }
    }
    if (!val) {
      confirm({
        title: '警告',
        icon: <ExclamationCircleOutlined />,
        content: `确认要停用${isBatch? "这些人员":record.observerName}的数据项?`,
        onOk: () => {
          changeStatus()        }
      });
    } else {
      changeStatus();
    }
  }
  useEffect(() => {
    const newColumns = columns((fieldProps: any) => {
      return <Select {...fieldProps}  placeholder="请选择">
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
        title: '状态',
        width: 100,
        dataIndex: 'state',
        align: 'left',
        hideInTable: !access.canPermissions('business:observer:editState'),
        search: false,
        // order: 3,
        valueEnum: {
          '0': {
            text: '停用',
          },
          '1': {
            text: '启用',
          },
        },
        render: (_: any, record: any) => {
          return <Switch key={`state${ record.observerId}`} loading={switchLoading} checkedChildren="启用" unCheckedChildren="停用" checked={record.state === '1'} onClick={(val: boolean) => {
            onChangeStatus(val, false, record)
          }} />
        }
      },{
      title: '操作',
      width: isXsScreen ? 60 : 200,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      hideInTable: !access.canPermissions('business:observer:edit'),
      render: (_: any, record: any) => [
        <Access key='edit' accessible={access.canPermissions('business:observer:edit')}>
          <a onClick={() => { edit(record); }}><EditOutlined /> {isXsScreen ? null : '修改'}</a>
        </Access>,
      ],
    }])
  }, []);

  const onFinish = async (values: any) => {
    if (editObserverId && editObserverId != 'undefined') {
      await updateObserver({ ...getObserverParams(values), observerId: editObserverId });
    } else {

      await insertObserver(getObserverParams(values));
    }

    message.success(`${createModalType === 'POST' ? '新增' : '编辑'}成功`);

    actionRef.current?.reload();
    handleModalVisible(false);
  }
  const uploadOk = async () =>{
    actionRef.current?.reload();
  }
  const downloadTemplate = async () => {
    window.location.href = `${process.env.PROXY_API}observer/observer_download/model`
  }
  return (
    <PageContainer title={false}>
      <CreateModal onCancel={() => {handleModalVisible(false);setEditObserverId('')}} title={modalTitle} modalVisible={createModalVisible}>
        <GeneralForm initialValues={initialValues} columns={generalFormColumns} onFinish={(values => onFinish(values))} />
      </CreateModal>
      <KeepAlive name="访问员信息库" id={history.location.pathname} saveScrollPosition="screen">
        <ProTable<TableListItem>
          size="small"
          className={styles.proTableBox}
          columns={columnsData}
          actionRef={actionRef}
          rowSelection={{}}
          request={async (params: any) => {
            const prs = getQueryParams(params)
            const { data } = await observerUser({ ...prs });
            return Promise.resolve({
              data: data.observerList,
              total: data.total,
              success: true,
            });
          }}
          scroll={{ x: 'max-content' }}
          rowKey="observerId"
          pagination={{
            showQuickJumper: true,
            current: Number(process.env.CURRENT),
            pageSize: Number(process.env.PAGE_SIZE)
          }}
          dateFormatter="string"
          headerTitle="访问员信息库"
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
                <Access key='batchDelete' accessible={access.canPermissions('business:observer:editState')}>
                  <Button danger type="link" onClick={() => onChangeStatus(true,true,{},onCleanSelected)}>
                    批量启用
                  </Button>
                </Access>
                <Access key='batchDelete' accessible={access.canPermissions('business:observer:editState')}>
                  <Button danger type="link" onClick={() => onChangeStatus(false,true,{},onCleanSelected)}>
                    批量停用
                  </Button>
                </Access>
              </Space>
            );
          }}
          options={false}
          toolBarRender={() => [
            <Access key='add' accessible={access.canPermissions('business:observer:downloadTemplate')}>
              <Button onClick={() => { downloadTemplate() }} icon={<DownloadOutlined />}>模板下载</Button>
            </Access>,
            <Access key='add' accessible={access.canPermissions('business:observer:import')}>
              <UploadButton text="批量导入" onSuccess={() => { uploadOk()}} name = 'file_upload' action="observer/observer_import" />
            </Access>,
            <Access key='add' accessible={access.canPermissions('business:observer:add')}>
              <Button type="primary" onClick={() => { add() }} icon={<PlusOutlined />}>新增</Button>
            </Access>
          ]}
        />
      </KeepAlive>
    </PageContainer>
  );
}
