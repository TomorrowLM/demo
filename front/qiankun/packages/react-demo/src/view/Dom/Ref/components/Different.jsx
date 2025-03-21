import React, { createRef, useEffect, useState } from "react";

const Different = () => {
  const [renderIndex, setRenderIndex] = React.useState(1);
  const refFromUseRef = React.useRef();
  const refFromCreateRef = createRef();
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
      <button onClick={() => setRenderIndex((prev) => prev + 1)}>
        Cause re-render
      </button>
      {refFromCreateRef.current?"可以看出useref只是赋值，而createRef则是拷贝地址":""}
    </div>
  );
};

export default Different;
