import React from "react";
export default function Second(props) {
console.log(props.match)
  return (
    <div>
      <ul>
        <div>123</div>
        <li><span>params.id:</span>{props.match.params.id}</li>
      </ul>
    </div>
  );
}
