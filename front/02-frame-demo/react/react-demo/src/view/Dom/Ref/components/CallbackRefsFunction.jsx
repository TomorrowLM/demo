import React from "react";
export default function CallbackRefsFunction(props) {
    const clickButton = ()=>{
        this.textInput.focus();
    }
    return (
    <div>
      <input type="text" ref={el => this.textInput = el} />
      <input type="button" onClick={clickButton} />
    </div>
  );
}

