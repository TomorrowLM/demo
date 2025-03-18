import { LaptopOutlined, DesktopOutlined } from "@ant-design/icons";
import React from "react";
import Index from '@/view/index'
import Dashboard from "@/view/DashBoard/index.jsx";
import Second from "@/view/Router/components/Second"
import Login from "@/view/User/Login";

export const menuRoutes = [
  // {
  //   path: "/dashboard",
  //   name: "面板",
  //   // exact: true,
  //   component: Dashboard,
  //   icon: <DesktopOutlined />,
  //   isMenu: 1,
  // },
  {
    name: "react学习",
    icon: <DesktopOutlined />,
    isMenu: 1,
    children: [
      {
        name: "useState",
        path: "/grammer/useState",
        component: 'Grammer/UseState',
        icon: <DesktopOutlined />,
      },
      {
        name: 'ref',
        icon: <LaptopOutlined />,
        isMenu: 2,
        children: [
          {
            name: "ref",
            path: "/dom/ref",
            component: 'Dom/Ref',
            icon: <DesktopOutlined />
          },
          {
            name: "onRef",
            path: "/dom/onRef",
            component: 'Dom/OnRef',
            icon: <DesktopOutlined />
          },
          {
            name: "findDomDode",
            path: "/dom/findDomDode",
            component: 'Dom/FindDomDode',
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
    name: '交流',
    icon: <LaptopOutlined />,
    isMenu: 1,
    children: [
      {
        name: "communicate",
        path: "/communicate",
        component: 'Communicate/Communicate',
        icon: <DesktopOutlined />
      }
    ]
  },
  {
    name: 'hooks',
    icon: <LaptopOutlined />,
    isMenu: 1,
    children: [
      {
        name: "类组件",
        path: "/hooks/classhooks",
        component: 'Hooks/ClassHooks',
        icon: <DesktopOutlined />
      },
      {
        name: "函数组件",
        path: "/hooks/functionHooks",
        component: 'Hooks/FunctionHooks',
        icon: <DesktopOutlined />,
      },
      {
        name: "ahooks",
        path: "/hooks/ahooks",
        component: 'Hooks/AHooks',
        icon: <DesktopOutlined />
      }
    ]
  },
  {
    name: '特效',
    icon: <LaptopOutlined />,
    isMenu: 1,
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
    name: '路由',
    icon: <LaptopOutlined />,
    isMenu: 1,
    children: [
      {
        name: "路由",
        path: "/router",
        component: 'Router',
        icon: <DesktopOutlined />,
        children: [
          {
            name: "路由通配符",
            path: "/router/:id",
            component: Second,
            icon: <DesktopOutlined />
          }
        ]
      },
      {
        name: "路由渲染方式",
        exact: true,
        path: "/routertype",
        component: 'Router/RouterType',
        icon: <DesktopOutlined />,
      }
    ]
  },
  {
    name: '权限',
    icon: <LaptopOutlined />,
    isMenu: 1,
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
    path: "/user/login",
    component: Login,
    isMenu: 0,
    exact: true,
  },
]

export const routes = [
  ...whiteRoute,
  {
    path: "/",
    component: Index,
    children: menuRoutes
  },
];