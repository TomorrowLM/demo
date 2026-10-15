const vscode = require("vscode");

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("lmMd.openPreview", () => {}),
    vscode.commands.registerCommand("lmMd.openCopilotForSelection", () => {}),
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
