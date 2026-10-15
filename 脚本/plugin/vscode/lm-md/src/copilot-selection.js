function toEditorRange(range, lines) {
  const values = Array.isArray(lines) && lines.length > 0 ? lines : [""];
  const lastLine = values.length - 1;
  const requestedStart = Number.isInteger(range && range.startLine)
    ? range.startLine - 1
    : 0;
  const requestedEnd = Number.isInteger(range && range.endLine)
    ? range.endLine - 1
    : requestedStart;
  const startLine = Math.min(lastLine, Math.max(0, requestedStart));
  const endLine = Math.min(lastLine, Math.max(startLine, requestedEnd));

  return {
    start: { line: startLine, character: 0 },
    end: {
      line: endLine,
      character: String(values[endLine] || "").length,
    },
  };
}

async function syncSelectionToCopilot(vscode, uri, range) {
  const document = await vscode.workspace.openTextDocument(uri);
  const lines = document.getText().split(/\r?\n/);
  const editorRange = toEditorRange(range, lines);
  const selection = new vscode.Selection(
    editorRange.start.line,
    editorRange.start.character,
    editorRange.end.line,
    editorRange.end.character,
  );
  const editor = await vscode.window.showTextDocument(document, {
    selection,
    preserveFocus: false,
    preview: false,
  });

  editor.selection = selection;
  editor.revealRange(selection, vscode.TextEditorRevealType.InCenter);
  await vscode.commands.executeCommand("workbench.action.chat.open");
  return editor;
}

module.exports = {
  syncSelectionToCopilot,
  toEditorRange,
};
