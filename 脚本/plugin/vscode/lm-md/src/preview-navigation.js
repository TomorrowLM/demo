function isMarkdownDocument(document) {
  return document?.languageId === "markdown" || /\.md$/i.test(document?.uri?.fsPath || document?.uri?.path || "");
}

function getPreviewLineTarget(editor, selections) {
  const document = editor?.document;
  if (!isMarkdownDocument(document)) return null;

  const selection = Array.isArray(selections)
    ? selections[0]
    : selections || editor.selection;
  const zeroBasedLine = Number(selection?.start?.line ?? selection?.active?.line);
  if (!Number.isInteger(zeroBasedLine) || zeroBasedLine < 0) return null;

  return { uri: document.uri, line: zeroBasedLine + 1 };
}

function createPreviewNavigationController(vscode, revealPreviewLine) {
  const suppressedSelections = new Map();
  const commandKind = vscode.TextEditorSelectionChangeKind?.Command;

  return {
    async handleSelectionChange(event) {
      if (commandKind === undefined || event?.kind !== commandKind) return false;
      const target = getPreviewLineTarget(event.textEditor, event.selections);
      if (!target) return false;

      const key = target.uri?.toString?.() || String(target.uri);
      const suppressed = suppressedSelections.get(key);
      if (suppressed) {
        suppressedSelections.delete(key);
        if (suppressed.line === target.line && suppressed.expiresAt >= Date.now()) {
          return false;
        }
      }

      return revealPreviewLine(target.uri, target.line);
    },

    async revealActiveSelection() {
      const target = getPreviewLineTarget(vscode.window?.activeTextEditor);
      if (!target) return false;
      return revealPreviewLine(target.uri, target.line);
    },

    suppressNextSelectionChange(uri, line) {
      if (!Number.isInteger(line) || line < 1) return;
      const key = uri?.toString?.() || String(uri);
      suppressedSelections.set(key, { line, expiresAt: Date.now() + 2000 });
    },
  };
}

async function resolveManualPreviewTarget(vscode) {
  const activeTarget = getPreviewLineTarget(vscode.window?.activeTextEditor);
  if (activeTarget) return activeTarget;

  const markdownDocuments = (vscode.workspace.textDocuments || []).filter(isMarkdownDocument);
  let candidates = markdownDocuments.map((document) => document.uri);
  if (candidates.length === 0 && typeof vscode.workspace.findFiles === "function") {
    candidates = await vscode.workspace.findFiles(
      "**/*.md",
      "**/{node_modules,.git}/**",
    );
  }

  const uniqueCandidates = Array.from(
    new Map(candidates.map((uri) => [uri?.toString?.() || String(uri), uri])).values(),
  );
  if (uniqueCandidates.length === 0) return null;

  let uri = uniqueCandidates[0];
  if (uniqueCandidates.length > 1) {
    const picks = uniqueCandidates.map((candidate) => ({
      label: vscode.workspace.asRelativePath(candidate),
      description: candidate.fsPath || candidate.path || "",
      uri: candidate,
    }));
    const picked = await vscode.window.showQuickPick(picks, {
      placeHolder: "选择要定位的 Markdown 文件",
      matchOnDescription: true,
    });
    if (!picked) return null;
    uri = picked.uri;
  }

  const rawLine = await vscode.window.showInputBox({
    prompt: `输入 ${vscode.workspace.asRelativePath(uri)} 的行号`,
    placeHolder: "例如 1131",
    validateInput(value) {
      return Number.isInteger(Number(value)) && Number(value) > 0
        ? undefined
        : "请输入大于 0 的整数行号";
    },
  });
  if (rawLine === undefined) return null;
  const line = Number(rawLine);
  if (!Number.isInteger(line) || line < 1) return null;
  return { uri, line };
}

async function revealPreviewLocation(
  vscode,
  uri,
  line,
  customEditorProvider,
  previewManager,
) {
  if (!uri || !Number.isInteger(line) || line < 1) return false;

  if (await customEditorProvider?.revealSourceLine?.(uri, line)) return true;
  if (await previewManager?.revealSourceLine?.(uri, line)) return true;

  const document = await vscode.workspace.openTextDocument(uri);
  const preview = previewManager?.open(document);
  if (typeof preview?.revealSourceLine !== "function") return false;
  await preview.revealSourceLine(line);
  return true;
}

module.exports = {
  createPreviewNavigationController,
  getPreviewLineTarget,
  resolveManualPreviewTarget,
  revealPreviewLocation,
};
