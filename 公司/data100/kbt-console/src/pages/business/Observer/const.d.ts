
import { ProColumns } from '@ant-design/pro-table';
import { GeneralFormColumnsItem } from '@/components/Form';
import { TableListItem } from './data';

export const columns = (node, nodeKeyword): ProColumns<TableListItem>[] => {
  return [
    {
      title: '访问员姓名',
      width: 240,
      dataIndex: 'observerName',
      search: false,
      align: 'left',
      isField:true,
      fieldValue:"observer_name"
    },
    {
      title: '身份证号',
      width: 290,
      dataIndex: 'idNumber',
      search: false,
      isField:true,
      align: 'left',
      fieldValue:"id_number"
    },
    {
      title: '所属项目',
      width: 290,
      dataIndex: 'projectName',
      search: false,
      isField:true,
      align: 'left',
      fieldValue:"project_name"
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
      name: 'observerName',
      label: '访问员姓名',
      type: 'INPUT',
      placeholder: '请输入访问员姓名',
      rules: [{ required: true, message: '请输入访问员姓名' }],
    },

    {
      name: 'idNumber',
      label: '身份证号码',
      type: 'INPUT',
      placeholder: '请输入身份证号码',
      rules: [{ required: true, pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号码', validateTrigger: ['blur', 'change'] }]
    },
    {
      name: 'projectName',
      label: '项目名称',
      type: 'INPUT',
      placeholder: '请输入项目名称',
      rules: [{ required: false, message: '请输入项目名称!' }],
    },
  ];
  return columns;
};
