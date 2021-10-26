import { ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';
import { isXsScreen } from '@/utils/utils';
const valueEnum_status = {
  "0":"未预订",
  "1":"执行中",
  "2":"已完成",
  "5":"已下架",

}
export const columnsList = (on_and_down,completeObj,treeNode): ProColumns<TableListItem>[] =>{
  return [
    {
      title: '任务编号',
      width: 120,
      dataIndex: 'subTaskId',
      align: 'left',
      search: false
    },
    {
      title: '任务名称',
      width: 120,
      dataIndex: 'taskName',
      align: 'left',
      search: false
    },
    {
      title: '预订人',
      width: 120,
      dataIndex: 'phone',
      align: 'left',
      hideInTable:true,
      placeholder:"手机号码",
      search: {
        placeholder:"手机号码"
      }
    },
    {
      title: '上线/下线',
      width: 120,
      dataIndex: 'status',//0:不展示 1：上线  2：下线
      align: 'left',
      search: false,
      render:(text,record)=>{
        return on_and_down(text,record)
      }
    },
    {
      title:completeObj.title,
      width: 120,
      dataIndex: 'finishStat',
      align: 'left',
      search: true,
      valueEnum:valueEnum_status,
    },
    {
      title: '省',
      width: 120,
      dataIndex: 'province',
      align: 'left',
      search: false
    },
    {
      title: '市',
      width: 120,
      dataIndex: 'city',
      align: 'left',
      search: false
    },
    {
      title: '省市',
      width: 120,
      hideInTable:true,
      dataIndex: 'city',
      search: true,
      // fieldProps:()=>{

      // },
      renderFormItem: (item, { type, defaultRender, formItemProps, fieldProps, ...rest }, form) => {
        console.log(item, { type, defaultRender, formItemProps, fieldProps, ...rest }, form)
        if(treeNode){
          return treeNode(fieldProps)
        }
       
      },
    },
    {
      title: '详细地址',
      width: 120,
      dataIndex: 'address',
      align: 'left',
      search: true
    },
    {
      title: '点位数量',
      width: 120,
      dataIndex: 'pointNum',
      align: 'left',
      search: false
    },
    {
      title: '已完成点位数量',
      width: 120,
      dataIndex: 'completeNum',
      align: 'left',
      search: false
    },
    {
      title: '预订人',
      width: 120,
      dataIndex: 'phone',
      align: 'left',
      search: false
    },
    {
      title: '预订时间',
      width: 120,
      dataIndex: 'destineTime',
      align: 'left',
      search: false
    },
  ]
}