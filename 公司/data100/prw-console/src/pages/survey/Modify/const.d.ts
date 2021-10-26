import { GeneralFormColumnsItem } from '@/components/Form';

const isTest = window.location.origin === "https://consolecs.pinrenwu.cn" || window.location.origin === "https://consolepre.pinrenwu.cn";

export const initParams = {
  surveyName: '',
  projectName: '',
  slsSurveyId: '',
  surveyUrl: '',
  surveyKind: 0,
  isNovice: 0,
  isSurveycool: 0,
  surveyAttribution: '',
  onlinePort: [],
  answerTimeStart: '',
  answerTimeEnd: '',
  departmentCode: '',
  actionline: '',
  deadline: '',
  quota: '',
  successGold: '',
  isCanShare: 0,
  isPc: 0,
  hasWelcome: 0,
  require: '',
  hasBeforeQuestion: 0
}

export const initBeforeQueParams = {
  hasCityCondition: 0,
  hasGenderCondition: 0,
  genderCondition: 1,
  hasAgeCondition: 0,
  ageStart: '15',
  ageEnd: '30',
  failDescription: '很抱歉你不符合本次调研的条件，请点击返回问卷列表参与其它调研。',
  addressSelect: []
}

export const initSubmitBeforeQueParams = {
  hasCityCondition: 0,
  hasGenderCondition: 0,
  genderCondition: 1,
  hasAgeCondition: 0,
  ageCondition: '',
  failDescription: '很抱歉你不符合本次调研的条件，请点击返回问卷列表参与其它调研。',
  cityCondition: ''
}

export const surveyFormColumns = (surveyAttributionOptions: Array<any>, departmentOptions: Array<any>, requireColumn?: Object | null): Array<GeneralFormColumnsItem> => {
  return [
    {
      name: 'surveyName',
      label: '问卷名称',
      type: 'INPUT',
      placeholder: '请输入问卷名称',
      rules: [{ required: true, message: '请输入问卷名称!' }],
      colSpan: 12,
      colXs: 24,
    },
    {
      name: 'projectName',
      label: '项目名称',
      type: 'INPUT',
      placeholder: '请输入项目名称',
      rules: [{ required: true, message: '请输入项目名称!' }],
      colSpan: 12,
      colXs: 24,
    },
    {
      name: 'slsSurveyId',
      label: '手拉手ID',
      type: 'INPUT',
      placeholder: '请输入手拉手ID',
      rules: [
        { required: true, message: '请输入手拉手ID!' },
      ],
      colSpan: 12,
      colXs: 24,
    },
    {
      name: 'surveyUrl',
      label: '问卷链接',
      type: 'INPUT',
      placeholder: '请输入问卷链接',
      rules: [
        { required: true, message: '问卷链接!' },
        { pattern: isTest ? /^(https:\/\/(apislstest.taidu8.com|survey.taidu8.com)\/survey\/survey\/)[0-9]+(\/before.do)$/ : /^(https:\/\/(survey.taidu8.com)\/survey\/survey\/)[0-9]+(\/before.do)$/, message: '请输入正确的手拉手链接！' }
      ],
      colSpan: 12,
      colXs: 24,
    },
    {
      name: 'surveyKind',
      label: '问卷分类',
      type: 'RADIO',
      colSpan: 8,
      colXs: 24,
      options: [
        {
          label: '商业问卷',
          value: 0
        },
        {
          label: '内投问卷',
          value: 1
        }
      ]
    },
    {
      name: 'isNovice',
      label: '是否为新手问卷',
      type: 'RADIO',
      colSpan: 8,
      colXs: 24,
      options: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ]
    },
    {
      name: 'isSurveycool',
      label: '是否surveycool编程问卷',
      type: 'RADIO',
      colSpan: 8,
      colXs: 24,
      options: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ]
    },
    // {
    //   name: 'surveyAttribution',
    //   label: '问卷归属',
    //   type: 'RADIO',
    //   rules: [{ required: true, message: '请选择问卷归属!' }],
    //   colSpan: 24,
    //   colXs: 24,
    //   options: surveyAttributionOptions
    // },
    {
      name: 'onlinePort',
      label: '问卷上线端口',
      type: 'CHECKBOX',
      rules: [{ required: true, message: '请选择问卷上线端口!' }],
      colSpan: 24,
      colXs: 24,
      layout: 'horizontal',
      options: [
        {
          label: '拼任务APP',
          value: 0
        },
        {
          label: 'PC端',
          value: 1
        },
        {
          label: '公众号',
          value: 2
        },
        // {
        //   label: '小程序',
        //   value: 3
        // },
        {
          label: 'H5端',
          value: 4
        },
        {
          label: '信息流',
          value: 5
        }
      ]
    },
    {
      siteName: ['answerTimeStart', 'answerTimeEnd'],
      label: '成功完成问卷预估耗时',
      type: 'INPUT_SITE',
      siteRules: [
        [{ required: true, message: '请输入!' }],
        [{ required: true, message: '请输入!' }]
      ],
      colSpan: 8,
      colXs: 24,
    },
    {
      name: 'departmentCode',
      label: '隶属事业部',
      type: 'SELECT',
      placeholder: '请选择隶属事业部',
      rules: [{ required: true, message: '请选择隶属事业部!' }],
      colSpan: 8,
      colXs: 24,
      options: departmentOptions
    },
    {
      name: 'actionline',
      label: '预计上线时间',
      type: 'DATE_PICKER',
      placeholder: '请选择预计上线时间',
      rules: [{ required: true, message: '请选择预计上线时间!' }],
      colSpan: 8,
      colXs: 24,
    },
    {
      name: 'deadline',
      label: '预计截止时间',
      type: 'DATE_PICKER',
      placeholder: '请选择预计截止时间',
      rules: [{ required: true, message: '请选择预计截止时间!' }],
      colSpan: 8,
      colXs: 24,
    },
    {
      name: 'quota',
      label: '预计合格数量',
      type: 'INPUT_NUM',
      placeholder: '请输入预计合格数量',
      rules: [{ required: true, message: '请输入预计合格数量!' }],
      colSpan: 8,
      colXs: 24,
    },
    {
      name: 'successGold',
      label: '答题成功奖励金币',
      type: 'INPUT_NUM',
      placeholder: '请输入答题成功奖励金币',
      rules: [{ required: true, message: '请输入答题成功奖励金币!' }],
      tip: '1元=100金币',
      colSpan: 8,
      colXs: 24,
    },
    {
      name: 'isCanShare',
      label: '是否可通过分享答题',
      type: 'RADIO',
      colSpan: 8,
      colXs: 24,
      options: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ]
    },
    {
      name: 'isPc',
      label: '只可在PC端答题',
      type: 'RADIO',
      colSpan: 8,
      colXs: 24,
      options: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ]
    },
    {
      name: 'hasWelcome',
      label: '设置欢迎页',
      type: 'RADIO',
      colSpan: 24,
      colXs: 24,
      options: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ]
    },
    requireColumn,
    {
      name: 'hasBeforeQuestion',
      label: '设置前置题目',
      type: 'RADIO',
      colSpan: 8,
      colXs: 24,
      options: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ]
    }
  ]
}

export const requireColumn = {
  name: 'require',
  label: '欢迎页基本要求',
  type: 'TEXT_AREA',
  placeholder: '请输入欢迎页基本要求',
  rules: [{ required: true, message: '请输入欢迎页基本要求!' }],
  colSpan: 24,
  colXs: 24,
}

export const qualifiedRangeOpts = [
  {
    label: '添加合格范围',
    value: 1
  },
  {
    label: '不添加合格范围',
    value: 0
  }
]

export const eligibleGenderOpts = [
  {
    label: '仅男性',
    value: 1
  },
  {
    label: '仅女性',
    value: 2
  }
]

export const deviceSwitchOptions = [
  {
    label: '是',
    value: 1
  },
  {
    label: '否',
    value: 0
  }
]

export const deviceTypeOptions = [
  {
    label: '访问限制',
    value: 1
  },
  {
    label: '返回限制',
    value: 2
  },
  {
    label: '成功完成返回限制',
    value: 3
  }
]