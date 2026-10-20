const vscode = require("vscode");
const {
  createMarkdownPreviewPanel,
} = require("./src/preview-panel");
const { syncSelectionToCopilot } = require("./src/copilot-selection");
const { MarkdownCustomEditorProvider } = require("./src/custom-editor");
const { MarkdownChangeHistory } = require("./src/change-history");
const { PreviewStateStore } = require("./src/preview-state");
const { openSourceReview } = require("./src/source-review");

const CUSTOM_EDITOR_VIEW_TYPE = "lmMd.previewEditor";

class PreviewManager {
  constructor(context, onSelection, changeHistory, onSourceReview, previewStateStore) {
    this.context = context;
    this.onSelection = onSelection;
    this.changeHistory = changeHistory;
    this.onSourceReview = onSourceReview;
    this.previewStateStore = previewStateStore;
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
      this.changeHistory.get(document.uri),
      this.onSourceReview,
      this.previewStateStore,
      this.changeHistory,
    );
    this.panels.set(key, panel);
    return panel;
  }

  update(document) {
    const panel = this.panels.get(document.uri.toString());
    if (panel && !panel.disposed) {
      panel.update(document, this.changeHistory.get(document.uri));
    }
  }

  toggleToolbar() {
    for (const panel of this.panels.values()) {
      if (!panel.disposed && panel.panel.visible) {
        void panel.panel.webview.postMessage({ type: "toggleToolbar" });
      }
    }
  }
}

function activate(context) {
  const syncSelection = (uri, selection) =>
    syncSelectionToCopilot(vscode, uri, selection);
  const changeHistory = new MarkdownChangeHistory(vscode.workspace.textDocuments);
  const previewStateStore = new PreviewStateStore();
  const sourceReview = (uri, range) => openSourceReview(vscode, uri, range);
  const previewManager = new PreviewManager(
    context,
    syncSelection,
    changeHistory,
    sourceReview,
    previewStateStore,
  );
  const customEditorProvider = new MarkdownCustomEditorProvider(
    vscode,
    context,
    syncSelection,
    changeHistory,
    sourceReview,
    previewStateStore,
  );

  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(
      CUSTOM_EDITOR_VIEW_TYPE,
      customEditorProvider,
      {
        supportsMultipleEditorsPerDocument: false,
        webviewOptions: { retainContextWhenHidden: true },
      },
    ),
    customEditorProvider,

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

      const selections = (editor.selections || [editor.selection])
        .filter((selection) => selection && !selection.isEmpty);
      const text = selections
        .map((selection) => editor.document.getText(selection).trim())
        .filter(Boolean)
        .join("\n");
      if (!text) {
        vscode.window.showWarningMessage("请先选择 Markdown 内容。");
        return;
      }

      const ranges = selections.map((selection) => ({
        startLine: selection.start.line + 1,
        endLine: selection.end.line + 1,
      }));
      try {
        await syncSelectionToCopilot(vscode, editor.document.uri, {
          ranges,
        });
        vscode.window.showInformationMessage(
          ranges.length === 1
            ? `已同步 Markdown 第 ${ranges[0].startLine}-${ranges[0].endLine} 行到 Copilot Chat。`
            : `已同步 Markdown ${ranges.length} 处选区到 Copilot Chat。`,
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          `无法打开 Copilot Chat：${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }),

    vscode.commands.registerCommand("lmMd.togglePreviewToolbar", () => {
      previewManager.toggleToolbar();
      customEditorProvider.toggleToolbar();
    }),

    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.languageId === "markdown") {
        changeHistory.record(event);
        previewManager.update(event.document);
      }
    }),
    vscode.workspace.onDidOpenTextDocument((document) => {
      if (document.languageId === "markdown") changeHistory.seed(document);
    }),
    vscode.workspace.onDidSaveTextDocument((document) => {
      if (document.languageId !== "markdown") return;
      changeHistory.markSaved(document);
      previewManager.update(document);
    }),
    { dispose: () => changeHistory.dispose() },
    { dispose: () => previewStateStore.dispose() },
  );

  context.subscriptions.push({
    dispose() {
      previewManager.panels.clear();
    },
  });
}

function deactivate() {}

module.exports = { activate, deactivate };
