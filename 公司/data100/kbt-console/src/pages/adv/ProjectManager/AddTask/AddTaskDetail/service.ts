import { request } from 'umi';

export async function getTaskList(params: Object) {
  return request('task/queryList', {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function getCustomerPublishTask(customerId:any) {
  return request('task/getCustomerPublishTask?customerId='+customerId);
}
export async function getAgentList() {
  return request('agent/getAgentList');
}

export async function getCommonQuestion() {
  return request('commonQuestion/queryList');
}
export async function getCommonQuestionTemplate() {
  return request('commonQuestion/queryTaskTemplate');
}
export async function getCommonQuestionTemplateDetail(templateId:any) {
  return request('commonQuestion/getTaskTemplateDetail?templateId='+templateId);
}

export async function updateTask(params: Object) {
  return request('task/updateTaskFirst', {
    method: "POST",
    data: {
      ...params
    }
  });
}
export async function addTask(params: Object) {
  return request('task/addTask', {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function insertTaskSecond(params: Object) {
  return request('task/insertTaskSecond', {
    method: "POST",
    data: {
      ...params
    }
  });
}


export async function updateTaskSecond(params: Object) {
  return request('task/updateTaskSecond', {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function updateTaskStatus(taskId:any,status:any) {
  return request('task/updateTaskStatus?taskId='+taskId+"&status="+status);
}




export async function getTaskInfo(params: Object) {
  return request('task/getTaskInfo', {
    method: "POST",params
  });
}
export async function getTaskAgentInfo(taskId: string) {
  return request('task/getTaskAgentInfo?taskId='+taskId);
}
export async function queryQuestion(taskId: string) {
  return request('commonQuestion/queryQuestion?taskId='+taskId);
}

export async function deleteMyTemplate(templateId:any) {
  return request('template/delete?templateId='+templateId);
}

/**
 * 邀请码
 * @param params
 */
export async function getVerificationCode() {
  return request('agent/getVerificationCode');
}
/**
 * 获取省市列表
 * @param params
 */
 export async function getAreaInfo() {
  return request('agent/cityDropDown');
}