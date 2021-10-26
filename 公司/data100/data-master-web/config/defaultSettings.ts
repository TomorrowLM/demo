import { Settings as LayoutSettings } from '@ant-design/pro-layout';

export default {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: 'rgba(33,79,126,1)',
  iconColor:"#e3e6eb",
  layout: 'top',
  contentWidth: 'Fluid',//自适应
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: false,
  },
  title: '',//数据交付平台   手拉手管理系统
  pwa: false,
  iconfontUrl: '//at.alicdn.com/t/font_2226712_reqccqgeht.js'
} as LayoutSettings & {
  pwa: boolean;
};