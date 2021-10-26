import { request } from 'umi';

/**
 * 项目列表
 * @param params
 */
export async function getCustomerList(params: Object) {
  return request('customer/customerList', {
    method: "POST",
    data: {
      ...params
    }
  });
}
export async function getTradeTree() {
  return request('customer/getTradeTree');
}

export async function deleteCustomerData(ids: String) {
  // console.log(ids)
  return request(`customer/deleteCustomer?ids=${ids}`, {method: "DELETE"  });
}

export async function insertCustomer( params: Object) {
  // console.log(params)
  return request('customer/insertCustomer', {
    method: "POST",
    data: {
      ...params
    }
  });
}

export async function getCustomerDetailData(  params: Object) {
  return request(`customer/getCustomerDetail`, {
    method: "POST",
    data: {
      ...params
    }
  });
}



export async function updateCustomer(params: Object) {
  return request(`customer/updateCustomer`, {
    method: "POST",
    data: {
      ...params
    }
  });
}


