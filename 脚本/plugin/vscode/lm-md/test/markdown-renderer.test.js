const test = require("node:test");
const assert = require("node:assert/strict");
const { renderMarkdownWithSourceMap } = require("../src/markdown-renderer");

test("renders Markdown blocks with source line metadata", () => {
  const html = renderMarkdownWithSourceMap(
    "# 标题\n\n正文第一行\n正文第二行\n\n```js\nconst x = 1;\n```",
  );

  assert.match(html, /<h1[^>]*data-md-start-line="1"[^>]*data-md-end-line="1"/);
  assert.match(html, /<p[^>]*data-md-start-line="3"[^>]*data-md-end-line="4"/);
  assert.match(html, /<pre[^>]*data-md-start-line="6"[^>]*data-md-end-line="8"/);
  assert.doesNotMatch(html, /<script>alert/);
});
