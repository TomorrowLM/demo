import { ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';
import { isXsScreen } from '@/utils/utils';

// export const progressEnum = {
//   "0": "全部",
//   "1": "已完成",
//   "2": "待完成",
//   "3": "待一审",
//   "4": "待二审",
//   "5": "审核中"
// }
// export const firstAuditStatusEnum = {
//   "0": "全部",
//   "1": "合格",
//   "2": "不合格",
//   "3": "待定",
//   "4": "未审核",
//   "5": "没有答题的"
// }
// export const secondAuditStatusEnum = {
//   "0": "全部",
//   "1": "合格",
//   "2": "不合格",
//   "3": "未审核",
//   "4": "没有答题的"
// }
export const cityLevelEnum = {
  "0": "全部",
  "1": "一级",
  "2": "二级",
  "3": "三级",
  "4": "四级"
}


// export const flagEnum = {
//   "0": "全部",
//   "1": "合格",
//   "2": "不合格",
//   "3": "待定"
// }

export const unusualFlagList = {
  "0": "全部",
  "1": "漏刊",
  "2": "错刊",
  "3": "正常上刊",
  "4": "复测",
  "5": "特殊情况",
  "6": "剔除"
}

// taskType 1：京东户外广告， 2：京东线下门店，3：新潮
export const columns = (node, nodeKeyword,viewType, taskType): ProColumns<TableListItem>[] => {
  console.log(taskType)
  if (viewType == "2") {//项目整体
    return [
      {
        title: '任务名称',
        width: 100,
        dataIndex: 'taskName',
        align: 'left',
        search: false,
        
      },
      {
        title: '计划点位数',
        width: 100,
        dataIndex: 'planNum',
        align: 'left',
        search: false,
      },
      {
        title: '有效点位数',
        width: 100,
        dataIndex: 'mobile',
        align: 'left',
        search: false,
      },
      {
        title: '正常上刊点位数',
        width: 100,
        dataIndex: 'publishPointNum',
        align: 'left',
        search: false,
      },
      {
        title: '漏刊点位数',
        width: 100,
        dataIndex: 'omitPointNum',
        align: 'left',
        search: false,
      },
      {
        title: '复测点位数',
        width: 100,
        dataIndex: 'resumePointNum',
        align: 'left',
        search: false,
      },
      {
        title: '特殊情况点位数',
        width: 100,
        dataIndex: 'specialPointNum',
        align: 'left',
        search: false,
      },
      {
        title: '剔除点位数',
        width: 100,
        dataIndex: 'rejectPointNum',
        align: 'left',
        search: false,
      },
    ];
  } else {

    let columnsArr = [

      {
        title: '关键字所属项',
        key: 'field',
        hideInTable: true,
        dataIndex: 'field',
        width:100,
        renderFormItem: (item, { type, defaultRender, formItemProps, fieldProps, ...rest }, form) => {
          // form.getFieldValue('field')
          if (node)
            return node(fieldProps)
        },
      },
      {
        title: '关键词',
        width:100,
        key: 'keyword',
        hideInTable: true,
        dataIndex: 'keyword',
        renderFormItem: (item, { type, defaultRender, formItemProps, fieldProps, ...rest }, form) => {
          // console.log(item, { type, defaultRender, formItemProps, fieldProps, ...rest }, form)
          if (nodeKeyword)
            return nodeKeyword(fieldProps)
        },
      },
    ];
    if (taskType == 1) {
      columnsArr.splice(0, 0,
        {
          title: '点位编号',
          width: 100,
          dataIndex: 'point_no',
          align: 'left',
          search: false,
          fixed: 'left'
        },
        {
          title: '监测结果',
          width: 100,
          dataIndex: 'unusual_flag',
          align: 'left',
          search: true,
          fixed:  'left',
          valueEnum: unusualFlagList,
          fieldProps: {
            defaultValue: "0",
            showArrow: true
          }
        },
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
          dataIndex: 'brand_id',
          align: 'left',
          search: false,
        },
        {
          title: '事业群',
          width: 100,
          dataIndex: 'busi_group',
          align: 'left',
          search: false,
        },
        {
          title: '事业部',
          width: 100,
          dataIndex: 'busi_dept',
          align: 'left',
          search: false,
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
          dataIndex: 'city_level',
          align: 'left',
          search: false,
        },
        {
          title: '媒体类型',
          width: 100,
          dataIndex: 'media_type',
          align: 'left',
          search: false,
        },
        {
          title: '媒体点位名称',
          width: 100,
          dataIndex: 'point_name',
          align: 'left',
          search: false,
        },
        {
          title: '媒体点位地址',
          width: 260,
          dataIndex: 'point_address',
          align: 'left',
          search: false,
          // ellipsis: true,
        },
        {
          title: '媒体安装位置',
          width: 120,
          dataIndex: 'install_position',
          align: 'left',
          search: false,
        },
        // ///////////
        {
          title: '投放开始日期',
          width: 120,
          dataIndex: 'start_date',
          align: 'left',
          search: false,
        },
        {
          title: '投放结束日期',
          width: 120,
          dataIndex: 'end_date',
          align: 'left',
          search: false,
        },
        {
          title: '计划投放频次',
          width: 120,
          dataIndex: 'plan_put_freq',
          align: 'left',
          search: false,
        },
        {
          title: '监测日期',
          width: 120,
          dataIndex: 'check_date',
          align: 'left',
          search: false,
        },
        {
          title: '产品',
          width: 120,
          dataIndex: 'product',
          align: 'left',
          search: false,
        },
        {
          title: '合作电商',
          width: 120,
          dataIndex: 'cooperate_ec',
          align: 'left',
          search: false,
        },
        {
          title: '尾板/随屏',
          width: 120,
          dataIndex: 'wb_sp_flag',
          align: 'left',
          search: false,
        },
        {
          title: '广告市场（S）',
          width: 120,
          dataIndex: 'ad_duration',
          align: 'left',
          search: false,
        },
        {
          title: '合作时长（S）',
          width: 120,
          dataIndex: 'cooperate_duration',
          align: 'left',
          search: false,
        },
        {
          title: '画面占比',
          width: 120,
          dataIndex: 'pic_rate',
          align: 'left',
          search: false,
        },
        {
          title: '异常类型',
          width: 120,
          dataIndex: 'unusual_type',
          align: 'left',
          search: false,
        },
        {
          title: '备注说明',
          width: 120,
          dataIndex: 'note',
          align: 'left',
          search: false,
        },
        {
          title: '点位远景照片',
          width: 120,
          dataIndex: 'far_pic',
          align: 'left',
          search: false,
        },
        {
          title: '上刊素材照',
          width: 120,
          dataIndex: 'material_pic',
          align: 'left',
          search: false,
        },
        {
          title: '复测标记',
          width: 120,
          dataIndex: 'retest_flag',
          align: 'left',
          search: false,
        },
      )

    } else if (taskType == 2) {
      columnsArr.splice(0, 0,
        {
          title: '点位编号',
          width: 100,
          dataIndex: 'point_id',
          align: 'left',
          search: false,
          fixed: 'left'
        },
        {
          title: '监测结果',
          width: 100,
          dataIndex: 'unusual_flag',
          align: 'left',
          search: true,
          fixed:  'left',
          valueEnum: unusualFlagList,
          fieldProps: {
            defaultValue: "0",
            showArrow: true
          }
        },
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
          dataIndex: 'brand_id',
          align: 'left',
          search: false,
        },
        {
          title: '事业群',
          width: 100,
          dataIndex: 'busi_group',
          align: 'left',
          search: false,
        },
        {
          title: '事业部',
          width: 100,
          dataIndex: 'busi_dept',
          align: 'left',
          search: false,
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
          dataIndex: 'city_level',
          align: 'left',
          search: false,
          valueEnum: cityLevelEnum
        },
        {
          title: '店面名称',
          width: 260,
          dataIndex: 'shop_name',
          align: 'left',
          search: false,
          // ellipsis: true,
        },
        {
          title: '店面地址',
          width: 120,
          dataIndex: 'shop_address',
          align: 'left',
          search: false,
        },
        {
          title: '投放开始日期',
          width: 120,
          dataIndex: 'start_date',
          align: 'left',
          search: false,
        },
        {
          title: '投放结束日期',
          width: 120,
          dataIndex: 'end_date',
          align: 'left',
          search: false,
        },

        {
          title: '投放天数',
          width: 120,
          dataIndex: 'put_days',
          align: 'left',
          search: false,
        },
        {
          title: '监播日期',
          width: 120,
          dataIndex: 'check_date',
          align: 'left',
          search: false,
        },
        {
          title: '是否异常',
          width: 120,
          dataIndex: 'check_result',
          align: 'left',
          search: false,
        },
        {
          title: '错漏刊原因',
          width: 120,
          dataIndex: 'wrong_reason',
          align: 'left',
          search: false,
        },
        {
          title: '门头照',
          width: 120,
          dataIndex: 'shop_pic',
          align: 'left',
          search: false,
        },
        {
          title: '门店状态',
          width: 120,
          dataIndex: 'shop_state',
          align: 'left',
          search: false,
        },
        {
          title: '门店全景照片',
          width: 120,
          dataIndex: 'shop_full_pic',
          align: 'left',
          search: false,
        },
        {
          title: '门店是否投放京东物料',
          width: 120,
          dataIndex: 'put_jd_flag',
          align: 'left',
          search: false,
        },
        {
          title: '京东物料照片',
          width: 120,
          dataIndex: 'jd_material_pic',
          align: 'left',
          search: false,
        },
        {
          title: '备注',
          width: 120,
          dataIndex: 'note',
          align: 'left',
          search: false,
        },
        {
          title: '复测标记',
          width: 120,
          dataIndex: 'retest_flag',
          align: 'left',
          search: false,
        },
        {
          title: '复测备注',
          width: 120,
          dataIndex: 'retest_note',
          align: 'left',
          search: false,
        },
      )

    } else if (taskType == 3) {
      columnsArr.splice(0, 0, {
        title: '点位序号',
        width: 100,
        dataIndex: 'point_id',
        align: 'left',
        search: false,
      },
      {
        title: '监测结果',
        width: 100,
        dataIndex: 'check_result',
        align: 'left',
        search: true,
        fixed:  'left',
        valueEnum: unusualFlagList,
        fieldProps: {
          defaultValue: "0",
          showArrow: true
        }
      },{
        title: '品牌',
        width: 100,
        dataIndex: 'brand',
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
          dataIndex: 'city_level',
          align: 'left',
          search: false,
        },
        {
          title: '媒体类型',
          width: 100,
          dataIndex: 'media_type',
          align: 'left',
          search: false,
        },
        {
          title: '媒体点位名称',
          width: 260,
          dataIndex: 'point_name',
          align: 'left',
          search: false,
          // ellipsis: true,
        },
        {
          title: '媒体安装位置',
          width: 120,
          dataIndex: 'install_position',
          align: 'left',
          search: false,
        },
        {
          title: '计划投放开始日期',
          width: 100,
          dataIndex: 'start_date',
          align: 'left',
          search: false,
        },
        {
          title: '计划投放结束日期',
          width: 100,
          dataIndex: 'end_date',
          align: 'left',
          search: false,
        },
        {
          title: '检测日期',
          width: 120,
          dataIndex: 'check_date',
          align: 'left',
          search: false,
        },
      )
    }else if(taskType == 4){
      columnsArr.splice(0, 0,
        {
          title: '品牌',
          width: 100,
          dataIndex: 'brand',
          align: 'left',
          search: false,
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
          dataIndex: 'city_level',
          align: 'left',
          search: false,
        },
        {
          title: '媒体类型',
          width: 100,
          dataIndex: 'media_style',
          align: 'left',
          search: false,
        },
        {
          title: '位置名称',
          width: 100,
          dataIndex: 'area_name',
          align: 'left',
          search: false,
        },
        {
          title: '具体位置',
          width: 100,
          dataIndex: 'address',
          align: 'left',
          search: false,
        },
        {
          title: '楼宇名称',
          width: 100,
          dataIndex: 'building_name',
          align: 'left',
          search: false,
        },
        {
          title: '是否异常',
          width: 100,
          dataIndex: 'unusual_flag',
          align: 'left',
          search: false,
        },
        {
          title: '监测结果',
          width: 100,
          dataIndex: 'check_result',
          align: 'left',
          search: false,
        },
      )
    }

    return columnsArr
  }

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





// taskType 1：京东户外广告， 2：京东线下门店，3：新潮
export const timeTypeLists = [{ title: "YYYY-MM-DD", value: "0" }, { title: "YYYY-MM-DD hh:mm", value: "1" }, { title: "YYYY-MM-DD hh:mm:ss", value: "2" }]


export const summaryData = (data): Array => {
  const {completeRate,publishRate,omitRate,specialRate,resumeRate,errorRate,planNum,completeNum,publishPointNum, errorPointNum, omitPointNum, resumePointNum, specialPointNum, rejectPointNum}= data
  return [
    {
      name: '计划点位数(个)',
      value: planNum,
      toolTip: '',
      rateName: "",
      rate: ""
    },
    {
      name: '有效点位数(个) ',
      value: completeNum,
      toolTip: '',
      rateName: `完成率：${(completeRate*100).toFixed(2)}%`,
      rate: ""
    },
    {
      name: '正常上刊点位数(个) ',
      value: publishPointNum,
      toolTip: '',
      rateName: `正常上刊率：${(publishRate*100).toFixed(2)}%`,
      rate: ""
    },
    {
      name: '错刊点位数(个) ',
      value: errorPointNum,
      toolTip: '',
      rateName: `错刊率：${(errorRate*100).toFixed(2)}%`,
      rate: ""
    },
    {
      name: '漏刊点位数(个)  ',
      value: omitPointNum,
      toolTip: '',
      rateName: `漏刊率：${(omitRate*100).toFixed(2)}%`,
      rate: ""
    },
    {
      name: '复测点位数(个)  ',
      value: resumePointNum,
      toolTip: '',
      rateName: `复测完成率：${(resumeRate*100).toFixed(2)}%`,
      rate: ""
    },
    {
      name: '特殊情况点位数(个) ',
      value: specialPointNum,
      toolTip: '',
      rateName: `特殊情况率：${(specialRate*100).toFixed(2)}%`,
      rate: ""
    },
    {
      name: '剔除点位数(个)  ',
      value: rejectPointNum,
      toolTip: '',
      rateName: "",
      rate: ""
    },
  ]
}