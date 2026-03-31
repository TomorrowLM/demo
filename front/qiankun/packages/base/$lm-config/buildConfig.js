/**
 * 自动生成的构建配置快照，请勿手动修改。
 * 生成时间: 2026-03-31T02:15:42.842Z
 * 项目名称: base-react-app
 * 项目版本: 0.1.0
 */

module.exports = {
  "mode": "development",
  "devtool": "eval-cheap-module-source-map",
  "entry": {
    "app": "D:\\work\\demo\\front\\qiankun\\packages\\base\\src\\main.tsx"
  },
  "output": {
    "path": "D:\\work\\demo\\front\\qiankun\\packages\\dist\\qiankun",
    "publicPath": "/qiankun/",
    "filename": "js/[name].[hash].js",
    "chunkFilename": "js/[name].[hash].js"
  },
  "performance": {
    "hints": "warning",
    "maxAssetSize": 100000000,
    "maxEntrypointSize": 100000000
  },
  "devServer": {
    "historyApiFallback": true,
    "open": true,
    "port": "[undefined]",
    "static": "./public",
    "headers": {
      "Access-Control-Allow-Origin": "*"
    },
    "proxy": [
      {
        "context": [
          "/vue2-mobile/api",
          "/vue2-pc/api",
          "/vue3/api",
          "/react-app/api"
        ],
        "target": "http://0.0.0.0:3600/",
        "changeOrigin": true,
        "secure": false,
        "xfwd": false,
        "pathRewrite": {
          "/vue2-pc/api": "/",
          "/vue2-mobile/api": "/",
          "/vue3/api": "/",
          "/react-app/api": "/"
        }
      }
    ]
  },
  "resolve": {
    "extensions": [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".json"
    ],
    "alias": {
      "@": "D:\\work\\demo\\front\\qiankun\\packages\\base\\src"
    }
  },
  "optimization": {
    "splitChunks": {
      "chunks": "all",
      "maxInitialRequests": null,
      "minSize": 20000,
      "maxSize": 300000,
      "cacheGroups": {
        "vendors": {
          "test": "/[\\\\/]node_modules[\\\\/]/",
          "chunks": "all",
          "name": "vendors",
          "priority": 10,
          "enforce": true
        }
      }
    }
  },
  "plugins": [
    {
      "__type": "DefinePlugin",
      "definitions": {
        "GLOBAL_INFO": "{\"APP_BASE_API\":\"http://0.0.0.0:3600/\",\"PORT\":3500,\"IS_PROD\":true,\"IS_QIANKUN\":false,\"APP_ENV\":\"production\",\"APP_OUTPUTDIR\":\"../dist/qiankun\",\"APP_ROUTER_BASE\":\"/qiankun\",\"Build_Path\":\"/qiankun/\",\"APP_NAME\":\"base-react-app\",\"APP_VERSION\":\"0.1.0\",\"APP_PATH\":\"D:\\\\work\\\\demo\\\\front\\\\qiankun\\\\packages\\\\base\"}"
      }
    },
    {
      "__type": "HtmlWebpackPlugin",
      "userOptions": {
        "template": "D:\\work\\demo\\front\\qiankun\\packages\\base\\public\\index.html",
        "filename": "index.html",
        "title": "react app",
        "minify": {
          "removeComments": true,
          "collapseWhitespace": true,
          "removeAttributeQuotes": true
        }
      },
      "version": 5,
      "options": {
        "template": "D:\\work\\demo\\front\\qiankun\\packages\\base\\public\\index.html",
        "templateContent": false,
        "templateParameters": "[Function templateParametersGenerator]",
        "filename": "index.html",
        "publicPath": "auto",
        "hash": false,
        "inject": "head",
        "scriptLoading": "defer",
        "compile": true,
        "favicon": false,
        "minify": "[Circular]",
        "cache": true,
        "showErrors": true,
        "chunks": "all",
        "excludeChunks": [],
        "chunksSortMode": "auto",
        "meta": {},
        "base": false,
        "title": "react app",
        "xhtml": false
      }
    },
    {
      "__type": "MiniCssExtractPlugin",
      "_sortedModulesCache": {
        "__type": "WeakMap"
      },
      "options": {
        "ignoreOrder": true,
        "experimentalUseImportModule": "[undefined]",
        "runtime": true,
        "filename": "css/[name].[hash].css",
        "chunkFilename": "css/[name].[hash].css"
      },
      "runtimeOptions": {
        "insert": "[undefined]",
        "linkType": "text/css",
        "attributes": "[undefined]"
      }
    },
    {
      "__type": "BundleAnalyzerPlugin",
      "opts": {
        "analyzerMode": "static",
        "analyzerHost": "127.0.0.1",
        "reportFilename": "D:\\work\\demo\\front\\qiankun\\packages\\base\\$lm-config\\bundle-report.html",
        "reportTitle": "[Function anonymous]",
        "defaultSizes": "parsed",
        "openAnalyzer": false,
        "generateStatsFile": false,
        "statsFilename": "stats.json",
        "statsOptions": null,
        "excludeAssets": null,
        "logLevel": "info",
        "startAnalyzer": true,
        "analyzerUrl": "[Function anonymous]",
        "analyzerPort": 8888
      },
      "server": null,
      "logger": {
        "__type": "Logger",
        "activeLevels": {
          "__type": "Set"
        }
      }
    }
  ],
  "module": {
    "rules": [
      {
        "test": "/\\.css$/",
        "use": [
          "D:\\work\\demo\\front\\qiankun\\node_modules\\.pnpm\\mini-css-extract-plugin@2.10.0_webpack@5.105.3\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
          "css-loader"
        ]
      },
      {
        "test": "/\\.s[ac]ss$/",
        "exclude": "/\\.module\\.s[ac]ss$/",
        "use": [
          "D:\\work\\demo\\front\\qiankun\\node_modules\\.pnpm\\mini-css-extract-plugin@2.10.0_webpack@5.105.3\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": true
            }
          },
          {
            "loader": "sass-loader",
            "options": {
              "additionalData": "@use \"@lm/shared/assets/styles/scss/index.scss\" as *;",
              "sassOptions": {
                "api": "modern"
              }
            }
          }
        ]
      },
      {
        "test": "/\\.module\\.s[ac]ss$/",
        "use": [
          "D:\\work\\demo\\front\\qiankun\\node_modules\\.pnpm\\mini-css-extract-plugin@2.10.0_webpack@5.105.3\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": true,
              "modules": {
                "localIdentName": "[local]___[hash:base64:5]"
              }
            }
          },
          {
            "loader": "sass-loader",
            "options": {
              "additionalData": "@use \"@lm/shared/assets/styles/scss/index.scss\" as *;",
              "sassOptions": {
                "api": "modern"
              }
            }
          }
        ]
      },
      {
        "test": "/\\.less$/",
        "exclude": "/\\.module\\.less$/",
        "use": [
          "D:\\work\\demo\\front\\qiankun\\node_modules\\.pnpm\\mini-css-extract-plugin@2.10.0_webpack@5.105.3\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": true
            }
          },
          {
            "loader": "less-loader",
            "options": {
              "lessOptions": {
                "javascriptEnabled": true
              }
            }
          }
        ]
      },
      {
        "test": "/\\.module\\.less$/",
        "use": [
          "D:\\work\\demo\\front\\qiankun\\node_modules\\.pnpm\\mini-css-extract-plugin@2.10.0_webpack@5.105.3\\node_modules\\mini-css-extract-plugin\\dist\\loader.js",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": true,
              "modules": {
                "localIdentName": "[local]___[hash:base64:5]"
              }
            }
          },
          {
            "loader": "less-loader",
            "options": {
              "lessOptions": {
                "javascriptEnabled": true
              }
            }
          }
        ]
      },
      {
        "test": "/\\.(jsx|js|ts|tsx)$/",
        "exclude": "/node_modules/",
        "loader": "babel-loader",
        "options": {
          "cacheDirectory": true,
          "cacheCompression": false,
          "presets": [
            "@babel/preset-env",
            [
              "@babel/preset-react",
              {
                "runtime": "automatic"
              }
            ],
            "@babel/preset-typescript"
          ]
        }
      }
    ]
  }
};
