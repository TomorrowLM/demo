const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);

test("extension manifest declares the Markdown preview command", () => {
  const commands = manifest.contributes.commands.map((item) => item.command);
  assert.ok(commands.includes("lmMd.openPreview"));
});

test("extension manifest declares the Copilot selection command", () => {
  const commands = manifest.contributes.commands.map((item) => item.command);
  assert.ok(commands.includes("lmMd.openCopilotForSelection"));
});

test("binds Ctrl+F to toolbar visibility while a preview webview has focus", () => {
  const commands = manifest.contributes.commands.map((item) => item.command);
  const binding = manifest.contributes.keybindings.find(
    (item) => item.command === "lmMd.togglePreviewToolbar",
  );
  assert.ok(commands.includes("lmMd.togglePreviewToolbar"));
  assert.deepEqual(binding, {
    command: "lmMd.togglePreviewToolbar",
    key: "ctrl+f",
    when: "webviewFocus",
  });
});

test("Copilot command is visible only for Markdown selections", () => {
  const items = manifest.contributes.menus["editor/context"];
  const item = items.find(
    (entry) => entry.command === "lmMd.openCopilotForSelection",
  );
  assert.equal(item.when, "editorLangId == markdown && editorHasSelection");
});

test("Copilot sync command is available in the Markdown editor context menu", () => {
  const items = manifest.contributes.menus["editor/context"];
  const item = items.find(
    (entry) => entry.command === "lmMd.openCopilotForSelection",
  );
  assert.ok(item);
  assert.match(item.when, /editorLangId == markdown/);
  assert.match(item.when, /editorHasSelection/);
});

test("Markdown custom editor is the default editor for .md files", () => {
  const editor = manifest.contributes.customEditors.find(
    (item) => item.viewType === "lmMd.previewEditor",
  );
  assert.ok(editor);
  assert.equal(editor.priority, "default");
  assert.deepEqual(editor.selector, [{ filenamePattern: "*.md" }]);
  assert.equal(
    manifest.contributes.configurationDefaults["workbench.editorAssociations"]["*.md"],
    "lmMd.previewEditor",
  );
});
