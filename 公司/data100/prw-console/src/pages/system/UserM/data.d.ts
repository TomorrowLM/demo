export interface TableListItem {
  searchValue?: any;
  createBy?: any;
  createTime: string;
  updateBy?: any;
  updateTime?: any;
  remark?: any;
  params: Params;
  menuId: number;
  menuName: string;
  parentName?: any;
  parentId: number;
  orderNum: string;
  path: string;
  component?: any;
  isFrame: string;
  menuType: string;
  visible: string;
  status: string;
  perms: string;
  icon: string;
  children: any[];
}
