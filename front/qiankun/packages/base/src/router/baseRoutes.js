import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { Loading } from "@lm/react-ui/loading";
const TipTapMarkdown = lazy(() => import("../page/base/markdown/tiptap/index.tsx"));
const UseReducerCom = lazy(() => import("../page/base/react/hooks/UseReducerCom.tsx"));
const QiankunDemo = lazy(() => import("../page/base/qiankun/communication/qiankun.jsx"));

const renderWithSuspense = (element, fallbackText) => (
  <Suspense fallback={<div>{fallbackText}</div>}>
    {element}
  </Suspense>
);

const baseRouteConfigs = [
  {
    path: "hooks",
    meta: {
      name: "hooks",
      title: "UseReducer",
      description: "useReducer hooks 示例",
    },
    element: renderWithSuspense(<UseReducerCom />, <Loading />),
  },
  {
    path: "tiptap-markdown",
    meta: {
      name: "tiptap-markdown",
      title: "TipTap Markdown",
      description: "Markdown 编辑器示例",
    },
    element: renderWithSuspense(<TipTapMarkdown />, <Loading />),
  },
  {
    path: "qiankun-communication",
    meta: {
      name: "qiankun-communication",
      title: "Qiankun 通信",
      description: "qiankun 主子应用通信示例",
    },
    element: renderWithSuspense(<QiankunDemo />, <Loading />),
  },
];

export const baseChildrenRoutes = [
  {
    index: true,
    element: <Navigate to="hooks" replace></Navigate>,
  },
  ...baseRouteConfigs.map((route) => ({
    path: route.path,
    handle: {
      meta: route.meta,
    },
    element: route.element,
  })),
];

export const baseMenuItems = baseRouteConfigs.map((route) => ({
  path: route.path,
  name: route.meta.name,
  title: route.meta.title,
  description: route.meta.description,
}));