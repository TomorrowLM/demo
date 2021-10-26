
import { ProColumns } from '@ant-design/pro-table';
import { GeneralFormColumnsItem } from '@/components/Form';
import { TableListItem } from './data';

export const columns = (dictType: object, option: object): ProColumns<TableListItem>[] => {
  return [
    dictType,
    {
      title: '编码',
      width: 50,
      dataIndex: 'dictCode',
      search: false,
      align: 'left'
    },
    {
      title: '字典标签',
      width: 100,
      dataIndex: 'dictLabel',
      align: 'left'
    },
    {
      title: '字典键值',
      width: 100,
      dataIndex: 'dictValue',
      search: false,
      align: 'left'
    },
    {
      title: '字典排序',
      width: 100,
      dataIndex: 'dictSort',
      search: false,
      align: 'left'
    },
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
    name: 'dictType',
    label: '字典类型',
    type: 'INPUT',
    placeholder: '请输入字典类型',
  },
  {
    name: 'dictLabel',
    label: '数据标签',
    type: 'INPUT',
    placeholder: '请输入数据标签',
    rules: [{ required: true, message: '请输入数据标签!' }],
  },
  {
    name: 'dictValue',
    label: '数据键值',
    type: 'INPUT',
    placeholder: '请输入数据键值',
    rules: [{ required: true, message: '请输入数据键值!' }],
  },
  {
    name: 'dictSort',
    label: '显示排序',
    type: 'INPUT_NUM',
    placeholder: '请输入显示排序',
    rules: [{ required: true, message: '请输入显示排序!' }],
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
    name: 'fieldType',
    label: '字段类型',
    type: 'SELECT',
    placeholder: '请选择字段类型',
    options: [
      {
        label: '成功',
        value: 'Success'
      },
      {
        label: '失败',
        value: 'Error'
      },
      {
        label: '进行中',
        value: 'Processing'
      },
      {
        label: '警告',
        value: 'Warning'
      },
      {
        label: '默认',
        value: 'Default'
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