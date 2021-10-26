declare namespace API {
  export interface CurrentUser {
    permissions: Array<string>,
    roles: Array<string>,
    user: {
      searchValue?: any;
      createBy: string;
      createTime: string;
      updateBy?: any;
      updateTime?: any;
      remark: string;
      params: Params;
      userId: number;
      deptId: number;
      userName: string;
      nickName: string;
      email: string;
      phonenumber: string;
      sex: string;
      avatar: string;
      salt?: any;
      status: string;
      delFlag: string;
      loginIp: string;
      loginDate: Date;
      dept: Dept;
      roles: Role[];
      roleIds?: any;
      postIds?: any;
      admin: boolean;
    }
  }

  export interface LoginStateType {
    code?: number;
    msg?: string;
    token?: string;
  }

  export interface LoginAccount {
    username?: string;
    password?: string;
  }

  export interface DownloadCenterData {
    records: any[];
    total: number;
    size: number;
    current: number;
    orders: any[];
    optimizeCountSql: boolean;
    hitCount: boolean;
    searchCount: boolean;
    pages: number;
  }
}