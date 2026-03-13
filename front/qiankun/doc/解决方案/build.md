# 构建封装（Vue2 · Vue CLI）设计与实现记录

本方案围绕“core → plugin 适配层 → builder 插件体系”的三层结构，提供统一、可扩展的构建封装，用于多项目快速接入与后续向 React/Webpack/Vite/Qiankun 等构建器扩展。

相关文件
- 构建器（Vue2 · Vue CLI）
  - [`index.builder.js`](npm/shared/src/config/build/vue-cli/index.builder.js)
- 插件适配层（Vue2 中转站）
  - [`plugin.ts`](npm/shared/src/config/build/vue-cli/plugin.ts)
  - [`plugin.js`](npm/shared/src/config/build/vue-cli/plugin.js)
- 通用 Webpack 能力（供多构建器复用）
  - [`webpack.helpers.js`](npm/shared/src/config/build/core/webpack.helpers.js)
- 包导出（exports）
  - [`package.json`](npm/shared/package.json)

---

## 1. 分层设计

- core（通用层）
  - 提供与具体框架无关的 Webpack 通用能力（合并 alias/externals、Define/Provide 注入、DevServer 代理拼装、CDN 资源规格化等）。
  - 位置：[`webpack.helpers.js`](npm/shared/src/config/build/core/webpack.helpers.js)

- plugin 适配层（中转站）
  - 作用：把 core 的通用能力转换为 Vue2 生命周期可用的“插件函数”，避免 builder 直接耦合 core。
  - 输出：externalsPlugin、aliasPlugin、definePlugin、providePlugin、htmlCdnPlugin、devServerProxyPlugin、helpers（透传 core 能力）。
  - 位置：
    - 优先 TS：[`plugin.ts`](npm/shared/src/config/build/vue-cli/plugin.ts)
    - 运行时 CJS：[`plugin.js`](npm/shared/src/config/build/vue-cli/plugin.js)

- builder（构建器）
  - 作用：聚合 options、预置/自定义插件，并在 Vue CLI 生命周期（configureWebpack/chainWebpack）中运行插件。
  - 特性：插件“命名 + 优先级 + 去重”、默认插件注册、顶层 css 与 devServer 合并、CDN 注入等。
  - 位置：[`index.builder.js`](npm/shared/src/config/build/vue-cli/index.builder.js)

---

## 2. 插件体系

- 注册接口
  - use(pluginFn, { name?: string, order?: number }): 注册插件
    - name：插件名称，用于去重（同名覆盖）
    - order：执行优先级，数值越小越先执行（默认 100）

- 去重与排序
  - 同名覆盖（最后注册的覆盖已有记录）
  - 先按 order 升序，再按 name 字典序稳定排序

- 生命周期
  - stage: 'configureWebpack' | 'chainWebpack'
  - 在 Vue CLI 的 configureWebpack 与 chainWebpack 生命周期阶段，通过 runPlugins 触发

- 建议的默认优先级（order）
  - devProxy: 10
  - alias: 20
  - externals: 30
  - define: 40
  - provide: 50
  - htmlCdn: 60

- 预置插件（自动）
  - externalsPlugin：在 createConfig 中自动注册，基于 options.externals 与 options.cdn.externals 合并 webpack.externals

---

## 3. 适配层（Vue2 插件工厂）

从中转站输出的插件工厂（均可直接 use）：
- externalsPlugin(map)
- aliasPlugin(alias)
- definePlugin(defines)
- providePlugin(provides)
- htmlCdnPlugin({ css, js })
- devServerProxyPlugin(rules)
- helpers（透传 core 的工具）

位置：
- [`plugin.ts`](npm/shared/src/config/build/vue-cli/plugin.ts)
- [`plugin.js`](npm/shared/src/config/build/vue-cli/plugin.js)

说明：
- configureWebpack 阶段插件对 config 直接修改（如合并 externals/alias、注入 Define/Provide、补齐 devServer.proxy）
- chainWebpack 阶段插件对 chain 进行注入（例如向 html-webpack-plugin 的模板参数注入 cdn 结构）

---

## 4. Builder（Vue2 · Vue CLI）核心能力

文件：[`index.builder.js`](npm/shared/src/config/build/vue-cli/index.builder.js)

- options → 构建能力映射（自动转插件或顶层合并）
  - externals：合并 webpack.externals（通过预置 externalsPlugin）
  - alias：追加/合并 resolve.alias（通过 aliasPlugin）
  - define/provide：注入 DefinePlugin/ProvidePlugin（通过 definePlugin/providePlugin）
  - cdn：注入 htmlWebpackPlugin.options.cdn（通过 htmlCdnPlugin）
  - proxyRules：生成 devServer.proxy；可插件化或顶层合并
  - css：与 base.css 深合并（注入 sass.additionalData 等）
  - devServer：与 base.devServer 深合并
  - enableSplitChunksInDev：开发期开启 splitChunks

- 插件体系（use/runPlugins）
  - use(pluginFn, { name, order })
  - runPlugins('configureWebpack' | 'chainWebpack', ctx)
  - 统一在生命周期内执行插件，并提供 helpers 与 options

- 默认注册的插件（createConfig 内）
  - externals → name: externals, order: 30
  - alias → name: alias, order: 20（按需）
  - define → name: define, order: 40（按需）
  - provide → name: provide, order: 50（按需）
  - htmlCdn → name: htmlCdn, order: 60（按需）
  - devProxy → name: devProxy, order: 10（按需）

---

## 5. 使用示例

- 仅使用 options 驱动（推荐）
```js
// vue.config.js
const { defineConfig } = require('@vue/cli-service')
const Builder = require('@lm/shared/config/build/vue-cli/index.builder.js')

const builder = new Builder({
  externals: { lodash: '_' },
  alias: { '@components': require('path').resolve(__dirname, 'src/components') },
  define: { __BUILD_ENV__: JSON.stringify(process.env.APP_ENV || 'development') },
  cdn: { externals: { vue: 'Vue' }, js: ['//cdn.jsdelivr.net/npm/vue@2/dist/vue.min.js'] },
  proxyRules: [{ baseUrl: '/api', target: 'http://localhost:3000' }],
  css: { loaderOptions: { sass: { additionalData: '@import "~@/styles/index.scss";' } } },
  enableSplitChunksInDev: true
})

module.exports = defineConfig(builder.createConfig())
```

- 插件化控制顺序与去重
```js
const { defineConfig } = require('@vue/cli-service')
const Builder = require('@lm/shared/config/build/vue-cli/index.builder.js')
const vue2Plugins = require('@lm/shared/config/build/vue-cli/plugin')

const builder = new Builder()

builder
  .use(vue2Plugins.devServerProxyPlugin([{ baseUrl: '/api', target: 'http://localhost:3000' }]), { name: 'devProxy', order: 10 })
  .use(vue2Plugins.aliasPlugin({ '@ui': require('path').resolve(__dirname, 'src/ui') }), { name: 'alias', order: 20 })
  .use(vue2Plugins.externalsPlugin({ lodash: '_' }), { name: 'externals', order: 30 })
  .use(vue2Plugins.definePlugin({ __APP_VERSION__: JSON.stringify('1.0.0') }), { name: 'define', order: 40 })
  // 覆盖同名插件（去重）
  .use(vue2Plugins.definePlugin({ __APP_VERSION__: JSON.stringify('1.0.1') }), { name: 'define', order: 40 })

module.exports = defineConfig(builder.createConfig())
```

---

## 6. 包导出（exports）

文件：[`package.json`](npm/shared/package.json)

新增导出：
- "@lm/shared/config/build/vue-cli/plugin"
  - ESM: ./lib/esm/config/build/vue-cli/plugin.js
  - CJS: ./lib/cjs/config/build/vue-cli/plugin.js
- "@lm/shared/config/build/vue-cli/index.builder"
  - ESM: ./lib/esm/config/build/vue-cli/index.builder.js
  - CJS: ./lib/cjs/config/build/vue-cli/index.builder.js

说明：
- 构建产物需在打包流程（Rollup/TS）中生成对应路径的 ESM/CJS 文件后可直接通过 exports 引用。
- builder 运行时优先加载 TS 版 plugin.ts → 再次加载 plugin.js → 最后兜底 core（仅打印警告，不推荐）。

---

## 7. 约定与最佳实践

- 插件命名 name：避免重复，建议以域名前缀+功能（如 app.alias、app.externals），便于覆盖与排查。
- 插件优先级 order：遵循“先环境/代理、再别名、后 externals、再 define/provide、最后 html 注入”的顺序。
- 合并策略：
  - alias/externals：合并覆盖
  - css/devServer：深合并（避免破坏基础配置）
- 失败边界：插件执行应幂等且对异常进行捕获，严苛模式可配置为抛出错误（后续增强）。
- 产物兼容：确保 plugin.ts 编译输出 plugin.js；避免运行时 fallback 到 core。

---

## 8. 后续计划（可选）

- 插件“严格模式”：use(fn, { name, order, strict: true })，strict 下插件异常将中断构建。
- Schema 校验：对 builder options 做 JSON Schema/zod 校验与默认值注入。
- 统一 Plugin Interface：为 React/Webpack/Vite/Qiankun 的 builder 定义相同的插件接口，降低迁移成本。
- 预设（preset）：将常用插件组合为预设（如 app-vue2、qiankun-slave、analyze、legacy），一键启用。
- 测试与文档：UT（helpers / 插件工厂）、e2e（最小工程）、调试日志开关。
