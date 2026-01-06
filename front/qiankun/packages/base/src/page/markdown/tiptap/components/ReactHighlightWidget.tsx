import React from "react";
import { Tag } from "antd";
import r2wc from "@r2wc/react-to-web-component";
import type { HighlightRecord } from "../hooks/useTiptapHighlight";

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
export const registerHighlightBridge = () => {
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

export default ReactHighlightWidget;
