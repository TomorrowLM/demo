const vscode = acquireVsCodeApi();

let selected = null;

function elementForNode(node) {
  if (!node) return null;
  if (node.nodeType === Node.ELEMENT_NODE) return node;
  return node.parentElement;
}

function mappedBlock(node) {
  return elementForNode(node)?.closest?.(
    "[data-md-start-line][data-md-end-line]",
  ) || null;
}

function currentPreviewSelection() {
  const selection = window.getSelection();
  const text = selection ? selection.toString().trim() : "";
  if (!selection || !text || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const startBlock = mappedBlock(range.startContainer);
  const endBlock = mappedBlock(range.endContainer);
  if (!startBlock || !endBlock) return null;

  return {
    type: "previewSelection",
    text,
    startLine: Math.min(
      Number(startBlock.dataset.mdStartLine),
      Number(endBlock.dataset.mdStartLine),
    ),
    endLine: Math.max(
      Number(startBlock.dataset.mdEndLine),
      Number(endBlock.dataset.mdEndLine),
    ),
  };
}

function publishSelection() {
  const next = currentPreviewSelection();
  if (!next) return;
  selected = next;
  vscode.postMessage(next);
}

function renderSelectionAvailable(selection) {
  const status = document.getElementById("lm-md-status");
  const button = document.getElementById("lm-md-sync");
  if (!status || !button) return;
  selected = selection;
  button.disabled = false;
  status.textContent = `已选择第 ${selection.startLine}-${selection.endLine} 行，点击同步到 Copilot`;
}

document.addEventListener("mouseup", publishSelection);
document.addEventListener("keyup", publishSelection);
document.getElementById("lm-md-sync")?.addEventListener("click", () => {
  if (!selected) return;
  vscode.postMessage({ type: "syncPreviewSelection", ...selected });
});

window.addEventListener("message", (event) => {
  if (event.data?.type === "selectionAvailable") {
    renderSelectionAvailable(event.data.selection);
  }
});
