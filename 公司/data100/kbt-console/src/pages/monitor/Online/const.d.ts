
import { ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';

export const columns = (option: object): ProColumns<TableListItem>[] => {
  return [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 72,
      align: 'left'
    },
    {
      title: '会话编号',
      width: 150,
      dataIndex: 'tokenId',
      search: false,
      align: 'left',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '登录名称',
      width: 100,
      dataIndex: 'userName',
      align: 'left'
    },
    {
      title: '部门名称',
      width: 100,
      dataIndex: 'deptName',
      search: false,
      align: 'left',
    },
    {
      title: '主机',
      width: 150,
      dataIndex: 'ipaddr',
      align: 'left',
      search: false,
      copyable: true,
      ellipsis: true,
    },
    {
      title: '登录地点',
      width: 100,
      dataIndex: 'loginLocation',
      align: 'left'
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
    {
      title: '登录时间',
      width: 150,
      dataIndex: 'loginTime',
      search: false,
      align: 'left',
      valueType: 'dateTime'
    },
    option
  ];
};