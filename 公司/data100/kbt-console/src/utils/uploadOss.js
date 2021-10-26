import OSS from 'ali-oss';

const region = 'oss-cn-zhangjiakou';
const accessKeyId = 'LTAI4G86v4tZZNbRRCTsSrwE';
const accessKeySecret = 'w473K3WjvZmQb41jXcqh24R4LckHSH';
const bucket = 'kbt';
const folder = 'test/kbt-console';
const cdnAddress = 'https://cdnfiles.kanbotong.net';

const client = new OSS({
	region, // 云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，创建并使用STS方式来进行API访问
	accessKeyId,
	accessKeySecret,
	bucket,
	endpoint: 'oss-accelerate.aliyuncs.com'
});

const getOssFileUrl = (obecjtKey) => {
	if (!obecjtKey) return new Error('object key 必须传');
	// console.log(cdnAddress,obecjtKey)
	return `${cdnAddress  }/${  obecjtKey}`;
}

const uploadOss = (file,params) => {
	let objectKey = `${folder  }/${  file.lastModified  }_${  new Date().getTime()}${file.name.substring(file.name.lastIndexOf("."),file.name.length)}`;
	if(params&&params.taskId){
		objectKey =  `${folder  }/${params.taskId}/${  file.lastModified  }_${  new Date().getTime()}${file.name.substring(file.name.lastIndexOf("."),file.name.length)}`;
	}
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

export default uploadOss;
