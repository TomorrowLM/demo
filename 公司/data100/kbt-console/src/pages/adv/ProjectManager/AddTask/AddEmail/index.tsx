import React, {useEffect, useState, useRef} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { message,Upload, Button, Tooltip, Radio, Badge, Popconfirm,Modal,Form, Drawer, Message, TreeSelect, Card, Row, Col, Space, Switch, DatePicker,Progress } from 'antd';
import { PlusOutlined, EditOutlined, SendOutlined, FormOutlined, MinusOutlined, EyeOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { isXsScreen } from '@/utils/utils';
import moment from 'moment';
import { KeepAlive } from 'react-activation';
import { Link, Access, useAccess, history } from 'umi';
import { getTaskEmailRepord } from './service';
import { tableColumnsData } from './const.d';

let copyActionRef: any = null;

export default () => {
  const { taskId, projectId } = history.location.query;
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  const [columnsData, setColumnsData] = useState([]);
const option = {
    title: '操作',
    width: 80,
    key: 'option',
    valueType: 'option',
    fixed: 'right',
    render: (_: any, record: any) => [
      <Access key='edit' accessible={access.canPermissions('adv:addTask')}>
      <Link to={{
        pathname: `/adv/projectManager/sendEmail`,
        search: `?projectId=${projectId}&taskId=${taskId}&agentId_=${record.agentId}`,
      }}>
        <Tooltip title='查看'><EyeOutlined /></Tooltip>
      </Link>
      </Access>
    ],
  }
useEffect(() => {
    if (actionRef.current!=null && window.taskEmailReload) {
      window.taskEmailReload=false
      reload()
    }
  },[])

  useEffect(() => {
    const curColumnsData: Array<any> = tableColumnsData(
      [

      ]
    )
    setColumnsData([...curColumnsData, option])
      return () => {
        if (actionRef.current) {
          copyActionRef = actionRef;
        }
      }
    }, [taskId]);
 const reload = () => {
    const current = actionRef.current || copyActionRef.current;
    current?.reload();
  }

  return (
    <PageContainer title={false}>
      <KeepAlive name="邮件列表" id={ history.location.pathname + history.location.search } saveScrollPosition="screen">
        <div>
          <ProTable<TableListItem>
            size="small"
            columns={columnsData}
            actionRef={actionRef}
            request={async (params: any) => {
              const { data }: any = await getTaskEmailRepord(taskId);
              return Promise.resolve({
                data: data,
                total: data.length,
                success: true,
              });
            }}
            scroll={{ x: 'max-content' }}
            rowKey="taskId"
            dateFormatter="string"
            headerTitle=""
            search={false}
            toolBarRender={() => [
              <Access key='add' accessible={access.canPermissions('adv:addTaskPoint')}>
                <Link to={{
                  pathname: `/adv/projectManager/sendEmail`,
                  search: `?projectId=${projectId}&taskId=${taskId}`,
                }}>
                  <Button type='primary' >邮件通知</Button>
                </Link>
              </Access>,
            ]}
          />
        </div>
      </KeepAlive>
    </PageContainer>
  )
}
