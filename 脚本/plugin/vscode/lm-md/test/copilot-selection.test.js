const test = require("node:test");
const assert = require("node:assert/strict");
const { toEditorRange } = require("../src/copilot-selection");

test("converts one-based preview lines to zero-based editor lines", () => {
  assert.deepEqual(
    toEditorRange(
      { startLine: 3, endLine: 5 },
      ["a", "b", "c", "d", "e", "f"],
    ),
    {
      start: { line: 2, character: 0 },
      end: { line: 4, character: 1 },
    },
  );
});

test("clamps a range to the document", () => {
  assert.deepEqual(
    toEditorRange({ startLine: 4, endLine: 99 }, ["a", "b", "c", "d"]),
    {
      start: { line: 3, character: 0 },
      end: { line: 3, character: 1 },
    },
  );
});
