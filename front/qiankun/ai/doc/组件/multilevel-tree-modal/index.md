# MultilevelTreeModal 组件文档

此文档总结 `MultilevelTreeModal` 组件的 props、行为、已实现功能以及使用示例，便于在项目中复用和调试。

实现文件：`src/components/multilevel-tree-modal/index.tsx`
样式文件：`src/components/multilevel-tree-modal/index.less`

---

## 组件简介

`MultilevelTreeModal` 是基于 React + Ant Design 的多级结构选择弹窗，常用于组织/人员树的单选或多选场景。特性包括：

- 支持单选与多选
- 搜索回退与外部自定义搜索
- 右侧已选列表（支持单项移除与全部清空）
- 支持回填外部已选（`savedList`）
- 在单选时支持树内节点高亮与勾选图标
- 兼容树中使用复合 key（如 `personId__deptKey`）

---

## Props

- `modalShow: boolean` - 控制弹窗显示
- `type?: 'person' | 'department'` - 选择类型，默认 `person`（影响是否加载人员）
- `title?: string` - 弹窗标题，默认 `选择人员`
- `multiple?: boolean` - 是否多选，默认 `false`
- `showSearch?: boolean` - 是否显示搜索框，默认 `true`
- `showAllCheck?: boolean` - 是否显示全选（保留字段，组件内目前未使用）
- `savedList?: PersonItem[]` - 外部传入的已选回填
- `data?: DataNode[]` - 外部传入的树数据（可选），若未传组件会发起默认接口请求或使用搜索回退
- `onUpdate?: (selected: PersonItem[]) => void` - 已选项更新时回调（选择/删除/清空时调用）
- `onOk?: (selected: PersonItem[]) => void` - 点击确定时回调
- `onClose?: () => void` - 关闭弹窗时回调
- `onSearch?: (keyword: string) => void` - 可选：外部实现搜索，若未传，组件在人员 tab 使用内置接口回退
- `onChangeTabs?: (key: string) => void` - tab 切换回调（组件打开时默认触发一次 `onChangeTabs('10')`）

---

## 重要类型

```ts
export type PersonItem = {
  id: string | number;
  xm?: string; // 姓名
  sjhm?: string; // 手机
  deptName?: string;
  [key: string]: any;
};
```

---

## 已实现行为（基于当前代码）

- 初始部门树使用 `getEqaBmApi()` 获取并渲染部门节点。组件在多个加载路径（首次打开、搜索为空时回退加载、以及节点展开时加载子部门）中已统一采用部门的主标识作为 `key`：优先 `id`，回退 `value` / `bmId` / `deptId` 等字段；同时会在 `DataNode.original` 中写入 `_nodeId: String(nodeId)` 以便后续解析与迁移。
- 展开部门节点时，会使用 `getEqaBmApi({ bmId })` 获取子部门；当 `type === 'person'` 时还会调用 `getEqaRyApi` 拉取该部门下的人员，并生成 leaf 节点。
  - 人员节点目前保留原先的复合 key 方案（`personId__deptKey`），并在 `original` 中写入 `_personId` 和 `_deptKey`，以保证节点唯一且可还原人员归属。
- 搜索：若未传入 `onSearch`，在人员 tab（默认 tab `10`）会使用 `getPersonListNewApi` 拉取搜索结果并渲染为树下的搜索结果组（搜索结果节点 key 为 `search_<personId>`，并在 `original._personId` 中保留原始 personId）。
- 右侧已选：`mapKeysToItems(keys)` 会从 `treeData` 中根据 key 还原 `PersonItem`，对复合 key 做处理并去重。
  - 若 `mapKeysToItems` 无法从 `treeData` 中映射（例如 `treeData` 还未加载或父组件直接通过 `savedList` 回填），组件会回退使用 `savedList` 作为已选回填来源；回填时优先取 `savedList` 中的 `_personId` 或 `id` 作为 `id`，并使用 `xm` 作为姓名显示。
- 清空：右侧 header 有 `清空` 按钮（AntD `Button` + `DeleteOutlined`），会执行 `setCheckedKeys([])`、`setSelectedKeys([])` 并触发 `onUpdate([])`。
- 单项删除：右侧每项有删除按钮（`CloseOutlined`），会从 `checkedKeys` / `selectedKeys` 中移除所有与该 id 匹配的 key（支持 `id` 与 `id__deptKey`），并调用 `onUpdate(newItems)`。
- 单选样式：`multiple===false` 时，右侧当前选中项使用 `selectedItemActive` 样式并显示 `CheckCircleFilled` 图标；同时树节点 title 会被替换为 React 节点（`treeNodeActive`）并在节点前显示勾选图标，树也通过受控 `selectedKeys` 保持与右侧一致。

---

## 使用示例

在页面中引入并使用（示例摘自 `src/pages/partner/base/index.tsx`）：

```tsx
<MultilevelTreeModal
  type="person"
  modalShow={deptModalShow}
  title="选择人员"
  multiple={false}
  showSearch={true}
  savedList={selectedPersons}
  onUpdate={(items) => {
    setSelectedPersons(items);
    form.setFieldsValue({ name1: items?.[0]?.xm || '' });
  }}
  onOk={(items) => {
    setSelectedPersons(items);
    form.setFieldsValue({ name1: items?.[0]?.xm || '' });
    setDeptModalShow(false);
  }}
  onClose={() => setDeptModalShow(false)}
/>
```

说明：`savedList` 用于回填初始已选；`onUpdate` 在选择/删除/清空时被触发，适合用于联动表单字段。

---

## 样式类（可覆盖）

- `selectedItemActive`：右侧已选项高亮样式（蓝色背景、边框、图标）
- `selectedItem`：右侧已选项默认样式
- `treeNodeActive`：树内被选中的节点 title 高亮样式
- `hideCheckbox` / `hideSwitcher`：用于隐藏节点的复选框或展开器（配合 DataNode.className 使用）

---

## 常见问题与排查建议

- 问：删除右侧项后树节点仍显示为选中状态（`.ant-tree-node-selected`）？
  - 答：确保组件传入受控 `selectedKeys={selectedKeys}`（已实现）。另外删除操作要同时更新 `selectedKeys` 与 `checkedKeys`，并确保父组件的 `onUpdate` 不会把已删除项再次回填到 `savedList`。查找父组件是否有 effect 根据 `onUpdate` 设置 `savedList` 导致回填循环。

- 问：树节点 key 规则不一致导致映射失败？
  - 答：组件对复合 key（`id__deptKey`）有兼容逻辑，但前提是人员节点原始 `original` 中包含 `_personId` 或 `id` 字段；若后端字段命名不同，需要调整 `mapKeysToItems` 或在 `DataNode.original` 中统一字段名。

---

## 建议改进（可选）

- 把删除按钮加上 `Popconfirm` 以防误删。
- 若需要更复杂的高亮动画，可在 `index.less` 中为 `.treeNodeActive` 添加 `transition`。
- 对于海量数据场景，建议在 `Tree` 上使用虚拟滚动或在搜索结果上做分页与懒加载。

---

文件已生成：`.ai/multilevel-tree-modal/multilevel-tree-modal.md`。如需我把该文档复制到 `docs/components` 下或转换为 HTML，告诉我目标位置。