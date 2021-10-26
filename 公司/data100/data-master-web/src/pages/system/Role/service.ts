import { request } from 'umi';
import { assTree } from '@/utils/utils'

export async function getRoleList(params: Object) {
  return request('center-account/system/role/list', { params });
}

export async function getMenuTreeselect() {
  return request(`center-account/system/menu/treeselect`).then(res => {
    return Promise.resolve(assTree(res.data))
  });
}

export async function getRoleMenuTreeselect(roleId: number) {
  return request(`center-account/system/menu/roleMenuTreeselect/${roleId}`).then(res => {
    return Promise.resolve(assTree(res.menus))
  });
}

export async function getRoleDeptTreeselect(roleId: number) {
  return request(`center-account/system/dept/roleDeptTreeselect/${roleId}`).then(res => {
    return Promise.resolve(assTree(res.depts))
  });
}

export async function systemRole(method: string, params: Object) {
  return request('center-account/system/role', {
    method,
    data: {
      ...params
    }
  });
}

export async function updateDataScope(params: Object) {
  return request('center-account/system/role/dataScope', {
    method: 'PUT',
    data: {
      ...params
    }
  });
}

export async function deleteSystemRole(deptId: string) {
  return request(`center-account/system/role/${deptId}`, { method: "DELETE" });
}

export async function changeStatus(params: Object) {
  return request(`center-account/system/role/changeStatus`, {
    method: "PUT",
    data: {
      ...params
    }
  });
}