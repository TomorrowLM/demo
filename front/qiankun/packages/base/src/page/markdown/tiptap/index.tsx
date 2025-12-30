import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input, Space, Tag, message } from "antd";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { mergeAttributes } from "@tiptap/core";
import { nanoid } from "nanoid";
import r2wc from "@r2wc/react-to-web-component";
import "./styles.less";

type HighlightRecord = {
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
  namespace JSX {
    interface IntrinsicElements {
      "highlight-bridge": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { highlights?: HighlightRecord[] };
    }
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

const defaultHighlightKeywords = ["高亮", "组件", "React", "Vue", "联动", "定位"];

const HighlightMark = Highlight.configure({ multicolor: true }).extend({
  addAttributes() {
    return {
      color: {
        default: highlightPalette[0],
        parseHTML: (element) =>
          element.getAttribute("data-highlight-color") || element.style.backgroundColor,
        renderHTML: (attributes) => {
          const color = attributes.color || highlightPalette[0];
          return {
            "data-highlight-color": color,
            style: `background-color: ${color}; padding: 0 2px; border-radius: 4px;` ,
          };
        },
      },
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-highlight-id"),
        renderHTML: (attributes) =>
          attributes.id ? { "data-highlight-id": attributes.id } : {},
      },
      label: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-highlight-label") || "",
        renderHTML: (attributes) =>
          attributes.label ? { "data-highlight-label": attributes.label } : {},
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const composedClass = [
      HTMLAttributes.class,
      "tiptap-highlight-mark",
    ]
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

const defaultArticle = `
  <h2>TipTap 多端高亮演示</h2>
  <p>在这里你可以像在在线文档中一样录入文字、应用样式而无需暴露源码。选中文本后点击“高亮选中”即可创建一条带标记的区段。</p>
  <p>你也可以在右侧输入框里指定任意关键字，系统会自动检索并高亮匹配片段，同时把数据抛给 React / Vue 组件。</p>
  <ul>
    <li>支持自定义标签和颜色轮换。</li>
    <li>所有高亮会在侧栏列表里展示并可一键定位。</li>
    <li>同一套核心数据可以同时给 React 组件和 Vue（通过 Web Component）使用。</li>
  </ul>
  <p>尝试：输入 “高亮” 或 “组件” 并点击“高亮指定文本”，然后在列表中点击“定位”按钮。</p>
`;

// React 侧用于展示高亮摘要信息的小组件
const ReactHighlightWidget: React.FC<{ highlights: HighlightRecord[] }> = ({
  highlights,
}) => (
  <div className="tiptap-demo__react-widget">
    <div className="tiptap-demo__widget-header">
      <span>React 组件实时数据</span>
      <Tag color="blue">{highlights.length} 条</Tag>
    </div>
    <div className="tiptap-demo__widget-body">
      {highlights.length ? (
        highlights.map((item) => (
          <Tag
            key={item.id}
            color={item.color}
            className="tiptap-demo__widget-chip"
          >
            {item.label || item.text.slice(0, 12)}
          </Tag>
        ))
      ) : (
        <span className="tiptap-demo__empty">暂无高亮，创建一条试试 →</span>
      )}
    </div>
  </div>
);

let highlightBridgeRegistered = false;

/**
 * 注册 Web Component：highlight-bridge
 * - 只在浏览器环境且未注册时执行一次
 * - 让 Vue / 其他框架通过自定义元素消费 React 组件
 */
const registerHighlightBridge = () => {
  if (highlightBridgeRegistered || typeof window === "undefined") {
    return;
  }
  if (!window.customElements?.get("highlight-bridge")) {
    const HighlightBridge = r2wc(ReactHighlightWidget, {
      props: {
        highlights: "json",
      },
    });
    window.customElements.define("highlight-bridge", HighlightBridge);
  }
  highlightBridgeRegistered = true;
};

const TextArea = Input.TextArea;

/**
 * 在文档中查找首次匹配指定关键字的文本范围
 */
const findRangeByText = (doc: any, keyword: string) => {
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
      (mark) => mark.type === highlightType && mark.attrs?.id === highlightId
    );
    if (hasTarget) {
      const from = pos + 1;
      const to = from + node.nodeSize;
      range = { from, to };
      return false; // stop traversal
    }
    return undefined;
  });
  return range;
};

/**
 * 按索引从预设调色板中取颜色，实现循环取色
 */
const pickColor = (index: number) =>
  highlightPalette[index % highlightPalette.length];

/**
 * 判断编辑器实例是否可用
 * - 已创建、未销毁且 view 存在时认为就绪
 */
const isEditorReady = (instance: Editor | null | undefined): instance is Editor =>
  Boolean(instance && !instance.isDestroyed && instance.view);

/**
 * TipTap 富文本编辑与高亮演示主组件
 */
const Tiptap: React.FC = () => {
  const [manualText, setManualText] = useState("");
  const [label, setLabel] = useState("");
  const [highlights, setHighlights] = useState<HighlightRecord[]>([]);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const bridgeRef = useRef<HTMLElement | null>(null);
  const defaultSeededRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "开始输入内容，或粘贴一段文本..." }),
      HighlightMark,
    ],
    content: defaultArticle,
  });

  /**
   * 创建一条高亮记录并应用到编辑器与本地状态
   */
  const createHighlight = useCallback(
    (
      range: { from: number; to: number },
      text?: string,
      options?: { label?: string; color?: string; skipReset?: boolean }
    ) => {
      if (!isEditorReady(editor)) return;
      const nextId = nanoid(8);
      const color = options?.color || pickColor(highlights.length);
      const labelValue = options?.label || label.trim() || `标注 ${highlights.length + 1}`;
      editor
        .chain()
        .focus()
        .setTextSelection(range)
        .setHighlight({ id: nextId, color, label: labelValue })
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
      if (!options?.skipReset) {
        setManualText("");
        setLabel("");
      }
    },
    [editor, highlights.length, label]
  );

  useEffect(() => {
    registerHighlightBridge();
  }, []);

  useEffect(() => {
    if (!isEditorReady(editor) || defaultSeededRef.current) return;
    const matches = defaultHighlightKeywords
      .map((keyword) => ({
        keyword,
        range: findRangeByText(editor.state.doc, keyword),
      }))
      .filter((item): item is { keyword: string; range: { from: number; to: number } } =>
        Boolean(item.range)
      );
    if (!matches.length) {
      defaultSeededRef.current = true;
      return;
    }
    const randomTwo = matches
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(2, matches.length));
    randomTwo.forEach((item, index) => {
      createHighlight(item.range, item.keyword, {
        label: `默认标注 ${index + 1}`,
        skipReset: true,
      });
    });
    defaultSeededRef.current = true;
  }, [editor, createHighlight]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__TIPTAP_HIGHLIGHTS__ = highlights;
      window.dispatchEvent(
        new CustomEvent("tiptap-highlight-change", { detail: { highlights } })
      );
    }
    if (bridgeRef.current) {
      // @ts-ignore - custom element prop
      bridgeRef.current.highlights = highlights;
    }
  }, [highlights]);

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
      message.warning("请先选中需要高亮的文本");
      return;
    }
    createHighlight({ from, to });
  };

  /**
   * 通过输入的关键字在文档中检索并高亮首次匹配
   */
  const handleHighlightByText = () => {
    if (!isEditorReady(editor)) return;
    const keyword = manualText.trim();
    if (!keyword) {
      message.warning("请输入要检索的文本");
      return;
    }
    const range = findRangeByText(editor.state.doc, keyword);
    if (!range) {
      message.error("当前文档中找不到该文本");
      return;
    }
    createHighlight(range, keyword);
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
    const range =
      findRangeByHighlightId(editor, target.id) ||
      findRangeByText(editor.state.doc, target.text) || ({
        from: target.from,
        to: target.to,
      } as { from: number; to: number });
    try {
      editor.chain().focus().setTextSelection(range).unsetHighlight().run();
    } catch (error) {
      console.warn("无法在文档中移除该标记", error);
    }
    setHighlights((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * 清空文档中所有高亮标记
   */
  const handleClearHighlights = () => {
    if (!isEditorReady(editor)) return;
    if (!highlights.length) {
      message.info("当前没有高亮内容");
      return;
    }
    editor.chain().focus().selectAll().unsetHighlight().run();
    setHighlights([]);
    setActiveHighlightId(null);
  };

  const editorDisabled = !editor;

  return (
    <div className="tiptap-demo">
      <section className="tiptap-demo__editor-card">
        <header className="tiptap-demo__toolbar">
          <div className="tiptap-demo__toolbar-main">
            <h3>富文本编辑区</h3>
            <p>所见即所得，可在 PC / Mobile 自适应布局下使用。</p>
          </div>
          <Space wrap>
            <Button
              type="primary"
              onClick={handleHighlightSelection}
              disabled={editorDisabled}
            >
              高亮选中文本
            </Button>
            <Button onClick={handleHighlightByText} disabled={editorDisabled}>
              高亮指定文本
            </Button>
            <Button danger ghost onClick={handleClearHighlights} disabled={editorDisabled}>
              清空全部高亮
            </Button>
          </Space>
        </header>

        <div className="tiptap-demo__editor">
          <EditorContent editor={editor} />
        </div>

        <div className="tiptap-demo__form">
          <Input
            placeholder="标注标签（可选）"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            maxLength={20}
            disabled={editorDisabled}
          />
          <TextArea
            rows={3}
            placeholder="输入要自动定位并高亮的关键字，例如：高亮 / 组件"
            value={manualText}
            onChange={(event) => setManualText(event.target.value)}
            disabled={editorDisabled}
          />
          <p className="tiptap-demo__form-tip">
            * 支持多次高亮，系统会自动轮换颜色；也可以通过右侧列表定位/删除。
          </p>
        </div>
      </section>

      <aside className="tiptap-demo__sidebar">
        <div className="tiptap-demo__panel">
          <div className="tiptap-demo__panel-header">
            <h4>高亮列表</h4>
            <span className="tiptap-demo__panel-sub">点击“定位”快速滚动</span>
          </div>
          <div className="tiptap-demo__highlight-list">
            {highlights.length ? (
              highlights.map((item) => (
                <div
                  key={item.id}
                  className="tiptap-demo__highlight-item"
                  style={{ borderLeftColor: item.color }}
                >
                  <div className="tiptap-demo__highlight-meta">
                    <Tag color={item.color}>{item.label}</Tag>
                    <span className="tiptap-demo__highlight-text">{item.text}</span>
                  </div>
                  <Space size="small">
                    <Button type="link" size="small" onClick={() => handleJumpToHighlight(item)}>
                      定位
                    </Button>
                    <Button
                      type="link"
                      size="small"
                      danger
                      onClick={() => handleRemoveHighlight(item.id)}
                    >
                      删除
                    </Button>
                  </Space>
                </div>
              ))
            ) : (
              <p className="tiptap-demo__empty">暂无数据，先在左侧创建一条高亮。</p>
            )}
          </div>
        </div>

        <div className="tiptap-demo__panel">
          <div className="tiptap-demo__panel-header">
            <h4>跨框架组件联动</h4>
            <span className="tiptap-demo__panel-sub">React & Vue 同步消费</span>
          </div>
          <ReactHighlightWidget highlights={highlights} />
          <div className="tiptap-demo__web-component">
            <highlight-bridge ref={bridgeRef as React.MutableRefObject<any>}></highlight-bridge>
            <small>
              Vue 侧只需引入 Web Component：<code>&lt;highlight-bridge /&gt;</code>
            </small>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Tiptap;