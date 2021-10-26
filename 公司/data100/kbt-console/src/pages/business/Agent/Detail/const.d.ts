
import { ProColumns } from '@ant-design/pro-table';
import { GeneralFormColumnsItem } from '@/components/Form';
import { TableListItem } from './data';


export const columns = (node, nodeKeyword): ProColumns<TableListItem>[] => {
  return [
    {
      title: '代理名称',
      width: 50,
      dataIndex: 'projectName',
      align: 'left', 
      search: false,
      isField:true,
      fieldValue:"project_name"
    },
    {
      title: '代理ID',
      width: 100,
      dataIndex: 'agentId',
      align: 'left',
      search: false,
      isField:true,
      fieldValue:"agent_id"
    },
    {
      title: '项目名称',
      width: 50,
      dataIndex: 'projectName',
      align: 'left',
      search: false,
      isField:true,
      fieldValue:"project_name"
    },
    {
      title: '项目ID',
      width: 100,
      dataIndex: 'projectId',
      align: 'left',
      search: false,
      isField:true,
      fieldValue:"project_id"
    },
    {
      title: '任务名称',
      width: 100,
      dataIndex: 'taskName',
      align: 'left',
      search: false,
      isField:true,
      fieldValue:"task_name"
    },
    {
      title: '任务ID',
      width: 150,
      dataIndex: 'taskId',
      align: 'left',
      search: false,
      isField:true,
      fieldValue:"task_id"
    },
    {
      title: '任务类型',
      width: 100,
      dataIndex: 'taskType',
      align: 'left',
      search: false,
      isField:true,
      fieldValue:"task_type"
    },
    {
      title: '完成点位数',
      width: 100,
      dataIndex: 'completePointNum',
      align: 'left',
      search: false,
    },
    {
      title: '不合格点位数',
      width: 100,
      dataIndex: 'failPointNum',
      align: 'left',
      search: false,
    },
    {
      title: '不合格点位率',
      width: 100,
      dataIndex: 'failPointRate',
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

