export const taskTypeOptions = {
	"1": [
		{ value: '1', label: '京东户外广告' },
		{ value: '2', label: '京东线下门店' }],
	"2": [
		{ value: '3', label: '新潮' }],
	"3": [
		{ value: '4', label: '通用模板' }]
}

export const questionTypeOptions = [
	{ value: '1', label: '单选' },
	{ value: '2', label: '多选' }
]

// 文本类型
export const typeOptions = [
	{ value: '1', label: '单行文本' },
	{ value: '2', label: '多行文本' }
]

// 答案验证
export const answerVerification = [
	{ value: '0', label: '不限' },
	{ value: '1', label: '数字' },
	{ value: '2', label: '字母' },
	{ value: '3', label: '中文' },
	{ value: '4', label: '手机' },
	{ value: '5', label: '邮箱' }
]

// 照片来源
export const photoSource = [
	{ value: '0', label: '不限' },
	{ value: '1', label: '仅相机' },
	{ value: '2', label: '仅相册' }
]

// 水印来源
export const watermarkSource = [
	{ value: '0', label: '不限' },
	{ value: '1', label: '使用点位库地址' },
	{ value: '2', label: '使用实时定位地址' }
]

export const tiOption = {
	"optionContent": "",
	"optionOrder": 1,
	"optionAdd": "",
	"addType": "",
	"jumpQuestionId": "",
	"otherFlag": "0"
}
export const tiXuanze = {
	"questionTitle": "",
	"questionOrder": 1,
	"questionType": "1",
	"mustAnswerFlag": "0",
	"hideFlag": "0",
	"note": "",
	"selectDisplayType": "1",
	"textDisplayType": "",
	"answerCheck": "",
	"minWordNum": 0,
	"maxWordNum": 0,
	"picSource": "",
	"picWatermarkSource": "",
	"minPicNum": 0,
	"maxPicNum": 0,
	"videoSource": "",
	"videoWatermarkSource": "",
	"minVideoNum": 0,
	"maxVideoNum": 0,
	"minVideoDuration": 0,
	"maxVideoDuration": 0,
	"commonId": 0,
	"picDemo": null,
	"videoDemo": null,
	"watermarkFlag": null,
	"dateFormat": null,
	"options": [tiOption]
}

export const tiWenben = {
	"questionTitle": "",
	"questionOrder": 1,
	"questionType": "2",
	"mustAnswerFlag": "0",
	"hideFlag": "0",
	"note": "",
	"selectDisplayType": "",
	"textDisplayType": "1",
	"answerCheck": "0",
	"minWordNum": 1,
	"maxWordNum": 30,
	"picSource": "0",
	"picWatermarkSource": "0",
	"minPicNum": 0,
	"maxPicNum": 0,
	"videoSource": "0",
	"videoWatermarkSource": "0",
	"minVideoNum": 0,
	"maxVideoNum": 0,
	"minVideoDuration": 0,
	"maxVideoDuration": 0,
	"commonId": 0,
	"picDemo": null,
	"videoDemo": null,
	"watermarkFlag": null,
	"dateFormat": null,
	"options": []
}

export const tiPaizhao = {
	"questionTitle": "",
	"questionOrder": 1,
	"questionType": "3",
	"mustAnswerFlag": "0",
	"hideFlag": "0",
	"note": "",
	"selectDisplayType": "",
	"textDisplayType": "",
	"answerCheck": "",
	"minWordNum": 0,
	"maxWordNum": 0,
	"picSource": "0",
	"picWatermarkSource": "0",
	"minPicNum": 1,
	"maxPicNum": 30,
	"videoSource": "0",
	"videoWatermarkSource": "0",
	"minVideoNum": 0,
	"maxVideoNum": 0,
	"minVideoDuration": 0,
	"maxVideoDuration": 0,
	"commonId": 0,
	"picDemo": "",
	"videoDemo": null,
	"watermarkFlag": null,
	"dateFormat": null,
	"options": []
}

export const tiShiping = {
	answerCheck: "",
	commonId: 0,
	dateFormat: null,
	hideFlag: "0",
	maxPicNum: 0,
	maxVideoDuration: 59,
	maxVideoNum: 30,
	maxWordNum: 0,
	minPicNum: 0,
	minVideoDuration: 10,
	minVideoNum: 1,
	minWordNum: 0,
	mustAnswerFlag: "0",
	note: "",
	options: [],
	picDemo: null,
	picSource: "0",
	picWatermarkSource: "0",
	questionOrder: 4,
	questionTitle: "",
	questionType: "4",
	selectDisplayType: "",
	textDisplayType: "",
	videoDemo: "",
	videoSource: "0",
	videoWatermarkSource: "0",
	watermarkFlag: null
}
export const tiDingwei = {
	questionTitle: "",
	questionOrder: 1,
	questionType: "6",
	mustAnswerFlag: "0",
	hideFlag: "0",
	note: "",
	selectDisplayType: "",
	textDisplayType: "1",
	answerCheck: "0",
	minWordNum: 1,
	maxWordNum: 30,
	picSource: "0",
	picWatermarkSource: "0",
	minPicNum: 0,
	maxPicNum: 0,
	videoSource: "0",
	videoWatermarkSource: "0",
	minVideoNum: 0,
	maxVideoNum: 0,
	minVideoDuration: 0,
	maxVideoDuration: 0,
	commonId: 0,
	picDemo: null,
	videoDemo: null,
	watermarkFlag: null,
	dateFormat: null,
	options: []
}
export const tis = {
	"1": tiXuanze,
	"2": tiWenben,
	"3": tiPaizhao,
	"4": tiShiping,
	"6": tiDingwei,
}
