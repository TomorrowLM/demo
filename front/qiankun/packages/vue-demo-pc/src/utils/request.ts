import $lm from '@lm/shared/lib/cjs/utils/index.js';
console.log(process.env.VUE_APP_PROXY_API,123)
const request = $lm.service(process.env.VUE_APP_PROXY_API as string);
export default request;
