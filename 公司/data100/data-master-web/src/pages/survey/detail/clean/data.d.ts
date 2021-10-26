
export interface rule {
  ruleType: string,
  state: string,
  ruleGroup?: Array<any>,
  questions?: Array<questionsItem>
}
export interface ruleGroupItem1 {
  questions: Array<questionsItem1>
}
export interface questionsItem1 {
  qid: string;
  title: string;
  questionName: string;
  subQuestionCode: string;
  lj: string;
  option: any[];
  optionList: any[];
  type?: any;
  label?: any;
  value?: any;
}
export interface submitData {
  groupId: string,//问卷组id
  ruleGroupId: string,//清洗组id
  rule1: {
    ruleType: string,
    state: string,
    ruleGroup: Array<ruleGroupItem1>,
  },
  rule2: {
    ruleType: string,
    state: string,
    questions: Array<questionsItem>
  },
  rule3: {
    ruleType: string,
    state: string,
    questions: Array<questionsItem>
  },
  rule4: {
    ruleType: string,
    state: string,
    ruleGroup: Array<ruleGroupItem1>,
  },
  rule5: {
    ruleType: string,
    state: string,
    ruleGroup: Array<ruleGroupItem1>,
  },
}

export interface questionItem {
  qid: string,
  questionName: string,
  questionOrder: string,
  subQuestionCode: string,
  subQuestionOrder: string,
  title: string,
  type: string,
}

export interface questionListItem {
	qid: string;
	questionName: string;
	title: string;
	type: string;
	countWords: string;
	questionType: string;
	questionOrder: number;
	subQuestionOrder: string;
	subQuestionCode: string;
	questionGroupId: number;
	optionList?: any;
  lable?:string,
  value?:string,
}