import { createHashRouter, createBrowserRouter, RouterProvider } from "react-router-dom";
import Web1 from "../page/web1.jsx";
import Empty from "../page/404.jsx";
import Home from "../page/Home.jsx";
import React, { lazy } from "react";
export const router = createBrowserRouter([
  {
    path: "/qiankun",
    element: <Home></Home>,
    children: [
      {
        path: "vue2-mobile",
        children: [
          {
            path: "learn",
          },
          {
            path: "user",
          },
        ],
      },
      {
        path: "vue2-pc",
        children: [
          {
            path: "login",
          },
          {
            path: "user",
          },
        ],
      },
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
