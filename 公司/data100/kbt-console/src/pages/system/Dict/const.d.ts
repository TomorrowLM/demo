
import { ProColumns } from '@ant-design/pro-table';
import { GeneralFormColumnsItem } from '@/components/Form';
import { TableListItem } from './data';

export const columns = (dictType: object, option: object): ProColumns<TableListItem>[] => {
  return [
    {
      title: '编号',
      width: 50,
      dataIndex: 'dictId',
      search: false,
      align: 'left'
    },
    {
      title: '字典名称',
      width: 100,
      dataIndex: 'dictName',
      align: 'left'
    },
    dictType,
    {
      title: '状态',
      width: 100,
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
      title: '备注',
      width: 150,
      dataIndex: 'remark',
      align: 'left',
      search: false
    },
    {
      title: '创建时间',
      width: 150,
      dataIndex: 'createTime',
      search: false,
      align: 'left'
    },
    option
  ];
}

export const dictFormColumns: Array<GeneralFormColumnsItem> = [
  {
    name: 'dictName',
    label: '字典名称',
    type: 'INPUT',
    placeholder: '请输入字典名称',
    rules: [{ required: true, message: '请输入字典名称!' }],
  },
  {
    name: 'dictType',
    label: '字典类型',
    type: 'INPUT',
    placeholder: '请输入字典类型',
    rules: [{ required: true, message: '请输入字典类型!' }],
  },
  {
    name: 'status',
    label: '状态',
    type: 'RADIO',
    options: [
      {
        label: '启用',
        value: '0'
      },
      {
        label: '停用',
        value: '1'
      }
    ]
  },
  {
    name: 'remark',
    label: '备注',
    type: 'TEXT_AREA',
    placeholder: '请输入备注',
    colSpan: 24,
    colXs: 24,
  },
]