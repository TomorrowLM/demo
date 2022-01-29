
import Dashboard from "../view/DashBoard/Dashboard"
import { LaptopOutlined, DesktopOutlined } from "@ant-design/icons";
import React from "react";

// export const routes = [
//   {
//     path: "dashboard",
//     component: Dashboard,
//     exact: true,
//   },
//   {
//     path: "store",
//     component: Store,
//     exact: true,
//   },
//   {
//     path: "hox",
//     component: Hox,
//     exact: true,
//   },
//   {
//     path: "communicate",
//     component: Communicate,
//     exact: true,
//   },
//   {
//     path: "onRef",
//     component: OnRef,
//     exact: true,
//   },
//   {
//     path: "findDomDode",
//     component: FindDomDode,
//     exact: true,
//   },
//   {
//     path: "ref",
//     component: Ref,
//     exact: true,
//   },
//   {
//     path: "classHooks",
//     component: ClassHooks,
//     exact: true,
//   },
//   {
//     path: "functionHooks",
//     component: FunctionHooks,
//     exact: true,
//   },
//   {
//     path: "ahooks",
//     component: AHooks,
//     exact: true,
//   },
//   {
//     path: "reactSortable",
//     component: ReactSortable,
//     exact: true,
//   },
//   {
//     path: "router",
//     component: Router,
//     exact: false,
//   },
// ];


export const routes = [
  {
    name: "首页",
    title: "首页",
    path: "/",
    exact: true,
    component: Dashboard,
    icon: <DesktopOutlined />,
    isMenu: 1
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
    name: 'ref',
    icon: <LaptopOutlined />,
    isMenu: 1,
    children: [
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
      {
        name: "ref",
        path: "/dom/ref",
        component: 'Dom/Ref',
        icon: <DesktopOutlined />
      },
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
        icon: <DesktopOutlined />
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
        component: 'Antd/Form',
        icon: <DesktopOutlined />
      }
    ]
  },
  // {
  //   name: 'router',
  //   // icon: <LaptopOutlined />,
  //   isMenu: 0,
  // }
];