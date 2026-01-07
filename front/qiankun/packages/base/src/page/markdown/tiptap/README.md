请生成一个<my-block>组件，并模拟后端给富文本或者markdown两种情况下的功能

## TipTap 文档高亮方案说明

## 目录

- [0. tiptap 目录结构](#0-tiptap-目录结构)
- [1. 需求概述](#1-需求概述)
- [2. 功能点与技术实现](#2-功能点与技术实现)
	- [2.1 编辑不暴露源码](#21-编辑不暴露源码)
	- [2.2 自定义指定高亮文本](#22-自定义指定高亮文本)
	- [2.3 React--vue-同时使用同一份高亮数据](#23-react--vue-同时使用同一份高亮数据)
	- [2.4 从列表定位到对应高亮文本](#24-从列表定位到对应高亮文本)
	- [2.5 适配手机与-pc](#25-适配手机与-pc)
- [3. 后端需要提供的文档数据结构](#3-后端需要提供的文档数据结构)
- [4. 典型交互流程](#4-典型交互流程)
- [5. 小结](#5-小结)

### 0. tiptap 目录结构

```text
packages/base/src/page/markdown/tiptap/
├── index.tsx                 # 页面入口组件，集成 TipTap 编辑器与高亮侧边栏
├── README.md                 # 本说明文档
├── styles.less               # 页面样式（布局、自适应、highlight 样式等）
├── components/
│   └── ReactHighlightWidget.tsx # React 侧高亮摘要组件，同时被封装为 Web Component
└── hooks/
		├── useTiptapHighlight.ts   # 高亮核心逻辑：mark 扩展、增删查跳转等 Hook
		└── useHighlightBubbleMenu.tsx # 基于 BubbleMenu 的选区高亮气泡菜单 Hook
```

### 1. 需求概述

本方案基于 TipTap 富文本编辑器，实现一套“文档内容 + 高亮元数据”的高亮能力，满足以下需求：

1. 编辑时**不暴露源码**，所见即所得；
2. 前端可**自定义指定高亮的文本**（手动选中 / 按关键字自动检索）；
3. 高亮数据可在 **Vue 与 React 中同时使用**，并能作为输入接入各自组件；
4. 可从高亮列表**定位并滚动到对应的高亮文本**；
5. 页面布局**兼容手机与 PC** 的展示与交互。

核心思想：后端只负责存储/下发“文档内容 + 高亮列表”，前端利用 TipTap 的 mark 扩展在渲染时还原高亮，并将同一份高亮数据暴露给 React / Vue 组件消费。

---

### 2. 功能点与技术实现

#### 2.1 编辑不暴露源码

- 文档在后端以 **HTML 或 TipTap JSON** 的形式存储，例如 `content` 字段为 HTML 片段；
- 前端使用 TipTap（基于 ProseMirror）渲染并编辑：
	- 用户只看到排版后的富文本，不直接看到 Markdown/原始源码；
	- 常规排版能力由 `StarterKit` 提供（标题、列表、加粗等）。

#### 2.2 自定义指定高亮文本

- 基于 `@tiptap/extension-highlight` 扩展一个 `HighlightMark`：
	- 新增属性：`id`（唯一标识）、`color`（背景色）、`label`（标签说明）；
	- 在 `renderHTML` 中输出带 `data-highlight-id` / `data-highlight-color` / `data-highlight-label` 的标记元素，并设置 `background-color` 等样式；
	- 统一附加类名 `tiptap-highlight-mark` 以便 CSS 控制。

- 高亮创建方式：
	1. **选中文本高亮**：
		 - 用户在编辑器中用鼠标或键盘选中一段文本；
		 - 触发 `createHighlight({ from, to })`，内部执行：
			 - `editor.chain().focus().setTextSelection(range).setHighlight({ id, color, label }).run()`。
	2. **按关键字自动高亮**：
		 - 用户在输入框里输入关键字；
		 - 使用 `findRangeByText(editor.state.doc, keyword)` 在文档中查找首次匹配的 `{ from, to }`；
		 - 找到后同样调用 `createHighlight(range, keyword, { label })` 进行高亮。

#### 2.3 React / Vue 同时使用同一份高亮数据

- 前端统一的高亮记录结构（在 Hook 内部定义）：

```ts
type HighlightRecord = {
	id: string;
	text: string;
	color: string;
	label: string;
	from: number;
	to: number;
	createdAt: string;
};
```

- **React 侧**：
	- 使用自定义 Hook `useTiptapHighlight(editor)` 管理高亮：
		- 提供 `highlights: HighlightRecord[]` 状态；
		- 提供 `createHighlight / handleHighlightSelection / handleJumpToHighlight / handleRemoveHighlight / handleClearHighlights` 等方法；
	- React 组件（如侧边“高亮列表”、“统计面板”等）直接以 `highlights` 作为 props 进行渲染。

- **Vue 侧**：
	- 通过 Web Component `highlight-bridge` 作为跨框架数据桥：
		- React 端在 `useEffect` 内：
			- 将 `highlights` 写入 `window.__TIPTAP_HIGHLIGHTS__`；
			- 分发 `window.dispatchEvent(new CustomEvent("tiptap-highlight-change", { detail: { highlights } }))`；
			- 同时将 `highlights` 赋值给 `<highlight-bridge>` 实例的 `highlights` 属性；
		- Vue 端只需引入该 Web Component，并监听其属性/事件，即可拿到同一份 `HighlightRecord[]`，再转给自己的 Vue 组件使用。

#### 2.4 从列表定位到对应高亮文本

- 在 `HighlightRecord` 中保存 `id / text / from / to` 等信息；
- 点击侧边列表中的某一条高亮时：
	- 调用 `handleJumpToHighlight(item)`：
		- 通过 `id` 调用 `findRangeByHighlightId(editor, item.id)` 在文档结构中反查 mark 对应的 `{ from, to }`；
		- 若失败，则回退为 `findRangeByText(editor.state.doc, item.text)` 或直接使用保存的 `from/to`；
	- 通过 `editor.chain().focus().setTextSelection(range).run()` 将光标跳转到该片段；
	- 通过 `editor.commands.scrollIntoView()` 滚动到可视区域；
	- 额外在对应 DOM 元素上加类 `is-highlight-target`，配合 CSS 做短暂闪烁或边框高亮动画。

#### 2.5 适配手机与 PC

- **布局适配**：
	- 外层容器采用 `flex` 布局 + 媒体查询：
		- PC：左侧为编辑区，右侧为高亮列表和跨框架联动区；
		- Mobile：上下布局（编辑在上，列表在下）或右侧抽屉式展开侧栏；
	- 保证交互元素在移动端有足够点击区域和合适字号行高。

- **编辑体验**：
	- TipTap 基于 `contenteditable`，原生支持移动端文本输入和选择；
	- 结合样式（如禁用多余 hover 效果、放大按钮点击区域）提升手机体验。

---

### 3. 后端需要提供的文档数据结构

后端只需要关心“文档 + 高亮元数据”的存储和下发，不参与高亮渲染细节。推荐返回结构示例如下：

```json
{
	"docId": "string",                 
	"title": "string",                
	"contentType": "html",            
	"content": "<h2>...</h2>...",     
	"highlights": [
		{
			"id": "hl_123456",           
			"text": "被高亮的原始文本",      
			"label": "业务含义或备注",       
			"color": "#fde68a",          
			"from": 120,                   
			"to": 130,                     
			"createdAt": "2025-01-01T12:00:00Z"
		}
	]
}
```

说明：

- `contentType`
	- `html`：`content` 为 HTML 片段，前端用 TipTap 的 HTML 扩展解析；
	- 也可以约定为 `tiptap-json`，内容是 TipTap 文档 JSON，前端直接用 `content` 初始化编辑器。

- `highlights` 数组为本方案的关键：
	- **必需字段**：
		- `id`: 高亮唯一标识（可由前端生成后回传，也可后端生成）；
		- `text`: 对应的原文文本，便于前端在位置不精确时回退按文本搜索；
	- **推荐字段**：
		- `from` / `to`: TipTap 文档中的位置，用于精准还原高亮；
		- `label`: 标签说明，例如“风险点”、“重点”、“批注1”；
		- `color`: 建议使用的颜色，若为空则前端按调色板自动轮换；
		- `createdAt`: 创建时间，方便排序与审计。

在实际实现中，前端在“保存文档”时，可以直接将当前的 `highlights: HighlightRecord[]` 原样上传给后端；后端在“获取文档”时再原样下发。这样可以确保：

- 高亮的位置信息与文档结构保持一致；
- 无需后端重新计算 `from/to`，降低实现成本；
- 前端每次加载时都能通过 `from/to` 快速恢复高亮，并在定位失败时以 `text` 作兜底搜索。

---

### 4. 典型交互流程

1. **前端请求文档详情**：`GET /api/docs/{docId}`；
2. 后端按上述结构返回 `content + highlights`；
3. 前端用 `content` 初始化 TipTap，用 `highlights` 遍历调用 `createHighlight` 还原所有高亮；
4. 用户在编辑区继续编辑文档，或新增/删除高亮；
5. 用户点击“保存”：前端组装最新的 `content + highlights`，调用 `PUT /api/docs/{docId}`；
6. 后端持久化存储并返回成功状态。

---

### 5. 小结

- 前端通过 TipTap 的 mark 扩展，将“高亮”抽象为带 `id/color/label` 的富文本标记；
- 通过 `HighlightRecord[]` 这一统一结构，实现 React / Vue / Web Component 对同一份高亮数据的共享与联动；
- 通过 `from/to + text` 的组合，提高高亮在文档变更后的可恢复性与定位稳定性；
- 后端只需按约定结构存储和下发文档，不参与渲染细节，即可支撑多端高亮能力。

