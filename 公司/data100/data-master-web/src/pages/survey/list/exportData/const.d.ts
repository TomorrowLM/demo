// export const columnsData = {

// }
import { ProColumns } from '@ant-design/pro-table';
import { isXsScreen } from '@/utils/utils';
import { TableListItem } from './data';

const stateEnum = {
  "0":"关闭",
  "1":"开启",
}

export const menuList =(handleOk?:object)=>[
  // export const menuList =[
  {
    access:true ,//所有角色都有权限
    menuName:'删除',//按钮名称
    handleOk:handleOk,//点击事件
    menuType:"button",
  },

]

export const columns = (
  download:Object,statusNode:Object,operateNode?:Object,
): ProColumns<TableListItem>[] => {
  return [
    {
      title: '操作人',
      width: 80,
      dataIndex: 'userName',
      align: 'left',
      // copyable: true,
      // order: 8,
      // fixed: isXsScreen ? '' : 'left'
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
      align: 'left',
      // copyable: true,
      width:'auto',
      // ...(editTable(100, 'contractNo'))
      // width: 100,
      // render: (text, record, index) => {
      //   return editTable( record, 'contractNo',100)
      // }
    },
    // status,
    {
      title: '下载路径',
      dataIndex: 'fileUrl',
      align: 'left',
      search: false,
      // ...(editTable(200, 'surveyName'))
      width: "auto",
      render: (text, record, index) => {
        return download( record, 'surveyName',200)
      }
    },

    {
      title: '状态',
      width: 100,
      dataIndex: 'status',
      align: 'left',
      search: false,
      // valueEnum:stateEnum,
      render:(text,record)=>statusNode(record)
    },
  
    {
      title: '操作',
      width: 60,
      dataIndex: 'operate',
      align: 'left',
      search: false,
      fixed: isXsScreen ? '' : 'right',
      render:(text,record)=>operateNode(record)
    },
  ];
};

export const downloadFormColumns = (): Array<GeneralFormColumnsItem> => {
  return [
    {
      name: 'answers',
      label: '导出答案为',
      type: 'RADIO',
      placeholder: '',
      rules: [{ required: true, message: '请选择!' }],
      options:[
        {
          label: '回复编号',
          value: 'short'
        },
        {
          label: '完整答案',
          value: 'long'
        }
      ]
    },
    {
      name: 'converty',
      label: '多选题选择项替换',
      type: 'CHECKBOX',
      placeholder: '请选择隶属事业部',
      rules: [{ required: false,}],
      options:[
        {
          label: ' Y转换1',
          value: '1'
        },
      ]
    },
   
    {
      name: 'headStyle',
      label: '导出标题为',
      type: 'RADIO',
      placeholder: '',
      rules: [{ required: true, message: '请选择!' }],
      options:[
        {
          label: '原始字段',
          value: 'field'
        },
        {
          label: '问题编码',
          value: 'code'
        },
        {
          label: '完整问题文本',
          value: 'full'
        },
        {
          label: '问题代码和问题文字',
          value: 'code_text'
        },
      ]
    },
    {
      name: 'exportTime',
      label: '答题时间是否导出',
      type: 'CHECKBOX',
      placeholder: '请选择隶属事业部',
      rules: [{ required: false,}],
      options:[
        {
          label: '导出答题时间',
          value: '1'
        },
      ]
    },
    {
      name: 'completionState',
      label: '完成状态',
      type: 'RADIO',
      placeholder: '',
      rules: [{ required: true, message: '请选择!' }],
      options:[
        {
          label: '所有数据',
          value: 'all'
        },
        {
          label: '仅已完成数据',
          value: 'complete'
        },
        {
          label: '仅未完成数据',
          value: 'incomplete'
        }
      ]
    },
    {
      name: 'isDownGroupData',
      label: '是否导出问卷组数据',
      type: 'RADIO',
      placeholder: '',
      rules: [{ required: true, message: '请选择!' }],
      options:[
        {
          label: '本问卷数据',
          value: 'this_survey'
        },
        {
          label: '问卷组',
          value: 'all_survey'
        },
        
      ]
    },
  ]
}

export const spssFormColumns = (): Array<GeneralFormColumnsItem> => {
  return [
    {
      name: 'downloadType',
      label: '导出类型',
      type: 'RADIO',
      placeholder: '',
      rules: [{ required: true, message: '请选择!' }],
      options:[
        {
          label: '导出句法',
          value: '/api/survey/get_file_sps'
        },
        {
          label: '导出数据',
          value: '/api/survey/get_file_dat'
        }
      ]
    },
    {
      name: 'completionState',
      label: '完成状态',
      type: 'RADIO',
      placeholder: '',
      rules: [{ required: true, message: '请选择!' }],
      options:[
        {
          label: '所有数据',
          value: 'all'
        },
        {
          label: '仅已完成数据',
          value: 'complete'
        },
        {
          label: '仅未完成数据',
          value: 'incomplete'
        }
      ]
    },
    {
      name: 'isDownGroupData',
      label: '是否导出问卷组数据',
      type: 'RADIO',
      placeholder: '',
      rules: [{ required: true, message: '请选择!' }],
      options:[
        {
          label: '本问卷数据',
          value: 'this_survey'
        },
        {
          label: '问卷组',
          value: 'all_survey'
        },
        
      ]
    },
  ]
}
