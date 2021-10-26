import { PageContainer } from '@ant-design/pro-layout';
import { Access, useAccess } from 'umi';
import React, { useEffect, useState, useRef } from 'react';
import { Space, Button, message, Modal, Switch, Tree } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateModal from '@/components/CreateModal';
import GeneralForm from '@/components/Form';
import DownloadButton from '@/components/DownloadButton';
import { formatData, formatDataToEnum, assTree, isXsScreen } from '@/utils/utils';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, RedoOutlined, ExclamationCircleOutlined, RestOutlined } from '@ant-design/icons';
import proTableSettings from '../../../../config/proTableSettings';
import { TableListItem } from './data.d';
import { columns, userFormColumns, restPasswordColumns } from './const.d';
import { getUserList, systemUser, getSystemUser, changeStatus, getDeptTreeselect, resetPwd } from './service';
import styles from './index.less';

const { confirm } = Modal;
const initParams: object = { status: '0', isAllSurvey: 0 }
let treeselectData: Array<any> = [];

export default () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [editUserId, setEditUserId] = useState<string>('');
  const [editUserName, setEditUserName] = useState<string>('');
  const [selectDeptId, setSelectDeptId] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [initialValues, setInitialValues] = useState<Object>(initParams);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [switchLoading, setSwitchLoading] = useState<boolean>(false);
  const [createModalType, handleModalType] = useState<string>('');
  const [columnsData, setColumnsData] = useState<ProColumns<TableListItem>[]>([]);
  const [generalFormColumns, handleGeneralFormColumns] = useState<Array<any>>([]);
  const [batchDeleteKeys, setBatchDeleteKeys] = useState<Array<any>>([]);
  const [deptTreeselect, setDeptTreeselect] = useState<Array<any>>([]);
  const [queryParams, setQueryParams] = useState<any>({});

  const getUserData = async (userId?: number) => {
    const [ systemUserData ]: any = await Promise.all([getSystemUser('GET', userId || '')]);
    const { data, posts, roles, postIds, roleIds } = systemUserData;
    const postList = formatData(posts, { postId: 'value', postName: 'label' });
    const roleList = formatData(roles, { roleId: 'value', roleName: 'label' });
    handleGeneralFormColumns(userFormColumns(treeselectData, postList, roleList, userId ? 1 : 0));
    if (userId) {
      const { nickName, userName, dept: { deptId }, isAllSurvey, phonenumber, email, sex, status, remark } = data;
      setEditUserName(userName);
      setInitialValues({ nickName, deptId, phonenumber, isAllSurvey, email, sex, status, remark, postIds, roleIds })
    } else {
      setInitialValues(initParams);
    }
  }

  const addUser = async () => {
    await getUserData();
    setModalTitle('新增用户');
    handleModalVisible(true);
    handleModalType('POST');
  }

  const editUser = async (record: any) => {
    const { userId } = record;
    await getUserData(userId);
    setModalTitle('编辑用户');
    setEditUserId(userId);
    handleModalVisible(true);
    handleModalType('PUT');
  }

  const deleteUser = (record: any) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除名称为 "${record.userName}" 的数据项?`,
      onOk: async () => {
        await getSystemUser('DELETE', record.userId);
        message.success('删除成功');
        actionRef.current?.reload();
      }
    });
  }

  const batchDeleteUser = (onCleanSelected: Function) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: `是否确认删除所选的数据项?`,
      onOk: async () => {
        await getSystemUser('DELETE', batchDeleteKeys.join());
        message.success('删除成功');
        actionRef.current?.reload();
        onCleanSelected();
      }
    });
  }

  const restPassword =async (record: any) => {
    const { userId } = record;
    await resetPwd({ password:'111111', userId })
    message.success(`重置密码成功,新密码为111111`)
    actionRef.current?.reload();
    /*
    handleGeneralFormColumns(restPasswordColumns);
    setModalTitle('重置密码');
    setEditUserId(userId);
    handleModalVisible(true);
    */
  }

  useEffect(() => {
    Promise.all([getDeptTreeselect(), getSystemUser('GET', '')]).then(([ treeselect, systemUserData ]) => {
      const { data } = treeselect;
      const { roles } = systemUserData;
      const roleEnum = formatDataToEnum(roles, 'roleName', 'roleId');
      treeselectData = assTree(data, { id: 'key', label: 'title' });
      setDeptTreeselect(treeselectData);
      setColumnsData(columns({
        title: '状态',
        width: 100,
        dataIndex: 'status',
        align: 'left',
        hideInTable: !access.canPermissions('system:user:edit'),
        order: 3,
        valueEnum: {
          '0': {
            text: '启用',
          },
          '1': {
            text: '停用',
          },
        },
        render: (_: any, record: any) => {
          return <Switch key={`status${  record.userId}`} loading={switchLoading} checkedChildren="启用" unCheckedChildren="停用" checked={record.status === '0'} onClick={(val: boolean) => {
            const onChangeStatus = async () => {
              setSwitchLoading(true)
              try {
                await changeStatus({ userId: record.userId, status: val ? '0' : '1' });
                message.success(val ? '启用成功' : '停用成功');
                setSwitchLoading(false)
                actionRef.current?.reload();
              } catch (error) {
                setSwitchLoading(false)
              }
            }
            if (!val) {
              confirm({
                title: '警告',
                icon: <ExclamationCircleOutlined />,
                content: `确认要停用 "${record.userName}" 的数据项?`,
                onOk: () => {
                  onChangeStatus();
                }
              });
            } else {
              onChangeStatus();
            }
          }} />
        }
      },
      roleEnum,
      {
        title: '操作',
        width: isXsScreen ? 60 : 130,
        key: 'option',
        valueType: 'option',
        fixed: 'right',
        hideInTable: !access.canPermissions('system:user:edit') && !access.canPermissions('system:user:remove') && !access.canPermissions('system:user:resetPwd'),
        render: (_: any, record: any) => [
          <Access key='edit' accessible={access.canPermissions('system:user:edit')}>
            <a onClick={() => { editUser(record); }}><EditOutlined /> { isXsScreen ? null : '修改' }</a>
          </Access>,
          // <Access key='delete' accessible={access.canPermissions('system:user:remove')}>
          //   { !record.admin && <a onClick={() => { deleteUser(record); }}><DeleteOutlined />  { isXsScreen ? null : '删除' }</a> }
          // </Access>,
          <Access key='reset' accessible={access.canPermissions('system:user:resetPwd')}>
            <a onClick={() => { restPassword(record); }}><RestOutlined />  { isXsScreen ? null : '重置' }</a>
          </Access>
        ],
      }))
    })
  }, []);

  const onFinish = async (values: any) => {
    if (modalTitle === '重置密码') {
      await resetPwd({ ...values, userId: editUserId })
      message.success(`重置密码成功`)
    } else {
      await systemUser(createModalType, createModalType === 'POST' ? values : { ...values, userId: editUserId, userName: editUserName });
      message.success(`${ createModalType === 'POST' ? '新增' : '编辑' }成功`);
    }
    actionRef.current?.reload();
    handleModalVisible(false);
  }

  const onSelect = (selectedKeys: any) => {
    setSelectDeptId(selectedKeys[0]);
    actionRef.current?.reload();
  };

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
          prs.pageNum = params.current;
          prs.roleIds = prs.roleIds ? prs.roleIds.join(',') : '';
          delete prs.current;
          setQueryParams({ ...prs, deptId: selectDeptId });
          const { rows, total } = await getUserList({ ...prs, deptId: selectDeptId });
          return Promise.resolve({
            data: rows,
            total,
            success: true,
          });
        }}
        scroll={{ x: 'max-content' }}
        rowKey="userId"
        pagination={{
          showQuickJumper: true,
          current: Number(process.env.CURRENT),
          pageSize: Number(process.env.PAGE_SIZE)
        }}
        dateFormatter="string"
        headerTitle="用户管理"
        search={{
          labelWidth: 100,
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
          <Access key='export' accessible={access.canPermissions('system:user:export')}>
            <DownloadButton text='下载列表' params={queryParams} path='system/user/export' />
            </Access>,
          <Access key='add' accessible={access.canPermissions('system:user:add')}>
            <Button type="primary" onClick={() => { addUser() }} icon={<PlusOutlined />}>新增</Button>
          </Access>
        ]}
      />
    </PageContainer>
  );
};
