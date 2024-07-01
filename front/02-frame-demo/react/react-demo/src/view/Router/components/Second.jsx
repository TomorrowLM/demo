import React, { useEffect } from "react";
export default function Second(props) {
console.log(props.match)
useEffect(()=>{
  console.log('second')
})
  return (
    <div>
      <ul>
        <li><span>params.id:</span>{props.match.params.id}</li>
      </ul>
    </div>
  );
}
