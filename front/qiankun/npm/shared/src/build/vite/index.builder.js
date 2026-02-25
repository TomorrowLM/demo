import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { createRequire } from 'module'
import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import qiankun from 'vite-plugin-qiankun'
import { visualizer } from 'rollup-plugin-visualizer'
// import importToCDN from 'vite-plugin-cdn-import'
// import inject from '@rollup/plugin-inject'
import vueJsx from '@vitejs/plugin-vue-jsx';
const require = createRequire(import.meta.url); // createRequire 以支持在 ESM 模块中使用 CommonJS 的 require
const QiankunClass = require('../qiankun/index.js')
const { getProjectInfo } = require("../core/scripts/app.js");
const { getEnvConfig } = require("../core/scripts/env.js");
console.log(123, process.env.NODE_ENV, process.env.APP_ENV, import.meta.url, new QiankunClass().APP_NAME, getProjectInfo(), getEnvConfig())
export default class ViteBuilder {
  constructor(options = {}) {
    console.log('ViteBuilder options', process.env.APP_ENV);
    this.options = options;
    this.QiankunInstance = new QiankunClass(); // 初始化 qiankun 实例
    this.GLOBAL_CONFIG = {
      ENV_CONFIG: getEnvConfig(process.env.APP_ENV),
      APP_INFO: getProjectInfo(),
      APP_ENV: process.env.APP_ENV || "development",
      IS_DEV: process.env.APP_ENV.includes("development"),
    };
  }

  createConfig({ mode } = {}) {
    const { ENV_CONFIG: { IS_PROD, IS_QIANKUN, Build_Path, APP_OUTPUTDIR }, APP_INFO: { APP_NAME } } = this.GLOBAL_CONFIG
    const env = loadEnv(mode || '', process.cwd(), 'VUE_APP')
    const srcPath = fileURLToPath(new URL('./src', import.meta.url))
    const typingsPath = resolve(srcPath, 'typings')

    const output = IS_QIANKUN ? {
      library: `${APP_NAME}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${APP_NAME}`,
    } : {}

    return defineConfig({
      base: Build_Path,
      output,
      define: {
        GLOBAL_INFO: this.GLOBAL_CONFIG
      },
      transpileDependencies: true,
      inlineDynamicImports: true,
      build: {
        // 如果是 qiankun 模式，优先使用 $lm-config 环境配置里的 APP_OUTPUTDIR（相对路径相对于项目根），否则使用默认 dist
        outDir: IS_QIANKUN && APP_OUTPUTDIR ? resolve(process.cwd(), APP_OUTPUTDIR) : 'dist',
        rollupOptions: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          output: {
            globals: {
              moment: 'moment',
              uuid: 'uuid',
              lodash: 'lodash',
            },
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
        origin: IS_PROD ? null : 'http://localhost:8003',
        proxy: {
          '/vue3/api': { target: 'http://127.0.0.1:3600' }
        }
      },
      resolve: {
        alias: {
          '@': resolve(process.cwd(), 'src/'),
        }
      },
      plugins: [
        Vue(),
        vueJsx(),
        nodePolyfills(),
        AutoImport({
          imports: ['vue', { '@vueuse/core': ['useVModel', 'useEventBus'] }],
          resolvers: [ElementPlusResolver({ importStyle: 'sass' }), IconsResolver({ prefix: 'Icon' })],
          dirs: [resolve(srcPath, './composition-api'), resolve(srcPath, './hooks')],
          dts: resolve(typingsPath, 'auto-imports.d.ts'),
          eslintrc: { enabled: IS_PROD, filepath: './.eslintrc-auto-import.json', globalsPropValue: true }
        }),
        Components({
          resolvers: [IconsResolver({ enabledCollections: ['ep'], customCollections: ['custom'] }), ElementPlusResolver({ importStyle: 'sass' })],
          dts: resolve(typingsPath, 'components.d.ts')
        }),
        Icons({ autoInstall: true, customCollections: { custom: FileSystemIconLoader('src/assets/icons') } }),
        qiankun('vue3', { useDevMode: true }),
        visualizer({ open: true, filename: 'stats.html', gzipSize: true, brotliSize: true })
      ],
      worker: { format: 'es' },
      css: {
        preprocessorOptions: { scss: { additionalData: `@use \"@lm/shared/assets/styles/index.scss\" as *;` } },
        modules: { scopeBehaviour: 'local', generateScopedName: '[name]__[local]___[hash:base64:5]', hashPrefix: 'prefix' }
      }
    })
  }
}
