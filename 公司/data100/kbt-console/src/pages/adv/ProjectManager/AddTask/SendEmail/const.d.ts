import { ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';
import { isXsScreen } from '@/utils/utils';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();


export const sendStatusEnmu= {
  '1':'成功',
  '0':'失败',
}

export const tableColumnsData = (args: Array<any>): ProColumns<TableListItem>[] => {
  return [
    {
      title: '代理',
      width: 100,
      dataIndex: 'agentId',
      search: false
    },
    {
      title: '代理名称',
      width: 100,
      dataIndex: 'agentName',
      align: 'left',
      search: true
    },
    {
      title: '接收者邮箱',
      width: 100,
      dataIndex: 'receiveEmail',
      align: 'left',
      search: false,
    },
    {
      title: '发送状态',
      width: 100,
      dataIndex: 'sendStatus',
      align: 'left',
      search: false,
      valueEnum: sendStatusEnmu
    },
  ];
};