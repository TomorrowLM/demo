
import { ProColumns } from '@ant-design/pro-table';
import { GeneralFormColumnsItem } from '@/components/Form';
import { TableListItem } from './data';

export const columns: ProColumns<TableListItem>[] = [
  {
    title: '部门名称',
    width: 150,
    dataIndex: 'deptName',
    align: 'left'
  },
  {
    title: '排序',
    width: 150,
    dataIndex: 'orderNum',
    align: 'left',
    search: false
  },
  {
    title: '状态',
    width: 150,
    dataIndex: 'status',
    align: 'left',
    valueEnum: {
      '0': {
        text: '启用',
        status: 'Processing',
      },
      '1': {
        text: '禁用',
        status: 'Error',
      },
    }
  },
  {
    title: '创建时间',
    width: 150,
    dataIndex: 'createTime',
    search: false,
    align: 'left'
  }
];

export const formColumns: Array<GeneralFormColumnsItem> = [
  {
    name: 'parentId',
    label: '上级部门',
    type: 'TREE_SELECT',
    placeholder: '请选择上级部门',
    rules: [{ required: true, message: '请选择上级部门!' }],
    colSpan: 24,
    colXs: 24,
    options: []
  },
  {
    name: 'deptName',
    label: '部门名称',
    type: 'INPUT',
    placeholder: '请输入部门名称',
    rules: [{ required: true, message: '请输入部门名称!' }],
  },
  {
    name: 'orderNum',
    label: '显示排序',
    type: 'INPUT_NUM',
    placeholder: '请输入显示排序',
    rules: [{ required: true, message: '请输入显示排序!' }]
  },
  {
    name: 'leader',
    label: '负责人',
    type: 'INPUT',
    placeholder: '请输入负责人'
  },
  {
    name: 'phone',
    label: '联系电话',
    type: 'INPUT',
    placeholder: '请输入联系电话',
    rules: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的联系电话!', validateTrigger: ['blur', 'change'] }]
  },
  {
    name: 'email',
    label: '邮箱',
    type: 'INPUT',
    placeholder: '请输入邮箱',
    rules: [{ type: 'email', message: '请输入正确的邮箱地址!', validateTrigger: ['blur', 'change'] }]
  },
  {
    name: 'status',
    label: '部门状态',
    type: 'RADIO',
    options: [
      {
        label: '启用',
        value: '0'
      },
      {
        label: '禁用',
        value: '1'
      }
    ]
  }
]