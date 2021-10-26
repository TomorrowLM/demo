import { request } from 'umi';

/**
 * 项目列表
 * @param params
 */
export async function getTaskList(params: Object) {
  return request('task/queryList', {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function deleteTask(params: Object) {
  return request('task/deleteTask', {
    method: "POST",
    data: {
      ...params
    }
  });
}


export async function updateTaskStatus(taskId:any,status:any) {
  return request('task/updateTaskStatus?taskId='+taskId+"&status="+status);
}

export async function getUserList(params: Object) {
  return request('assistant/getUserList');
}

export async function getAssistUserList() {
  return request('assistant/getUserList');
}
export async function getTaskAssistant(taskId:string) {
  return request('assistant/getTaskAssistant?taskId='+taskId);
}

export async function addTaskAssistant(params: Object) {
  return request('assistant/addTaskAssistant', {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function deleteTaskAssistant(params: Object) {
  return request('assistant/deleteTaskAssistant', {
    method: "POST",
    data: {
      ...params
    }
  });
}


export async function checkTaskAssistantPower(taskIds: string) {
  return request('assistant/checkTaskAssistantPower?taskIds='+taskIds);
}

export async function getSystemUserList(params: Object) {
  return request('template/queryUserForTempate');
}

export async function templateQueryNameExist(templateName: string) {
  return request('template/queryNameExist?templateName='+templateName);
}

export async function templateSave(params: Object) {
  return request('template/save', {
    method: "POST",
    data: {
      ...params
    }
  });
}


/**
 * 查看报告校验
 * @param params
 */
export async function checkViewReport(taskId: string) {
  return request('task/checkViewReport?taskId='+taskId);
}