import { ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';
import { isXsScreen } from '@/utils/utils';

export const templateFiles={
 '1':'/template/jd_outdoor.xlsx',
 '2':'/template/jd_offline.xlsx',
 '3':'/template/xc.xlsx',
 "4":'/template/通用模板.xlsx'
}

export const updateTypeOptions= [
    {value:'1',label:'全量'},
    {value:'2',label:'增量'}
]

//TODO:添加全
export const fieldEnmu= {
  "serial":"项目编号",
  "province":"省",
  "city":"城市",
}

//京东户外广告
export const tableColumnsData1 = (args: Array<any>): ProColumns<TableListItem>[] => {
  return [
    {
      title: '查询条件',
      dataIndex: 'field',
      hideInTable:true,
      search:true,
      valueEnum: {
        ...fieldEnmu,
        'install_address':"媒体点位地址",
        'install_position':'媒体安装位置'
      }
    },
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable:true,
      search:true
    },
    {
      title: '点位编号',
      width: 120,
      dataIndex: 'serial',
      search: false
    },
    {
      title: '品牌',
      width: 120,
      dataIndex: 'brand',
      search: false
    },
    {
      title: '品牌ID',
      width: 120,
      dataIndex: 'brandId',
      search: false
    },
    {
      title: '事业群',
      width: 120,
      dataIndex: 'busiGroup',
      search: false
    },
    {
      title: '事业部',
      width: 120,
      dataIndex: 'busiDept',
      search: false
    },
    {
      title: '媒体形式',
      width: 120,
      dataIndex: 'mediaStyle',
      search: false
    },
    {
      title: '省',
      width: 100,
      dataIndex: 'province',
      search: false
    },
    {
      title: '城市',
      width: 100,
      dataIndex: 'city',
      search: false
    },
    {
      title: '城市级别',
      width: 100,
      dataIndex: 'cityLevel',
      search: false
    },
    {
      title: '媒体类型',
      width: 100,
      dataIndex: 'mediaType',
      search: false
    },
    {
      title: '媒体点位地址',
      width: 100,
      dataIndex: 'installAddress',
      search: false
    },
    {
      title: '媒体安装位置',
      width: 100,
      dataIndex: 'installPosition',
      search: false
    },
    {
      title: '楼宇名称',
      width: 100,
      dataIndex: 'buildingName',
      search: false
    },
    {
      title: '城区',
      width: 100,
      dataIndex: 'district',
      search: false
    },
    {
      title: '楼栋',
      width: 100,
      dataIndex: 'buildingNum',
      search: false
    },
    {
      title: '单元',
      width: 100,
      dataIndex: 'buildingUnit',
      search: false
    },
    {
      title: '电梯编号',
      width: 100,
      dataIndex: 'liftNum',
      search: false
    },
    {
      title: '开始日期',
      width: 100,
      dataIndex: 'startDate',
      search: false
    },
    {
      title: '结束日期',
      width: 100,
      dataIndex: 'endDate',
      search: false
    },
    {
      title: '是否在刊',
      width: 100,
      dataIndex: 'publishFlag',
      search: false
    },
    {
      title: '发布频次',
      width: 100,
      dataIndex: 'publishFreq',
      search: false
    },
    {
      title: '点位数量',
      width: 100,
      dataIndex: 'pointNum',
      search: false
    },
    {
      title: '循环次数',
      width: 100,
      dataIndex: 'cycleNum',
      search: false
    },
    // {
    //   title: '备注',
    //   width: 100,
    //   dataIndex: 'city',
    //   search: false
    // },
    // {
    //   title: '媒体商',
    //   width: 100,
    //   dataIndex: 'city',
    //   search: false
    // },
    {
      title: '排除点位',
      width: 100,
      dataIndex: 'excludeFlag',
      search: false
    },
    {
      title: '编辑用户',
      width: 100,
      dataIndex: 'userName',
      search: false
    },
    // {
    //   title: '更新时间',
    //   width: 100,
    //   dataIndex: 'city',
    //   search: false
    // },
  ];
};

//京东线下门店
export const tableColumnsData2 = (args: Array<any>): ProColumns<TableListItem>[] => {
  return [
    {
      title: '查询条件',
      dataIndex: 'field',
      hideInTable:true,
      search:true,
      valueEnum: {
        ...fieldEnmu,
        'shop_address':"店面地址",
      }
    },
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable:true,
      search:true
    },
    {
      title: '点位编号',
      width: 120,
      dataIndex: 'serial',
      search: false
    },
    {
      title: '品牌',
      width: 120,
      dataIndex: 'brand',
      search: false
    },
    {
      title: '品牌ID',
      width: 120,
      dataIndex: 'brandId',
      search: false
    },
    {
      title: '事业群',
      width: 120,
      dataIndex: 'busiGroup',
      search: false
    },
    {
      title: '事业部',
      width: 120,
      dataIndex: 'busiDept',
      search: false
    },
    {
      title: '省',
      width: 100,
      dataIndex: 'province',
      search: false
    },
    {
      title: '城市',
      width: 100,
      dataIndex: 'city',
      search: false
    },
    {
      title: '城市级别',
      width: 100,
      dataIndex: 'cityLevel',
      search: false
    },
    {
      title: '店面类型',
      width: 100,
      dataIndex: 'shopType',
      search: false
    },
    {
      title: '店面名称',
      width: 100,
      dataIndex: 'shopName',
      search: false
    },
    {
      title: '店面地址',
      width: 100,
      dataIndex: 'shopAddress',
      search: false
    },
    {
      title: '展示元素',
      width: 100,
      dataIndex: 'displayElement',
      search: false
    },
    {
      title: '投放开始日期',
      width: 100,
      dataIndex: 'startDate',
      search: false
    },
    {
      title: '投放结束日期',
      width: 100,
      dataIndex: 'endDate',
      search: false
    },
    {
      title: '投放天数',
      width: 100,
      dataIndex: 'putDays',
      search: false
    },
    // {
    //   title: '备注',
    //   width: 100,
    //   dataIndex: 'city',
    //   search: false
    // },
    {
      title: '排除点位',
      width: 100,
      dataIndex: 'excludeFlag',
      search: false
    },
  ];
};

export const tableColumnsData3 = (args: Array<any>): ProColumns<TableListItem>[] => {
  return [
    {
      title: '项目编号',
      width: 120,
      dataIndex: 'serial',
      search: false
    },
    {
      title: '省',
      width: 100,
      dataIndex: 'province',
      search: false
    },
    {
      title: '城市',
      width: 100,
      dataIndex: 'city',
      search: false
    },
    {
      title: '城市级别',
      width: 100,
      dataIndex: 'cityLevel',
      search: false
    },
    {
      title: '任务全部回收点位数量',
      width: 150,
      dataIndex: 'allNum',
      search: false
    },
    {
      title: '任务全部正常上刊点位数量',
      width: 180,
      dataIndex: 'allNormalNum',
      search: false
    },
    {
      title: '单小区最多点位数量',
      width: 150,
      dataIndex: 'singleNum',
      search: false
    },
    {
      title: '单小区正常上刊最多点位数量',
      width: 180,
      dataIndex: 'singleNormalNum',
      search: false
    },
    {
      title: '项目名称',
      width: 150,
      dataIndex: 'projectName',
      search: false
    },
    {
      title: '行政区域',
      width: 150,
      dataIndex: 'district',
      search: false
    },
    {
      title: '详细地址',
      width: 320,
      dataIndex: 'address',
      search: false
    },
    {
      title: '物业类型',
      width: 150,
      dataIndex: 'propertyType',
      search: false
    },
    {
      title: '总户数',
      width: 100,
      dataIndex: 'totalDoorNum',
      align: 'left',
      search: false
    },
    // {
    //   title: '总入驻企业数',
    //   width: 100,
    //   dataIndex: 'address',
    //   align: 'left',
    //   search: false
    // },
    // {
    //   title: '日均人流量',
    //   width: 100,
    //   dataIndex: 'address',
    //   align: 'left',
    //   search: false
    // },
    {
      title: '最低楼层',
      width: 100,
      dataIndex: 'lowestFloor',
      align: 'left',
      search: false
    },
    {
      title: '最高楼层',
      width: 100,
      dataIndex: 'uppermostFloor',
      align: 'left',
      search: false
    },
    {
      title: '停车位',
      width: 100,
      dataIndex: 'parkSpace',
      align: 'left',
      search: false
    },
    {
      title: '建筑面积(平方米)',
      width: 150,
      dataIndex: 'floorArea',
      align: 'left',
      search: false
    },
    {
      title: '入住率%',
      width: 100,
      dataIndex: 'occupancyRate',
      align: 'left',
      search: false
    },
    {
      title: '覆盖人数',
      width: 100,
      dataIndex: 'coverPeopleNum',
      align: 'left',
      search: false
    },
    {
      title: '物业费(元/平米/月)',
      width: 150,
      dataIndex: 'propertyFee',
      align: 'left',
      search: false
    },
    {
      title: '平均售价(元/平米)',
      width: 150,
      dataIndex: 'avgPrice',
      align: 'left',
      search: false
    },
    {
      title: '竟忌行业',
      width: 100,
      dataIndex: 'tabooTrade',
      align: 'left',
      search: false
    },
    {
      title: '楼栋',
      width: 100,
      dataIndex: 'buildingNum',
      align: 'left',
      search: false
    },
    {
      title: '单元',
      width: 100,
      dataIndex: 'buildingUnit',
      align: 'left',
      search: false
    },
    {
      title: '电梯位置',
      width: 100,
      dataIndex: 'liftPosition',
      align: 'left',
      search: false
    },
    {
      title: '设备尺寸',
      width: 150,
      dataIndex: 'equipmentSize',
      align: 'left',
      search: false
    },
    {
      title: '分贝描述',
      width: 100,
      dataIndex: 'decibelNote',
      align: 'left',
      search: false
    },
    {
      title: '电梯用途',
      width: 100,
      dataIndex: 'liftUse',
      align: 'left',
      search: false
    },
    {
      title: '位置属性',
      width: 150,
      dataIndex: 'positionAttribute',
      align: 'left',
      search: false
    },
    {
      title: '点位状态',
      width: 100,
      dataIndex: 'pointState',
      align: 'left',
      search: false
    },
    {
      title: '媒体终端编号',
      width: 150,
      dataIndex: 'terminalId',
      align: 'left',
      search: false
    },
    {
      title: '温馨提示',
      width: 180,
      dataIndex: 'tips',
      align: 'left',
      search: false
    },
    {
      title: '排除点位',
      width: 100,
      dataIndex: 'excludeFlag',
      align: 'left',
      search: false
    },
    {
      title: '编辑用户',
      width: 100,
      dataIndex: 'userName',
      align: 'left',
      search: false
    },
    {
      title: '更新时间',
      width: 150,
      dataIndex: 'editTime',
      align: 'left',
      search: false
    },
    {
      title: '查询条件',
      dataIndex: 'field',
      hideInTable:true,
      search:true,
      valueEnum: {
        ...fieldEnmu,
        'address':"详细地址",
      }
    },
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable:true,
      search:true
    }
  ];
};

export const tableColumnsData4 = (args: Array<any>): ProColumns<TableListItem>[] => {
  return [
    {
      title: '编号',
      width: 120,
      dataIndex: 'serial',
      search: false
    },
    {
      title: '品牌',
      width: 120,
      dataIndex: 'brand',
      search: false
    },
    {
      title: '媒体形式',
      width: 120,
      dataIndex: 'mediaStyle',
      search: false
    },
    {
      title: '省份',
      width: 100,
      dataIndex: 'province',
      search: false
    },
    {
      title: '城市',
      width: 100,
      dataIndex: 'city',
      search: false
    },
    {
      title: '城区',
      width: 100,
      dataIndex: 'district',
      search: false
    },
    {
      title: '城市级别',
      width: 100,
      dataIndex: 'cityLevel',
      search: false
    },
    {
      title: '位置名称',
      dataIndex: 'areaName',
      search: false
    },
    {
      title: '具体位置',
      dataIndex: 'address',
      search: false
    },
    {
      title: '楼宇名称',
      width: 100,
      dataIndex: 'buildingName',
      search: false
    },
    {
      title: '点位描述',
      width: 100,
      dataIndex: 'pointInfo',
      search: false
    },
    {
      title: '计划回收数',
      width: 100,
      dataIndex: 'planNum',
      search: false
    },
    {
      title: '创建人',
      width: 100,
      dataIndex: 'userName',
      search: false
    },
    {
      title: '创建时间',
      width: 100,
      dataIndex: 'createTime',
      search: false
    },
    {
      title: '查询条件',
      dataIndex: 'field',
      hideInTable:true,
      search:true,
      valueEnum: {
        ...fieldEnmu,
        'address':"具体位置",
      }
    },
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable:true,
      search:true
    }
  ]
}


export const tableColumnsDatas={
 '1':tableColumnsData1,
 '2':tableColumnsData2,
 '3':tableColumnsData3,
 '4':tableColumnsData4,
}