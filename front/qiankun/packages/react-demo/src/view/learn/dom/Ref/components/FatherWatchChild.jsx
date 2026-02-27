import React from "react";
import { Button, Input } from "antd";
export default function FatherWatchChild(props) {
  return (
    <div>
      <Input
        onChange={() => {
          console.log("father change", props.iptRef);
        }}
        name="iptRef"
        type="text"
        ref={props.iptRef}
      />
    </div>
  );
}
