export interface TableListItem {
  serial: string;
  brand: string;
  busiGroup: string;
  busiDept: string;
  brandId: string;
  mediaStyle: string;
  province: string;
  city: string;
  cityLevel: string;
  mediaType: string;
  installAddress: string;
  installPosition: string;
  pointNo: string;
  cycleNum: string;
  inviteCode: string;
  agentName: string;
  firstAuditUser: string;
  secondAuditUser: string;
  auditOpinion: string;
}
    
  export interface QueryParams {
    agentName: string,
    field: string,
    firstAuditStatus: string,
    firstAuditUser: string,
    flag: string,
    inviteCode: string,
    keyword: string,
    pageNo: string,
    pageSize: string,
    pointTable: string,
    progress: string,
    secondAuditStatus: string,
    secondAuditUser: string,
    staffMobile: string,
    startDate: string,
    endDate: string,
    curTaskValue: string,
    city: string,
    cityLevel: string,
    province: string,
    field:string,
    taskId:string,
  }
  