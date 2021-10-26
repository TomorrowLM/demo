const basicData = {
  improveInfoText: '完善信息',
  invitationCenterText: '邀请中心',
  downloadAppText: '下载APP，参与更多金币任务',
  appIntroduceList: [
    {
      img: require('../../assets/images/user/ic1@2x.png'),
      title: '每日签到',
      content: '领取金币和问卷<span>奖励翻倍卡</span>'
    },
    {
      img: require('../../assets/images/user/ic2@2x.png'),
      title: '每日任务',
      content: '完成问卷<span>领额外奖励</span>'
    },
    {
      img: require('../../assets/images/user/ic3@2x.png'),
      title: '社区活动',
      content: '回复帖子<span>赢金币</span>'
    }
  ],
  basicUserInfo: [
    {
      title: '性别',
      value: '',
      code: '',
      columns: [],
      columnType: 'sex',
      paramsType: 'gender',
      componentType: 'picker'
    },
    {
      title: '出生年份',
      value: '',
      paramsType: 'birthDay',
      componentType: 'datetime'
    },
    {
      title: '所在城市',
      value: '',
      province: '',
      provinceCode: '110000',
      city: '',
      cityCode: '',
      componentType: 'area'
    },
    {
      title: '学历',
      value: '',
      code: '',
      columns: [],
      columnType: 'education',
      paramsType: 'education',
      componentType: 'picker'
    },
    {
      title: '工作状况',
      value: '',
      code: '',
      columns: [],
      columnType: 'work',
      paramsType: 'work',
      componentType: 'picker'
    },
    {
      title: '所在行业',
      value: '',
      code: '',
      columns: [],
      columnType: 'industry',
      paramsType: 'industry',
      componentType: 'picker'
    },
    {
      title: '职业',
      value: '',
      code: '',
      columns: [],
      columnType: 'occupation',
      paramsType: 'occupation',
      componentType: 'picker'
    },
    {
      title: '月薪',
      value: '',
      code: '',
      columns: [],
      columnType: 'salary',
      paramsType: 'salary',
      componentType: 'picker'
    },
    {
      title: '家庭收入',
      value: '',
      code: '',
      columns: [],
      columnType: 'income',
      paramsType: 'income',
      componentType: 'picker'
    },
    {
      title: '是否接受电话访问',
      value: '',
      code: '',
      columns: [],
      columnType: 'visit',
      paramsType: 'visit',
      componentType: 'picker'
    }
  ]
}

export default basicData