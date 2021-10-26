// export const columnsData = {

// }
import {ProColumns} from '@ant-design/pro-table';
import {isXsScreen} from '@/utils/utils';
import {TableListItem} from './data';
import defaultSettings from '../../../../config/defaultSettings';
import {Image, Input} from "antd";

const stateEnum = {
  "0": "关闭",
  "1": "开启",
}

export const menuList = (handleOk?: object, createCard, search: string) => [
  // export const menuList =[
  {
    access: 'survey:list:exportData',// 权限标识
    path: '/survey/list/exportData',// 页面地址
    menuName: '导出数据列表',// 按钮名称
    search,
    // handleOk:null,//点击事件
    menuType: "url",
  },
  {
    access: 'survey:list:detail:data',// 权限标识
    path: '/list/detail/data',// 页面地址
    menuName: '项目资料',// 按钮名称
    search,
    // handleOk:null,//点击事件
    menuType: "url",
  },
  {
    access: 'survey:list:detail:clean',// 权限标识
    path: '/list/detail/clean',// 页面地址
    menuName: '数据清洗',// 按钮名称
    search,
    // handleOk:null,//点击事件
    menuType: "url",
  },
  {
    access: 'survey:list:detail:dataReport',// 权限标识
    path: '/list/detail/dataReport',// 页面地址
    menuName: '数据报告',// 按钮名称
    search,
    // handleOk:null,//点击事件
    menuType: "url",
  },
  {
    access: 'survey:list:detail:report',// 权限标识
    path: '/list/detail/report',// 页面地址
    menuName: '文字报告',// 按钮名称
    search,
    // handleOk:null,//点击事件
    menuType: "url",
  },
  {
    access: 'survey:list:members',// 权限标识
    path: '',// 页面地址
    menuName: '管理成员',// 按钮名称
    handleOk,// 点击事件
    menuType: "button",
  },
  {
    access: 'folder:creatCard',// 权限标识
    path: '',// 页面地址
    menuName: '创建卡片',// 按钮名称
    handleOk: createCard,//点击事件
    menuType: "button",
    search,
  },
]

export const columns = (
  editTable: Object, statusNode: Object, joinCountNode: Object, operateNode?: Object, progressNode: Object
): ProColumns<TableListItem>[] => {
  return [
    {
      title: '搜索',
      search: true,
      dataIndex: 'searchAll',
      hideInTable: true,
      width: 80,
    },
    {
      title: 'SID',
      width: 80,
      dataIndex: 'sid',
      align: 'left',
      search: false,
      // copyable: true,
      // order: 8,
      fixed: isXsScreen ? '' : 'left'
    },
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      align: 'left',
      copyable: true,
      search: false,
      width: 'auto',
      // ...(editTable(100, 'contractNo'))
      // width: 100,
      render: (text, record, index) => {
        return editTable(record, 'contractNo', 100)
      }
    },
    // status,
    {
      title: '问卷名称',
      dataIndex: 'surveyName',
      align: 'left',
      search: false,
      // ...(editTable(200, 'surveyName'))
      width: "auto",
      render: (text, record, index) => {
        return editTable(record, 'surveyName', 200)
      }
    },
    {
      search: false,
      title: '所属文件夹',
      width: 150,
      dataIndex: 'fileName',
      align: 'left',
      // order: 10,
    },
    {
      search: false,
      title: '项目经理',
      width: 100,
      dataIndex: 'userName',
      align: 'left',
      // order: 3,
      // fieldProps: {
      //   mode: 'tags',
      //   optionFilterProp: 'label',
      //   showArrow: true,
      //   showSearch: true
      // }
    },
    {
      title: '状态',
      width: 100,
      dataIndex: 'status',
      align: 'left',
      search: false,
      valueEnum: stateEnum
      // render:(text,record)=>statusNode(record)
    },
    {
      title: '配额',
      width: 'auto',
      dataIndex: 'totalNum',
      align: 'left',
      search: false,
      render: (text, record, index) => {
        return editTable(record, 'totalNum', 80)
      }
    },
    {
      title: '参与量',
      width: 80,
      dataIndex: 'answerNum',
      align: 'left',
      search: false,
    },
    {
      title: '成功量',
      width: 80,
      dataIndex: 'successNum',
      align: 'left',
      search: false,
    },
    {
      title: '项目进度',
      width: 150,
      dataIndex: 'progress',
      // valueType: {
      //   type: 'progress',
      //   status: 'active',
      //   strokeColor:'rgba(33,79,126,1)',
      // },
      align: 'left',
      search: false,
      render: progressNode
    },
    // {
    //   title: '数据',
    //   width: 80,
    //   dataIndex: 'refresh',
    //   align: 'left',
    //   search: false,
    //   render:(text,record)=>joinCountNode(record)
    // },
    {
      title: '时间',
      width: 100,
      dataIndex: 'updateTime',
      align: 'left',
      search: false,
    },
    {
      title: '操作',
      width: 60,
      dataIndex: 'operate',
      align: 'left',
      search: false,
      fixed: isXsScreen ? '' : 'right',
      render: (text, record) => operateNode(record)
    },
  ];
};

