import React from 'react';
import * as Icon from '@ant-design/icons';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { history, RequestConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import Logo from '@/assets/logo.png';
import KeepAliveTabs from '@/components/KeepAliveTabs';
import { isXsScreen } from '@/utils/utils';
import { surveyRoutes } from '@/utils/route';
import { errorHandler, requestInterceptors, responseInterceptors } from './interceptors';
import { queryCurrent, getRouters } from './services/user';
import defaultSettings from '../config/defaultSettings';

let authRoutes: Array<any> = [];
console.log(window.localStorage.getItem('defaultCollapsed'),window.localStorage.getItem('defaultCollapsed')==null)
const defaultCollapsed = window.localStorage.getItem('defaultCollapsed')&& window.localStorage.getItem('defaultCollapsed') !== '0';

export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  settings?: LayoutSettings;
  cachingNodes?: Array<any>
}> {
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    try {
      const currentUser = await queryCurrent();
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
    const indexRoutes = {
      path: '/index',
      name: '首页',
      icon: React.createElement(Icon.HomeOutlined),
      // eslint-disable-next-line global-require
      component: require('./pages/Index').default,
    };
    routes[0].routes.unshift(indexRoutes, ...addRoutes);
  });
}

export async function render(oldRoutes: any) {
  const token = window.localStorage.getItem('authorization');
  if (token) {
    const { data } = await getRouters();
    data.forEach((item: any) => {
      const route = item;
      if (item.path === '/survey') {
        route.routes = [
          ...route.routes,
          ...surveyRoutes
        ]
      }
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
    footerRender: () => <Footer />,
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
  timeout: 600000,
  credentials: 'include',
  errorHandler,
  requestInterceptors,
  responseInterceptors,
};
