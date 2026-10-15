const vscode = require("vscode");
const {
  createMarkdownPreviewPanel,
} = require("./src/preview-panel");
const { syncSelectionToCopilot } = require("./src/copilot-selection");

class PreviewManager {
  constructor(context, onSelection) {
    this.context = context;
    this.onSelection = onSelection;
    this.panels = new Map();
  }

  open(document) {
    const key = document.uri.toString();
    const existing = this.panels.get(key);
    if (existing && !existing.disposed) {
      existing.panel.reveal(vscode.ViewColumn.Beside);
      existing.update(document);
      return existing;
    }

    const panel = createMarkdownPreviewPanel(
      this.context,
      this.context.extensionUri,
      document,
      this.onSelection,
    );
    this.panels.set(key, panel);
    return panel;
  }

  update(document) {
    const panel = this.panels.get(document.uri.toString());
    if (panel && !panel.disposed) panel.update(document);
  }
}

function activate(context) {
  const previewManager = new PreviewManager(context, (uri, selection) => {
    void syncSelectionToCopilot(vscode, uri, selection).catch((error) => {
      vscode.window.showErrorMessage(
        `无法打开 Copilot Chat：${error instanceof Error ? error.message : String(error)}`,
      );
    });
  });

  context.subscriptions.push(
    vscode.commands.registerCommand("lmMd.openPreview", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== "markdown") {
        vscode.window.showWarningMessage("请先打开 Markdown 文件。");
        return;
      }
      previewManager.open(editor.document);
    }),

    vscode.commands.registerCommand("lmMd.openCopilotForSelection", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== "markdown") {
        vscode.window.showWarningMessage("请先打开 Markdown 文件。");
        return;
      }

      const text = editor.document.getText(editor.selection).trim();
      if (!text) {
        vscode.window.showWarningMessage("请先选择 Markdown 内容。");
        return;
      }

      try {
        await syncSelectionToCopilot(vscode, editor.document.uri, {
          startLine: editor.selection.start.line + 1,
          endLine: editor.selection.end.line + 1,
        });
      } catch (error) {
        vscode.window.showErrorMessage(
          `无法打开 Copilot Chat：${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }),

    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.languageId === "markdown") {
        previewManager.update(event.document);
      }
    }),
  );

  context.subscriptions.push({
    dispose() {
      previewManager.panels.clear();
    },
  });
}

function deactivate() {}

module.exports = { activate, deactivate };
