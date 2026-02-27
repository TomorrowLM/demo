import { LaptopOutlined, DesktopOutlined } from "@ant-design/icons";
import React from "react";
import Layout from '@/view/layout/index'
import Dashboard from "@/view/dashBoard";
import Second from "@/view/learn/router/components/Second"
import Login from "@/view/User/Login";
console.log(GLOBAL_INFO.APP_ROUTER_BASE, "Second");
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
        name: "react基础",
        path: "/basic",
        component: 'learn/basic',
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
            name: "ahooks",
            path: "/ahooks",
            component: 'learn/hooks/aHooks',
            icon: <DesktopOutlined />
          }
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
            name: "onRef",
            path: "/dom/onRef",
            component: 'learn/dom/OnRef',
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
        name: '路由',
        icon: <LaptopOutlined />,
        isMenu: 1,
        path: "/router",
        children: [
          {
            name: "路由",
            path: "learn/router",
            component: 'Router',
            icon: <DesktopOutlined />,
            children: [
              {
                name: "路由通配符",
                path: "learn/router/:id",
                component: Second,
                icon: <DesktopOutlined />
              }
            ]
          },
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
    path: `${GLOBAL_INFO.APP_ROUTER_BASE}/login`,
    // path: `/login`,
    component: Login,
    isMenu: 0,
    exact: true,
  },
]

export const routes = {
  path: GLOBAL_INFO.APP_ROUTER_BASE,
  component: Layout,
  children: [
    ...menuRoutes
  ]
};