const { StatsWriterPlugin } = require("webpack-stats-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin");
const nodemon = require("nodemon");
const get = require("lodash.get");
const path = require("path");
const fs = require("fs");
const { getExternalModules } = require("./util");
const { appExternalPreset, libExternalPreset } = require("./externalPreset");
const { execSync } = require("child_process");

let paths = null;

module.exports = (api, projectOptions) => {
    const prod = process.env.NODE_ENV === "production";
    if (!process.env.NO_TAR_PACKAGE) {
        try {
            paths = require(path.join(process.cwd(), "config/paths"));
            qbeeVueConfigModify(projectOptions, prod);
        } catch (error) {
            //
        }
        // 注册mock指令
        qbeeMockConfig(api);
        api.configureWebpack((config) => {
            const buildTarget = process.env.VUE_CLI_BUILD_TARGET || "app";
            if (buildTarget === "app") {
                // 修改webpack配置
                qbeeWebpackConfig(config, projectOptions);
            }
        });

        if (!get(projectOptions, "pluginOptions.qbee.isBaseApp")) {
            // 非基座项目才添加external
            modifyExternalConfig(api, projectOptions);
        }
        registerDevImport(api); // TODO: 旧项目迁移生成dev-import完成后，可删除该命令
        registerUpgradeQbeeLib(api);
    }
};
// -------注册mock指令-------
function qbeeMockConfig(api) {
    api.registerCommand(
        "qbeemock", {
            description: "starting mock service",
            usage: "vue-cli-service qbeemock",
        },
        () => {
            nodemon({
                script: path.join(process.cwd(), "src/mock/mockServer.js"),
                ext: "js",
            });

            nodemon
                .on("start", function() {
                    console.log("mockServer has started");
                })
                .on("quit", function() {
                    console.log("mockServer has quit");
                    process.exit();
                })
                .on("restart", function(files) {
                    console.log("mockServer restarted due to: ", files);
                });
            console.log(`👋  mock has start`);
        }
    );
    // 对serve命令进行修改，自动启动
    const { serve, qbeemock } = api.service.commands;
    const serveFn = serve.fn;
    serve.fn = (...args) => {
        const model = (args[0] || {}).mode;
        if (!model) {
            qbeemock.fn();
        }
        return serveFn(...args);
    };
}

function mergeOptions(projectOptions, defaultOptions) {
    const type = Object.prototype.toString.call(projectOptions);
    const isObject = type === "[object Object]";
    const isUndefined = typeof projectOptions === "undefined";
    const isNull = type === "[object Null]";
    const isArray = type === "[object Array]";
    const isEmpty =
        isUndefined ||
        isNull ||
        (isObject && Object.keys(projectOptions).length === 0) ||
        (isArray && projectOptions.length === 0);
    if (isEmpty) {
        if (typeof defaultOptions !== "undefined") {
            return defaultOptions;
        }
    } else if (isObject) {
        const defaultIsObject =
            Object.prototype.toString.call(defaultOptions) === "[object Object]";
        if (defaultOptions && defaultIsObject) {
            const keys = Object.keys(projectOptions);
            keys.forEach((key) => {
                let options = projectOptions[key] || {};
                options = mergeOptions(options, defaultOptions[key]);
                projectOptions[key] = options;
            });
            const merge = {
                ...defaultOptions,
                ...projectOptions,
            };
            return merge;
        }
    }
    return projectOptions;
}
// -------修改vue-config配置-------
function qbeeVueConfigModify(projectOptions, prod) {
    // 基本路径 部署在一个域名的根路径上
    if (projectOptions.publicPath === "/") {
        projectOptions.publicPath = paths.publicUrl;
    }
    // 输出文件目录
    if (projectOptions.outputDir === "dist") {
        projectOptions.outputDir = paths.buildPath;
    }
    const defalutCss = {
        requireModuleExtension: true,
        loaderOptions: {
            css: {
                modules: {
                    hashPrefix: paths.mfName,
                },
            },
            scss: {
                prependData: `@import "@/AppVar.scss";@import "@/AppCommon.scss";`,
            },
        },
    };
    let cssOptions = projectOptions.css || {};
    cssOptions = mergeOptions(cssOptions, defalutCss);
    projectOptions.css = cssOptions;

    if (prod) {
        projectOptions.productionSourceMap = false; // 生产环境强制关闭sourcemap
    } else {
        projectOptions.productionSourceMap = true;
    }
}
// -------修改webpack配置-------
function qbeeWebpackConfig(config, projectOptions) {
    const injectDependence = get(
        projectOptions,
        "pluginOptions.qbee.injectDependence",
        false
    );
    if (process.env.NODE_ENV === "production") {
        configMicrosoftFront(config);
        config.devtool = "none";
        configManifest(config);
        if (injectDependence) {
            configDependenceShareLoadingPlugin(config);
        }
        configBuildPath(config);
    } else {
        enhanceSourcemap(config, projectOptions);
    }
}

// 配置微前端
function configMicrosoftFront(config) {
    config.output.library = paths.mfName;
    config.output.libraryTarget = "window";
}

function enhanceSourcemap(config, projectOptions) {
    if (get(projectOptions, "pluginOptions.qbee.enhanceSourcemap")) {
        config.devtool = "eval-source-map";
        config.output.devtoolModuleFilenameTemplate = function(info) {
            let filename = `sources:///${info.resourcePath}`;
            if (
                info.resourcePath.match(/\.vue$/) &&
                !info.query.match(/type=script/)
            ) {
                filename = `webpack-generated:///${info.resourcePath}?${info.hash}`;
            }
            return filename;
        };
        config.output.devtoolFallbackModuleFilenameTemplate =
            "webpack:///[resource-path]?[hash]";
    }
}

// 添加manifest配置
function configManifest(config) {
    config.plugins.push(
        new StatsWriterPlugin({
            filename: "manifest.json",
            fields: ["entrypoints", "publicPath"],
        })
    );
}

// 配置加载共享依赖plugin
function configDependenceShareLoadingPlugin(config) {
    const HtmlWebpackInjectScriptPlugin = require("html-webpack-inject-script-plugin");
    const content = fs.readFileSync(
        path.resolve(
            "node_modules/vue-cli-plugin-qbee-basic/dependence-share/index.js"
        ), { encoding: "utf-8" }
    );
    var UglifyJS = require("uglify-es");
    var result = UglifyJS.minify(content);
    fs.writeFileSync(
        path.resolve(
            "node_modules/vue-cli-plugin-qbee-basic/dependence-share/index-min.js"
        ),
        result.code
    );
    config.plugins.push(
        new HtmlWebpackInjectScriptPlugin({
            filename: "node_modules/vue-cli-plugin-qbee-basic/dependence-share/index-min.js",
            inline: true,
        })
    );
}

// 添加build结果打包配置
function configBuildPath(config) {
    const BUILD_PARENT_PATH = path.resolve(paths.appBuild, "..");
    const BUILD_DIR_NAME = path.basename(paths.appBuild);
    const NAME = `${paths.name}${
    process.env.npm_package_privateVersion
      ? "-" + process.env.npm_package_privateVersion
      : ""
  }-${process.env.npm_package_version}`;
    const CREATE_ARCHIVE = `cd ${BUILD_PARENT_PATH} && tar -czf ${NAME}.tar.gz ${BUILD_DIR_NAME}`;
    config.plugins.push(
        new WebpackShellPlugin({
            onBuildExit: [CREATE_ARCHIVE],
            safe: true,
        })
    );
}

// 修改Externals配置
function modifyExternalConfig(api, projectOptions) {
    api.chainWebpack((webpackConfig) => {
        const buildTarget = process.env.VUE_CLI_BUILD_TARGET || "app";
        const shareLibs = get(projectOptions, "pluginOptions.qbee.shareLibs", true);
        console.log("[vue-cli-plugin-qbee-basic] shareLibs", shareLibs);
        if (process.env.NODE_ENV === "production" && shareLibs) {
            let externalModuleNames = appExternalPreset;
            if (buildTarget === "lib") {
                externalModuleNames = libExternalPreset;
            }
            webpackConfig.merge({
                externals: [
                    getExternalModules(
                        externalModuleNames,
                        buildTarget,
                        paths ? paths.mfName : ""
                    ),
                ],
            });
        } else {
            if (buildTarget === "app") {
                webpackConfig.entry("app").prepend("./src/dev-import.ts").end();
            }
        }
    });
}

function registerDevImport(api) {
    api.registerCommand(
        "devimport", {
            description: "generate dev-import file",
            usage: "vue-cli-service devimport",
        },
        () => {
            const devImportFile = api.resolve("./src/dev-import.ts");
            const templateFile = path.resolve(
                __dirname,
                "./generator/template/src/dev-import.ts"
            );
            const content = fs.readFileSync(templateFile, { encoding: "utf-8" });
            fs.writeFileSync(devImportFile, content, { encoding: "utf-8" });
        }
    );
}

function registerUpgradeQbeeLib(api) {
    api.registerCommand(
        "upgradeQbeeLib", {
            description: "upgrade qbee lib",
            usage: "vue-cli-service upgradeQbeeLib",
        },
        () => {
            removeOldLib();
            const qbeeLibs = appExternalPreset.filter((moduleName) =>
                moduleName.startsWith("@qbee/")
            );
            const upgradeCommand = `yarn add ${qbeeLibs.join(" ")}`;
            console.log(`exec ${upgradeCommand}`);
            execSync(upgradeCommand);
            console.log("upgrade complete!");
        }
    );
}

// TODO: 移除旧版本的库，迁移完成后可删除
function removeOldLib() {
    const oldLibs = [
        "qbee-common-lib",
        "fe-qbee-icon",
        "fe-vue-contacts",
        "fe-eb-components",
        "@qbee/theme-adapt",
        "@qbee/business-component",
    ];
    oldLibs.forEach((lib) => {
        try {
            const command = `yarn remove ${lib}`;
            execSync(command);
        } catch (e) {
            //
        }
    });
    console.log("remove old version lib complete!");
}