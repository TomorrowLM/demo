
import { ProColumns } from '@ant-design/pro-table';
import { GeneralFormColumnsItem } from '@/components/Form';
import { TableListItem } from './data';

export const columns: ProColumns<TableListItem>[] = [
  {
    title: '编号',
    width: 50,
    dataIndex: 'teamId',
    search: false,
    align: 'left'
  },
  {
    title: '小组名称',
    width: 100,
    dataIndex: 'teamName',
    align: 'left'
  },
  {
    title: '小组组长',
    width: 100,
    dataIndex: 'teamLeader',
    align: 'left'
  },
  {
    title: '组员',
    width: 200,
    dataIndex: 'member',
    align: 'left',
    search: false,
    copyable: true,
    ellipsis: true,
  },
  {
    title: '创建时间',
    width: 150,
    dataIndex: 'createTime',
    search: false,
    align: 'left'
  }
];

export const teamFormColumns = (memberList: Array<object>): Array<GeneralFormColumnsItem> => {
  return [
    {
      name: 'teamName',
      label: '组名',
      type: 'INPUT',
      placeholder: '请输入小组名称',
      rules: [{ required: true, message: '请输入小组名称!' }],
    },
    {
      name: 'teamLeaderId',
      label: '组长',
      type: 'SELECT',
      placeholder: '请选择小组组长',
      rules: [{ required: true, message: '请选择小组组长!' }],
      options: memberList
    },
    {
      name: 'members',
      label: '组员',
      type: 'SELECT',
      placeholder: '请选择小组组员',
      rules: [{ required: true, message: '请选择小组组员!' }],
      colSpan: 24,
      colXs: 24,
      mode: 'multiple',
      options: memberList
    }
  ];
};