# Qiankun 主应用

Node.js 版本要求: 16

## 项目概述

这是一个基于 React + Qiankun 的微前端主应用项目。

## 依赖项说明

### 生产依赖 (dependencies)

**运行时必需的依赖项，会被打包到生产代码中：**

- `antd` (^5.27.0) - Ant Design UI 组件库
- `dotenv` (^16.4.7) - 环境变量配置管理
- `qiankun` (^2.10.16) - 微前端框架
- `react` (^18.3.1) - React 核心库
- `react-dom` (^18.3.1) - React DOM 渲染
- `react-router-dom` (^6.23.1) - React 路由管理
- `@r2wc/react-to-web-component` (^2.0.4) - React 组件转 Web Components
- `web-vitals` (^2.1.4) - Web 性能指标监控

### 开发依赖 (devDependencies)

**仅在开发构建时需要的工具和库：**

- `@babel/core` (^7.24.6) - Babel 核心编译工具
- `@babel/preset-env` (^7.24.6) - Babel 环境预设
- `@babel/preset-react` (^7.24.6) - Babel React 预设
- `@types/react` (^18.3.24) - React TypeScript 类型定义
- `@types/react-dom` (^18.3.7) - React DOM TypeScript 类型定义
- `babel-loader` (^8.4.1) - Webpack Babel 加载器
- `cross-env` (^7.0.3) - 跨平台环境变量设置
- `css-loader` (^6.5.0) - Webpack CSS 加载器
- `less` (^4.4.0) - Less CSS 预处理器
- `less-loader` (^10.2.0) - Webpack Less 加载器
- `mini-css-extract-plugin` (^2.9.2) - CSS 提取插件
- `typescript` (^5.3.3) - TypeScript 编译器
- `webpack` (^5.91.0) - 模块打包工具
- `webpack-cli` (^5.1.4) - Webpack 命令行工具

## 脚本命令

- `npm start` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run build:qiankun` - 构建 Qiankun 版本

## 项目结构

```
src/
├── main.js              # 应用入口文件
├── router/              # 路由配置
├── page/               # 页面组件
│   ├── Home/           # 首页
│   ├── subApp/         # 子应用容器
│   ├── communication/  # 通信相关
│   └── componentPage/  # 组件页面
├── assets/             # 静态资源
└── public-path.js      # 公共路径配置
```

## 构建配置

项目使用 Webpack 5 进行构建，配置详见 `webpack.config.js`。

## 环境要求

- Node.js 16+
- npm 或 yarn 包管理器
