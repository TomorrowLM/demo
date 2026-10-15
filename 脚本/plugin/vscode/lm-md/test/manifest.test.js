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

test("Copilot command is visible only for Markdown selections", () => {
  const items = manifest.contributes.menus["editor/context"];
  const item = items.find(
    (entry) => entry.command === "lmMd.openCopilotForSelection",
  );
  assert.equal(item.when, "editorLangId == markdown && editorHasSelection");
});
