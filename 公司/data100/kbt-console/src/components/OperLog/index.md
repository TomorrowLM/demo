Modal操作日志。

## 何时使用

- 列表查看操作日志时。

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modalVisible | 对话框是否可见 | boolean | - |
| params | 获取日志接口所传参数 | { projectId: string, targetCode: number, createTime?: string, description?: string } | - |
| onCancel | 点击遮罩层或右上角叉或取消按钮的回调 | function(e) | - |