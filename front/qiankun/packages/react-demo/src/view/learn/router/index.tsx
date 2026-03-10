import React, { useEffect, useState, ReactNode } from "react";
import { Button, Divider } from "antd";
import { Link, useHistory } from "react-router-dom";
import LmCard from "@/components/Lm-card";

interface RouterProps {
  children?: ReactNode;
}
const Router: React.FC<RouterProps> = (props: RouterProps) => {
  console.log(props.children);

  const history = useHistory();
  useEffect(() => {
    // console.log("渲染");
  });
  return (
    <div>
      <LmCard title="路由exact示例">
        <Button onClick={() => {
          history.push("/learn/router/exact")
        }}>跳转到exact示例, 不继承父路由内容</Button>
      </LmCard>
      <Divider />
      <LmCard title="路由嵌套示例">
        <>
          <li>
            <Link to="/learn/router/1">1</Link>
          </li>
          <li>
            <Link to="/learn/router/2">2</Link>
          </li>
          {props.children}
        </>
      </LmCard>
      <Divider />
      <LmCard title="路由传参示例">
        <>
          <Button onClick={() => {
            history.push("/learn/router/3")
          }}>动态路由传参</Button>
          {/* query传参 */}
          <Button onClick={() => {
            history.push("/learn/router/3?id=123")
          }}>query传参</Button>
          {/* state传参  */}
          <Button onClick={() => {
            history.push("/learn/router/3", { id: 123 })
          }}>state传参</Button>
          {props.children}
        </>
      </LmCard>
      <Divider />
    </div>
  );
}
export default Router;  