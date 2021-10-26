
import { ProColumns } from '@ant-design/pro-table';
import { GeneralFormColumnsItem } from '@/components/Form';
import { TableListItem } from './data';


export const columns = (option: object): ProColumns<TableListItem>[] =>{
  return [
    {
      title: '客户',
      width: 50,
      dataIndex: 'customerName',
      align: 'left'
    },
    {
      title: '客户ID',
      width: 100,
      dataIndex: 'customerId',
      align: 'left'
    },
    {
      title: '行业',
      width: 100,
      dataIndex: 'tradeName',
      align: 'left',
      search: false,
    },
    // {
    //   title: '二级行业',
    //   width: 200,
    //   dataIndex: 'subTrade',
    //   align: 'left',
    //   // search: false,
    //   // copyable: true,
    //   // ellipsis: true,
    // },
    {
      title: '手机号',
      width: 150,
      dataIndex: 'mobile',
      align: 'left'
    },
    {
      title: '公司邮箱',
      width: 100,
      dataIndex: 'email',
      align: 'left',
      search: false,
    },
    {
      title: '更新时间',
      width: 100,
      dataIndex: 'editTime',
      align: 'left',
      search: false,
  
    },
    {
      title: '更新人',
      width: 100,
      dataIndex: 'editUserId',
      align: 'left',
      search: false,
    },
    option
  ]
}

export const customerFormColumns = (tradeTree: Array<object>): Array<GeneralFormColumnsItem> => {
  // eslint-disable-next-line no-shadow
  const columns = [
    {
      name: 'customerName',
      label: '客户名称',
      type: 'INPUT',
      placeholder: '请输入客户名称',
      rules: [{ required: true, message: '请输入客户名称!' }],
    },
    {
      name: 'trade',
      label: '行业',
      type: 'TREE_SELECT',
      placeholder: '请选择行业',
      rules: [{ required: true, message: '请选择行业!' }],
      options: tradeTree
    },
    // {
    //   name: 'deptId',
    //   label: '二级行业',
    //   type: 'TREE_SELECT',
    //   placeholder: '请选择二级行业',
    //   rules: [{ required: true, message: '请选择二级行业!' }],
    //   options: tradeTree
    // },
    {
      name: 'mobile',
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
   
  ];
  return columns;
};