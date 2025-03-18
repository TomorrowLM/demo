import React, { useRef } from "react";
const Input = React.forwardRef((props, ref) => {
    return (
        <input type="text" ref={ref} {...props} />
    )
});
export default Input