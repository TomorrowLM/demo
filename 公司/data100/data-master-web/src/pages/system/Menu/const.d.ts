
import { ProColumns } from '@ant-design/pro-table';
import { GeneralFormColumnsItem } from '@/components/Form';
import { TableListItem } from './data';

export const columns = (icon: object, option: object): ProColumns<TableListItem>[] => {
  return [
    {
      title: '菜单名称',
      width: 150,
      dataIndex: 'menuName',
      align: 'left'
    },
    icon,
    {
      title: '排序',
      width: 150,
      dataIndex: 'orderNum',
      align: 'left',
      search: false
    },
    {
      title: '权限标识',
      width: 150,
      dataIndex: 'perms',
      align: 'left',
      search: false
    },
    {
      title: '组件路径',
      width: 150,
      dataIndex: 'component',
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
          text: '正常',
          status: 'Processing',
        },
        '1': {
          text: '停用',
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

export const formColumns: Array<GeneralFormColumnsItem> = [
  {
    name: 'parentId',
    label: '上级菜单',
    type: 'TREE_SELECT',
    placeholder: '请选择上级菜单',
    rules: [{ required: true, message: '请选择上级菜单!' }],
    colSpan: 24,
    colXs: 24,
    options: []
  },
  {
    name: 'menuType',
    label: '菜单类型',
    type: 'RADIO',
    options: [
      {
        label: '目录',
        value: 'M'
      },
      {
        label: '菜单',
        value: 'C'
      },
      {
        label: '按钮',
        value: 'F'
      }
    ],
  },
]

export const otherFormColumns: { M: Array<any>; C: Array<any>; F: Array<any>; } = {
  M: [
    {
      name: 'icon',
      label: '菜单图标',
      type: 'SELECT_ICON',
      placeholder: '请选择菜单图标'
    },
    {
      name: 'menuName',
      label: '菜单名称',
      type: 'INPUT',
      placeholder: '请输入菜单名称',
      rules: [{ required: true, message: '请输入菜单名称!' }],
    },
    {
      name: 'orderNum',
      label: '显示排序',
      type: 'INPUT_NUM',
      placeholder: '请输入显示排序',
      rules: [{ required: true, message: '请输入显示排序!' }]
    },
    {
      name: 'path',
      label: '路由地址',
      type: 'INPUT',
      placeholder: '请输入路由地址',
      rules: [{ required: true, message: '请输入路由地址!' }],
    },
    {
      name: 'visible',
      label: '显示状态',
      type: 'RADIO',
      options: [
        {
          label: '显示',
          value: '0'
        },
        {
          label: '隐藏',
          value: '1'
        }
      ]
    },
    {
      name: 'status',
      label: '菜单状态',
      type: 'RADIO',
      options: [
        {
          label: '正常',
          value: '0'
        },
        {
          label: '停用',
          value: '1'
        }
      ]
    },
  ],
  C: [
    {
      name: 'icon',
      label: '菜单图标',
      type: 'SELECT_ICON',
      placeholder: '请选择菜单图标'
    },
    {
      name: 'menuName',
      label: '菜单名称',
      type: 'INPUT',
      placeholder: '请输入菜单名称',
      rules: [{ required: true, message: '请输入菜单名称!' }],
    },
    {
      name: 'orderNum',
      label: '显示排序',
      type: 'INPUT_NUM',
      placeholder: '请输入显示排序',
      rules: [{ required: true, message: '请输入显示排序!' }]
    },
    {
      name: 'path',
      label: '路由地址',
      type: 'INPUT',
      placeholder: '请输入路由地址',
      rules: [{ required: true, message: '请输入路由地址!' }],
    },
    {
      name: 'component',
      label: '组件路径',
      type: 'INPUT',
      placeholder: '请输入组件路径',
      rules: [{ required: true, message: '请输入组件路径!' }],
    },
    {
      name: 'perms',
      label: '权限标识',
      type: 'INPUT',
      placeholder: '请输入权限标识',
      rules: [{ required: true, message: '请输入权限标识!' }],
    },
    {
      name: 'isFrame',
      label: '是否内链',
      type: 'RADIO',
      options: [
        {
          label: '是',
          value: '0'
        },
        {
          label: '否',
          value: '1'
        }
      ]
    },
    {
      name: 'visible',
      label: '显示状态',
      type: 'RADIO',
      options: [
        {
          label: '显示',
          value: '0'
        },
        {
          label: '隐藏',
          value: '1'
        }
      ]
    },
    {
      name: 'status',
      label: '菜单状态',
      type: 'RADIO',
      options: [
        {
          label: '正常',
          value: '0'
        },
        {
          label: '停用',
          value: '1'
        }
      ]
    },
  ],
  F: [
    {
      name: 'menuName',
      label: '菜单名称',
      type: 'INPUT',
      placeholder: '请输入菜单名称',
      rules: [{ required: true, message: '请输入菜单名称!' }],
    },
    {
      name: 'orderNum',
      label: '显示排序',
      type: 'INPUT_NUM',
      placeholder: '请输入显示排序',
      rules: [{ required: true, message: '请输入显示排序!' }]
    },
    {
      name: 'perms',
      label: '权限标识',
      type: 'INPUT',
      placeholder: '请输入权限标识',
      rules: [{ required: true, message: '请输入权限标识!' }],
    }
  ]
}


export const frameUrlColumn = {
  name: 'frameUrl',
  label: '内链地址',
  type: 'INPUT',
  placeholder: '请输入内链地址',
  colSpan: 24,
  colXs: 24,
  rules: [{ required: true, message: '请输入权限标识!' }],
}