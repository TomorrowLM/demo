# 轻蜂 vue-cli 插件

用途：下沉轻蜂前端项目的底层配置，让其对业务开发透明、统一基础配置，方便维护与升级。

## generator

- 渲染轻蜂业务逻辑模版

  > 模版路径 ./generator/template

- 注入业务依赖

```js
{
    "axios": "^0.19.2",
    "qt-element-ui": "^1.0.70",
    "@qbee/qbee-common-lib": "^0.0.1", // 轻蜂通用工具库
    "qs": "^6.9.4",
    "@qbee/fe-eb-components": "^0.2.148",// 轻蜂自定义组件库
    "fe-qbee-bo": "^0.0.2",// 轻蜂通用模型库
    "@qbee/fe-vue-contacts": "^0.1.2",// 轻蜂通讯录组件
    "lodash": "^4.17.15",
    "vue-i18n": "^8.18.1",
    "web-security": "^1.2.9"
}
```

- 注入开发依赖

```js
{
      'stats-webpack-plugin': '^0.7.0',
      'webpack-shell-plugin': '^0.5.0',// 打包
      'single-spa-vue':'^1.8.2',// 微前端子项目
      'nodemon':'^2.0.4',
      'babel-plugin-component':'^1.1.1',// element按需引入
      "sass-loader": "^8.0.2",
      "node-sass": "^4.14.1",
      "cors": "^2.8.5",// mock服务跨域支持
}
```

- 注入自定义命令

```js
{
    'start':'vue-cli-service serve',
    'start:dev': 'vue-cli-service serve --mode dev',
    'start:qa': 'vue-cli-service serve --mode qa',
    'start:pet': 'vue-cli-service serve --mode pet',
}
```

## babelConfig.js

保存 babelConfig 配置，主要是为了方便统一各项目配置，方便维护

## service 插件

- 注册自定义 vue-cli 指令：qbeemock

  该指令会用 `nodemon` 启动 `src/mock/mockServer.js`文件

- 修改 vue-cli serve 指令

  如果运行 vue-cli serve 指令时不使用 mode 参数，则会自动运行 vue-cli qbeemock 指令，以启动 mock 服务

- 修改 webpack 配置
  - 修改 `publicUrl` 为 `config/paths.js` 中的 `publicUrl` 字段
  - 修改 `outputDir` 为 `config/paths.js` 中的 `buildPath` 字段
  - 添加 css loader `prependData:{ @import "@/AppVar.scss"; }`
  - 构建时如果为生产环境，强制关闭 sourcemap
  - 配置 webpack 打包输出配置，方便配合微前端接入
  - 配置打包输出 `manifest.json` 文件
  - 配置打包完成后自动生成 `tar` 包
  - 非基座项目添加 externals 配置
  - 调试阶段在 entry 中添加`dev-import.ts`文件
  - 增强 sourcemap 配置，不需要的可通过在`vue.config.js`设置`pluginOptions.qbee.enhanceSourcemap: false`关闭
  - 不排包 `vue.config.js` 配置 `pluginOptions.qbee.shareLibs: false`
