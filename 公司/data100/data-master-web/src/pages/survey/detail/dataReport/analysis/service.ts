import { request } from 'umi';

// 数据交付
export async function crossAnalysisOne(params: Object) {
  return request(`center-data-show/reprot/crossAnalysisOne`, {
    method: "POST",
    data: {
      ...params
    }
  });
}

// 数据交付
export async function crossAnalysisTwo(params: Object) {
  return request(`center-data-show/reprot/crossAnalysisTwo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}

// 保存
export async function saveCrossAnalysisOne(params: Object) {
  return request(`center-data-show/reprot/saveCrossAnalysisOne`, {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function saveCrossAnalysisTwo(params: Object) {
  return request(`center-data-show/reprot/saveCrossAnalysisTwo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}

/**
 * 交叉分析列表
 */
export async function crossAnalysisList(params: Object) {
  return request('center-data-show/reprot/crossAnalysisList', { params });
}

/**
 * 删除交叉分析数据
 */
export async function delCrossAnalysis(params: Object) {
  return request('center-data-show/reprot/delCrossAnalysis', { params });
}

/**
 * 交叉分析详情
 */
export async function showCrossAnalysis(params: Object) {
  return request('center-data-show/reprot/showCrossAnalysis', { params });
}

/**
 * 交付
 */
export async function approeDeliver(params: Object) {
  return request(`center-data-show/reprot/approeDeliver`, { params });
}

/**
 * 交叉分析撤销交付
 */
export async function revokeDeliver(params: Object) {
  return request('center-data-show/reprot/revokeDeliver', { params });
}

/**
 * 交叉分析队列
 */
export async function crossAnalysisForQueue(params: Object) {
  return request('center-data-show/reprot/crossAnalysisForQueue', {
    method: "POST",
    data: {
      ...params
    }
  });
}


/**
 *交叉分析预估时间-一层表头
 */
 export async function crossAnalysisOneTime(params: Object) {
  return request('center-data-show/reprot/crossAnalysisOneTime', { 
    method: "POST",
    data: {
      ...params
    }
   });
}

/**
 *交叉分析预估时间-两层表头
 */
 export async function crossAnalysisTwoTime(params: Object) {
  return request('center-data-show/reprot/crossAnalysisTwoTime', { 
    method: "POST",
    data: {
      ...params
    }
   });
}

/**
 *交叉分析-下载excle
 */
 export async function crossAnalysisState(params: Object) {
  return request('center-data-show/reprot/crossAnalysisState', {params});
}