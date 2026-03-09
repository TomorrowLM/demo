import React, { useEffect } from "react";
export default function Second(props) {
console.log(props.match)
useEffect(()=>{
  console.log('second')
})
  return (
    <div>
      我是子路由<span>params.id:</span>{props.match.params.id}
    </div>
  );
}
