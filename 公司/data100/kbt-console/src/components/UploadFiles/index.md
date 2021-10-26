上传文件按钮。

## 何时使用

- 上传结算数据等操作。

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 发到后台的文件参数名 | string | fileUpload |
| multiple | 是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件 | boolean | false |
| action | 上传的地址 | string | - |
| accept | 接受上传的文件类型 | string | - |
| tip | 按钮提示 | string | - |
| text | 按钮文字 | string | 上传 |
| data | 上传所需额外参数或返回上传额外参数的方法 | object | - |
| onSuccess | 上传成功后回调 | () => void | - |
