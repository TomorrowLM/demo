import React from 'react';
import * as Icon from '@ant-design/icons';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { history, RequestConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import Logo from '@/assets/logo.png';
import KeepAliveTabs from '@/components/KeepAliveTabs';
import { isXsScreen } from '@/utils/utils';
import { folderRoutes } from '@/utils/route';
import { errorHandler, requestInterceptors, responseInterceptors } from './interceptors';
import { queryCurrent, getRouters } from './services/user';
import defaultSettings from '../config/defaultSettings';
import exportData from "./pages/survey/list/exportData"

let authRoutes: Array<any> = [];
const defaultCollapsed = window.localStorage.getItem('defaultCollapsed') !== '0';

export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  settings?: LayoutSettings;
  cachingNodes?: Array<any>
}> {
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    try {
      const currentUser = await queryCurrent(); //获取权限标识列表
      localStorage.setItem('adminId',currentUser.user.adminId)
      return {
        currentUser,
        settings: defaultSettings,
      };
    } catch (error) {
      history.push('/user/login');
    }
  }
  return {
    settings: defaultSettings,
  };
}

export function patchRoutes({ routes }: any) {
  console.log(routes)
  const filterRoute = (data: Array<any>) => {
    data.forEach((route: any) => {
      const obj = route;
      if (Icon[obj.icon]) {
        obj.icon = React.createElement(Icon[obj.icon]);
      }
      if (obj.component && !obj.routes) {
        try {
          obj.component = require(`./pages/${obj.component}`).default;
          obj.exact = true;
          obj.unaccessible = true;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log('无法找到该文件路径: ', obj.component)
        }
      }
      if (obj.frameUrl) {
        window.localStorage.setItem(obj.path, JSON.stringify(obj));
        delete obj.frameUrl;
      }
      if (obj.routes) {
        delete obj.component;
        delete obj.redirect;
        delete obj.alwaysShow;
        filterRoute(obj.routes)
      }
    });
    return data;
  };
  setTimeout(() => {
    const addRoutes = filterRoute(authRoutes);
    const indexRoutes = [{
      path: '/index',
      name: '首页',
      hideInMenu: true,
      // icon: React.createElement(Icon.HomeOutlined),
      // eslint-disable-next-line global-require
      component: require('./pages/Index').default,
    },
    {
      path: '/folder/detail',
      name: '交付看板详情',
      hideInMenu: true,
      // icon: React.createElement(Icon.HomeOutlined),
      // eslint-disable-next-line global-require
      component: require('./pages/survey/folder/detail').default,
    },
    {
      path: '/survey/list/exportData',
      name: '导出数据列表',
      hideInMenu: true,
      component: exportData,
    },
     {
      path: '/list',
      name: '',
      hideInMenu: true,
      component: require('./pages/survey/detail').default,
      routes: [
        {
          name: '数据清洗',
          path: '/list/detail/clean',
          component: require('./pages/survey/detail/clean').default,
        },
        {
          name: '文字报告',
          path: '/list/detail/report',
          component: require('./pages/survey/detail/report').default,
        },
        {
          key: "123",
          name: '数据报告',
          path: '/list/detail/dataReport',
          component: require('./pages/survey/detail/dataReport').default,
          routes: [
            {
              name: '统计分析',
              path: '/list/detail/dataReport/statistical',
              component: require('./pages/survey/detail/dataReport/statistical').default,
            },
            {
              name: '数据报告',
              path: '/list/detail/dataReport/analysis',
              component: require('./pages/survey/detail/dataReport/analysis').default,
            }, {
              name: '统计分析',
              path: '/list/detail/dataReport/statistical',
              component: require('./pages/survey/detail/dataReport/statistical').default,
            },
          ]
        },
        // {
        //   name: '数据报告下载',
        //   path: '/list/detail/dataReportDown',
        //   component: require('./pages/survey/detail/dataReportDownLoad').default,
        // },
        {
          name: '项目资料',
          path: '/list/detail/data',
          component: require('./pages/survey/detail/data').default,
        },
        {
          name: '文字报告在线预览',
          path: '/list/detail/reportDetail',
          component: require('./pages/survey/detail/report/detail/detail').default,
        },
        {
          name: '项目资料报告在线预览',
          path: '/list/detail/dataDetail',
          component: require('./pages/survey/detail/data/detail/detail').default,
        },  {
          name: '数据清洗在线查看',
          path: '/list/detail/clearDataEdit',
          component: require('./pages/survey/detail/clean/clearDataEdit/clearDataEdit').default,
        }

      ]
    }
  ];

    routes[0].routes.unshift(...indexRoutes, ...addRoutes);
  });
}

export async function render(oldRoutes: any) {
  const token = window.localStorage.getItem('authorization');
  if (token) {
    const { data } = await getRouters();
    data.forEach((item: any) => {
      // debugger;
      const route = item;
      // console.log(item)
      // if (item.path === '/folder') {
      //   route.routes = folderRoutes
      // }
      // console.log( route)
    });
    authRoutes = data;
  } else if (history.location.pathname !== '/user/login') {
    history.push('/user/login');
  }
  oldRoutes();
}

export const layout = ({
  initialState
}: {
  initialState: { settings?: LayoutSettings; currentUser?: API.CurrentUser };
}): BasicLayoutProps => {
  return {
    logo: () => <img src={Logo} alt="logo" />,
    headerContentRender: () => !isXsScreen && <KeepAliveTabs />,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    defaultCollapsed,
    breakpoint: false,
    breadcrumbRender: (routes) => {
      const arr = routes?.map((item: any) => {
        const obj = item;
        if (!obj.component) {
          obj.path = '/'
        }
        return obj;
      })
      return arr;
    },
    // footerRender: () => <Footer />,
    onPageChange: () => {
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser?.user?.userId && history.location.pathname !== '/user/login') {
        history.push('/user/login');
      }
    },
    onCollapse: (collapsed) => {
      window.localStorage.setItem('defaultCollapsed', collapsed ? '1' : '0');
    },
    menuHeaderRender: undefined,
    ...initialState?.settings
  };
};

export const request: RequestConfig = {
  timeout: 300000,
  credentials: 'include',
  errorHandler,
  requestInterceptors,
  responseInterceptors,
};
