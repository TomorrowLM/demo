
import { ProColumns } from '@ant-design/pro-table';
import { GeneralFormColumnsItem } from '@/components/Form';
import { TableListItem } from './data';

export const columns: ProColumns<TableListItem>[] = [
  {
    title: '编号',
    width: 50,
    dataIndex: 'roleId',
    search: false,
    align: 'left',
  },
  {
    title: '角色名称',
    width: 100,
    dataIndex: 'roleName',
    align: 'left'
  },
  // {
  //   title: '权限字符',
  //   width: 100,
  //   dataIndex: 'roleKey',
  //   align: 'left'
  // },
  {
    title: '显示顺序',
    width: 100,
    dataIndex: 'roleSort',
    align: 'left',
    search: false
  },
  {
    title: '创建时间',
    width: 150,
    dataIndex: 'createTime',
    search: false,
    align: 'left'
  }
];

export const roleFormColumns: Array<GeneralFormColumnsItem> = [
  {
    name: 'roleName',
    label: '角色名称',
    type: 'INPUT',
    placeholder: '请输入角色名称',
    rules: [{ required: true, message: '请输入角色名称!' }],
  },
  // {
  //   name: 'roleKey',
  //   label: '权限字符',
  //   type: 'INPUT',
  //   placeholder: '请输入权限字符',
  //   rules: [{ required: true, message: '请输入权限字符!' }],
  // },
  {
    name: 'roleSort',
    label: '角色顺序',
    type: 'INPUT_NUM',
    placeholder: '请输入角色顺序',
    rules: [{ required: true, message: '请输入角色顺序!' }],
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
    name: 'menuIds',
    label: '菜单权限',
    type: 'TREE',
    colSpan: 24,
    colXs: 24,
    options: [],
    rules: [{ required: true, message: '请分配菜单权限!' }],
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

export const jurisdictionFormColumns: Array<GeneralFormColumnsItem> = [
  {
    name: 'roleName',
    label: '角色名称',
    type: 'INPUT',
    placeholder: '请输入角色名称',
    disabled: true
  },
  {
    name: 'roleKey',
    label: '权限字符',
    type: 'INPUT',
    placeholder: '请输入权限字符',
    disabled: true
  },
  {
    name: 'dataScope',
    label: '权限范围',
    type: 'SELECT',
    placeholder: '请选择权限范围',
    options: [
      {
        value: "1",
        label: "全部数据权限"
      },
      {
        value: "2",
        label: "自定数据权限"
      },
      {
        value: "3",
        label: "本部门数据权限"
      },
      {
        value: "4",
        label: "本部门及以下数据权限"
      },
      {
        value: "5",
        label: "仅本人数据权限"
      }
    ],
  }
]

export const deptIdsColumns: GeneralFormColumnsItem = {
  name: 'deptIds',
  label: '数据权限',
  type: 'TREE',
  colSpan: 24,
  colXs: 24,
  options: []
}