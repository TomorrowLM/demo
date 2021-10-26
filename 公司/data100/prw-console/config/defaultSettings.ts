import { Settings as LayoutSettings } from '@ant-design/pro-layout';

export default {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#7979f5',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: false,
  },
  title: '拼任务管理系统',
  pwa: false,
  iconfontUrl: '//at.alicdn.com/t/font_2226712_reqccqgeht.js'
} as LayoutSettings & {
  pwa: boolean;
};