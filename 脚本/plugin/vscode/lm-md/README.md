# LM Markdown Copilot Preview

在 VS Code 中打开一个可选中的 Markdown 预览：用户可以直接选中渲染后的标题、段落、列表或代码块，插件会把预览选区映射回源 `.md` 文件的行范围，然后交给 VS Code 原生 Copilot Chat。插件同时注册为 `.md` 的默认自定义编辑器，因此可从编辑器类型下拉菜单切回“文本编辑器”。

插件不实现模型、不实现聊天窗口，也不调用自己的 API。Copilot 负责输入框、模型回复、修改 diff、应用和撤销。

## 功能

- Markdown 渲染预览：`LM Markdown: Open Selectable Preview`
- Mermaid 代码围栏使用扩展内置渲染器预览，离线可用，并跟随预览明暗主题
- Markdown 图片支持相对路径和工作区资源；兼容安全的 `<font color>` / `style="color:..."` 标签
- `.md` 默认使用 `LM Markdown Preview`，编辑器右上角下拉菜单可以切换“文本编辑器”
- 预览右侧层级目录：同级标题文本对齐，点击标题跳转，可隐藏/显示目录
- 预览文字选区携带源文件行号元数据
- 点击 Copilot 中的 Markdown 行引用时，若 VS Code 提供对应源码行号，会自动打开并定位预览、短暂高亮内容并同步目录；也可在 Markdown 源码右键选择“LM Markdown: Reveal Location in Preview”，或从命令面板运行后输入行号
- 预览中选择文本后右键可“加粗”或“源码定位”；加粗会在源 Markdown 中插入 `**`（可用 VS Code 撤销），源码定位会在右侧分屏打开源码并定位到对应行
- 点击“同步到 Copilot”后保持当前预览不变，把当前选中的 Markdown 行范围作为一个新引用附加到原生 Copilot Chat；继续选择其他片段并再次同步，会在 Copilot 输入框中追加引用。插件只保留当前选区，不记录已同步片段
- `Ctrl+F` 显示/隐藏预览顶部工具栏
- `Ctrl+H` 显示/隐藏整个当前文件变化容器（预览获得焦点时）
- 预览中选中文字后可以右键执行“加粗”“复制”或“同步到 Copilot”；源 Markdown 编辑器也提供同步命令
- 编辑源文件后，已打开的预览自动刷新
- 按磁盘保存内容与当前 Markdown 计算净变化，显示文件、精确行范围、增删行数及改动前后片段；整文件替换会重新按行比对；点击改动或上一处/下一处可定位并高亮预览中的位置
- 改动区支持手动重算、固定操作栏和独立滚动；另可展开查看本会话捕获的编辑事件
- Copilot 修改及在文本编辑器与预览间切换时，会保留目录/章节折叠、目录隐藏和搜索状态
- “在源码中审阅”会在预览旁打开普通文本编辑器并定位改动范围，可继续使用 Copilot 原生审阅控件
- 没有 Copilot 时仍可使用 Markdown 预览，但同步动作会提示失败

## 开发运行

```powershell
Set-Location 'D:\LM\lm-project\脚本\plugin\vscode\lm-md'
npm.cmd install
npm.cmd run build:mermaid
npm.cmd test
```

在 VS Code 中打开本目录，按 `F5` 启动 Extension Development Host。开发宿主中打开一个 `.md` 文件后，默认会进入 `LM Markdown Preview`；可以通过编辑器右上角类型下拉菜单切换回“文本编辑器”。也可以通过命令面板执行：

```text
LM Markdown: Open Selectable Preview
```

也可以在 Markdown 编辑器右键菜单中执行同名命令。

## 使用流程

1. 在 Extension Development Host 中打开 Markdown 文件。
2. 预览右侧目录可以隐藏/显示，目录按 Markdown 标题层级缩进；点击目录标题可跳转，正文标题旁的箭头可以折叠章节。
3. 在预览中选择文字后可右键“加粗”以修改源 Markdown，或选择“同步到 Copilot”把片段作为新引用添加到 Copilot 输入框；要添加其他片段，重新选择后再次同步。插件不保存已同步选区的历史。
4. 当前预览保持不变，Copilot 会获得该片段对应的文件行范围上下文。按 `Ctrl+F` 可隐藏或重新显示顶部工具栏；按 `Ctrl+H` 可隐藏或重新显示整个当前文件变化容器。
5. 在 Copilot 输入框中输入“请优化这段 Markdown”或其他要求。
6. 由 Copilot 自己生成回复、展示修改 diff，并由用户决定 Keep 或 Undo。

## 选区映射规则

预览渲染器为块级节点添加源行号。预览选区跨越多个块时，插件使用起始块的最小行号和结束块的最大行号，选中源文件中的完整行范围。这样可以保证 Copilot 获得完整的 Markdown 结构，但选区可能包含预览中未拖选的同一块其他文字。

## 项目结构

```text
lm-md/
├── extension.js                 # VS Code 激活入口、命令和预览刷新
├── src/markdown-renderer.js     # Markdown 渲染和源行号元数据
├── src/preview-panel.js         # Webview 预览和选区消息协议
├── src/custom-editor.js         # .md 默认自定义编辑器
├── src/change-history.js        # 当前会话的文档改动记录
├── src/preview-state.js          # 当前会话内按文档保存预览折叠状态
├── src/source-review.js         # 在原生文本编辑器中定位改动
├── src/copilot-selection.js     # 源文件选区转换和原生 Chat 调用
├── media/preview.js             # Webview 选区采集脚本
└── test/                        # 纯 Node.js 单元测试
```

## 注意事项

- 需要安装并启用 GitHub Copilot Chat，插件不会提供模型或 API Key。
- 该扩展使用 VS Code 公开命令打开原生 Chat，不操作 Copilot 内部 DOM。
- 预览选区最终映射到源文件块级行范围，而不是字符级精确范围。
- 改动净差异和编辑事件只保存在当前扩展会话内；事件列表每个文件最多保留最近 30 条，只捕获扩展开始监听后的文档变化，不区分 Copilot 与手动编辑，也不写入历史文件。净差异用于去除重复/整文替换事件造成的噪声，并不代表 Copilot 原生待审清单。
- “在源码中审阅”负责定位，不模拟 Copilot 的保留/撤销；是否显示 Copilot 原生待审阅控件取决于当前 Agent 会话模式和该文件是否仍有待审阅改动。
- VS Code 版本需要满足 `package.json` 中声明的最低版本。
