
### 前言
#数字100 拼任务公众号


### 依赖模块
<span style="color: rgb(184,49,47);">项目是用create-react-app创建的，主要还是列出新加的功能依赖包</span>


- [vue@2.6.11](https://cn.vuejs.org/)
- [vuex@3.4.0](https://vuex.vuejs.org/zh/guide/)(<span style="color: rgb(243,121,52);">vue状态管理</span>)
- [vue-router@3.2.0](https://router.vuejs.org/zh/)(<span style="color: rgb(243,121,52);">vue路由</span>)
- [vant@2.9.0](https://youzan.github.io/vant/#/zh-CN/home)(<span style="color: rgb(243,121,52);">轻量、可靠的移动端 Vue 组件库</span>)
- [axios@0.19.2](https://github.com/mzabriskie/axios)(<span style="color: rgb(243,121,52);">http请求</span>)
- [moment@2.27.0](http://momentjs.cn/)(<span style="color: rgb(243,121,52);">JavaScript 日期处理类库</span>)
- [lodash.clonedeep@4.5.0](https://www.lodashjs.com/)(<span style="color: rgb(243,121,52);">Lodash是一个一致性、模块化、高性能的 JavaScript 实用工具库</span>)
- [vue-ls@3.2.1](https://www.npmjs.com/package/vue-ls)(<span style="color: rgb(243,121,52);">用于Vue上下文中的本地存储，会话存储和内存存储</span>)


<!--more-->

### 代码目录
```js
├── dist/                    # 打包的文件目录
├── node_modules/            # npm下载文件目录
├── public/                                 
|   └── index.html					 # 首页入口html文件
|   └── favicon.ico					 # 应用图标
├── src
│   ├── api                  # Api ajax 等
│   ├── assets               # 本地静态资源
│   ├── components           # 业务通用组件
│   ├── config               # 项目基础配置，包含路由，全局设置
│   ├── core                 # 项目引导, 全局配置初始化，依赖包引入等
│   ├── router               # Vue-Router
│   ├── store                # Vuex
│   ├── utils                # 工具库
│   ├── locales              # 国际化资源
│   ├── views                # 业务页面入口和常用模板
│   ├── App.vue              # Vue 模板入口
│   └── main.js              # Vue 入口 JS
├── .browserslistrc
├── .env                     # 正式NODE_ENV配置
├── .env.development         # 本地NODE_ENV配置
├── .env.preview             # 测试NODE_ENV配置
├── .eslintrc                # 自定义eslint配置文件
├── .gitignore               # git 提交规则配置
├── babel.config.js          
├── package.json            
└── vue.config.js            # Vue 全局配置       
```

### 安装运行
##### 1.下载或克隆项目源码
##### 2.npm安装相关包文件
```js
npm i 或者 yarn
```
##### 3.启动项目
```js
npm run serve 或者 yarn serve
```
##### 4.打包项目
```js
npm run build 或者 yarn build
```
