import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
// import Inspect from 'vite-plugin-inspect'; //可以让开发者在浏览器端就可以看到vue文件编译后的代码、vue文件的相互依赖关系
import dayjs from 'dayjs'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills' //允许你在浏览器环境中直接require或import Node.js的内置模块。通过这个插件，您可以轻松地在Web应用中使用诸如process、events、http和stream等常用的Node.js模块
import qiankun from 'vite-plugin-qiankun'
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
  console.log(
    '========> mode = ',
    mode,
    process.env.npm_package_version,
    ' appPublicPath = ',
    appPublicPath,
    '  proxyTarget = ',
    proxyTarget
  )
  const qiankunPath = path.resolve(__dirname, '../').replace(/\\/g, '/')
  console.log(1234, qiankunPath)
  return {
    define: {
      // __APP_VERSION__: `'${process.env.npm_package_version}${sprintVersion ? `.${sprintVersion}` : ''}'`,
      __APP_VERSION__: "'1.0'",
      // __APP_BUILD_COMMIT__: `'${buildCommit}'`,
      // __APP_BUILD_BRANCH__: `'${buildBranch}'`,
      __APP_BUILD_DATE__: `'${buildDate}'`
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "${qiankunPath}/shared/styles/index.scss" as *;`
        }
      }
    },
    optimizeDeps: {
      include: [
        'monaco-editor/esm/vs/editor/editor.worker'
        // './src/components/monacoEditor/language-service/todoLangWorker.ts',
      ]
    },
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
      // vue3微应用名字，与主应用注册的微应用名字保持一致
      // 如果是在主应用中加载子应用vite,必须打开useDevMode,否则vite加载不成功, 单独运行没影响
      qiankun('vue3', { useDevMode: true })
      // VueI18nPlugin({
      //   /* options */
      //   // locale messages resource pre-compile option
      //   include: resolve(srcPath, './i18n/locales/**'),
      // }),
      // Inspect(),
      // new MonacoWebpackPlugin()
    ],
    resolve: {
      alias: {
        '@': srcPath
      }
    },
    transpileDependencies: true,
    publicPath: appPublicPath,
    // buildPath: './',
    base: basePath,
    // base: 'D:/work/cidsi/data-plat/assets/asset-fe/gui/assets',
    // base: './',
    // assetsPublicPath: './',
    // productionSourceMap: true,
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}` // webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
    },
    build: {
      outDir: appBuildDir,
      // emptyOutDir: true,
      // chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // 分包
          // manualChunks(id) {
          //   if (id.includes("node_modules")) {
          //     return id
          //       .toString()
          //       .split("node_modules/")[1]
          //       .split("/")[0]
          //       .toString();
          //   }
          // },
        }
      }
      // outDir: 'build_electron/release',
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
