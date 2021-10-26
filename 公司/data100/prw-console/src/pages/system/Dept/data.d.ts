export interface TableListItem {
  searchValue?: any;
  createBy: string;
  createTime: string;
  updateBy?: any;
  updateTime?: any;
  remark?: any;
  params: Params;
  deptId: number;
  parentId: number;
  ancestors: string;
  deptName: string;
  orderNum: string;
  leader: string;
  phone: string;
  email: string;
  status: string;
  delFlag: string;
  parentName?: any;
  children: any[];
}
