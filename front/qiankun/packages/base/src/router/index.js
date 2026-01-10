import { createHashRouter, createBrowserRouter, RouterProvider, redirect, Navigate } from "react-router-dom";
import Web1 from "../page/subApp/web1.jsx";
import Web2 from "../page/subApp/web2.jsx";
import Web3 from "../page/subApp/web3.jsx";
import Web4 from "../page/subApp/web4.jsx";
import Empty from "../page/404.jsx";
import Home from "../page/Home/index.jsx";
import Qiankun from "../page/communication/qiankun.jsx";
import ComPage from "../page/comPage/index.tsx";
import React, { lazy, Suspense } from "react";
import ComponentPage from "../page/componentPage/index.jsx";
const { APP_ROUTER_BASE } = GLOBAL_INFO;
const TipTapMarkdown = lazy(() => import("../page/markdown/tiptap/index.tsx"));

export const router = createBrowserRouter([
  {
    // path: "/",
    path: APP_ROUTER_BASE,
    element: <Home></Home>,
    // loader: async () => {
    //   return redirect('/qiankun/base');
    // },
    children: [
      {
        index: true,
        element: <Navigate to="/qiankun/base"></Navigate>,
      },
      {
        path: "base",
        element: <ComPage></ComPage>,
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
        path: "react/*",
        element: <Web4></Web4>
      },
      {
        path: "vue2-mobile/*",
        element: <Web1></Web1>,
        // children: [
        //   {
        //     path: "home",
        //   },
        //   {
        //     path: "learn",
        //   },
        //   {
        //     path: "user",
        //   },
        //   {
        //     path: "login",
        //   },
        //   {
        //     path: "menu",
        //   },
        // ],
      },
      {
        path: "tiptap-markdown",
        element: (
          <Suspense fallback={<div>Loading markdown editor...</div>}>
            <TipTapMarkdown />
          </Suspense>
        )
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
