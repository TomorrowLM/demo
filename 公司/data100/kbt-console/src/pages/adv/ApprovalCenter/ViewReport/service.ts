import { request } from 'umi';

/**
 * 获取时间范围
 * @param params
 */
export async function getDateRange(params: object) {
  return request('task/getDateRange', {params});
}

/**
 * 查询所有项目数据
 * @param params
 */

export async function listProject() {
  return request(`approve/listProject`, {
    method: "POST",
    data: {
      startDate: "",
      endDate: "",
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
  return request('task/getCityLevelInfo', { params });
}

/**
 * 获取报表中心，省市列表，仅展示有基础数据的省市
 * @param params
 */
export async function getAreaInfo(params: Object) {
  return request('task/getAreaInfo', { params });
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

export async function taskReportDetail(params: Object) {
  return request(`task/taskReportDetail`, {
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
 * 报告数据
 * @param params
 */

export async function taskReport(params: Object) {
  return request(`task/taskReport`, {
    method: "POST",
    data: params
  });
}


/**
 * 水印修正
 * @param params
 */

export async function downloadTaskReportZip(params: Object) {
  return request(`task/downloadTaskReportZip`, { method: "GET", params });
}
