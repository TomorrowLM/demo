
import { ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';

export const columns = (option: object): ProColumns<TableListItem>[] => {
  return [
    {
      title: '批次号',
      width: 150,
      dataIndex: 'batchId',
      search: false,
      copyable: true,
      ellipsis: true,
      align: 'left'
    },
    {
      title: '批次名称',
      width: 100,
      dataIndex: 'batchName',
      align: 'left',
      search: false,
    },
    {
      title: '总条数',
      width: 100,
      dataIndex: 'count',
      align: 'left',
      search: false
    },
    {
      title: '创建人',
      width: 100,
      dataIndex: 'admin',
      align: 'left',
      search: false
    },
    {
      title: '创建日期',
      width: 150,
      dataIndex: 'createTime',
      search: false,
      align: 'left'
    },
    option
  ];
};