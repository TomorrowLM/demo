import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import LmCard from "@/components/Lm-card";

export default function Second(props) {
  const params = useParams(); // path params
  const location = useLocation(); // contains search

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchId = searchParams.get("id");
    console.log("props:", props);
    console.log("动态路由传参 useParams:", params);
    console.log(
      "query传参 location.search:",
      location.search,
      "parsed id:",
      searchId,
    );
    console.log("state 传参 location.state:", location.state);
  }, [location.search, params, props]);

  const searchParams = new URLSearchParams(location.search);
  const searchId = searchParams.get("id");

  return (
    <div>
      <LmCard title="我是子路由">
        <>
          <div>
            动态路由传参:{" "}
            {props.match && props.match.params
              ? props.match.params.id
              : params.id}
          </div>
          <div>query传参: {searchId || "(empty)"}</div>
          <div>
            state传参:{" "}
            {location.state ? JSON.stringify(location.state) : "(empty)"}
          </div>
        </>
      </LmCard>
    </div>
  );
}
