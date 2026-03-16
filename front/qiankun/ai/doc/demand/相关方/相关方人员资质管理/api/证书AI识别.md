

## 企业组织证件管理-证书AI识别


**接口地址**:`/dsb/yqarw/api/rwgl/zjgl/qyzz/zssb`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|imageUrl|imageUrl|query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|Result«ZjglQyzzAddReq»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|datas||ZjglQyzzAddReq|ZjglQyzzAddReq|
|&emsp;&emsp;bz|备注|string||
|&emsp;&emsp;fzsj|发证时间|string(date-time)||
|&emsp;&emsp;id|ID，新增为空、编辑必传|integer(int64)||
|&emsp;&emsp;ryxm|姓名|string||
|&emsp;&emsp;sjhm|手机号码|string||
|&emsp;&emsp;yxqjssj|有效期结束时间yyyy-MM-dd|string(date-time)||
|&emsp;&emsp;yxqkssj|有效期开始时间yyyy-MM-dd|string(date-time)||
|&emsp;&emsp;zjbh|证件编号|string||
|&emsp;&emsp;zjlx|证件类型:20=特种作业人员的操作证,30=特种设备操作证,40=安全培训合格证,50=高危岗位作业证,60=安全管理员|integer(int32)||
|&emsp;&emsp;zjmc|证件名称枚举:20=电工作业证,21=焊接与热切割作业证,22=高处作业证,23吊装作业证,24=有限空问作业证,25=盲板抽堵作业证,30=制冷与空调作业操作证,31=压力容器操作证,32=压力管道操作证,33=锅炉操作证,34=叉车驾驶证,35=起車机械操作证,40=安全管理负责人,41=安全生产管理人员,50=煤矿安全作业,51=金属非金屈矿山安全作业,52=石油天然气安全作业,53=冶金（有色）生产安全作业,54=危险化学品安全作业,55=烟花爆竹安全作业,56=其他作业,61=安全管理员|integer(int32)||
|&emsp;&emsp;zpUrlList|照片地址,/image/compress/upload接口上传|array|string|
|error||string||
|msg||string||
|path||string||
|traceId||string||


**响应示例**:
```javascript
{
	"code": 0,
	"datas": {
		"bz": "",
		"fzsj": "",
		"id": 0,
		"ryxm": "",
		"sjhm": "",
		"yxqjssj": "",
		"yxqkssj": "",
		"zjbh": "",
		"zjlx": 0,
		"zjmc": 0,
		"zpUrlList": []
	},
	"error": "",
	"msg": "",
	"path": "",
	"traceId": ""
}
```