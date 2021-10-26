
import { ProColumns } from '@ant-design/pro-table';
import { GeneralFormColumnsItem } from '@/components/Form';
import { TableListItem } from './data';

export const columns = (statusList: object, roleList: object, option: object): ProColumns<TableListItem>[] => {
  return [
    {
      title: '编号',
      width: 50,
      dataIndex: 'userId',
      search: false,
      align: 'left'
    },
    {
      title: '登录账号',
      width: 100,
      dataIndex: 'userName',
      align: 'left',
      order: 5
    },
    {
      title: '用户昵称',
      width: 100,
      dataIndex: 'nickName',
      search: false,
      align: 'left'
    },
    statusList,
    {
      title: '部门',
      width: 100,
      dataIndex: 'dept',
      search: false,
      align: 'left',
      render: (_) => _.deptName
    },
    {
      title: '角色',
      width: 150,
      dataIndex: 'roleIds',
      valueEnum: roleList,
      fieldProps: {
        mode: 'tags',
        optionFilterProp: 'label',
        showArrow: true
      },
      order: 2,
      render: (_, record) => record ? record.roles.map(item => item.roleName).join('、') : '-'
    },
    {
      title: '手机号码',
      width: 120,
      dataIndex: 'phonenumber',
      align: 'left',
      order: 4
    },
    {
      title: '创建时间',
      width: 150,
      dataIndex: 'createTime',
      search: false,
      align: 'left'
    },
    // {
    //   title: '所有问卷可见',
    //   dataIndex: 'isAllSurvey',
    //   hideInTable: true,
    //   order: 1,
    //   valueEnum: {
    //     '1': '是',
    //     '0': '否'
    //   }
    // },
    option
  ]
}

export const setUserNameColumns: Array<GeneralFormColumnsItem> = [
  {
    name: 'userName',
    label: '登录账号',
    type: 'INPUT',
    placeholder: '请输入登录账号',
    rules: [{ required: true, message: '请输入登录账号!' }],
  },
  {
    name: 'password',
    label: '密码',
    type: 'INPUT',
    mode: 'text',
    placeholder: '请输入密码',
    rules: [{ required: true, message: '请输入密码!' }],
  },
];

export const userFormColumns = (deptList: Array<object>, postList: Array<object>, roleList: Array<object>, type: number): Array<GeneralFormColumnsItem> => {
  // eslint-disable-next-line no-shadow
  const columns = [
    {
      name: 'nickName',
      label: '用户昵称',
      type: 'INPUT',
      placeholder: '请输入用户昵称',
      rules: [{ required: true, message: '请输入用户昵称!' }],
    },
    {
      name: 'deptId',
      label: '归属部门',
      type: 'TREE_SELECT',
      placeholder: '请选择归属部门',
      rules: [{ required: true, message: '请选择归属部门!' }],
      options: deptList
    },
    {
      name: 'phonenumber',
      label: '手机号',
      type: 'INPUT',
      placeholder: '请输入手机号',
      rules: [{ required: true, pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号!', validateTrigger: ['blur', 'change'] }]
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'INPUT',
      placeholder: '请输入邮箱',
      rules: [{ required: true, type: 'email', message: '请输入正确的邮箱地址!', validateTrigger: ['blur', 'change'] }]
    },
    {
      name: 'sex',
      label: '用户性别',
      type: 'SELECT',
      placeholder: '请选择用户性别',
      options: [
        {
          label: '男',
          value: '0'
        },
        {
          label: '女',
          value: '1'
        },
        // {
        //   label: '未知',
        //   value: '2'
        // }
      ]
    },
    {
      name: 'postIds',
      label: '岗位',
      type: 'SELECT',
      placeholder: '请选择岗位',
      mode: 'multiple',
      options: postList
    },
    {
      name: 'roleIds',
      label: '角色',
      placeholder: '请选择角色',
      type: 'SELECT',
      mode: 'multiple',
      options: roleList
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
    // {
    //   name: 'isAllSurvey',
    //   label: '所有问卷可见',
    //   type: 'RADIO',
    //   options: [
    //     {
    //       label: '是',
    //       value: 1
    //     },
    //     {
    //       label: '否',
    //       value: 0
    //     }
    //   ]
    // },
    {
      name: 'remark',
      label: '备注',
      type: 'TEXT_AREA',
      placeholder: '请输入备注',
      colSpan: 24,
      colXs: 24,
    },
  ];
  if (type === 0) {
    columns.splice(4, 0, ...setUserNameColumns)
  }
  return columns;
};

export const restPasswordColumns: Array<GeneralFormColumnsItem> = [
  {
    name: 'password',
    label: '请输入新密码',
    type: 'INPUT',
    mode: 'password',
    placeholder: '请输入新密码',
    rules: [{ required: true, message: '请输入新密码!' }],
    colSpan: 24,
    colXs: 24,
  },
];
