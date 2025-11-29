<template>
  <div>
    <h1>重复请求</h1>
    <el-button @click="reqHandle1">点击</el-button>
    <h1>其他模块触发相同接口（包括参数相同），则会使用缓存的数据</h1>
    <el-button @click="reqHandle2">点击</el-button>
    <h1>并发上传，场景：图片或文件批量下载、RSSHub高速抓取内容</h1>
    <el-button @click="reqHandle3">点击</el-button>
  </div>
</template>

<script>
// import { Component, Vue } from 'vue-property-decorator';
// import $lm from '@lm/shared/utils';
// import { method } from 'lodash';
// const request = $lm.service(process.env.VUE_APP_PROXY_API);
// // import useRequest from '@lm/shared/utils/useRequest';
// function setTimeOutApi() {
//   const params = { url: '/common/setTimeOut', method: 'get' };
//   return {
//     params,
//     request,
//   };
// }
// // const { resData, requestFn } = useRequest(setTimeOutApi(), { isCache: true });
// export default {
//   methods: {
//     async reqHandle1() {
//       console.log(1);
//       // const data = await requestFn({ a: 1 });
//       // console.log(resData, data, 'data');
//       // request
//       //   .get('/common/setTimeOut', {
//       //     params: { a: 1 },
//       //     isCache: true,
//       //   })
//       //   .then(res => {
//       //     console.log(res);
//       //   })
//       //   .catch(err => {
//       //     console.log(123, err);
//       //   });
//     },
//     async reqHandle2() {
//       console.log(2);
//       const data = await requestFn({ a: 1 });
//     },
//     /**
//      * 教程：https://zhuanlan.zhihu.com/p/700309565
//      * @param url 文件上传地址
//      * @param dataSize  文件大小
//      * @param maxConcurrency  并发请求数量
//      */
//     async simulateConcurrentRequests(url, dataSize, maxConcurrency) {
//       const oneSize = 1; //每次上传数据大小;
//       // const upLoadNum = parseInt(file.size / 1024);
//       const totalRequests = parseInt(dataSize / oneSize); //总请求数量

//       const results = [];
//       let activeRequests = 0; //
//       let currentIndex = 0; //当前请求索引

//       async function fetchTask() {
//         console.log(currentIndex, 'currentIndex');
//         if (currentIndex >= totalRequests) return;
//         const taskIndex = currentIndex++;
//         // activeRequests++;
//         try {
//           const response = await request.get('/common/setTimeOut', {
//             params: { a: 1 },
//           });
//           results[taskIndex] = response.data;
//         } catch (error) {
//           console.error('Request failed:', error);
//           results[taskIndex] = null;
//         } finally {
//           // activeRequests--;
//           // 这里当请求完成时，通过currentIndex检查是否还有其他请求未完成，如果有，则继续执行下一个请求，从而始终保持并发数。
//           if (currentIndex < totalRequests) {
//             await fetchTask();
//           }
//         }
//       }

//       const initialTasks = Array.from({ length: maxConcurrency }, fetchTask);
//       console.log(initialTasks, 'initialTasks');
//       await Promise.all(initialTasks);
//       return results;
//     },
//     async reqHandle3() {
//       this.simulateConcurrentRequests('/common/setTimeOut', 13, 6)
//         .then(results => {
//           console.log('All requests completed. Results:', results);
//         })
//         .catch(error => {
//           console.error('Error during requests:', error);
//         });
//     },
//   },
// };
</script>
