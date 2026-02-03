import React, { createRef, useEffect, useState } from "react";
import { Button, Input } from "antd";
const Different = () => {
  const [renderIndex, setRenderIndex] = React.useState(1);
  const refFromUseRef = React.useRef();
  const refFromCreateRef = createRef();
  //renderIndex改变后再次render，refFromUseRef.current的值是不会重置
  if (!refFromUseRef.current) {
    refFromUseRef.current = renderIndex;
  }
  if (!refFromCreateRef.current) {
    refFromCreateRef.current = renderIndex;
  }
  return (
    <div>
      <p>Current render index: {renderIndex}</p>
      <p>
        <b>refFromUseRef</b> value: {refFromUseRef.current}
      </p>
      <p>
        <b>refFromCreateRef</b> value:{refFromCreateRef.current}
      </p>
      <Button onClick={() => setRenderIndex((prev) => prev + 1)}>
        Cause re-render
      </Button>
      {refFromCreateRef.current
        ? "可以看出createRef 每次渲染都会返回一个新的引用，而 useRef 每次都会返回相同的引用"
        : ""}
    </div>
  );
};

export default Different;
