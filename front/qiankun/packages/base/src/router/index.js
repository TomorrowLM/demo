import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Web1 from "../page/subApp/web1.jsx";
import Web2 from "../page/subApp/web2.jsx";
import Web3 from "../page/subApp/web3.jsx";
import Web4 from "../page/subApp/web4.jsx";
import Layout from "../page/layout/index.jsx";
import ComponentPage from "../page/base/qiankun/componentPage/index.jsx";
import { baseChildrenRoutes } from "./baseRoutes.js";

const BasePage = lazy(() => import("../page/base/index.tsx"));
const { APP_ROUTER_BASE } = GLOBAL_INFO;

/** @type {import("react-router-dom").Router} */
export const router = createBrowserRouter([
  {
    path: APP_ROUTER_BASE,
    element: <Layout></Layout>,
    children: [
      {
        index: true,
        element: <Navigate to="/qiankun/base"></Navigate>,
      },
      {
        path: "base",
        element: (
          <Suspense fallback={<div>Loading base page...</div>}>
            <BasePage />
          </Suspense>
        ),
        children: baseChildrenRoutes,
      },
      {
        path: "vue2-pc/*",
        element: <Web2></Web2>,
        children: [
          {
            path: 'dashboard', // 子应用中可以访问主应用页面
          },
          {
            path: 'page1', // 子应用中可以访问主应用页面
            element: <ComponentPage></ComponentPage>
          },
          {
            path: 'page2', // 子应用中可以访问主应用页面
            element: <ComponentPage></ComponentPage>
          },
        ]
      },
      {
        path: "react-app/*",
        element: <Web4></Web4>
      },
      {
        path: "vue2-mobile/*",
        element: <Web1></Web1>,
      },
      {
        path: "vue3/*",
        element: <Web3></Web3>,
      },
      {
        path: '*',
        name: 'error',
        meta: {
          name: '404',
        },
        element: <div>404</div>,
      }
    ]
  },
  // {
  //   path: '/:catchAll(.*)*',
  //   // name: 'error',
  //   // meta: {
  //   //   name: '404',
  //   // },
  //   component: () => import('../page/404.jsx'),
  // }
]);
