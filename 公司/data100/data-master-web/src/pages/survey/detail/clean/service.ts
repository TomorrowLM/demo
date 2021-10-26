import { request } from 'umi';
import { } from './data.d';

export async function optionInfo(params: Object) {
  return request('center-data-clean/question/optionInfo', { params });
}

export async function questionInfo(params: Object) {
  return request(`center-data-clean/question/questionInfo`, { params });
}
// 刷新问卷结构
export async function refershSurveyStructure(params: Object) {
  return request(`center-data-collect/survey/refershSurveyStructure`, { params });
}
// 获取清洗规则
export async function showRule(params: Object) {
  return request(`center-data-clean/data/showRule`, { params });
}

// 获取清洗状态
export async function cleanState(params: Object) {
  return request(`center-data-clean/data/cleanState`, { params });
}
// 存储清洗规则
export async function saveRule(params: Object) {
  return request(`center-data-clean/data/saveRule`, {
    method: "POST",
    data: {
      ...params
    },
    hideLoding:true
  });
}

// 按规则清洗数据
export async function cleanData(params: Object) {
  return request(`center-data-clean/data/clean`, { params });
}

// 上传人工交付数据
export async function uploadAnswerCsv(params: Object) {
  return request(`center-data-clean/data/uploadAnswerCsv`, { params });
}

// 数据交付
export async function dataDelivery(params: Object) {
  return request(`center-data-clean/data/dataDelivery`, { params });
}
// 撤销数据交付
export async function dataDeliveryRevoke(params: Object) {
  return request(`center-data-clean/data/dataDeliveryRevoke`, { params });
}

// 获取打包数据的状态
export async function getDownloadCSVFileStatus(params: Object) {
  return request(`center-data-collect/survey/getDownloadCSVFileStatus`, { params });
}
// 新增清洗组
export async function addCleanTabsService(params: Object) {
  return request(`center-data-clean/data/addRuleGroup`, {
    method: "POST",
    data: {
      ...params
    }
  });
}
// 查询清洗组
export async function getCleanTabsService(params: Object) {
  return request(`center-data-clean/data/ruleGroups`, { params });
}
// 删除清洗组
export async function deleteCleanTabsService(params: Object) {
  return request(`center-data-clean/data/delRuleGroup`, { params });
}
// 编辑清洗组名称
export async function editCleanTabsService(params: Object) {
  return request(`center-data-clean/data/saveRuleGroupName`, { params });
}
/**
 * 查询该清洗组下数据报告个数和已交付的个数
 * groupId 问卷组
 * ruleGroupId 清洗组
 */
export async function dataReportNumByRuleGroup(params: Object) {
  return request(`center-data-clean/data/dataReportNumByRuleGroup`, { params });
}

/**
 * 复制清洗组
 * groupId 问卷组
 * ruleGroupId 清洗组
 */
 export async function copyRuleGroup(params: Object) {
  return request(`center-data-clean/data/copyRuleGroup`, { params });
}

/**
 * 获取文本题信息
 * groupId 问卷组
 */
 export async function textQuestionInfo(params: Object) {
  return request(`center-data-clean/question/textQuestionInfo`, { params });
}

/**
 * 拉取或上传数据清洗的答题数据
 * surveyGroup 问卷组
 * sid 问卷ID 
 * fileUrl 上传csv文件url
 * operType 操作类型（1拉取 2上传）
 * @returns 
 */
 export async function putCSVInfo(params: Object) {
  return request(`center-data-collect/survey/putCSVInfo`, {  method: "POST",
  data: {
    ...params
  } });
}

/**
 * 删除数据清洗的答题数据
 * @param params 
 * @returns 
 */
export async function delCSVInfo(params: Object) {
  return request(`center-data-collect/survey/delCSVInfo`, {
    method: "POST",
    data: {
      ...params
    }
  });
}

/**
 * 提交清洗分数到拼任务
 * @param params 
 * @returns 
 */
 export async function submitScoreToPrw(params: Object) {
  return request(`center-data-clean/data/submitScoreToPrw`, {
    method: "POST",
    data: {
      ...params
    }
  });
}
