import OSS from 'ali-oss';

const region = 'oss-cn-zhangjiakou';
const accessKeyId = 'LTAI4G86v4tZZNbRRCTsSrwE';
const accessKeySecret = 'w473K3WjvZmQb41jXcqh24R4LckHSH';
const bucket = 'pinrenwu';
const folder = 'prw-console';
const cdnAddress = 'https://cdnfiles.pinrenwu.cn';

const client = new OSS({
	region, // 云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，创建并使用STS方式来进行API访问
	accessKeyId,
	accessKeySecret,
	bucket
});

const getOssFileUrl = (obecjtKey) => {
	if (!obecjtKey) return new Error('object key 必须传');
	// console.log(cdnAddress,obecjtKey)
	return `${cdnAddress  }/${  obecjtKey}`;
}

const uploadOss = (file) => {
	const objectKey = `${folder  }/${  file.lastModified  }_${  new Date().getTime()}${file.name.substring(file.name.lastIndexOf("."),file.name.length)}`;
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
