import React from "react";
import { Button, Input } from "antd";
export default function FatherWatchChild(props) {
  return (
    <div>
      <Input name="iptRef" type="text" ref={ props.iptRef }/>
    </div>
  );
}

