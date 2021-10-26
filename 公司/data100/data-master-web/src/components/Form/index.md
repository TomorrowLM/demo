通用简单表单组件。

## 何时使用

- 常见于非复杂场景的配置表单。

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 配置项 | Array<any> | [] |
| initialValues | 表单值 | object | {} |
| onFinish | 表单提交回调 | (values: any) => Promise<void> | - |
| onValuesChange | 表单值改变回调 | (changedValues: any, allValues: any) => void | - |

## Column

- 列描述数据对象，是 columns 中的一项，Column 使用相同的 API。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 表单提交key值 | string | - |
| type | 列类型，可选值 `CASCADER`、`SELECT`、`SELECT_ICON`、`INPUT`、`INPUT_NUM`、`RADIO`、`CHECKBOX`、`TEXT_AREA`、`TREE`、`TREE_SELECT`、`DIVIDER` | string | - |
| label | 列标题 | string | - |
| width | 列宽度 | string ｜ number | - |
| tip | 列提示 | string | - |
| placeholder | - | string | - |
| options | - | Array<any> | - |
| rules | 列自定义验证 | Array<any> | - |
| fieldNames | 自定义 options 中 label name children 的字段 | object | { label: label, value: value, children: children } |
| colSpan | 栅格占位格数，为 0 时相当于 display: none | number | - |
| colXs | 小屏幕栅格占位格数，为 0 时相当于 display: none | number | - |
| disabled | 是否禁用状态，默认为 false | boolean | false |
| precision | 数值精度 | number | - |
| mode | 设置 Select 的模式为多选或标签 | multiple | tags | - |
| showSearch | 使 Select 单选模式可搜索 | boolean | false |
| showArrow | 是否显示下拉小箭头 | boolean | true |
| optionFilterProp | 搜索时过滤对应的 option 属性，如设置为 children 表示对内嵌内容进行搜索 | string | label |
| treeNodeFilterProp | 输入项过滤对应的 treeNode 属性 | string | title |
