import { LaptopOutlined, DesktopOutlined } from "@ant-design/icons";
import React from "react";
import Layout from '@/view/layout/index'
import Dashboard from "@/view/dashBoard";
import ChildRouter from "@/view/learn/router/ChildRouter"
import Login from "@/view/User/Login";
import Exact from "@/view/learn/router/Exact";

export const menuRoutes = [
  {
    path: "/dashboard",
    name: "面板",
    // exact: true,
    component: Dashboard,
    icon: <DesktopOutlined />,
    isMenu: 1,
  },
  {
    name: "react学习",
    icon: <DesktopOutlined />,
    isMenu: 1,
    path: "/learn",
    children: [
      {
        name: "闭包",
        path: "/closure",
        component: 'learn/closure',
      },
      {
        name: 'hooks',
        children: [
          {
            name: "useState",
            path: "/useState",
            component: 'learn/hooks/useState',
            icon: <DesktopOutlined />,
          },
          {
            name: "useEffect",
            path: "/useEffect",
            component: 'learn/hooks/useEffect',
            icon: <DesktopOutlined />,
          },
        ],
      },
      {
        name: 'ref',
        icon: <LaptopOutlined />,
        isMenu: 2,
        children: [
          {
            name: "ref",
            path: "/dom/ref",
            component: 'learn/dom/Ref',
            icon: <DesktopOutlined />
          },
          {
            name: "findDomDode",
            path: "/dom/findDomDode",
            component: 'learn/dom/FindDomDode',
            icon: <DesktopOutlined />
          },
        ]
      },
      {
        name: "exact",
        path: "/router/exact",
        isMenu: 0,
        component: Exact,
        // exact: false,
        exact: true, // 精确匹配,/learn/router/exact/childExact会匹配到/learn/router/:id,所以不能设置exact:true
        icon: <DesktopOutlined />,
        children: [
          {
            name: "exact",
            path: "/childExact",
            isMenu: 0,
            component: Exact,
            exact: false,
            icon: <DesktopOutlined />,
            children: [
            ]
          },
        ]
      },
      {
        name: '路由',
        icon: <LaptopOutlined />,
        isMenu: 1,
        component: 'learn/router',
        path: "/router",
        exact: false,
        children: [
          {
            name: "路由通配符",
            path: "/:id",
            isMenu: 0,
            component: ChildRouter,
            icon: <DesktopOutlined />
          }
        ]
      },
      {
        name: '组件',
        icon: <LaptopOutlined />,
        isMenu: 2,
        children: [
          {
            name: "渲染机制",
            path: "/render",
            component: 'learn/component/Render',
            icon: <DesktopOutlined />
          },
          {
            name: "通信",
            path: "/communicate",
            component: 'learn/component/Communicate',
            icon: <DesktopOutlined />
          },
        ]
      },
    ]
  },
  {
    name: '状态管理器',
    icon: <LaptopOutlined />,
    isMenu: 1,
    path: "/store",
    children: [
      {
        name: "store",
        title: "store",
        path: "/store/store",
        component: 'Store/Store',
        icon: <DesktopOutlined />,
      },
      {
        name: "hox",
        title: "hox",
        path: "/store/hox",
        component: "Store/Hox",
        icon: <DesktopOutlined />,
      }
    ]
  },
  {
    name: '特效',
    icon: <LaptopOutlined />,
    isMenu: 1,
    path: "/specialEffects",
    children: [
      {
        name: "reactSortable",
        path: "/specialEffects/reactSortable",
        component: 'SpecialEffects/ReactSortable/index',
        icon: <DesktopOutlined />,
      },
      {
        name: "pdf",
        path: "/specialEffects/pdf",
        component: 'SpecialEffects/pdf/index',
        icon: <DesktopOutlined />,
      },
      {
        name: "cron",
        path: "/specialEffects/cron",
        component: 'SpecialEffects/Cron/index',
        icon: <DesktopOutlined />,
      },
    ]
  },
  {
    name: '权限',
    icon: <LaptopOutlined />,
    isMenu: 1,
    path: "/access",
    children: [
      {
        name: "权限",
        path: "/access",
        component: 'Access',
        icon: <DesktopOutlined />
      }
    ]
  },
  {
    name: 'antd',
    icon: <LaptopOutlined />,
    isMenu: 1,
    path: "/antd",
    children: [
      {
        name: "表单",
        path: "/form",
        component: 'Antd',
        icon: <DesktopOutlined />
      }
    ]
  },
]

export const whiteRoute = [
  {
    path: "/login",
    component: Login,
    isMenu: 0,
    exact: true,
  },
]

export const routes = {
  path: "/",
  component: Layout,
  children: [
    ...menuRoutes
  ]
};