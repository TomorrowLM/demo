通用弹窗组件。

## 何时使用

- 当某个页面需要Modal操作时候。

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modalVisible | 对话框是否可见 | boolean | - |
| width | 宽度 | string | number | 520 |
| title | 标题 | ReactNode ｜ string | - |
| centered | 垂直居中展示 Modal | boolean | false |
| cancelText | 取消按钮文字 | ReactNode | 取消 |
| submitText | 提交按钮文字 | ReactNode | 提交 |
| onCancel | 点击遮罩层或右上角叉或取消按钮的回调 | function(e) | - |
| onHandleOk | 点击确定回调，非必传，在不传的情况下默认无footer按钮 | () => void | - |
