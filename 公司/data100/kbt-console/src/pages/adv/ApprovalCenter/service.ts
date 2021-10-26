import { request } from 'umi';

/**
 * 获取时间范围
 * @param params
 */
export async function getDateRange() {
  return request('approve/getDateRange');
}

/**
 * 查询所有项目数据
 * @param params
 */

export async function listProject(params: Object) {
  return request(`approve/listProject`, {
    method: "POST",
    data: {
      ...params
    }
  });
}

/**
 * 查询项目下的所有任务
 * @param params
 */

export async function listTask(params: Object) {
  return request(`approve/listTask`, {
    method: "POST",
    data: {
      ...params
    }
  });
}

/**
 * 获取审批中心，省市列表
 * @param params
 */
export async function getCityLevelInfo(params: Object) {
  return request('approve/getCityLevelInfo', { params });
}

/**
 * 获取报表中心，省市列表，仅展示有基础数据的省市
 * @param params
 */
export async function getAreaInfo(params: Object) {
  return request('approve/getAreaInfo', { params });
}

/**
 * 指标统计接口-计划点位数、完成数、合格数、不合格数
 * @param params
 */

export async function getPointCount(params: Object) {
  return request(`approve/getPointCount`, {
    method: "POST",
    data: {
      ...params
    }
  });
}

/**
 * 获取任务点位信息列表
 * @param params
 */

export async function getPointDetail(params: Object) {
  return request(`approve/getPointDetail`, {
    method: "POST",
    data: {
      ...params
    }
  });
}

/**
 * 项目列表
 * @param params
 */
export async function getProjectList(params: Object) {
  return request('project/queryList', { params });
}


/**
 * 新增
 * @param params
 */

export async function systemDept(method: string, params: Object) {
  return request('project/addProject', {
    method,
    data: {
      ...params
    }
  });
}


/**
 * 获取执行人对应的执行点位数量
 * @param params
 */

export async function listStaff(params: Object) {
  return request(`approve/getStaffExecNum`, {params});
}

/**
 * 列出用户可审核的任务
 * @param params
 */

export async function listUserAuditTask(params: Object) {
  return request(`approve/listUserAuditTask`, {params});
}

// /**
//  * 导出问卷
//  * @param params
//  */

// export async function exportPointDetail(params: Object) {
//   return request(`approve/exportPointDetail`, {params});
// }


/**
 * 水印修正
 * @param params
 */

export async function watermarkAmend(params: Object) {
  return request(`approve/watermarkAmend`, {method: "POST",data:params});
}
/**
 * 单条水印修正
 * @param params
 */

 export async function watermarkAmendOne(params: Object) {
  return request(`approve/watermarkAmendOne`, {method: "POST",data:params});
}
