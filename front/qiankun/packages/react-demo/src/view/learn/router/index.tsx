import React, { useEffect, useState, ReactNode } from "react";
import { Divider } from "antd";
import { Route, Link, Switch } from "react-router-dom";

interface RouterProps {
  children?: ReactNode;
}
const Router: React.FC<RouterProps> = (props: RouterProps) => {
  console.log(props.children);
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log("渲染 2");
  });
  return (
    <div>
      <p>router 没有设置 exact，那么会将匹配的子页面都渲染出来并放在一个页面</p>
      <ul>
        <li>
          <Link to="/router/1">1</Link>
        </li>
        <li>
          <Link to="/router/2">2</Link>
        </li>
      </ul>
      {/* '/router'路由没有设置 exact，那么会将匹配的子页面都渲染出来 */}
      {/* <Switch>
        <Route exact path="/router/:id" component={Second}></Route>
      </Switch> */}
      {props.children}
      <Divider />
      <p>路由渲染方式</p>
      <div>
        Count : {count}
        <button onClick={() => setCount(count + 1)}>我是按钮</button>
      </div>
    </div>
  );
}
export default Router;  