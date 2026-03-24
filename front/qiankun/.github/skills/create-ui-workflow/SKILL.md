---
name: create-ui-workflow
description: "当需要根据 page.json 和 UI 图片创建页面时使用，尤其适用于必须先执行 create_api_mcp 再执行 create_ui_mcp、需要把 apiName 回填到 page.json、或需要编排 create_api_mcp 与 create_ui_mcp 的完整页面生成流程时。"
---

# Create UI 工作流

## 目标

这个 skill 用来统一当前仓库里“基于 page.json 和 UI 图片生成页面代码”的工作流。

它专门处理以下组合流程：

1. `create_api_mcp`
2. `create_ui_mcp`
3. 以 `page.json` 作为单一事实来源

当任务不是“单独调用一个 MCP 工具”，而是“正确完成整条页面生成链路”时，应优先使用这个 skill。

## 适用场景

当用户提出以下需求时使用：

1. 根据 `page.json` 创建页面
2. 根据 UI 图片生成页面代码
3. 需要先执行 `create_api_mcp` 再执行 `create_ui_mcp`
4. 需要把 `apiName` 回填到 `page.json`
5. 需要编排 API 生成和页面生成的完整流程
6. 排查 `create_ui_mcp` 因缺少 `apiName` 无法执行的问题

以下情况不要使用这个 skill：

1. 与页面工作流无关的普通 TypeScript 编码
2. 独立的 Swagger 查询或模型查看
3. 与页面生成无关的运行时调试

## 工作流约定

当前仓库推荐的流程是：

1. 读取 `page.json`
2. 检查 `page.requests`
3. 如果存在缺少 `apiName` 的请求项，先执行 `create_api_mcp`
4. 从返回结果中提取 API 函数名，并写回到 `page.json` 的 `apiName`
5. 再使用 `{ "page": "..." }` 形式执行 `create_ui_mcp`
6. 使用返回的 JSON 结果生成页面和子组件代码

重要约束：

1. `create_ui_mcp` 不会在内部执行 `create_api_mcp`
2. 当 `page.requests` 存在时，`create_ui_mcp` 要求 `page.requests[].apiName` 已经存在
3. UI 图片路径来源于 `page.uiPath` 和 `page.children[].uiPath`
4. `page.depends` 用于描述组件、utils、model、images 等依赖，`page.requirements` 用于描述布局和交互要求
5. `create_ui_mcp` 的返回结构应与当前业务页面对应的 `return.json` 目标结构保持一致

## 输入与关键文件

主要涉及两类文件：

### 1. 固定实现文件

这些文件属于当前仓库里 create-api / create-ui 工作流的实现本身：

1. `ai/mcp/src/server/feature/createUI/index.ts`
2. `ai/mcp/src/server/feature/createUI/instruction.ts`
3. `ai/mcp/src/server/feature/createApi/index.ts`
4. `ai/mcp/src/server/feature/createApi/instruction.ts`

### 2. 动态业务输入文件

这些文件不是固定路径，而是运行时根据用户输入动态确定：

1. 用户传入的 `page.json`
2. 与该页面流程对应的 `return.json` 样例或目标返回结构
3. `page.uiPath` 指向的主页面图片
4. `page.children[].uiPath` 指向的子组件图片
5. 业务目录中与该页面相关的配置文件

当用户给出业务目录中的页面路径时，应优先读取用户指定的 `page.json`，并检查对应业务目录中的 UI 图片和页面配置，而不是依赖仓库内某个固定示例路径。

当前 page.json 结构里，常见字段职责如下：

1. `page.depends`：组件、工具、模型、图片等依赖声明
2. `page.requirements`：布局、按钮、交互等页面要求
3. `page.children[].depends`：子组件依赖
4. `page.children[].requirements`：子组件自身的实现要求

## 必要的 MCP 调用顺序

### 情况 1：`page.requests` 为空或不存在

只需要调用：

1. `create_ui_mcp`

### 情况 2：`page.requests` 存在，且每一项都已经有 `apiName`

只需要调用：

1. `create_ui_mcp`

### 情况 3：`page.requests` 存在，但某些项缺少 `apiName`

必须按顺序执行：

1. 从 `page.json` 中提取 `requests`
2. 调用 `create_api_mcp`
3. 识别每个请求对应返回的 API 函数名
4. 把 `apiName` 写回 `page.json`
5. 再调用 `create_ui_mcp`

如果当前仓库工作流依赖 `page.json` 作为单一事实来源，不要跳过“回填”这一步。

## 期望的工具入参形态

### `create_api_mcp`

调用示例：

```json
{
	"requests": [
		{
			"source": "https://example.com/swagger#/tag/operationId",
			"targetPath": "doc/test/api.ts"
		}
	]
}
```

### `create_ui_mcp`

调用示例：

```json
{
	"page": "<用户传入的 page.json 路径>"
}
```

例如：

```json
{
	"page": "ai\\doc\\demand\\某业务\\某页面\\page.json"
}
```

## `create_ui_mcp` 的期望返回结构

期望返回结构如下：

```json
{
	"type": "create_ui",
	"description": "页面描述",
	"page": {
		"name": "页面名称",
		"description": "页面描述",
		"uiPath": "主页面图片路径",
		"targetPath": "页面目标路径",
		"type": "page",
		"requests": [],
		"tools": {},
		"children": []
	},
	"instruction": {
		"tasks": [],
		"additionalNotes": []
	}
}
```

其中：

1. `instruction` 用来描述模型下一步应该创建什么
2. `page` 保持页面源配置，并可包含诸如 `type: "page"` 这类规范化字段
3. `instruction.tasks[].requirements` 需要同时体现 `depends` 和 `requirements` 的约束
4. 这里的结构是目标返回协议，具体内容应以当前业务页面的 `page.json` 和对应 `return.json` 约定为准

## API 名称处理规则

当执行 `create_api_mcp` 后，工作流必须确定最终的 API 函数名，并将其回填到 `page.json`。

优先规则：

1. 如果返回结果里已经明确给出 API 函数名，直接使用
2. 否则从 Swagger 的 `operationId` 推导

回填目标字段是：

1. `page.requests[].apiName`

如果后续步骤依赖这个名字，不要把 API 命名仅作为注释或隐式说明保留。

## 实现建议

当实现或更新这条工作流时：

1. 让 `create_api_mcp` 专注于生成 API 指令
2. 让 `create_ui_mcp` 专注于读取 `page.json` 并返回 UI 指令
3. 除非仓库明确要求，否则不要把图片路径复制到冗余字段中
4. 优先使用 `page.uiPath` 和 `page.children[].uiPath`，而不是额外派生图片路径数组
5. 生成 instruction 时要把 `page.depends` 和 `page.requirements` 分开处理，不要混用字段语义
6. 保持当前业务页面对应的 `return.json` 目标结构与真实 MCP 返回结构一致

## 校验清单

在认为工作流完成之前，确认以下事项：

1. `page.json` 是合法 JSON
2. 在执行 `create_ui_mcp` 之前，每个 `requests` 项都已经有 `apiName`
3. `create_ui_mcp` 返回了期望的顶层字段：`type`、`description`、`page`、`instruction`
4. `instruction.tasks` 与页面和子组件的目标文件一致
5. `instruction.tasks[].requirements` 能体现 `depends` 与 `requirements` 的信息
6. 当前业务页面对应的 `return.json` 目标结构与实际运行时返回结构一致

## 常见失败模式

1. `create_ui_mcp` 执行失败，因为 `apiName` 从未被回填到 `page.json`
2. 当前业务页面对应的 `return.json` 目标结构与真实 MCP 输出发生偏离
3. 把 `page.depends` 错当成页面交互要求，导致 instruction 丢失真实布局/按钮约束
4. 图片路径被复制到多个冗余字段后逐渐失去一致性
5. `create_api_mcp` 虽然返回了有用指令，但没有把明确的 API 名称持久化下来

## 推荐的代理行为

使用这个 skill 时，代理应当：

1. 优先检查用户传入的 `page.json`
2. 先判断是否需要执行 `create_api_mcp`
3. 优先返回显式的结构化结果，而不是只给自然语言说明
4. 保持工作流顺序清晰、可观察
5. 总结哪些内容被生成、哪些内容被回填
6. 避免把某个示例业务路径误当成固定输入路径
