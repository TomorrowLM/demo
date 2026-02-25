// ../../npm/shared/src/build/vite/index.builder.js
import { fileURLToPath, URL } from "node:url";
import { resolve } from "node:path";
import { createRequire } from "module";
import { defineConfig, loadEnv } from "vite";
import Vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import qiankun from "vite-plugin-qiankun";
import { visualizer } from "rollup-plugin-visualizer";
import vueJsx from "@vitejs/plugin-vue-jsx";
import commonjs from "file:///D:/work/demo/front/qiankun/node_modules/.pnpm/@rollup+plugin-commonjs@28.0.9_rollup@4.57.1/node_modules/@rollup/plugin-commonjs/dist/es/index.js";
var __vite_injected_original_import_meta_url = "file:///D:/work/demo/front/qiankun/npm/shared/src/build/vite/index.builder.js";
var require2 = createRequire(__vite_injected_original_import_meta_url);
var QiankunClass = require2("../qiankun/index.js");
var { getProjectInfo } = require2("../core/scripts/app.js");
var { getEnvConfig } = require2("../core/scripts/env.js");
console.log(123, process.env.NODE_ENV, process.env.APP_ENV, __vite_injected_original_import_meta_url, new QiankunClass().APP_NAME, getProjectInfo(), getEnvConfig());
var ViteBuilder = class {
  constructor(options = {}) {
    console.log("ViteBuilder options", process.env.APP_ENV);
    this.options = options;
    this.QiankunInstance = new QiankunClass();
    this.GLOBAL_CONFIG = {
      ENV_CONFIG: getEnvConfig(process.env.APP_ENV),
      APP_INFO: getProjectInfo(),
      APP_ENV: process.env.APP_ENV || "development",
      IS_DEV: process.env.APP_ENV === "development"
    };
  }
  createConfig({ mode } = {}) {
    const { ENV_CONFIG: { IS_PROD, IS_QIANKUN, Build_Path }, APP_INFO: { APP_NAME } } = this.GLOBAL_CONFIG;
    const env = loadEnv(mode || "", process.cwd(), "VUE_APP");
    const srcPath = fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url));
    const typingsPath = resolve(srcPath, "typings");
    const output = IS_QIANKUN ? {
      library: `${APP_NAME}-[name]`,
      libraryTarget: "umd",
      jsonpFunction: `webpackJsonp_${APP_NAME}`
    } : {};
    return defineConfig({
      base: Build_Path,
      output,
      define: {
        GLOBAL_INFO: this.GLOBAL_CONFIG
      },
      transpileDependencies: true,
      inlineDynamicImports: true,
      build: {
        outDir: IS_QIANKUN ? env.APP_OUTPUTDIR : "dist",
        rollupOptions: {
          chunkFileNames: "static/js/[name]-[hash].js",
          output: {
            globals: {
              moment: "moment",
              uuid: "uuid",
              lodash: "lodash"
            },
            manualChunks(id) {
              if (id.includes("node_modules")) {
                return id.toString().split("node_modules/")[1].split("/")[0].toString();
              }
            }
          }
        }
      },
      server: {
        host: true,
        port: 8003,
        origin: IS_PROD ? null : "http://localhost:8003",
        proxy: {
          "/vue3/api": { target: "http://127.0.0.1:3600" }
        }
      },
      resolve: {
        alias: {
          "@": resolve(process.cwd(), "src/")
        }
      },
      plugins: [
        // commonjs(), // optional
        Vue(),
        vueJsx(),
        nodePolyfills(),
        AutoImport({
          imports: ["vue", { "@vueuse/core": ["useVModel", "useEventBus"] }],
          resolvers: [ElementPlusResolver({ importStyle: "sass" }), IconsResolver({ prefix: "Icon" })],
          dirs: [resolve(srcPath, "./composition-api"), resolve(srcPath, "./hooks")],
          dts: resolve(typingsPath, "auto-imports.d.ts"),
          eslintrc: { enabled: IS_PROD, filepath: "./.eslintrc-auto-import.json", globalsPropValue: true }
        }),
        Components({
          resolvers: [IconsResolver({ enabledCollections: ["ep"], customCollections: ["custom"] }), ElementPlusResolver({ importStyle: "sass" })],
          dts: resolve(typingsPath, "components.d.ts")
        }),
        Icons({ autoInstall: true, customCollections: { custom: FileSystemIconLoader("src/assets/icons") } }),
        qiankun("vue3", { useDevMode: true }),
        visualizer({ open: true, filename: "stats.html", gzipSize: true, brotliSize: true })
      ],
      worker: { format: "es" },
      css: {
        preprocessorOptions: { scss: { additionalData: `@use "@lm/shared/assets/styles/index.scss" as *;` } },
        modules: { scopeBehaviour: "local", generateScopedName: "[name]__[local]___[hash:base64:5]", hashPrefix: "prefix" }
      }
    });
  }
};

// vite.config.ts
var vite_config_default = ({ mode }) => new ViteBuilder().createConfig({ mode });
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbnBtL3NoYXJlZC9zcmMvYnVpbGQvdml0ZS9pbmRleC5idWlsZGVyLmpzIiwgInZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcd29ya1xcXFxkZW1vXFxcXGZyb250XFxcXHFpYW5rdW5cXFxcbnBtXFxcXHNoYXJlZFxcXFxzcmNcXFxcYnVpbGRcXFxcdml0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcd29ya1xcXFxkZW1vXFxcXGZyb250XFxcXHFpYW5rdW5cXFxcbnBtXFxcXHNoYXJlZFxcXFxzcmNcXFxcYnVpbGRcXFxcdml0ZVxcXFxpbmRleC5idWlsZGVyLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi93b3JrL2RlbW8vZnJvbnQvcWlhbmt1bi9ucG0vc2hhcmVkL3NyYy9idWlsZC92aXRlL2luZGV4LmJ1aWxkZXIuanNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ25vZGU6cGF0aCdcclxuaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSB9IGZyb20gJ21vZHVsZSdcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBJY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJ1xyXG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tICd1bnBsdWdpbi1pY29ucy9yZXNvbHZlcidcclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcclxuaW1wb3J0IHsgRmlsZVN5c3RlbUljb25Mb2FkZXIgfSBmcm9tICd1bnBsdWdpbi1pY29ucy9sb2FkZXJzJ1xyXG5pbXBvcnQgeyBub2RlUG9seWZpbGxzIH0gZnJvbSAndml0ZS1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMnXHJcbmltcG9ydCBxaWFua3VuIGZyb20gJ3ZpdGUtcGx1Z2luLXFpYW5rdW4nXHJcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXHJcbi8vIGltcG9ydCBpbXBvcnRUb0NETiBmcm9tICd2aXRlLXBsdWdpbi1jZG4taW1wb3J0J1xyXG4vLyBpbXBvcnQgaW5qZWN0IGZyb20gJ0Byb2xsdXAvcGx1Z2luLWluamVjdCdcclxuLy8gaW1wb3J0IG1vbmFjb0VkaXRvclBsdWdpbiBmcm9tICd2aXRlLXBsdWdpbi1tb25hY28tZWRpdG9yJ1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnO1xyXG5pbXBvcnQgY29tbW9uanMgZnJvbSAnQHJvbGx1cC9wbHVnaW4tY29tbW9uanMnXHJcbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCk7XHJcbmNvbnN0IFFpYW5rdW5DbGFzcyA9IHJlcXVpcmUoJy4uL3FpYW5rdW4vaW5kZXguanMnKVxyXG5jb25zdCB7IGdldFByb2plY3RJbmZvIH0gPSByZXF1aXJlKFwiLi4vY29yZS9zY3JpcHRzL2FwcC5qc1wiKTtcclxuY29uc3QgeyBnZXRFbnZDb25maWcgfSA9IHJlcXVpcmUoXCIuLi9jb3JlL3NjcmlwdHMvZW52LmpzXCIpO1xyXG5jb25zb2xlLmxvZygxMjMsIHByb2Nlc3MuZW52Lk5PREVfRU5WLCBwcm9jZXNzLmVudi5BUFBfRU5WLCBpbXBvcnQubWV0YS51cmwsIG5ldyBRaWFua3VuQ2xhc3MoKS5BUFBfTkFNRSwgZ2V0UHJvamVjdEluZm8oKSwgZ2V0RW52Q29uZmlnKCkpXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpdGVCdWlsZGVyIHtcclxuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuICAgIGNvbnNvbGUubG9nKCdWaXRlQnVpbGRlciBvcHRpb25zJywgcHJvY2Vzcy5lbnYuQVBQX0VOVik7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgdGhpcy5RaWFua3VuSW5zdGFuY2UgPSBuZXcgUWlhbmt1bkNsYXNzKCk7IC8vIFx1NTIxRFx1NTlDQlx1NTMxNiBxaWFua3VuIFx1NUI5RVx1NEY4QlxyXG4gICAgdGhpcy5HTE9CQUxfQ09ORklHID0ge1xyXG4gICAgICBFTlZfQ09ORklHOiBnZXRFbnZDb25maWcocHJvY2Vzcy5lbnYuQVBQX0VOViksXHJcbiAgICAgIEFQUF9JTkZPOiBnZXRQcm9qZWN0SW5mbygpLFxyXG4gICAgICBBUFBfRU5WOiBwcm9jZXNzLmVudi5BUFBfRU5WIHx8IFwiZGV2ZWxvcG1lbnRcIixcclxuICAgICAgSVNfREVWOiBwcm9jZXNzLmVudi5BUFBfRU5WID09PSBcImRldmVsb3BtZW50XCIsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlQ29uZmlnKHsgbW9kZSB9ID0ge30pIHtcclxuICAgIGNvbnN0IHsgRU5WX0NPTkZJRzogeyBJU19QUk9ELCBJU19RSUFOS1VOLCBCdWlsZF9QYXRoIH0sIEFQUF9JTkZPOiB7IEFQUF9OQU1FIH0gfSA9IHRoaXMuR0xPQkFMX0NPTkZJR1xyXG4gICAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlIHx8ICcnLCBwcm9jZXNzLmN3ZCgpLCAnVlVFX0FQUCcpXHJcbiAgICBjb25zdCBzcmNQYXRoID0gZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXHJcbiAgICBjb25zdCB0eXBpbmdzUGF0aCA9IHJlc29sdmUoc3JjUGF0aCwgJ3R5cGluZ3MnKVxyXG5cclxuICAgIGNvbnN0IG91dHB1dCA9IElTX1FJQU5LVU4gPyB7XHJcbiAgICAgIGxpYnJhcnk6IGAke0FQUF9OQU1FfS1bbmFtZV1gLFxyXG4gICAgICBsaWJyYXJ5VGFyZ2V0OiAndW1kJyxcclxuICAgICAganNvbnBGdW5jdGlvbjogYHdlYnBhY2tKc29ucF8ke0FQUF9OQU1FfWAsXHJcbiAgICB9IDoge31cclxuXHJcbiAgICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcclxuICAgICAgYmFzZTogQnVpbGRfUGF0aCxcclxuICAgICAgb3V0cHV0LFxyXG4gICAgICBkZWZpbmU6IHtcclxuICAgICAgICBHTE9CQUxfSU5GTzogdGhpcy5HTE9CQUxfQ09ORklHXHJcbiAgICAgIH0sXHJcbiAgICAgIHRyYW5zcGlsZURlcGVuZGVuY2llczogdHJ1ZSxcclxuICAgICAgaW5saW5lRHluYW1pY0ltcG9ydHM6IHRydWUsXHJcbiAgICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgb3V0RGlyOiBJU19RSUFOS1VOID8gZW52LkFQUF9PVVRQVVRESVIgOiAnZGlzdCcsXHJcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdzdGF0aWMvanMvW25hbWVdLVtoYXNoXS5qcycsXHJcbiAgICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgICAgZ2xvYmFsczoge1xyXG4gICAgICAgICAgICAgIG1vbWVudDogJ21vbWVudCcsXHJcbiAgICAgICAgICAgICAgdXVpZDogJ3V1aWQnLFxyXG4gICAgICAgICAgICAgIGxvZGFzaDogJ2xvZGFzaCcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xyXG4gICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpZC50b1N0cmluZygpLnNwbGl0KCdub2RlX21vZHVsZXMvJylbMV0uc3BsaXQoJy8nKVswXS50b1N0cmluZygpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzZXJ2ZXI6IHtcclxuICAgICAgICBob3N0OiB0cnVlLFxyXG4gICAgICAgIHBvcnQ6IDgwMDMsXHJcbiAgICAgICAgb3JpZ2luOiBJU19QUk9EID8gbnVsbCA6ICdodHRwOi8vbG9jYWxob3N0OjgwMDMnLFxyXG4gICAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgICAnL3Z1ZTMvYXBpJzogeyB0YXJnZXQ6ICdodHRwOi8vMTI3LjAuMC4xOjM2MDAnIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgJ0AnOiByZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMvJyksXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgLy8gY29tbW9uanMoKSwgLy8gb3B0aW9uYWxcclxuICAgICAgICBWdWUoKSxcclxuICAgICAgICB2dWVKc3goKSxcclxuICAgICAgICBub2RlUG9seWZpbGxzKCksXHJcbiAgICAgICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgICBpbXBvcnRzOiBbJ3Z1ZScsIHsgJ0B2dWV1c2UvY29yZSc6IFsndXNlVk1vZGVsJywgJ3VzZUV2ZW50QnVzJ10gfV0sXHJcbiAgICAgICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKHsgaW1wb3J0U3R5bGU6ICdzYXNzJyB9KSwgSWNvbnNSZXNvbHZlcih7IHByZWZpeDogJ0ljb24nIH0pXSxcclxuICAgICAgICAgIGRpcnM6IFtyZXNvbHZlKHNyY1BhdGgsICcuL2NvbXBvc2l0aW9uLWFwaScpLCByZXNvbHZlKHNyY1BhdGgsICcuL2hvb2tzJyldLFxyXG4gICAgICAgICAgZHRzOiByZXNvbHZlKHR5cGluZ3NQYXRoLCAnYXV0by1pbXBvcnRzLmQudHMnKSxcclxuICAgICAgICAgIGVzbGludHJjOiB7IGVuYWJsZWQ6IElTX1BST0QsIGZpbGVwYXRoOiAnLi8uZXNsaW50cmMtYXV0by1pbXBvcnQuanNvbicsIGdsb2JhbHNQcm9wVmFsdWU6IHRydWUgfVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAgICAgcmVzb2x2ZXJzOiBbSWNvbnNSZXNvbHZlcih7IGVuYWJsZWRDb2xsZWN0aW9uczogWydlcCddLCBjdXN0b21Db2xsZWN0aW9uczogWydjdXN0b20nXSB9KSwgRWxlbWVudFBsdXNSZXNvbHZlcih7IGltcG9ydFN0eWxlOiAnc2FzcycgfSldLFxyXG4gICAgICAgICAgZHRzOiByZXNvbHZlKHR5cGluZ3NQYXRoLCAnY29tcG9uZW50cy5kLnRzJylcclxuICAgICAgICB9KSxcclxuICAgICAgICBJY29ucyh7IGF1dG9JbnN0YWxsOiB0cnVlLCBjdXN0b21Db2xsZWN0aW9uczogeyBjdXN0b206IEZpbGVTeXN0ZW1JY29uTG9hZGVyKCdzcmMvYXNzZXRzL2ljb25zJykgfSB9KSxcclxuICAgICAgICBxaWFua3VuKCd2dWUzJywgeyB1c2VEZXZNb2RlOiB0cnVlIH0pLFxyXG4gICAgICAgIHZpc3VhbGl6ZXIoeyBvcGVuOiB0cnVlLCBmaWxlbmFtZTogJ3N0YXRzLmh0bWwnLCBnemlwU2l6ZTogdHJ1ZSwgYnJvdGxpU2l6ZTogdHJ1ZSB9KVxyXG4gICAgICBdLFxyXG4gICAgICB3b3JrZXI6IHsgZm9ybWF0OiAnZXMnIH0sXHJcbiAgICAgIGNzczoge1xyXG4gICAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHsgc2NzczogeyBhZGRpdGlvbmFsRGF0YTogYEB1c2UgXFxcIkBsbS9zaGFyZWQvYXNzZXRzL3N0eWxlcy9pbmRleC5zY3NzXFxcIiBhcyAqO2AgfSB9LFxyXG4gICAgICAgIG1vZHVsZXM6IHsgc2NvcGVCZWhhdmlvdXI6ICdsb2NhbCcsIGdlbmVyYXRlU2NvcGVkTmFtZTogJ1tuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XScsIGhhc2hQcmVmaXg6ICdwcmVmaXgnIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3JrXFxcXGRlbW9cXFxcZnJvbnRcXFxccWlhbmt1blxcXFxwYWNrYWdlc1xcXFx2dWUzLWRlbW9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHdvcmtcXFxcZGVtb1xcXFxmcm9udFxcXFxxaWFua3VuXFxcXHBhY2thZ2VzXFxcXHZ1ZTMtZGVtb1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovd29yay9kZW1vL2Zyb250L3FpYW5rdW4vcGFja2FnZXMvdnVlMy1kZW1vL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHZpdGVCdWlsZGVyTW9kIGZyb20gJy4uLy4uL25wbS9zaGFyZWQvc3JjL2J1aWxkL3ZpdGUvaW5kZXguYnVpbGRlci5qcyc7XHJcbi8vIGltcG9ydCB7IGNyZWF0ZVJlcXVpcmUgfSBmcm9tICdub2RlOm1vZHVsZSdcclxuLy8gY29uc3QgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUoaW1wb3J0Lm1ldGEudXJsKVxyXG4vLyBjb25zb2xlLmxvZygncmVxdWlyZTonLCByZXF1aXJlKVxyXG4vLyBjb25zdCB7IGJ1aWxkQ29uZmlnIH0gPSByZXF1aXJlKCdAbG0vc2hhcmVkJylcclxuLy8gY29uc29sZS5sb2coJ2J1aWxkQ29uZmlnOicsIGJ1aWxkQ29uZmlnKVxyXG4vLyBjb25zdCBWaXRlQnVpbGRlciA9IGJ1aWxkQ29uZmlnLnZpdGVCdWlsZGVyTW9kXHJcblxyXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH0pID0+IG5ldyB2aXRlQnVpbGRlck1vZCgpLmNyZWF0ZUNvbmZpZyh7IG1vZGUgfSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQXNXLFNBQVMsZUFBZSxXQUFXO0FBQ3pZLFNBQVMsZUFBZTtBQUN4QixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsMkJBQTJCO0FBQ3BDLFNBQVMsNEJBQTRCO0FBQ3JDLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sYUFBYTtBQUNwQixTQUFTLGtCQUFrQjtBQUkzQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxjQUFjO0FBbEJnTixJQUFNLDJDQUEyQztBQW1CdFIsSUFBTUEsV0FBVSxjQUFjLHdDQUFlO0FBQzdDLElBQU0sZUFBZUEsU0FBUSxxQkFBcUI7QUFDbEQsSUFBTSxFQUFFLGVBQWUsSUFBSUEsU0FBUSx3QkFBd0I7QUFDM0QsSUFBTSxFQUFFLGFBQWEsSUFBSUEsU0FBUSx3QkFBd0I7QUFDekQsUUFBUSxJQUFJLEtBQUssUUFBUSxJQUFJLFVBQVUsUUFBUSxJQUFJLFNBQVMsMENBQWlCLElBQUksYUFBYSxFQUFFLFVBQVUsZUFBZSxHQUFHLGFBQWEsQ0FBQztBQUMxSSxJQUFxQixjQUFyQixNQUFpQztBQUFBLEVBQy9CLFlBQVksVUFBVSxDQUFDLEdBQUc7QUFDeEIsWUFBUSxJQUFJLHVCQUF1QixRQUFRLElBQUksT0FBTztBQUN0RCxTQUFLLFVBQVU7QUFDZixTQUFLLGtCQUFrQixJQUFJLGFBQWE7QUFDeEMsU0FBSyxnQkFBZ0I7QUFBQSxNQUNuQixZQUFZLGFBQWEsUUFBUSxJQUFJLE9BQU87QUFBQSxNQUM1QyxVQUFVLGVBQWU7QUFBQSxNQUN6QixTQUFTLFFBQVEsSUFBSSxXQUFXO0FBQUEsTUFDaEMsUUFBUSxRQUFRLElBQUks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
