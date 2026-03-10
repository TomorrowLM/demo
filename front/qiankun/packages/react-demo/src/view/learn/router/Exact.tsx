import React from "react";
import LmCard from "@/components/Lm-card";

const Exact: React.FC = (props) => {
  return <>
    <LmCard title="exact">精准匹配</LmCard>
    {props.children}
  </>;
}

export default Exact;