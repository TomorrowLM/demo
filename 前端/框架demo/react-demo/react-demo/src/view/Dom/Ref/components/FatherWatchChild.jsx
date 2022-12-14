import React from "react";
export default function FatherWatchChild(props) {
  return (
    <div>
      <input name="iptRef" type="text" ref={ props.iptRef }/>
    </div>
  );
}

