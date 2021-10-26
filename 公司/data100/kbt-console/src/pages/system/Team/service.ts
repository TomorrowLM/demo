import { request } from 'umi';

export async function getTeamList(params: Object) {
  return request('system/team/list', { params });
}

export async function getUserEnable() {
  return request('system/user/enable');
}

export async function systemTeam(method: string, params: Object) {
  return request('system/team', {
    method,
    data: {
      ...params
    }
  });
}

export async function deleteSystemTeam(deptId: string) {
  return request(`system/team/${deptId}`, { method: "DELETE" });
}