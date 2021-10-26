export interface ReportDetail {
  name: string;
  fileUrl: string;
  status: number;
  canApproval?: number;
  cannotApprovalMsg?: string;
  applyUser: ApplyUser;
  approvalUser: ApplyUser[];
}

export interface ApplyUser {
  name: string;
  avatar: string;
  status?: string;//1:审批中 2：同意  3：驳回
  time?: string;
}
