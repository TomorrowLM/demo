
import { ProColumns } from '@ant-design/pro-table';
import { GeneralFormColumnsItem } from '@/components/Form';
import { TableListItem } from './data';


export const columns = (): ProColumns<TableListItem>[] => {
  return [
    {
      title: '项目名称',
      width: 50,
      dataIndex: 'projectName',
      align: 'left'
    },
    {
      title: '项目ID',
      width: 100,
      dataIndex: 'projectId',
      align: 'left'
    },
    {
      title: '任务名称',
      width: 100,
      dataIndex: 'taskName',
      align: 'left',
    },
    {
      title: '任务ID',
      width: 150,
      dataIndex: 'taskId',
      align: 'left'
    },
    {
      title: '类型',
      width: 100,
      dataIndex: 'taskType',
      align: 'left',
    },
    {
      title: '更新时间',
      width: 100,
      dataIndex: 'editTime',
      align: 'left',
      search: false,

    },
  ]
}

