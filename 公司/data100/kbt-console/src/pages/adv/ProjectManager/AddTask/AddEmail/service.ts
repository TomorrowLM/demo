import { request } from 'umi';

export async function getTaskEmailRepord(taskId:any) {
  return request('email/getTaskEmailRepord?taskId='+taskId);
}

export async function getAllEmailContact() {
  return request('email/getAllEmailContact')
}
export async function getLatelyEmailContact() {
  return request('email/getLatelyEmailContact')
}

export async function deleteEmailContact(params: Object) {
  return request('email/deleteEmailContact', {
    method: "PUT",
    requestType: 'form',
    data: {
      ...params
    }
  });
}

export async function getMailInfo(taskId:any,agentId:any) {
  return request('email/getMailInfo?taskId='+taskId+"&agentId="+agentId);
}

export async function saveMail(params: Object) {
  return request('email/saveMail', {
    method: "POST",
    data: {
      ...params
    }
  });
}
export async function sendMail(params: Object) {
  return request('email/sendMail', {
    method: "POST",
    data: {
      ...params
    }
  });
}
