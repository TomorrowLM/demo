import { request } from 'umi';

/**
 * 客户数据
 * @param params
 */
export async function getCustomerDetail(params: Object) {
  return request('customer/getCustomerDetail', {
    method: "POST",
    data: {
      ...params
    }
  });
}




export async function deleteTask(taskIds: String) {
  return request(`task/deleteTask`, {
    method: "POST",
    data:{
      taskIds
    }
  });
}


