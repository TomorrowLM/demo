import { createHashRouter, createBrowserRouter, RouterProvider } from "react-router-dom";
import Web1 from "../page/web1.jsx";
import Empty from "../page/404.jsx";
import Home from "../page/Home.jsx";

export const router = createBrowserRouter([
  {
    path: "/qiankun",
    element: <Home />,
    children: [
      {
        path: "vue2-mobile",
        element: <Web1 />,
        children: [
          {
            path: "learn",
          },
          {
            path: "user",
          },
        ],
      },
    ]
  },
  // {
  //   path: "vue2-mobile",
  //   element: <Web1 />,
  //   children: [
  //     {
  //       path: "learn",
  //     },
  //     {
  //       path: "user",
  //     },
  //   ],
  // },
  // {
  //   path: '/:catchAll(.*)*',
  //   // name: 'error',
  //   // meta: {
  //   //   name: '404',
  //   // },
  //   component: () => import('../page/404.jsx'),
  // }
]);
