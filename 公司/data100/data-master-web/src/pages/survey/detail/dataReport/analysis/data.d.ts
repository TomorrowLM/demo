export interface dataListItem {
	id: number;
	groupId: string;
	userId: string;
	name: string;
	state: number;
	createTime: string;
	updataTime?: any;
	info?: any;
	type: number;
	crossType: number;
	approvalNo?: any;
}

/** SpanRect 用于描述合并单元格的边界
 * 注意 top/left 为 inclusive，而 bottom/right 为 exclusive */
 export interface SpanRect {
  top: number
  bottom: number
  left: number
  right: number
}
export interface deliverRuleItem {
	ruleGroupId: number;
	ruleGroupName: string;
}

export interface asyncData{
	ruleGroupId?: number,
	reportName:string,
	state:string,
	questionLists?:any,
}