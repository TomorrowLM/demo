// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const prodGzipList = ['js', 'css'];

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: 'Ant Design Pro',
    locale: false,
    siderWidth: 208,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  define: {
    'process.env.PROXY_API': '/adconsole/',
    'process.env.CURRENT': 1,
    'process.env.PAGE_SIZE': 10
  },
  plugins: [],
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: '登录',
          path: '/user/login',
          component: './user/login',
        }
      ],
    },
    {
      name: '个人中心',
      icon: 'smile',
      path: '/account/center',
      component: './user/AccountCenter',
      hideInMenu: true,
    },
    {
      path: '/',
      redirect: '/index',
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
    // 'font-size-base': '12px'
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  chainWebpack: (config: any) => {
    if (process.env.NODE_ENV === 'production') {  // 生产模式开启
      config.plugin('compression-webpack-plugin').use(
        new CompressionWebpackPlugin({
          // filename: 文件名称，这里我们不设置，让它保持和未压缩的文件同一个名称
          algorithm: 'gzip', // 指定生成gzip格式
          test: new RegExp('\\.(' + prodGzipList.join('|') + ')$'), // 匹配哪些格式文件需要压缩
          threshold: 10240, //对超过10k的数据进行压缩
          minRatio: 0.6 // 压缩比例，值为0 ~ 1
        })
      );
    }
  },
  // 配置 external
  externals: {
    'react': 'window.React',
    'react-dom': 'window.ReactDOM',
  },
  // 引入被 external 库的 scripts
  // 区分 development 和 production，使用不同的产物
  scripts: process.env.NODE_ENV === 'development' ? [
    'https://gw.alipayobjects.com/os/lib/react/16.8.6/umd/react.development.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/16.8.6/umd/react-dom.development.js',
  ] : [
    'https://gw.alipayobjects.com/os/lib/react/16.8.6/umd/react.production.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/16.8.6/umd/react-dom.production.min.js',
  ],
});
