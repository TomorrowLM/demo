import { useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import { mergeAttributes } from "@tiptap/core";
import { nanoid } from "nanoid";

export type HighlightRecord = {
  id: string;
  text: string;
  color: string;
  label: string;
  from: number;
  to: number;
  createdAt: string;
};

declare global {
  interface Window {
    __TIPTAP_HIGHLIGHTS__?: HighlightRecord[];
  }
}

const highlightPalette = [
  "#fde68a",
  "#bfdbfe",
  "#c4b5fd",
  "#fbcfe8",
  "#bbf7d0",
  "#fecdd3",
];

export const HighlightMark = Highlight.configure({ multicolor: true }).extend({
  addAttributes() {
    return {
      color: {
        default: highlightPalette[0],
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("data-highlight-color") || (element as HTMLElement).style.backgroundColor,
        renderHTML: (attributes: { color?: string }) => {
          const color = attributes.color || highlightPalette[0];
          return {
            "data-highlight-color": color,
            style: `background-color: ${color}; padding: 0 2px; border-radius: 4px;`,
          };
        },
      },
      id: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("data-highlight-id"),
        renderHTML: (attributes: { id?: string | null }) =>
          attributes.id ? { "data-highlight-id": attributes.id } : {},
      },
      label: {
        default: "",
        parseHTML: (element: HTMLElement) => element.getAttribute("data-highlight-label") || "",
        renderHTML: (attributes: { label?: string }) =>
          attributes.label ? { "data-highlight-label": attributes.label } : {},
      },
    };
  },
  renderHTML({ HTMLAttributes }: any) {
    const composedClass = [HTMLAttributes.class, "tiptap-highlight-mark"]
      .filter(Boolean)
      .join(" ");
    return [
      "mark",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: composedClass,
      }),
      0,
    ];
  },
});

/**
 * 在文档中查找首次匹配指定关键字的文本范围
 */
export const findRangeByText = (doc: any, keyword: string) => {
  if (!keyword) return null;
  const target = keyword.toLowerCase();
  let match: { from: number; to: number } | null = null;
  doc.descendants((node: any, pos: number) => {
    if (match || !node.isText || !node.text) return;
    const idx = node.text.toLowerCase().indexOf(target);
    if (idx !== -1) {
      const from = pos + idx + 1;
      const to = from + keyword.length;
      match = { from, to };
    }
  });
  return match;
};

/**
 * 根据高亮标记的 id 在编辑器中反查对应文本范围
 */
const findRangeByHighlightId = (editor: Editor, highlightId: string) => {
  const highlightType = editor.schema.marks.highlight;
  if (!highlightType) return null;
  let range: { from: number; to: number } | null = null;
  editor.state.doc.descendants((node, pos) => {
    if (range || !node.isText || !node.marks?.length) {
      return range ? false : undefined;
    }
    const hasTarget = node.marks.some(
      (mark) => mark.type === highlightType && (mark.attrs as any)?.id === highlightId
    );
    if (hasTarget) {
      const from = pos + 1;
      const to = from + node.nodeSize;
      range = { from, to };
      return false;
    }
    return undefined;
  });
  return range;
};

/**
 * 从文档中移除指定 id 的高亮 mark（可能跨多个 text 节点）
 */
const removeHighlightById = (editor: Editor, highlightId: string) => {
  const highlightType = editor.schema.marks.highlight;
  if (!highlightType) return;
  const { state, view } = editor;
  const { doc } = state;
  let tr = state.tr;

  doc.descendants((node, pos) => {
    if (!node.isText || !node.marks?.length) return;
    const hasTarget = node.marks.some(
      (mark) => mark.type === highlightType && (mark.attrs as any)?.id === highlightId
    );
    if (hasTarget) {
      // 对当前 text 节点整段移除 highlight mark
      tr = tr.removeMark(pos, pos + node.nodeSize, highlightType);
    }
  });

  if (tr.docChanged) {
    view.dispatch(tr);
  }
};

/**
 * 按索引从预设调色板中取颜色，实现循环取色
 */
const pickColor = (index: number) => highlightPalette[index % highlightPalette.length];

/**
 * 判断编辑器实例是否可用
 */
export const isEditorReady = (instance: Editor | null | undefined): instance is Editor =>
  Boolean(instance && !instance.isDestroyed && instance.view);

/**
 * TipTap 高亮逻辑与状态的自定义 Hook
 */
export const useTiptapHighlight = (editor: Editor) => {
  const [highlights, setHighlights] = useState<HighlightRecord[]>([]); // 本地高亮记录状态
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null); // 当前高亮 id

  /**
   * 创建一条高亮记录并应用到编辑器与本地状态
   */
  const createHighlight = useCallback(
    (
      range: { from: number; to: number },
      text?: string,
      options?: { label?: string; color?: string }
    ) => {
      console.log('createHighlight called with range:', isEditorReady(editor), editor, !editor.isDestroyed, editor.view);
      if (!isEditorReady(editor)) return;
      const nextId = nanoid(8);
      const color = options?.color || pickColor(highlights.length);
      const labelValue = options?.label || "";
      editor
        .chain()
        .focus()
        .setTextSelection(range)
        .setHighlight({ id: nextId, color, label: labelValue } as any)
        .run();

      const record: HighlightRecord = {
        id: nextId,
        text: text || editor.state.doc.textBetween(range.from, range.to, " ", " "),
        color,
        label: labelValue,
        from: range.from,
        to: range.to,
        createdAt: new Date().toISOString(),
      };
      setHighlights((prev) => [...prev, record]);
      return record;
    },
    [editor, highlights.length]
  );

  // 控制某条高亮在文档中的闪烁效果
  useEffect(() => {
    if (!activeHighlightId) return;
    const target = document.querySelector(
      `[data-highlight-id="${activeHighlightId}"]`
    );
    if (!target) return;
    target.classList.add("is-highlight-target");
    const timer = window.setTimeout(() => {
      target.classList.remove("is-highlight-target");
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [activeHighlightId]);

  /**
   * 高亮当前光标选中的文本片段
   */
  const handleHighlightSelection = () => {
    if (!isEditorReady(editor)) return;
    const { from, to } = editor.state.selection;
    if (from === to) {
      // 交由调用方决定如何提示
      return;
    }
    createHighlight({ from, to });
  };

  /**
   * 跳转到某一条高亮所在的位置，并滚动到可视区域
   */
  const handleJumpToHighlight = (item: HighlightRecord) => {
    if (!isEditorReady(editor)) return;
    const range =
      findRangeByHighlightId(editor, item.id) ||
      findRangeByText(editor.state.doc, item.text) || ({
        from: item.from,
        to: item.to,
      } as { from: number; to: number });
    editor.chain().focus().setTextSelection(range).run();
    editor.commands.scrollIntoView();
    setActiveHighlightId(item.id);
  };

  /**
   * 删除指定 id 的高亮标记
   */
  const handleRemoveHighlight = (id: string) => {
    if (!isEditorReady(editor)) return;
    const target = highlights.find((item) => item.id === id);
    if (!target) return;

    // 从文档中移除该 id 对应的所有 highlight mark 片段
    removeHighlightById(editor, target.id);

    setHighlights((prev) => prev.filter((item) => item.id !== id));
    if (activeHighlightId === id) {
      setActiveHighlightId(null);
    }
  };

  /**
   * 清空文档中所有高亮标记
   */
  const handleClearHighlights = () => {
    if (!isEditorReady(editor)) return;
    if (!highlights.length) return;
    editor.chain().focus().selectAll().unsetHighlight().run();
    setHighlights([]);
    setActiveHighlightId(null);
  };

  return {
    highlights,
    createHighlight,
    handleHighlightSelection,
    handleJumpToHighlight,
    handleRemoveHighlight,
    handleClearHighlights,
  };
};
