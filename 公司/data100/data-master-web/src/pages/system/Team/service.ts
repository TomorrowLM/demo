import { request } from 'umi';

export async function getTeamList(params: Object) {
  return request('center-account/system/team/list', { params });
}

export async function getUserEnable() {
  return request('center-account/system/user/enable');
}

export async function systemTeam(method: string, params: Object) {
  return request('center-account/system/team', {
    method,
    data: {
      ...params
    }
  });
}

export async function deleteSystemTeam(deptId: string) {
  return request(`center-account/system/team/${deptId}`, { method: "DELETE" });
}