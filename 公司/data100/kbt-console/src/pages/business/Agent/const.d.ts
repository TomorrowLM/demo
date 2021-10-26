
import { ProColumns } from '@ant-design/pro-table';
import { GeneralFormColumnsItem } from '@/components/Form';
import { TableListItem } from './data';

export const columns = (node, nodeKeyword): ProColumns<TableListItem>[] => {
  return [
    {
      title: '代理名',
      width: 50,
      dataIndex: 'agentName',
      search: false,
      align: 'left',
      isField:true,
      fieldValue:"agent_name"
    },
    {
      title: '代理ID',
      width: 100,
      dataIndex: 'agentId',
      search: false,
      isField:true,
      align: 'left',
      fieldValue:"agent_id"
    },
    {
      title: '企业名',
      width: 100,
      dataIndex: 'company',
      search: false,
      isField:true,
      align: 'left',
      fieldValue:"company"
    },
    {
      title: '手机号',
      width: 200,
      dataIndex: 'mobile',
      align: 'left',
      isField:true,
      search: false,
      copyable: true,
      ellipsis: true,
      fieldValue:"mobile"
    },
    {
      title: '邮箱',
      width: 150,
      dataIndex: 'email',
      search: false,
      isField:true,
      align: 'left',
      fieldValue:"email"
    },
    {
      title: '更新时间',
      width: 150,
      dataIndex: 'editTime',
      search: false,
      align: 'left'
    },
    {
      title: '更新人',
      width: 150,
      dataIndex: 'editUserId',
      search: false,
      align: 'left'
    },
    {
      title: '关键字所属项',
      key: 'field',
      hideInTable: true,
      dataIndex: 'field',
      renderFormItem: (item, { type, defaultRender, formItemProps, fieldProps, ...rest }, form) => {
        // form.getFieldValue('field')
        if (node)
          return node(fieldProps)
      },
    },
    {
      title: '关键词',
      key: 'keyword',
      hideInTable: true,
      dataIndex: 'keyword',
      renderFormItem: (item, { type, defaultRender, formItemProps, fieldProps, ...rest }, form) => {
        // console.log(item, { type, defaultRender, formItemProps, fieldProps, ...rest }, form)
        if (nodeKeyword)
          return nodeKeyword(fieldProps)
      },
    },
  ]
}

export const formColumns = (): Array<GeneralFormColumnsItem> => {
  // eslint-disable-next-line no-shadow
  const columns = [
    {
      name: 'agentName',
      label: '代理名称',
      type: 'INPUT',
      placeholder: '请输入代理名称',
      rules: [{ required: true, message: '请输入代理名称!' }],
    },
 
    {
      name: 'mobile',
      label: '手机号',
      type: 'INPUT',
      placeholder: '请输入手机号',
      rules: [{ required: true, pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号!', validateTrigger: ['blur', 'change'] }]
    },
    {
      name: 'company',
      label: '企业名称',
      type: 'INPUT',
      placeholder: '请输入企业名称',
      rules: [{ required: false, message: '请输入企业名称!' }],
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'INPUT',
      placeholder: '请输入邮箱',
      rules: [{ required: false, type: 'email', message: '请输入正确的邮箱地址!', validateTrigger: ['blur', 'change'] }]
    },
   
  ];
  return columns;
};