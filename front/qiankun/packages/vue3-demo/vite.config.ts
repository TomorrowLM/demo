import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import dayjs from 'dayjs'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills' //允许你在浏览器环境中直接require或import Node.js的内置模块。通过这个插件，您可以轻松地在Web应用中使用诸如process、events、http和stream等常用的Node.js模块
import qiankun from 'vite-plugin-qiankun'
import { visualizer } from 'rollup-plugin-visualizer'
import importToCDN, { cdn } from 'vite-plugin-cdn-import'
import inject from '@rollup/plugin-inject'
import monacoEditorPlugin from "vite-plugin-monaco-editor"
// import MonacoEditorPlugin from 'vite-plugin-monaco-editor' // 使用vite-plugin-monaco-editor
// import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';// 引入rollup-plugin-visualizer模块
// import Inspect from 'vite-plugin-inspect'; //可以让开发者在浏览器端就可以看到vue文件编译后的代码、vue文件的相互依赖关系
export default defineConfig(({ mode }) => {
  const buildDate = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const env = loadEnv(mode, process.cwd(), 'CONFIG')
  const proxyTarget = `http://${env.CONFIG_API_PROXY}`
  const sprintVersion = env.CONFIG_SPRINT_VERSION || ''
  const srcPath = fileURLToPath(new URL('./src', import.meta.url))
  const typingsPath = resolve(srcPath, 'typings')
  const appPublicPath = mode === 'elecPro' ? '../' : env.CONFIG_APP_PUBLIC || '/'
  const basePath = mode === 'elecPro' ? './' : env.CONFIG_APP_PUBLIC || '/'
  const appBuildDir = env.CONFIG_APP_BUILD_DIR || 'dist'
  const isDev = mode === 'development' || mode === 'elecDev'
  const name = require('./package.json').name
  const externals = {
    jquery: 'jQuery'
  }
  console.log(
    '========> mode = ',
    mode,
    process.env.npm_package_version,
    ' appPublicPath = ',
    appPublicPath,
    '  proxyTarget = ',
    proxyTarget
  )
  const qiankunPath = path.resolve(__dirname, '../../').replace(/\\/g, '//');

  // path.resolve(__dirname, '../').replace(/\\/g, '/')
  console.log(1234, qiankunPath)
  console.log(srcPath, 1234)
  return {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@lm/shared/src/styles/index.scss" as *;`
        }
      }
    },
    // optimizeDeps: {
    //   include: [
    //     // 'monaco-editor/esm/vs/editor/editor.worker', // 预构建
    //     // './src/views/editor/language-service/todoLangWorker.ts',
    //   ]
    // },
    plugins: [
      Vue(),
      nodePolyfills(),
      AutoImport({
        // Auto import functions from Vue, e.g. ref, reactive, toRef...
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        // , '@vueuse/core'
        imports: [
          'vue',
          {
            '@vueuse/core': [
              // named imports
              'useVModel', // import { useVModel } from '@vueuse/core',
              'useEventBus'
            ]
          }
        ],
        dirs: [resolve(srcPath, './composition-api')],
        resolvers: [
          // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver({
            importStyle: 'sass'
          }),
          // Auto import icon components
          // 自动导入图标组件
          IconsResolver({
            prefix: 'Icon'
          })
        ],
        dts: resolve(typingsPath, 'auto-imports.d.ts'),
        // Generate corresponding .eslintrc-auto-import.json file.
        // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
        eslintrc: {
          enabled: !isDev, // Default `false`
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true
        }
      }),
      Components({
        resolvers: [
          // Auto register icon components
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ['ep'],
            customCollections: ['custom']
          }),
          // Auto register Element Plus components
          // 自动导入 Element Plus 组件
          ElementPlusResolver({
            importStyle: 'sass'
          })
        ],
        dts: resolve(typingsPath, 'components.d.ts')
      }),
      Icons({
        autoInstall: true,
        customCollections: { custom: FileSystemIconLoader('src/assets/icons') }
        // iconCustomizer(collection, icon, props) {
        //   const name = `${collection}:${icon}`;
        //   console.log(name, props);
        // },
      }),
      /**
       * vue3微应用名字，与主应用注册的微应用名字保持一致
       * 如果是在主应用中加载子应用vite,必须打开useDevMode,否则vite加载不成功, 单独运行没影响
       */
      qiankun('vue3', { useDevMode: true }),
      visualizer({
        open: true, //注意这里要设置为true，否则无效
        filename: 'stats.html', //分析图生成的文件名
        gzipSize: true, // 收集 gzip 大小并将其显示
        brotliSize: true // 收集 brotli 大小并将其显示
      }),
      inject({
        $: 'jquery', // 这里会自动载入 node_modules 中的 jquery
        jQuery: 'jquery',
        'windows.jQuery': 'jquery'
      }),
      importToCDN({
        // prodUrl：可选，默认指向 https://cdn.jsdelivr.net/npm/{name}@{version}/{path}
        modules: [
          {
            name: 'jquery',
            var: 'jQuery',
            version: '3.6.4',
            path: 'dist/jquery.min.js'
          }
          // {
          //   name: 'element-plus',
          //   // ElementPlus 为什么不是同下面第二种配置的elementPlus是因为这个配置同CDN资源一致，而下面的配置同需同main.ts的引入名称一致
          //   var: 'ElementPlus', // 外部化的依赖提供一个全局变量 同rollupOptions配置中的globals的值
          //   // https://unpkg.com/element-plus@2.2.32/dist/index.full.js 或者 dist/index.full.js
          //   path: 'dist/index.full.js',
          //   // 可选
          //   css: 'dist/index.css'
          // },
          // {
          //   name: 'vue-i18n',
          //   var: 'VueI18n',
          //   path: 'dist/vue-i18n.global.prod.js',
          // },
          // {
          //   name: 'vue-router',
          //   var: 'VueRouter',
          //   path: 'dist/vue-router.global.js'
          // },
          // // VueDemi这个是pinia用来判断是vue2还是vue3所需要的，要额外引入一下
          // {
          //   name: 'vue-demi',
          //   var: 'VueDemi',
          //   path: 'https://unpkg.com/vue-demi@0.13.1/lib/index.iife.js'
          // },
          // {
          //   name: 'pinia',
          //   var: 'Pinia',
          //   path: 'dist/pinia.iife.js'
          // },
          // // echarts，只有配置全局的时候有效，不然构建的时候还是会打包执行。也可以把echarts处理成按需引入
          // {
          //   name: 'echarts',
          //   var: 'echarts',
          //   path: 'dist/echarts.js'
          // },
          // // echarts 内使用了
          // {
          //   name: 'zrender',
          //   var: 'zrender ',
          //   path: 'dist/zrender.js'
          // },
        ]
      }),
      // (monacoEditorPlugin as any).default({
      //   languageWorkers: ['json', 'AviatorScript', 'editorWorkerService'],
      //   customWorkers: [
      //     {
      //       label: 'AviatorScript',
      //       entry: './src/views/editor/language-service/todoLangWorker.worker'
      //     }
      //   ]
      // })
      // MonacoEditorPlugin({
      //   languageWorkers: ['editorWorkerService']
      // })
      // new MonacoWebpackPlugin({ 
      //   languages: ['typescript', 'javascript', 'css', 'AviatorScript']
      // })
      // VueI18nPlugin({
      //   /* options */
      //   // locale messages resource pre-compile option
      //   include: resolve(srcPath, './i18n/locales/**'),
      // }),
      // Inspect(),
    ],
    resolve: {
      alias: {
        '@': srcPath,
        '@shared': qiankunPath + '\\npm\\shared\\src'
      }
    },
    transpileDependencies: true,
    publicPath: appPublicPath,
    base: basePath,
    // assetsPublicPath: './',
    // productionSourceMap: true,
    external: ['jquery'],
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}` // webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
    },
    define: {
      __APP_VERSION__: "'1.0'",
      __APP_BUILD_DATE__: `'${buildDate}'`,
      qiankunPath: `'${qiankunPath}'`
      // __APP_VERSION__: `'${process.env.npm_package_version}${sprintVersion ? `.${sprintVersion}` : ''}'`,
      // __APP_BUILD_COMMIT__: `'${buildCommit}'`,
      // __APP_BUILD_BRANCH__: `'${buildBranch}'`,
    },
    build: {
      outDir: appBuildDir,
      // emptyOutDir: true,
      // chunkSizeWarningLimit: 1000,
      rollupOptions: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        output: {
          globals: {
            moment: 'moment',
            uuid: 'uuid',
            lodash: 'lodash',
            jquery: '$'
          },
          // 分包
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          }
        }
      }
    },
    server: {
      host: true,
      port: 8003,
      proxy: {
        '/api': {
          target: 'http://192.168.110.59:7000'
        },

        '/mock': {
          target: '192.168.110.41:7000'
        }
      }
    }
  }
})
