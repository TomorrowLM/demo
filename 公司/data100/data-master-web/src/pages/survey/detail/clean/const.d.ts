
import {uniKey} from "@/utils/utils"
export const defaultData = {
  groupId: '',//问卷组id
  rule1: {
    ruleType: '1',
    state: "0",
    ruleGroup: [
      {
        questions: [
          {
            qid: "",
            title: "",
            questionName: "",
            optionList:[],
            subQuestionCode: "",
            lj: "0",//'0'无 "1 或| 2 且",
            option: [
              // { code: "", name: "" },
            ]
          }
        ]
      }
    ]
  },
  rule2: {
    ruleType: '2',
    state: "0",
    questions: [
      {
        qid: "",
        title: "",
        questionName: "",
        optionList:[],
        subQuestionCode: "",
        bj: "",//选择选项个数比较类型 1 大于 2 小于 3 大于等于 4 小于等于 5 不等于
        number: '0',
      }
    ]
  },
  rule3: {
    ruleType: '3',
    state: "0",
    questions: [
      {
        qid: "",
        title: "",
        questionName: "",
        optionList:[],
        subQuestionCode: "",
      }
    ]
  },
  rule4: {
    ruleType: '4',
    state: "0",
    ruleGroup: [
      {
        questions: [
          // {
          //   qid: "",
          //   title: "",
          //   optionList:[],
          //   questionName: "",
          //   subQuestionCode: "",
          // }
        ]
      }
    ]

  },
  rule5: {
    ruleType: '5',
    state: "0",
    ruleGroup: [
      {
        questions: [
          // {
          //   qid: "",
          //   title: "",
          //   optionList:[],
          //   questionName: "",
          //   subQuestionCode: "",
          // }
        ]
      }
    ]

  },
}

export const luojiguanxiEnum = {
  "0": "无",
  "1": "或",
  "2": "且",
}
//1 大于 2 小于 3 大于等于 4 小于等于 5 不等于",
export const optionNumEnum = {
  '1': "大于",
  '2': "小于",
  '3': "大于等于",
  '4': "小于等于",
  // '5': "不等于",
}

export const radioEnum = {
  '0': "否",
  '1': '是'
}

export const stateEnum = {
  
  '1': '未清洗',
  '2': "清洗中",
  '3': "清洗完毕",
  '4': "清洗失败",
}

