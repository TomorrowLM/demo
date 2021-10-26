import { ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';
import { isXsScreen } from '@/utils/utils';

export const progressEnum = {
  "0": "全部",
  "1": "已完成",
  // "2": "待完成",
  "3": "待一审",
  "4": "待二审",
  // "5": "审核中"
}
export const firstAuditStatusEnum = {
  "0": "全部",
  "1": "合格",
  "2": "不合格",
  "3": "待定",
  "4": "未审核",
  // "5": "没有答题的"
}
export const secondAuditStatusEnum = {
  "0": "全部",
  "1": "合格",
  "2": "不合格",
  "3": "未审核",
  // "4": "没有答题的"
}
export const cityLevelEnum = {
  "0": "全部",
  "1": "一级",
  "2": "二级",
  "3": "三级",
  "4": "四级"
}


export const flagEnum = {
  "0": "全部",
  "1": "合格",
  "2": "不合格",
  "3": "待定"
}

// taskType 1：京东户外广告， 2：京东线下门店，3：新潮
export const columns = (userEnum: Object, node, nodeKeyword, taskType): ProColumns<TableListItem, 'phoneNum'>[] => {
  console.log(taskType)
  let columnsArr = [
    {
      title: '编号',
      width: 80,
      dataIndex: 'serial',
      align: 'left',
      search: false,
      fixed: isXsScreen ? '' : 'left'
    },

    {
      title: '省',
      width: 100,
      dataIndex: 'province',
      align: 'left',
      search: false,
    },
    {
      title: '城市',
      width: 100,
      dataIndex: 'city',
      align: 'left',
      search: false,
    },
    {
      title: '城市级别',
      width: 100,
      dataIndex: 'cityLevel',
      align: 'left',
      search: false,
      valueEnum: cityLevelEnum
    },

    {
      title: '用户',
      width: 100,
      dataIndex: 'mobile',
      align: 'left',
      search: false,
      showSearch:true,
      valueEnum: userEnum ? userEnum : [],
      // valueType:"phoneNum",
      fieldProps: {
        defaultValue: "",
        showArrow: true
      }
    },
    {
      title: '提交时间',
      width: 180,
      dataIndex: 'answerTime',
      align: 'left',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '邀请码',
      width: 100,
      dataIndex: 'inviteCode',
      align: 'left',
      search: false,
    },
    {
      title: '代理',
      width: 100,
      dataIndex: 'agentName',
      align: 'left',
      search: false,
    },
    {
      title: '一审账户',
      width: 100,
      dataIndex: 'firstAuditUser',
      align: 'left',
      search: false,
    },
    {
      title: '二审账户',
      width: 100,
      dataIndex: 'secondAuditUser',
      align: 'left',
      search: false,
    },
    {
      title: '进度',
      width: 80,
      dataIndex: 'progress',
      align: 'left',
      search: false,
      fixed: isXsScreen ? '' : 'right',
      valueEnum: progressEnum,
      fieldProps: {
        defaultValue: "0",
        showArrow: true,
        allowClear: false
      }
    },
    {
      title: '一审',
      width: 80,
      dataIndex: 'firstAudit',
      align: 'left',
      search: true,
      fixed: isXsScreen ? '' : 'right',
      valueEnum: firstAuditStatusEnum,
      fieldProps: {
        defaultValue: "0",
        showArrow: true,
        allowClear: false
      }
    },
    {
      title: '二审',
      width: 80,
      dataIndex: 'secondAudit',
      align: 'left',
      search: true,
      fixed: isXsScreen ? '' : 'right',
      valueEnum: secondAuditStatusEnum,
      fieldProps: {
        defaultValue: "0",
        showArrow: true,
        allowClear: false
      }
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
    {
      title: '用户',
      width: 100,
      dataIndex: 'mobile',
      align: 'left',
      search: true,
      hideInTable: true,
      showSearch:true,
      valueEnum: userEnum ? userEnum : [],
      // valueType:"phoneNum",
      fieldProps: {
        defaultValue: "",
        showArrow: true
      }
    },
    {
      title: '进度',
      width: 100,
      dataIndex: 'progress',
      align: 'left',
      hideInTable: true,
      search: true,
      fixed: isXsScreen ? '' : 'right',
      valueEnum: progressEnum,
      fieldProps: {
        defaultValue: "0",
        showArrow: true,
        allowClear: false
      }
    },
    {
      title: '审核意见',
      width:120,
      dataIndex: 'auditOpinion',
      align: 'left',
      search: false,
      fixed: isXsScreen ? '' : 'right'
    },
    {
      title: '申诉',
      width:100,
      dataIndex: 'appealOpinion',
      align: 'left',
      search: false,
      fixed: isXsScreen ? '' : 'right'
    },
    {
      title: '审核结果',
      key: 'flag',
      hideInTable: true,
      dataIndex: 'flag',
      valueEnum: flagEnum,
      fieldProps: {
        defaultValue: "0",
        showArrow: true,
        allowClear: false
      }
    },
   
  ];
  if (taskType == 1) {
    columnsArr.splice(1, 0,
      {
        title: '品牌',
        width: 100,
        dataIndex: 'brand',
        align: 'left',
        search: false,
      },
      {
        title: '品牌ID',
        width: 100,
        dataIndex: 'brandId',
        align: 'left',
        search: false,
      },
      {
        title: '事业群',
        width: 100,
        dataIndex: 'busiGroup',
        align: 'left',
        search: false,
      },
      {
        title: '事业部',
        width: 100,
        dataIndex: 'busiDept',
        align: 'left',
        search: false,
      },
      {
        title: '媒体形式',
        width: 100,
        dataIndex: 'mediaStyle',
        align: 'left',
        search: false,
      })
    columnsArr.splice(9, 0, {
      title: '媒体类型',
      width: 100,
      dataIndex: 'mediaType',
      align: 'left',
      search: false,
    },
      {
        title: '媒体点位地址',
        width: 160,
        dataIndex: 'installAddress',
        align: 'left',
        search: false,
        // ellipsis: true,
      },
      {
        title: '安装位置',
        width: 120,
        dataIndex: 'installPosition',
        align: 'left',
        search: false,
      },
      {
        title: '点位编号',
        width: 100,
        dataIndex: 'pointNo',
        align: 'left',
        search: false,
      },
      {
        title: '循环次数',
        width: 100,
        dataIndex: 'cycleNum',
        align: 'left',
        search: false,
      })
  } else if (taskType == 2) {
    columnsArr.splice(1, 0,
      {
        title: '品牌',
        width: 100,
        dataIndex: 'brand',
        align: 'left',
        search: false,
      },
      {
        title: '品牌ID',
        width: 100,
        dataIndex: 'brandId',
        align: 'left',
        search: false,
      },
      {
        title: '事业群',
        width: 100,
        dataIndex: 'busiGroup',
        align: 'left',
        search: false,
      },
      {
        title: '事业部',
        width: 100,
        dataIndex: 'busiDept',
        align: 'left',
        search: false,
      })
    columnsArr.splice(5, 0, {
      title: '店面类型',
      width: 100,
      dataIndex: 'shopType',
      align: 'left',
      search: false,
    },
      {
        title: '店面名称',
        width: 100,
        dataIndex: 'shopName',
        align: 'left',
        search: false,
        // ellipsis: true,
      },
      {
        title: '店面地址',
        width: 120,
        dataIndex: 'shopAddress',
        align: 'left',
        search: false,
      },
      {
        title: '门店类型',
        width: 100,
        dataIndex: 'storeType',
        align: 'left',
        search: false,
      },
      {
        title: '展示元素',
        width: 100,
        dataIndex: 'displayElement',
        align: 'left',
        search: false,
      })
  } else if (taskType == 3) {
    columnsArr.splice(4, 0, {
      title: '任务全部回收点位数量',
      width: 100,
      dataIndex: 'allNum',
      align: 'left',
      search: false,
    },
      {
        title: '任务全部回收正常上刊点位数量',
        width: 60,
        dataIndex: 'allNormalNum',
        align: 'left',
        search: false,
        // ellipsis: true,
      },
      {
        title: '单小区最多点位数量',
        width: 120,
        dataIndex: 'singleNum',
        align: 'left',
        search: false,
      },
      {
        title: '项目名称',
        width: 100,
        dataIndex: 'projectName',
        align: 'left',
        search: false,
      },
      {
        title: '行政区域',
        width: 100,
        dataIndex: 'district',
        align: 'left',
        search: false,
      },
      {
        title: '详细地址',
        width: 120,
        dataIndex: 'address',
        align: 'left',
        search: false,
      },
      {
        title: '媒体安装位置',
        width: 100,
        dataIndex: 'installPosition',
        align: 'left',
        search: false,
      },
      {
        title: '媒体终端编号',
        width: 100,
        dataIndex: 'terminalId',
        align: 'left',
        search: false,
      })
  }else if(taskType == 4){
    columnsArr.splice(4, 0, {
      title: '区域',
      width: 100,
      dataIndex: 'district',
      align: 'left',
      search: false,
    },
      {
        title: '品牌',
        width: 100,
        dataIndex: 'brand',
        align: 'left',
        search: false,
      },{
        title: '媒体形式',
        width: 100,
        dataIndex: 'mediaStyle',
        align: 'left',
        search: false,
      },{
        title: '位置名称',
        width: 100,
        dataIndex: 'areaName',
        align: 'left',
        search: false,
      },{
        title: '具体位置',
        width: 100,
        dataIndex: 'address',
        align: 'left',
        search: false,
      },{
        title: '楼宇名称',
        width: 100,
        dataIndex: 'buildingName',
        align: 'left',
        search: false,
      })
  }
  return columnsArr

};


export const formColumns = (taskList: Array<object>,): Array<GeneralFormColumnsItem> => {
  return [
    {
      name: 'taskId',
      label: '任务名称',
      type: 'SELECT',
      placeholder: '请选择',
      rules: [{ required: true, message: '请选择任务名称!' }],
      options: taskList
    },
    {
      name: 'inviteCode',
      label: '邀请码',
      type: 'TEXT_AREA',
      placeholder: '请输入邀请码，用英文逗号分隔',
      rules: [{ required: true }]
    }
  ]
}





// taskType 1：京东户外广告， 2：京东线下门店，3：新潮 4:通用模板
export const timeTypeLists = [{ title: "YYYY-MM-DD", value: "0" }, { title: "YYYY-MM-DD HH:mm", value: "1" }, { title: "YYYY-MM-DD HH:mm:ss", value: "2" }]