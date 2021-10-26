
import { ProColumns } from '@ant-design/pro-table';
import { GeneralFormColumnsItem } from '@/components/Form';
import { TableListItem } from './data';

export const columns: ProColumns<TableListItem>[] = [
  {
    title: '编号',
    width: 50,
    dataIndex: 'postId',
    search: false,
    align: 'left'
  },
  {
    title: '岗位编码',
    width: 100,
    dataIndex: 'postCode',
    align: 'left'
  },
  {
    title: '岗位名称',
    width: 150,
    dataIndex: 'postName',
    align: 'left'
  },
  {
    title: '岗位顺序',
    width: 100,
    dataIndex: 'postSort',
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

export const postFormColumns: Array<GeneralFormColumnsItem> = [
  {
    name: 'postName',
    label: '岗位名称',
    type: 'INPUT',
    placeholder: '请输入岗位名称',
    rules: [{ required: true, message: '请输入岗位名称!' }],
  },
  {
    name: 'postCode',
    label: '岗位编码',
    type: 'INPUT',
    placeholder: '请输入岗位编码',
    rules: [{ required: true, message: '请输入岗位编码!' }],
  },
  {
    name: 'postSort',
    label: '岗位顺序',
    type: 'INPUT_NUM',
    placeholder: '请输入岗位顺序',
    rules: [{ required: true, message: '请输入岗位顺序!' }],
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