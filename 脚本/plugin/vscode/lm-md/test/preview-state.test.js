const test = require("node:test");
const assert = require("node:assert/strict");
const { PreviewStateStore, normalizePreviewState } = require("../src/preview-state");

test("normalizes and returns independent per-document preview fold state", () => {
  const store = new PreviewStateStore();
  const first = store.set("file:///docs/a.md", {
    collapsedHeadingIds: ["section", "section", 42],
    collapsedTocIds: ["toc"],
    tocHidden: true,
    tocDetailsOpen: false,
    changePanelCollapsed: true,
    tocSearch: "section",
    contentSearch: "match",
  });

  assert.deepEqual(first, {
    collapsedHeadingIds: ["section"],
    collapsedTocIds: ["toc"],
    tocHidden: true,
    tocDetailsOpen: false,
    changePanelCollapsed: true,
    tocSearch: "section",
    contentSearch: "match",
  });
  assert.deepEqual(store.get("file:///docs/a.md"), first);
  assert.deepEqual(store.get("file:///docs/b.md"), normalizePreviewState());

  first.collapsedTocIds.push("mutated");
  assert.deepEqual(store.get("file:///docs/a.md").collapsedTocIds, ["toc"]);
  store.dispose();
  assert.deepEqual(store.get("file:///docs/a.md"), normalizePreviewState());
});
