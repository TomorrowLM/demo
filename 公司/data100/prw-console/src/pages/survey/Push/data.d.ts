export interface List {
  id: string;
  conditionId: string;
  conditionName: string;
  matchUserCount: number;
  state: number;
}

export interface TableListItem {
  list: List[];
  hasCondition: number;
  newuserIgnoreCondition: number;
  limiting: number;
  someuserShow: number;
  userRegTimeStart: string;
  userRegTimeEnd: string;
  allUserShowTime: string;
}
