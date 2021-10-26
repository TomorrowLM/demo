export interface TableListItem {
  searchValue?: any;
  createBy?: any;
  createTime?: any;
  updateBy?: any;
  updateTime?: any;
  remark?: any;
  params: Params;
  operId: number;
  title: string;
  businessType: number;
  businessTypes?: any;
  method: string;
  requestMethod: string;
  operatorType: number;
  operName: string;
  deptName?: any;
  operUrl: string;
  operIp: string;
  operLocation: string;
  operParam: string;
  jsonResult: string;
  status: number;
  errorMsg?: any;
  operTime: string;
}

export interface OperDetails {
  label: string,
  value: string | string[],
  type: string,
  tips: string,
}