# LM Markdown Copilot Preview

在 VS Code 中打开一个可选中的 Markdown 预览：用户可以直接选中渲染后的标题、段落、列表或代码块，插件会把预览选区映射回源 `.md` 文件的行范围，然后交给 VS Code 原生 Copilot Chat。

插件不实现模型、不实现聊天窗口，也不调用自己的 API。Copilot 负责输入框、模型回复、修改 diff、应用和撤销。

## 功能

- Markdown 渲染预览：`LM Markdown: Open Selectable Preview`
- 预览文字选区携带源文件行号元数据
- 点击“同步到 Copilot”后，激活源 Markdown 编辑器并设置真实选区
- 打开原生 Copilot Chat，让 Copilot 自动获取当前 Markdown 文件和选区上下文
- 编辑源文件后，已打开的预览自动刷新
- 没有 Copilot 时仍可使用 Markdown 预览，但同步动作会提示失败

## 开发运行

```powershell
Set-Location 'D:\LM\lm-project\脚本\plugin\vscode\lm-md'
npm.cmd install
npm.cmd test
```

在 VS Code 中打开本目录，按 `F5` 启动 Extension Development Host。开发宿主中打开一个 `.md` 文件后，可以通过命令面板执行：

```text
LM Markdown: Open Selectable Preview
```

也可以在 Markdown 编辑器右键菜单中执行同名命令。

## 使用流程

1. 在 Extension Development Host 中打开 Markdown 文件。
2. 执行 `LM Markdown: Open Selectable Preview`。
3. 在预览中选择一段标题、正文、列表、引用或代码块内容。
4. 点击预览顶部出现的“同步到 Copilot”。
5. 插件切回源 Markdown 编辑器，设置对应的源文件行选区，并打开原生 Copilot Chat。
6. 在 Copilot 输入框中输入“请优化这段 Markdown”或其他要求。
7. 由 Copilot 自己生成回复、展示修改 diff，并由用户决定 Keep 或 Undo。

## 选区映射规则

预览渲染器为块级节点添加源行号。预览选区跨越多个块时，插件使用起始块的最小行号和结束块的最大行号，选中源文件中的完整行范围。这样可以保证 Copilot 获得完整的 Markdown 结构，但选区可能包含预览中未拖选的同一块其他文字。

## 项目结构

```text
lm-md/
├── extension.js                 # VS Code 激活入口、命令和预览刷新
├── src/markdown-renderer.js     # Markdown 渲染和源行号元数据
├── src/preview-panel.js         # Webview 预览和选区消息协议
├── src/copilot-selection.js     # 源文件选区转换和原生 Chat 调用
├── media/preview.js             # Webview 选区采集脚本
└── test/                        # 纯 Node.js 单元测试
```

## 注意事项

- 需要安装并启用 GitHub Copilot Chat，插件不会提供模型或 API Key。
- 该扩展使用 VS Code 公开命令打开原生 Chat，不操作 Copilot 内部 DOM。
- 预览选区最终映射到源文件块级行范围，而不是字符级精确范围。
- VS Code 版本需要满足 `package.json` 中声明的最低版本。
