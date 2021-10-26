import { ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';

export const basicParameters = {
  // 基础条件
  name: '', // 分组名称
  revisitExclusive: '0', // 重访/排他(0 不限 1 重访 2 排他 5 超级)
  isPhoneChecked: '0', // 手机号是否验证(2 否 1 是 0 全部)
  quality: '', // 会员质量等级（0 高级 1 中级 2 低级)
  idType: '0', // ID类型(0 项目ID 1 会员ID)
  idContent: '', // ID内容
  surveyResultStatus: [], // 会员状态(0不限 1配额满 2被甄别 3已完成 多个用;链接）
}

export const whetherOptions: Array<any> = [
  {
    label: '否',
    value: '1'
  },
  {
    label: '是',
    value: '0'
  }
]

export const revisitExclusiveOptions: Array<any> = [
  {
    label: '不限',
    value: '0'
  },
  {
    label: '重访',
    value: '1'
  },
  {
    label: '排他',
    value: '2'
  }
]

export const idTypeOptions: Array<any> = [
  {
    label: '项目ID',
    value: '0'
  },
  {
    label: '会员ID',
    value: '1'
  }
]

export const isPhoneCheckedOptions: Array<any> = [
  {
    label: '全部',
    value: '0'
  },
  {
    label: '是',
    value: '1'
  },
  {
    label: '否',
    value: '2'
  }
]

export const qualityOptions: Array<any> = [
  {
    label: '超级',
    value: '5'
  },
  {
    label: '高级',
    value: '0'
  },
  {
    label: '中级',
    value: '1'
  },
  {
    label: '低级',
    value: '2'
  }
]

export const surveyResultStatusOptions: Array<any> = [
  {
    label: '不限',
    value: '0'
  },
  {
    label: '配额满',
    value: '1'
  },
  {
    label: '被甄别',
    value: '2'
  },
  {
    label: '已完成',
    value: '3'
  }
]

export const tableColumnsData = (args: Array<any>): ProColumns<TableListItem>[] => {
  return [
    {
      title: 'ID',
      width: 200,
      dataIndex: 'conditionId',
      align: 'left',
      copyable: true,
      search: false
    },
    {
      title: '组名',
      width: 200,
      dataIndex: 'conditionName',
      align: 'left',
      search: false
    },
    {
      title: '已推送数',
      width: 200,
      dataIndex: 'matchUserCount',
      align: 'left',
      search: false
    },
    ...args
  ]
}

export const statusValueEnum = {
  1: {
    text: '开启',
    status: 'processing'
  },
  0: {
    text: '暂停',
    status: 'warning'
  }
}