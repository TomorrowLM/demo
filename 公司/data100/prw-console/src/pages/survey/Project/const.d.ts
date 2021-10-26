import { ProColumns } from '@ant-design/pro-table';
import { isXsScreen } from '@/utils/utils';
import { TableListItem } from './data';

export const columns = (departmentValueEnum: Object, createAdminValueEnum: Object, status: Object, createTime: Object, topping: Object): ProColumns<TableListItem>[] => {
  return [
    {
      title: '问卷名称',
      width: 200,
      dataIndex: 'surveyName',
      align: 'left',
      copyable: true,
      order: 8,
      fixed: isXsScreen ? '' : 'left'
    },
    {
      title: '问卷ID',
      width: 200,
      dataIndex: 'surveyId',
      align: 'left',
      copyable: true,
      order: 9
    },
    status,
    {
      title: '问卷分类',
      width: 100,
      dataIndex: 'surveyKind',
      align: 'left',
      search: false,
    },
    // {
    //   title: '问卷归属',
    //   width: 100,
    //   dataIndex: 'surveyAttribution',
    //   align: 'left',
    //   search: false,
    // },
    {
      title: '手拉手ID',
      width: 100,
      dataIndex: 'slsSurveyId',
      align: 'left',
      order: 10,
    },
    createTime,
    {
      title: '创建人',
      width: 100,
      dataIndex: 'createAdmin',
      align: 'left',
      order: 3,
      valueEnum: createAdminValueEnum,
      fieldProps: {
        mode: 'tags',
        optionFilterProp: 'label',
        showArrow: true,
        showSearch: true
      }
    },
    {
      title: '预计上线时间',
      width: 150,
      dataIndex: 'actionline',
      align: 'left',
      search: false,
    },
    {
      title: '预计截止时间',
      width: 150,
      dataIndex: 'deadline',
      align: 'left',
      search: false,
    },
    {
      title: '答题成功金币',
      width: 100,
      dataIndex: 'successGold',
      align: 'left',
      search: false,
    },
    {
      title: '分享次数',
      width: 100,
      dataIndex: 'shareCount',
      align: 'left',
      search: false,
    },
    {
      title: '分享新增会员量',
      width: 100,
      dataIndex: 'shareAdduserCount',
      align: 'left',
      search: false,
    },
    {
      title: '通过分享参与人数',
      width: 100,
      dataIndex: 'joinCount',
      align: 'left',
      search: false,
    },
    {
      title: '通过分享合格人数',
      width: 100,
      dataIndex: 'qualifiedCount',
      align: 'left',
      search: false,
    },
    {
      title: '合格红包数量',
      width: 100,
      dataIndex: 'successCount',
      align: 'left',
      search: false,
    },
    {
      title: '不合格红包数量',
      width: 100,
      dataIndex: 'failCount',
      align: 'left',
      search: false,
    },
    {
      title: '合格金币总数',
      width: 100,
      dataIndex: 'successGoldSum',
      align: 'left',
      search: false,
    },
    {
      title: '归属项目金币数',
      width: 100,
      dataIndex: 'projectGoldSum',
      align: 'left',
      search: false,
    },
    {
      title: '不合格金币总数',
      width: 100,
      dataIndex: 'failGoldSum',
      align: 'left',
      search: false,
    },
    {
      title: '预计合格量',
      width: 100,
      dataIndex: 'quota',
      align: 'left',
      search: false,
    },
    {
      title: '参与量',
      width: 100,
      dataIndex: 'participateCount',
      align: 'left',
      search: false,
    },
    {
      title: '提交量',
      width: 100,
      dataIndex: 'submitCount',
      align: 'left',
      search: false,
    },
    {
      title: '合格量',
      width: 100,
      dataIndex: 'successCount',
      align: 'left',
      search: false
    },
    {
      title: 'IR',
      width: 100,
      dataIndex: 'ir',
      align: 'left',
      search: false,
    },
    {
      title: '隶属事业部',
      width: 150,
      dataIndex: 'department',
      align: 'left',
      order: 6,
      valueEnum: departmentValueEnum,
      fieldProps: {
        optionFilterProp: 'label',
        showSearch: true
      }
    },
    topping,
    {
      title: '只可在PC端答题',
      width: 120,
      dataIndex: 'isPc',
      align: 'left',
      search: false,
    },
  ];
};


export const statusValueEnum = {
  0: {
    text: '开启',
    status: 'processing'
  },
  1: {
    text: '暂停',
    status: 'warning'
  },
  2: {
    text: '结束',
    status: 'error'
  },
  3: {
    text: '预发布',
    status: 'success'
  }
}

export const toppingValueEnum = {
  '0': {
    text: '否',
    status: 'default'
  },
  '1': {
    text: '是',
    status: 'success'
  }
}

export const reinviteUserEnum = {
  'surveyBeforeScreen':7,
  'screen':2,
  'quota':3
}