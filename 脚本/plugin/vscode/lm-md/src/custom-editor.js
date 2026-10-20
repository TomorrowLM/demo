const {
  buildPreviewHtml,
  createPreviewMessageHandler,
  createMarkdownImageResolver,
  getMarkdownPreviewResourceRoots,
  renderChangeHistory,
  renderTableOfContents,
  renderPreviewDocument,
  readSavedDocumentText,
} = require("./preview-panel");

class MarkdownCustomEditorProvider {
  constructor(vscode, context, onSelection, changeHistory, onSourceReview, previewStateStore, onFormatBold) {
    this.vscode = vscode;
    this.context = context;
    this.onSelection = onSelection;
    this.changeHistory = changeHistory;
    this.onSourceReview = onSourceReview;
    this.previewStateStore = previewStateStore;
    this.onFormatBold = onFormatBold;
    this.disposables = new Set();
    this.webviewPanels = new Map();
    this.previewPanels = new Map();
  }

  async resolveCustomTextEditor(document, webviewPanel) {
    const { vscode, context } = this;
    const webview = webviewPanel.webview;
    this.webviewPanels.set(webviewPanel, webview);
    const documentKey = document.uri.toString();
    const previewRecord = {
      panel: webviewPanel,
      webview,
      ready: false,
      pendingLine: null,
    };
    this.previewPanels.set(documentKey, previewRecord);
    webview.options = {
      enableScripts: true,
      localResourceRoots: getMarkdownPreviewResourceRoots(
        vscode,
        context.extensionUri,
        document.uri,
      ),
    };

    let initialHtmlSet = false;
    let webviewReady = false;
    let pendingUpdate = null;
    let latestDocument = document;
    const makePayload = (currentDocument) => {
      const rendered = renderPreviewDocument(currentDocument.getText(), {
        resolveImageSource: createMarkdownImageResolver(
          vscode,
          currentDocument.uri,
          webview,
        ),
      });
      const fileName = vscode.workspace.asRelativePath(currentDocument.uri);
      const changeRecords = this.changeHistory?.get(currentDocument.uri) || [];
      const changeEvents = this.changeHistory?.getEvents(currentDocument.uri) || [];
      return {
        bodyHtml: rendered.html,
        tocHtml: renderTableOfContents(rendered.headings),
        changeHistoryHtml: renderChangeHistory(changeRecords, fileName, changeEvents),
        headings: rendered.headings,
        fileName,
      };
    };
    const render = (currentDocument) => {
      latestDocument = currentDocument;
      const payload = makePayload(currentDocument);
      const scriptUri = webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, "media", "preview.js"),
      );
      const mermaidScriptUri = webview.asWebviewUri(
        vscode.Uri.joinPath(
          context.extensionUri,
          "media",
          "mermaid.bundle.js",
        ),
      );
      if (!initialHtmlSet) {
        webview.html = buildPreviewHtml(
          payload.bodyHtml,
          webview.cspSource,
          scriptUri,
          payload.headings,
          {
            changeRecords: this.changeHistory?.get(currentDocument.uri) || [],
            changeEvents: this.changeHistory?.getEvents(currentDocument.uri) || [],
            fileName: payload.fileName,
            mermaidScriptUri: mermaidScriptUri.toString(),
          },
        );
        initialHtmlSet = true;
        return;
      }
      if (!webviewReady) {
        pendingUpdate = payload;
        return;
      }
      void webview.postMessage({ type: "updatePreviewContent", ...payload }).then((sent) => {
        if (!sent) {
          webviewReady = false;
          previewRecord.ready = false;
          pendingUpdate = payload;
        }
      });
    };
    const flushPendingReveal = async () => {
      if (!webviewReady || previewRecord.pendingLine === null) return;
      const line = previewRecord.pendingLine;
      const sent = await webview.postMessage({ type: "revealPreviewLine", line });
      if (sent) {
        previewRecord.pendingLine = null;
      } else {
        webviewReady = false;
        previewRecord.ready = false;
      }
    };

    const messageHandler = createPreviewMessageHandler(
      webview,
      document.uri,
      (uri, selection) => this.onSelection(uri, selection),
      this.onSourceReview,
      async () => {
        webviewReady = true;
        previewRecord.ready = true;
        await webview.postMessage({
          type: "restorePreviewState",
          previewState: this.previewStateStore?.has(document.uri)
            ? this.previewStateStore.get(document.uri)
            : null,
        });
        if (pendingUpdate) {
          const update = pendingUpdate;
          pendingUpdate = null;
          const sent = await webview.postMessage({ type: "updatePreviewContent", ...update });
          if (!sent) {
            webviewReady = false;
            previewRecord.ready = false;
            pendingUpdate = update;
          }
        }
        await flushPendingReveal();
      },
      (uri, state) => this.previewStateStore?.set(uri, state),
      async (uri) => {
        const fileName = vscode.workspace.asRelativePath(uri);
        const savedText = await readSavedDocumentText(vscode, uri);
        this.changeHistory?.refresh(latestDocument, savedText);
        await webview.postMessage({
          type: "updateChangeHistory",
          changeHistoryHtml: renderChangeHistory(
            this.changeHistory?.get(uri) || [],
            fileName,
            this.changeHistory?.getEvents(uri) || [],
          ),
        });
      },
      this.onFormatBold,
    );
    const messageSubscription = webview.onDidReceiveMessage(messageHandler);
    const documentSubscription = vscode.workspace.onDidChangeTextDocument(
      (event) => {
        if (event.document.uri.toString() === document.uri.toString()) {
          render(event.document);
        }
      },
    );
    const saveSubscription = vscode.workspace.onDidSaveTextDocument((savedDocument) => {
      if (savedDocument.uri.toString() !== document.uri.toString()) return;
      render(savedDocument);
    });
    const panelSubscription = webviewPanel.onDidDispose(() => {
      messageSubscription.dispose();
      documentSubscription.dispose();
      saveSubscription.dispose();
      this.webviewPanels.delete(webviewPanel);
      if (this.previewPanels.get(documentKey) === previewRecord) {
        this.previewPanels.delete(documentKey);
      }
      this.disposables.delete(panelSubscription);
    });

    this.disposables.add(messageSubscription);
    this.disposables.add(documentSubscription);
    this.disposables.add(saveSubscription);
    this.disposables.add(panelSubscription);
    render(document);
  }

  toggleToolbar() {
    for (const [panel, webview] of this.webviewPanels) {
      if (panel.visible) void webview.postMessage({ type: "toggleToolbar" });
    }
  }

  async revealSourceLine(uri, line) {
    if (!uri || !Number.isInteger(line) || line < 1) return false;
    const record = this.previewPanels.get(uri.toString());
    if (!record) return false;

    record.panel.reveal(record.panel.viewColumn, false);
    record.pendingLine = line;
    if (!record.ready) return true;

    const sent = await record.webview.postMessage({ type: "revealPreviewLine", line });
    if (sent) record.pendingLine = null;
    else record.ready = false;
    return true;
  }

  dispose() {
    for (const disposable of this.disposables) disposable.dispose();
    this.disposables.clear();
    this.webviewPanels.clear();
    this.previewPanels.clear();
  }
}

module.exports = { MarkdownCustomEditorProvider };
