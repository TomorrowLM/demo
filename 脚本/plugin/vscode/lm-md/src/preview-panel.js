function normalizePreviewSelection(message) {
  if (!message || message.type !== "previewSelection") return null;
  const text = String(message.text || "").trim();
  const startLine = Number(message.startLine);
  const endLine = Number(message.endLine);

  if (!text || !Number.isInteger(startLine) || !Number.isInteger(endLine)) {
    return null;
  }
  if (startLine < 1 || endLine < startLine) return null;

  return { text, startLine, endLine };
}

function normalizeSyncSelection(message) {
  if (!message || message.type !== "syncPreviewSelection") return null;
  return normalizePreviewSelection({
    type: "previewSelection",
    text: message.text,
    startLine: message.startLine,
    endLine: message.endLine,
  });
}

function createMarkdownPreviewPanel(context, extensionUri, document, onSelection) {
  const vscode = require("vscode");
  return new MarkdownPreviewPanel(
    vscode,
    context,
    extensionUri,
    document,
    onSelection,
  );
}

class MarkdownPreviewPanel {
  constructor(vscode, context, extensionUri, document, onSelection) {
    this.vscode = vscode;
    this.extensionUri = extensionUri;
    this.document = document;
    this.onSelection = onSelection;
    this.panel = vscode.window.createWebviewPanel(
      "lmMdPreview",
      `Preview: ${vscode.workspace.asRelativePath(document.uri)}`,
      vscode.ViewColumn.Beside,
      { enableScripts: true, retainContextWhenHidden: true },
    );

    this.panel.webview.onDidReceiveMessage(
      (message) => {
        if (message && message.type === "previewSelection") {
          const selection = normalizePreviewSelection(message);
          if (selection) {
            this.lastSelection = selection;
            void this.panel.webview.postMessage({
              type: "selectionAvailable",
              selection,
            });
          }
          return;
        }

        const selection = normalizeSyncSelection(message);
        if (selection) this.onSelection(this.document.uri, selection);
      },
      null,
      context.subscriptions,
    );

    this.panel.onDidDispose(() => {
      this.disposed = true;
    }, null, context.subscriptions);

    this.update(document);
  }

  update(document) {
    if (this.disposed) return;
    this.document = document;
    const body = renderPreviewBody(document.getText());
    const scriptUri = this.panel.webview.asWebviewUri(
      this.vscode.Uri.joinPath(this.extensionUri, "media", "preview.js"),
    );
    this.panel.webview.html = buildPreviewHtml(
      body,
      this.panel.webview.cspSource,
      scriptUri,
    );
  }

  setExtensionUri(extensionUri) {
    this.extensionUri = extensionUri;
    this.update(this.document);
  }
}

function renderPreviewBody(markdown) {
  const { renderMarkdownWithSourceMap } = require("./markdown-renderer");
  return renderMarkdownWithSourceMap(markdown);
}

function buildPreviewHtml(body, cspSource, scriptUri) {
  const nonce = createNonce();
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'none'; style-src ${cspSource} 'nonce-${nonce}'; script-src ${cspSource};"
  >
  <style nonce="${nonce}">
    :root { color-scheme: light dark; }
    body { max-width: 900px; margin: 0 auto; padding: 24px 32px 56px; color: var(--vscode-editor-foreground); background: var(--vscode-editor-background); font-family: var(--vscode-font-family); line-height: 1.65; }
    .lm-md-toolbar { position: sticky; top: 0; z-index: 2; display: flex; align-items: center; gap: 12px; min-height: 32px; padding: 8px 0; margin-bottom: 18px; background: color-mix(in srgb, var(--vscode-editor-background) 92%, transparent); border-bottom: 1px solid var(--vscode-panel-border); }
    .lm-md-status { flex: 1; color: var(--vscode-descriptionForeground); font-size: 12px; }
    button { border: 1px solid var(--vscode-button-border, transparent); border-radius: 4px; padding: 5px 10px; color: var(--vscode-button-foreground); background: var(--vscode-button-background); cursor: pointer; }
    button:disabled { opacity: .55; cursor: default; }
    pre { overflow: auto; padding: 12px 14px; background: var(--vscode-textCodeBlock-background); }
    code { font-family: var(--vscode-editor-font-family); }
    blockquote { border-left: 3px solid var(--vscode-textBlockQuote-border); padding-left: 14px; color: var(--vscode-textBlockQuote-foreground); }
    a { color: var(--vscode-textLink-foreground); }
    table { border-collapse: collapse; }
    th, td { border: 1px solid var(--vscode-panel-border); padding: 5px 9px; }
  </style>
</head>
<body>
  <div class="lm-md-toolbar">
    <span class="lm-md-status" id="lm-md-status">在预览中选择文字后同步到 Copilot</span>
    <button id="lm-md-sync" type="button" disabled>同步到 Copilot</button>
  </div>
  <main>${body}</main>
  <script src="${scriptUri}"></script>
</body>
</html>`;
}

function createNonce() {
  return Math.random().toString(36).slice(2, 14);
}

module.exports = {
  buildPreviewHtml,
  createMarkdownPreviewPanel,
  normalizePreviewSelection,
};
