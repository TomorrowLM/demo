import { ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';
import { GeneralFormColumnsItem } from '@/components/Form';
import { isXsScreen } from '@/utils/utils';
import moment from 'moment';

export const columns = (customerValueEnum: Object): ProColumns<TableListItem>[] => {
  return [
    {
      title: '客户',
      width: 120,
      dataIndex: 'customerName',
      align: 'left',
      search: false
    },
    {
      title: '客户',
      dataIndex: 'customerIds',
      hideInTable:true,
      search: true,
      valueType: 'select',
      valueEnum: customerValueEnum
    },
    {
      title: '项目名称',
      width: 120,
      dataIndex: 'projectName',
      align: 'left',
      search: true,
    },
    {
      title: '项目ID',
      width: 120,
      dataIndex: 'projectId',
      align: 'left',
      search: false,
    },
    {
      title: '创建人',
      width: 120,
      dataIndex: 'creatUser',
      align: 'left',
      search: true,
      fieldProps: {
          placeholder:"请输入用户名或者昵称" 
      },
    },
    {
      title: '任务数量',
      width: 100,
      dataIndex: 'taskNum',
      align: 'left',
      search: false,
    },
    {
      title: '创建时间',
      width: 120,
      dataIndex: 'createTime',
      align: 'left',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      width: 120,
      dataIndex: 'createTime',
      align: 'left',
      hideInTable: true,
      valueType: 'dateRange',
      fieldProps: {
          defaultValue: () => {
            let startDate = moment().subtract(3,"months")
            let endDate = moment()
            let value=[startDate,endDate];
            return value;
          },
      },
      search: {
        transform: (value) => {
          return {
            startTime: value?value[0]:'',
            endTime: value?value[1]:'',
          }
        }
      }
    }
  ];
};

export const customerFormColumns = (customerOptions: Array<Object>): Array<GeneralFormColumnsItem> => {
  return [
    {
      name: 'customerId',
      label: '客户',
      type: 'SELECT',
      placeholder: '请选择客户',
      rules: [{ required: true, message: '请选择客户!' }],
      colSpan: 24,
      colXs: 24,
      options: customerOptions
    },
    {
      name: 'projectName',
      label: '项目名称',
      type: 'INPUT',
      placeholder: '请输入部门名称',
      rules: [{ required: true, message: '请输入部门名称!' }],
      colSpan: 24,
      colXs: 24,
    }
  ]
}
