import OSS from 'ali-oss';

const region = 'oss-cn-zhangjiakou';
const accessKeyId = 'LTAI4G86v4tZZNbRRCTsSrwE';
const accessKeySecret = 'w473K3WjvZmQb41jXcqh24R4LckHSH';
const bucket = 'data100-datacenter';
const folder = 'sls-console';
// 一定要注意，oss postObject上传的时候需要用 bucket的连接也就是【ossHost】
// 访问的时候用cdnAddress
const cdnAddress = 'https://cdndatacenter.data100.com';
const ossPath = 'oss://data100-datacenter';
const ossHost = 'https://data100-datacenter.oss-cn-zhangjiakou.aliyuncs.com';

const client = new OSS({
  region, // 云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，创建并使用STS方式来进行API访问
  accessKeyId,
  accessKeySecret,
  bucket
});


const getOssFileUrl = (obecjtKey) => {
  if (!obecjtKey) return new Error('object key 必须传');
  // console.log(cdnAddress,obecjtKey)
  return `${cdnAddress}/${obecjtKey}`;
}

const uploadOss = (file) => {
  const objectKey = `${folder}/${file.lastModified}_${new Date().getTime()}${file.name.substring(file.name.lastIndexOf("."), file.name.length)}`;
  return new Promise((resolve, reject) => {
    client.multipartUpload(objectKey, file).then(() => {
      resolve({
        code: 1,
        objectKey,
        url: getOssFileUrl(objectKey),
        msg: 'ok'
      });
    }).catch(() => {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({ code: 0, url: ', objectKey : ', msg: '上传出错了' });
    });
  })
};

const downloadFileOss = (objectKey,filename) => {
  // const filename = 'pdf文件下载' // 自定义下载后的文件名。
  const response = {
    'content-disposition': `attachment; filename=${encodeURIComponent(filename)}`
  }
  // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
  // return client.signatureUrl(objectKey, { response });
  window.location.href = client.signatureUrl(objectKey.split(cdnAddress+'/')[1], { response });
}


export { accessKeyId, accessKeySecret, cdnAddress, ossHost, ossPath ,downloadFileOss};

export default uploadOss;
