export interface TableListItem {
  mainPic: any;
  taskName: string;
  taskId: string;
  taskType: string;
  agent: string;
  brand: string;
  pointFile: string;
  pointUploadMsg: string;
  pointProgress: number;
  putStartDate: string;
  putEndDate: string;
  execStartDate: string;
  execEndDate: string;
  taskStatus: string;
  auditProgress: string;
}
  
export interface QueryParams {
  projectId: string;
  taskName: string;
}