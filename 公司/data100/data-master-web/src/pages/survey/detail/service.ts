import { request } from 'umi';


// 查询问卷所在文件夹
export async function getFileInfoBySurveyGroupId(params: Object) {
  return request(`center-data-collect/survey/getFileInfoBySurveyGroupId`, {
    method: "POST",
    data: {
      ...params
    }
  });
}



