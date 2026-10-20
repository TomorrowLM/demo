const MAX_DOCUMENTS = 40;
const MAX_HEADING_IDS = 5000;

function normalizeIds(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value
    .filter((item) => typeof item === "string" && item.length > 0)
    .map((item) => item.slice(0, 512)))]
    .slice(0, MAX_HEADING_IDS);
}

function normalizePreviewState(state) {
  return {
    collapsedHeadingIds: normalizeIds(state?.collapsedHeadingIds),
    collapsedTocIds: normalizeIds(state?.collapsedTocIds),
    tocHidden: Boolean(state?.tocHidden),
    tocDetailsOpen: state?.tocDetailsOpen !== false,
    changePanelCollapsed: Boolean(state?.changePanelCollapsed),
    changePanelHidden: Boolean(state?.changePanelHidden),
    tocSearch: typeof state?.tocSearch === "string" ? state.tocSearch.slice(0, 1000) : "",
    contentSearch: typeof state?.contentSearch === "string" ? state.contentSearch.slice(0, 1000) : "",
  };
}

class PreviewStateStore {
  constructor() {
    this.states = new Map();
  }

  get(uri) {
    const key = typeof uri === "string" ? uri : uri?.toString?.();
    if (!key) return normalizePreviewState();
    const state = this.states.get(key);
    if (!state) return normalizePreviewState();
    this.states.delete(key);
    this.states.set(key, state);
    return normalizePreviewState(state);
  }

  has(uri) {
    const key = typeof uri === "string" ? uri : uri?.toString?.();
    return Boolean(key && this.states.has(key));
  }

  set(uri, state) {
    const key = typeof uri === "string" ? uri : uri?.toString?.();
    if (!key) return null;
    const normalized = normalizePreviewState(state);
    this.states.delete(key);
    this.states.set(key, normalized);
    while (this.states.size > MAX_DOCUMENTS) {
      this.states.delete(this.states.keys().next().value);
    }
    return normalizePreviewState(normalized);
  }

  dispose() {
    this.states.clear();
  }
}

module.exports = { PreviewStateStore, normalizePreviewState };
