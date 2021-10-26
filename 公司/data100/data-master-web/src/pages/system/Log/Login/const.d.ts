
import { ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';

export const columns = (commonStatus: object): ProColumns<TableListItem>[] => {
  return [
    {
      title: '编号',
      width: 50,
      dataIndex: 'infoId',
      search: false,
      align: 'left',
      fixed: 'left'
    },
    {
      title: '登录账号',
      width: 100,
      dataIndex: 'userName',
      align: 'left'
    },
    {
      title: '登录地址',
      width: 150,
      dataIndex: 'ipaddr',
      align: 'left',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '登录地点',
      width: 100,
      dataIndex: 'loginLocation',
      align: 'left',
      search: false
    },
    {
      title: '浏览器',
      width: 100,
      dataIndex: 'browser',
      align: 'left',
      search: false
    },
    {
      title: '操作系统',
      width: 100,
      dataIndex: 'os',
      align: 'left',
      search: false
    },
    commonStatus,
    {
      title: '登录日期',
      width: 150,
      dataIndex: 'loginTime',
      search: false,
      align: 'left'
    }
  ];
};