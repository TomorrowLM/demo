import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Space, Tag } from "antd";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useTiptapHighlight, HighlightMark, findRangeByText, isEditorReady } from "./hooks/useTiptapHighlight";
import { useHighlightBubbleMenu } from "./hooks/useHighlightBubbleMenu";
import ReactHighlightWidget, { registerHighlightBridge } from "./components/ReactHighlightWidget";
import "./styles.less";

const TextArea = Input.TextArea;

// 默认演示用文章内容，放在页面层而不是 Hook 内
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

/**
 * TipTap 富文本编辑与高亮演示主组件
 */
const Tiptap: React.FC = () => {
  const [manualText, setManualText] = useState("");
  const [label, setLabel] = useState("");
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
  const {
    highlights,
    createHighlight,
    handleHighlightSelection,
    handleJumpToHighlight,
    handleRemoveHighlight,
    handleClearHighlights,
  } = useTiptapHighlight(editor as any);

  // 选中文本时显示的气泡高亮菜单
  const highlightBubbleMenu = useHighlightBubbleMenu({
    editor: editor as any,
    onHighlightSelection: handleHighlightSelection,
  });

  useEffect(() => {
    registerHighlightBridge();
  }, []);

  // 初始化默认高亮关键字（演示用），依赖核心 createHighlight 能力
  useEffect(() => {
    if (!isEditorReady(editor) || defaultSeededRef.current) return;
    const keywords = ["高亮", "组件", "React", "Vue", "联动", "定位"];
    const matches = keywords
      .map((keyword) => {
        const range = findRangeByText(editor.state.doc, keyword);
        if (!range) return null;
        return { keyword, range };
      })
      .filter((item) => item !== null) as {
        keyword: string;
        range: { from: number; to: number };
      }[];
    console.log('matches', matches);
    if (!matches.length) {
      defaultSeededRef.current = true;
      return;
    }
    const randomTwo = matches
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(2, matches.length));
    console.log('randomTwo', randomTwo);
    randomTwo.forEach((item, index) => {
      createHighlight(item.range, item.keyword, {
        label: `默认标注 ${index + 1}`,
      });
    });
    defaultSeededRef.current = true;
  }, [editor, createHighlight]);

  // 将高亮数据同步到 window 与 WebComponent（业务集成逻辑）
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__TIPTAP_HIGHLIGHTS__ = highlights;
      window.dispatchEvent(
        new CustomEvent("tiptap-highlight-change", { detail: { highlights } })
      );
    }
    if (bridgeRef.current) {
      (bridgeRef.current as any).highlights = highlights;
    }
  }, [highlights]);

  // 通过输入的关键字在文档中检索并高亮首次匹配（业务层逻辑）
  const handleHighlightByText = () => {
    if (!isEditorReady(editor)) return;
    const keyword = manualText.trim();
    if (!keyword) return;
    const range = findRangeByText(editor.state.doc, keyword);
    if (!range) return;
    createHighlight(range, keyword, { label });
    setManualText("");
  };

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
            >
              高亮选中文本
            </Button>
            <Button onClick={handleHighlightByText}>
              高亮指定文本
            </Button>
            <Button danger ghost onClick={handleClearHighlights}>
              清空全部高亮
            </Button>
          </Space>
        </header>

        <div className="tiptap-demo__editor">
          {highlightBubbleMenu}
          <EditorContent editor={editor} />
        </div>

        <div className="tiptap-demo__form">
          {/* <Input
            placeholder="标注标签（可选）"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            maxLength={20}
          /> */}
          <TextArea
            rows={3}
            placeholder="输入要自动定位并高亮的关键字，例如：高亮 / 组件"
            value={manualText}
            onChange={(event) => setManualText(event.target.value)}
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
            <highlight-bridge ref={bridgeRef as any}></highlight-bridge>
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