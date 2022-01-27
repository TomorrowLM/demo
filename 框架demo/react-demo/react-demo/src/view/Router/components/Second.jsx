import React from "react";
export default function Second(props) {
console.log(props.match)
  return (
    <div>
      <ul>
        <li><span>params.id:</span>{props.match.params.id}</li>
      </ul>
    </div>
  );
}
