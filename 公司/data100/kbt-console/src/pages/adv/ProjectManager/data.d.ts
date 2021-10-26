export interface TableListItem {
  customerName: string;
  projectName: string;
  projectId: string;
  taskNum: string;
  createTime: string;
}
  
export interface QueryParams {
  startTime: string;
  endTime: string;
  projectName: string;
  customerIds: string;
}
