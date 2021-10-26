
import { request } from 'umi';


export async function selectDownLoadSurveyList(params: Object) {
  return request(`center-data-collect/survey/selectDownLoadSurveyList`, {params});
}

export async function downLoadSurveyReport(params: Object) {
  return request(`center-data-collect/survey/downLoadSurveyReport`, {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function deleteDownLoadSurveyList(params: Object) {
  return request(`center-data-collect/survey/deleteDownLoadSurveyList`, {params});
}