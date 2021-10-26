
import { ProColumns } from '@ant-design/pro-table';
import { TableListItem, OperDetails } from './data';

export const columns = (operType: object, commonStatus: object, option: object): ProColumns<TableListItem>[] => {
  return [
    {
      title: '编号',
      width: 50,
      dataIndex: 'operId',
      search: false,
      align: 'left'
    },
    {
      title: '系统模块',
      width: 100,
      dataIndex: 'title',
      align: 'left'
    },
    operType,
    {
      title: '请求方式',
      width: 100,
      dataIndex: 'requestMethod',
      align: 'left',
      search: false
    },
    {
      title: '操作人员',
      width: 100,
      dataIndex: 'operName',
      align: 'left',
    },
    {
      title: '主机',
      width: 150,
      dataIndex: 'operIp',
      align: 'left',
      search: false,
      copyable: true,
      ellipsis: true,
    },
    {
      title: '操作地点',
      width: 100,
      dataIndex: 'operLocation',
      align: 'left',
      search: false
    },
    {
      title: '操作地点',
      width: 100,
      dataIndex: 'operLocation',
      align: 'left',
      search: false
    },
    commonStatus,
    {
      title: '操作日期',
      width: 150,
      dataIndex: 'operTime',
      search: false,
      align: 'left'
    },
    option
  ];
};

export const descriptionsColumns: Array<OperDetails> = [
  {
    label: '操作模块',
    value: ['title', 'businessTypeName']
  },
  {
    label: '请求地址',
    value: 'operUrl'
  },
  {
    label: '登录信息',
    value: ['operName', 'operIp', 'operLocation']
  },
  {
    label: '请求方式',
    value: 'requestMethod'
  },
  {
    label: '操作方法',
    value: 'method'
  },
  {
    label: '请求参数',
    value: 'operParam',
    type: 'jsonCode'
  },
  {
    label: '返回参数',
    value: 'jsonResult',
    type: 'jsonCode'
  },
  {
    label: '操作状态',
    value: 'statusName'
  },
  {
    label: '操作时间',
    value: 'operTime'
  },
]