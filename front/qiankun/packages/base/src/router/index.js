import { createHashRouter, createBrowserRouter, RouterProvider } from "react-router-dom";
import Web1 from "../page/subApp/web1.jsx";
import Web2 from "../page/subApp/web2.jsx";
import Web3 from "../page/subApp/web3.jsx";
import Empty from "../page/404.jsx";
import Home from "../page/Home/index.jsx";
import Qiankun from "../page/communication/qiankun.jsx";
import React, { lazy } from "react";
import ComponentPage from "../page/componentPage/index.jsx";

export const router = createBrowserRouter([
  {
    path: "/qiankun",
    element: <Home></Home>,
    children: [
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
        // children: [
        //   {
        //     path: "login",
        //   },
        //   {
        //     path: "dashboard",
        //   },
        //   {
        //     path: "user",
        //   },
        //   {
        //     path: "demo",
        //     children: [{
        //       path: 'access'
        //     }, {
        //       path: 'skin'
        //     }]
        //   }, {
        //     path: "task",
        //     children: [{
        //       path: 'PickupTask'
        //     }, {
        //       path: 'skin'
        //     }]
        //   },
        // ],
      },
      {
        path: "vue3/*",
        element: <Web3></Web3>,
        children: [
          {
            path: "qiankun-vue3-page",
            element: <Qiankun></Qiankun>,
            // children: [
            //   {
            //     path: "qiankun-vue3-page",
            //     element: <Web3></Web3>,
            //   },
            // ],
          },
        ]
        // children: [
        //   {
        //     path: '3D',
        //     children: [
        //       {
        //         path: "canvas/moon",
        //       },
        //       {
        //         path: "webgl/basic",
        //       },
        //       {
        //         path: "webgl/attribute",
        //       },
        //       {
        //         path: "webgl/uniform",
        //       },
        //       {
        //         path: "three/axis",
        //       },
        //       {
        //         path: "three/cube",
        //       },
        //     ]
        //   },
        //   {
        //     path: "editor",
        //   },
        // ],
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
