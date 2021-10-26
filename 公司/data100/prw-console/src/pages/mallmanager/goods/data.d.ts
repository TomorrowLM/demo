export interface TableListItem {
  surveyId: string;
  status: number;
  surveyName: string;
  projectId: string;
  surveyKind: string;
  surveyAttribution: string;
  slsSurveyId: string;
  createTime: string;
  createAdmin: string;
  actionline: string;
  deadline: string;
  shareCount: number;
  shareAdduserCount: number;
  successAmountSum: string;
  failAmountSum: string;
  successDollarSum: string;
  failDollarSum: string;
  successGoldSum: number;
  projectGoldSum: number;
  failGoldSum: number;
  successCount: number;
  failCount: number;
  screenoutCount: number;
  quota: number;
  participateCount: number;
  submitCount: number;
  ir: string;
  department: string;
  isTop: string;
  isPc: string;
  isHot: string;
  onlineTime?: any;
  language: string;
  projectName: string;
  orderId?: any;
  startTime?: any;
  endTime?: any;
  successGold: string;
  failGold?: any;
  joinCount: number;
  qualifiedCount: number;
  isNovice: number;
}

export interface QueryParams {
  createAdminId: string;
  departmentCode: string;
  current: number;
  end: string;
  pageSize: number;
  status: string;
  isTop: string;
  start: string;
  surveyId: string;
  surveyName: string;
  slsSurveyId: string;
}
