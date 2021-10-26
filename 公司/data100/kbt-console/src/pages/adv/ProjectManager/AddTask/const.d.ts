import { ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';
import { isXsScreen } from '@/utils/utils';
import { createBrowserHistory } from 'history';



const history = createBrowserHistory();

export const assistPowerList = [
  { value: '1', label: '查看' },
  { value: '2', label: '编辑' },
  { value: '3', label: '删除' }
]

export const taskTypeOptions = [
  { value: '1', label: '京东户外广告' },
  { value: '2', label: '京东线下门店' },
  { value: '3', label: '新潮' }
]

export const taskTypeEnmu = {
  '1': '京东户外广告',
  '2': '京东线下门店',
  '3': '新潮',
  '4': '通用模板'
}

export const taskStatusEnmu = {
  "0": "新建",
  "1": "发布",
  "2": "暂停",
  "3": "关闭",
  "4": "下架"
}

export const tableColumnsData = (args: Object<any>,pointUploadMsgRnder:Object<any>): ProColumns<TableListItem>[] => {
  return [
    {
      title: '任务主图',
      width: 150,
      dataIndex: 'mainPic',
      search: false,
      valueType: (item) => ({
        type: 'image',
        width: 100,
        height: 100
      })
    },
    {
      title: '任务名称',
      width: 120,
      dataIndex: 'taskName',
      align: 'left',
      search: true
    },
    {
      title: '任务ID',
      width: 180,
      dataIndex: 'taskId',
      align: 'left',
      search: false,
    },
    {
      title: '品牌',
      width: 150,
      dataIndex: 'brand',
      align: 'left',
      search: false,
    },
    {
      title: '代理邀请码',
      width: 120,
      dataIndex: 'agent',
      align: 'left',
      search: false,
    },
    {
      title: '任务类型',
      width: 150,
      dataIndex: 'taskType',
      align: 'left',
      search: false,
      valueEnum: taskTypeEnmu
    },
    args,
    // {
    //   title: '点位库',
    //   width: 150,
    //   dataIndex: 'pointFile',
    //   align: 'left',
    //   search: false,
    //   render: (e, r) => {
    //     let c = e == '-' ? '待上传' : e;
    //     let i = c.lastIndexOf('/');
    //     if (i > 0) {
    //       c = c.substring(i + 1, c.length);
    //       return React.createElement("div",{},
    //       [React.createElement('a', { href: '#', onClick: () => { history.push('/adv/projectManager/addPoint?projectId=' + r.projectId + '&taskId=' + r.taskId + '&taskType=' + r.taskType) } }, c),
    //       React.createElement('a', { href: 'https://wwwtest.taidu8.com/3YzgB9zJLb.txt',target:"_blank",download:'规范',style:{color:"#7575f9",display:"inline-block",margin:"0 0 0 10px",border:"1px solid #7575f9"}  }, '下载')])
    //     }else{
    //       return React.createElement('a', {href:'#',onClick:() => {history.push('/adv/projectManager/addPoint?projectId='+r.projectId+'&taskId='+r.taskId+'&taskType='+r.taskType)}}, c);
    //     }
    //   }
    // },
    {
      title: '点位上传状态',
      width: 100,
      dataIndex: 'pointUploadMsg',
      align: 'left',
      search: false,
      render:pointUploadMsgRnder
    },
    {
      title: '点位上传进度',
      width: 150,
      dataIndex: 'pointProgress',
      align: 'left',
      search: false,
      valueType: {
        type: 'progress',
        status: 'active',
      }
    },
    {
      title: '任务状态',
      width: 120,
      dataIndex: 'taskStatus',
      align: 'left',
      search: false,
      valueEnum: taskStatusEnmu
    },
    {
      title: '协管员',
      width: 180,
      dataIndex: 'assistant',
      key: 'assistant',
      render: (e, r) => {
        return e == '()' ? '-' : e;
      }
    },
    {
      title: '投放开始时间',
      width: 120,
      dataIndex: 'putStartDate',
      align: 'left',
      valueType: 'date',
      search: false,
    },
    {
      title: '投放结束时间',
      width: 120,
      dataIndex: 'putEndDate',
      align: 'left',
      valueType: 'date',
      search: false,
    },
    {
      title: '执行开始时间',
      width: 150,
      dataIndex: 'execStartDate',
      align: 'left',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '执行结束时间',
      width: 150,
      dataIndex: 'execEndDate',
      align: 'left',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '执行进度',
      width: 150,
      dataIndex: 'completeRate',
      align: 'left',
      search: false,
      valueType: {
        type: 'progress',
        status: 'active',
      }
    },
    {
      title: '审批进度',
      width: 150,
      dataIndex: 'auditProgress',
      align: 'left',
      search: false,
      valueType: {
        type: 'progress',
        status: 'active',
      }
    },

  
  ];
};



const assistColumns = [
  {
    title: '协管员',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '权限',
    dataIndex: 'powerIds',
    key: 'powerIds',
    render: (powerIds) => {
      let as = powerIds.split(',')
      let text = '';
      as.forEach(a => {
        if (text.length > 0) {
          text += ','
          text += a == '1' ? '查看' : (a == '2' ? '编辑' : '删除')
        }
      })
      return text
    }
  },
]
