import React, { useEffect } from "react";
import { Route, Link, Switch } from "react-router-dom";

export default function RouterType() {
  useEffect(()=>{
    console.log('渲染1');
  })
  return (
    <div>
      <p>路由渲染方式1</p>
    </div>
  );
}
