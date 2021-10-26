import { request } from 'umi';

/**
 * 答案详情
 */
export async function getPointAnswerDetail(taskId: String,answerId:String) {
  return request(`approve/getPointAnswerDetail?taskId=${taskId}&answerId=${answerId}`);
}

/**
 * 一审二审`approve/updateTaskAnswerTwo`
 */
export async function updateTaskAnswer(url:string,params:any) {
  return request(url,{
    method:"POST",
    data:{...params}
  });
}
/**
 * -获取用户对应任务的操作权限
 */
export async function auditTaskAuthority(taskId: String,) {
  return request(`approve/auditTaskAuthority?taskId=${taskId}`);
}