import { createHashRouter, createBrowserRouter, RouterProvider } from "react-router-dom";
import Web1 from "../page/web1.jsx";
import Web2 from "../page/web2.jsx";
import Web3 from "../page/web3.jsx";
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
        element: <Web1></Web1>,
        children: [
          {
            path: "learn",
          },
          {
            path: "user",
          },
          {
            path: "login",
          },
        ],
      },
      {
        path: "vue2-pc",
        element: <Web2></Web2>,
        children: [
          {
            path: "login",
          },
          {
            path: "user",
          }, {
            path: "demo",
            children: [{
              path: 'access'
            }, {
              path: 'skin'
            }]
          }, {
            path: "task",
            children: [{
              path: 'PickupTask'
            }, {
              path: 'skin'
            }]
          },
        ],
      },
      {
        path: "vue3",
        element: <Web3></Web3>,
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
