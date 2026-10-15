const MarkdownIt = require("markdown-it");

const BLOCK_OPEN_TYPES = new Set([
  "blockquote_open",
  "bullet_list_open",
  "ordered_list_open",
  "heading_open",
  "paragraph_open",
  "table_open",
]);

function addSourceAttributes(token) {
  if (!token.map || !BLOCK_OPEN_TYPES.has(token.type)) return;
  token.attrSet("data-md-start-line", String(token.map[0] + 1));
  token.attrSet("data-md-end-line", String(token.map[1]));
}

function renderFence(md) {
  return (tokens, index) => {
    const token = tokens[index];
    const attrs = token.map
      ? ` data-md-start-line="${token.map[0] + 1}" data-md-end-line="${token.map[1]}"`
      : "";
    const info = token.info ? token.info.trim().split(/\s+/, 1)[0] : "";
    const className = info
      ? ` class="language-${md.utils.escapeHtml(info)}"`
      : "";
    const content = md.utils.escapeHtml(token.content);
    return `<pre${attrs}><code${className}>${content}</code></pre>\n`;
  };
}

function renderMarkdownWithSourceMap(markdown) {
  const md = new MarkdownIt({
    html: false,
    breaks: false,
    linkify: false,
    typographer: false,
  });

  md.core.ruler.push("lm-md-source-map", (state) => {
    for (const token of state.tokens) addSourceAttributes(token);
  });

  md.renderer.rules.fence = renderFence(md);
  return md.render(String(markdown || ""));
}

module.exports = { renderMarkdownWithSourceMap };
