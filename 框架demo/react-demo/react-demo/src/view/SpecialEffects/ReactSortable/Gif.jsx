import React from "react";
import { SortableHandle } from "react-sortable-hoc";
import { StepForwardOutlined } from "@ant-design/icons";
import {
  SmileTwoTone,
  HeartTwoTone,
  CheckCircleTwoTone,
} from "@ant-design/icons";
export default function Gif(gif) {
  const DragHandle = SortableHandle(() => {
    return (
      <div className="icons-list">
        <SmileTwoTone style={{fontSize:"30px"}}/>
        <p>请拖动上面的图标切换位置</p>
      </div>
    );
  });
  return (
    <div>
      <div style={{ width: "200px", height: "200px", background: "red" }}>
        {gif.gif}
      </div>
      <div>
        <DragHandle />
      </div>
    </div>
  );
}
