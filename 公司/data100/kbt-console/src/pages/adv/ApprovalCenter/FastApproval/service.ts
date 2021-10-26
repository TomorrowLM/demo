import { request } from 'umi';

/**
 *快速审批的点位答案
 * @param params
 */
export async function queryFastPointAnswer(answerId: string) {
  return request(`approve/queryFastPointAnswer?answerId=${answerId}`, {
    method:"GET",
    // data:params
  });
}

/**
 * 快速审批的点位
 * @param params
 */

export async function queryFastPoint(params:object) {
  return request(`approve/queryFastPoint`, {
    method: "POST",
    data: params
  });
}

/**
 *二审`approve/updateTaskAnswerTwo`
 */
export async function updateTaskAnswerTwo(params:any) {
  return request(`approve/updateTaskAnswerTwo`,{
    method:"POST",
    data:{...params}
  });
}

/**
 *一审`approve/updateTaskAnswerTwo`
 */
export async function updateTaskAnswerOne(params:any) {
  return request(`approve/updateTaskAnswerOne`,{
    method:"POST",
    data:{...params}
  });
}

