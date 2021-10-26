// 文字报告页面列表，item
export interface DataReportItem {
  fileUrl: string;
  name: string;
  status: number;
  surveyGroup: string;
  textReportId?: string;
  createTime: string,
  // 文件扩展名，
  extraName: string,
}
