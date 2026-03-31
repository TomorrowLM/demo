import React from "react";
import { Node } from "@tiptap/core";
import {
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";

/**
 * 自定义 <my-block> 区块的 React 渲染组件
 */
const MyBlockView: React.FC<NodeViewProps> = ({ node, selected }) => {
  const { type = "info", title = "信息块" } = node.attrs as {
    type?: string;
    title?: string;
  };

  return (
    <NodeViewWrapper data-type={type} data-title={title} className="my-block-wrapper">
      <my-block
        className={[
          "my-block",
          `my-block--${type}`,
          selected ? "my-block--selected" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        data-type={type}
        data-title={title}
      >
        <div className="my-block__header">{title}</div>
        <div className="my-block__body">
          <NodeViewContent />
        </div>
      </my-block>
    </NodeViewWrapper>
  );
};

/**
 * TipTap 自定义 Node：myBlock <-> <my-block>
 */
export const MyBlock = Node.create({
  name: "myBlock",
  group: "block",
  content: "block*",
  defining: true,

  addAttributes() {
    return {
      type: {
        default: "info",
      },
      title: {
        default: "信息块",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "my-block",
        getAttrs: (element: HTMLElement) => {
          const type =
            element.getAttribute("data-type") || element.getAttribute("type") || "info";
          const title =
            element.getAttribute("data-title") || element.getAttribute("title") || "信息块";
          return { type, title };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { type, title, ...rest } = HTMLAttributes as {
      type?: string;
      title?: string;
      [key: string]: any;
    };

    const attrs: Record<string, any> = { ...rest };
    if (type) attrs["data-type"] = type;
    if (title) attrs["data-title"] = title;

    return ["my-block", attrs, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MyBlockView);
  },
});

export default MyBlock;
