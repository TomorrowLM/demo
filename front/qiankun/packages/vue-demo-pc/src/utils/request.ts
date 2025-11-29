import $lm from '@lm/shared';
console.log(process.env,999)
console.log($lm,123)
console.log($lm.utils.baseRequest, 'process.env.VUE_APP_PROXY_API')
export default $lm.utils.baseRequest;