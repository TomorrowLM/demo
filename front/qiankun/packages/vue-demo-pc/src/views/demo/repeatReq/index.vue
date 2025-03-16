<template>
  <div>
    <h1>重复请求</h1>
    <el-button @click="reqHandle1">点击</el-button>
    <h1>其他模块触发相同接口</h1>
    <el-button @click="reqHandle2">点击</el-button>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import $lm from '@lm/shared/lib/src/utils';
import { method } from 'lodash';
const request = $lm.service(process.env.VUE_APP_PROXY_API);
import useRequest from '@lm/shared/lib/src/utils/useRequest';
function setTimeOutApi() {
  const params = { url: '/common/setTimeOut', method: 'get' };
  return {
    params,
    request,
  };
}
const { resData, requestFn } = useRequest(setTimeOutApi(), { isCache: true });
export default {
  methods: {
    async reqHandle1() {
      console.log(1);
      const data = await requestFn({ a: 1 });
      console.log(resData, data, 'data');
      // request
      //   .get('/common/setTimeOut', {
      //     params: { a: 1 },
      //     isCache: true,
      //   })
      //   .then(res => {
      //     console.log(res);
      //   })
      //   .catch(err => {
      //     console.log(123, err);
      //   });
    },
    reqHandle2() {
      console.log(2);
      request.get('/common/setTimeOut', {
        params: { a: 1 },
      });
    },
  },
};
</script>
