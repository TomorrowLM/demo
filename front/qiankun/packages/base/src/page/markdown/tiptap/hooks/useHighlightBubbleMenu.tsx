import React from "react";
import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react";
import { Button, Space } from "antd";
import { isEditorReady } from "./useTiptapHighlight";

export type UseHighlightBubbleMenuOptions = {
  editor: Editor | null | undefined;
  onHighlightSelection: () => void;
};

/**
 * 高亮气泡菜单 Hook
 * - 当选中文本时，在其上方展示“高亮 / 取消高亮”菜单
 * - 复用已有的 handleHighlightSelection 逻辑，实现与主按钮一致的高亮行为
 */
export const useHighlightBubbleMenu = ({
  editor,
  onHighlightSelection,
}: UseHighlightBubbleMenuOptions) => {
  if (!isEditorReady(editor as any)) return null;

  return (
    <BubbleMenu
      editor={editor as Editor}
      tippyOptions={{ duration: 150 }}
      shouldShow={({ editor }) => {
        const { from, to } = editor.state.selection;
        // 仅在有选区时展示气泡菜单
        return from !== to && editor.isFocused;
      }}
    >
      <Space size="small">
        <Button
          size="small"
          type="primary"
          onClick={onHighlightSelection}
        >
          高亮
        </Button>
        <Button
          size="small"
          onClick={() => {
            if (!isEditorReady(editor as any)) return;
            (editor as Editor).chain().focus().unsetHighlight().run();
          }}
        >
          取消高亮
        </Button>
      </Space>
    </BubbleMenu>
  );
};

export default useHighlightBubbleMenu;
