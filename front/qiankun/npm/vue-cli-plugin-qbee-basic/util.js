const upperFirst = require("lodash.upperfirst");
const camelCase = require("lodash.camelcase");

const GLOBAL_SHARED_NAMESPACE = "__qbee_shared_modules";

function getModuleExposeName(moduleName) {
    return upperFirst(camelCase(moduleName));
}

function generateExposeGlobalModules(modules) {
    const temp = [];
    modules.forEach((module) => {
        const exposeName = getModuleExposeName(module.moduleName);
        const item = {};
        item.test = module.ruleTest;
        item.use = [{
            loader: "expose-loader",
            options: { exposes: [`${GLOBAL_SHARED_NAMESPACE}.${exposeName}`] },
        }, ];
        temp.push(item);
    });
    return temp;
}

function exposeGlobalModules(chainConfig, modules) {
    modules.forEach((module) => {
        const exposeName = getModuleExposeName(module.moduleName);
        chainConfig.module
            .rule(`expose-${exposeName}`)
            .test(module.ruleTest)
            .use("expose-loader")
            .loader("expose-loader")
            .options({
                exposes: [`${GLOBAL_SHARED_NAMESPACE}.${exposeName}`],
            })
            .end();
    });
}

function getExternalModules(modules, buildTarget, appName) {
    const externals = {};
    modules.forEach((moduleName) => {
        let rootExternal = [
            GLOBAL_SHARED_NAMESPACE,
            getModuleExposeName(moduleName),
        ];
        if (buildTarget === "app" && appName && moduleName === "vue") {
            // 子应用的vue使用各自独立的实例（Vue4SubApp在基座项目的src/shared/proxyVueInstance.ts中注册）
            rootExternal = [GLOBAL_SHARED_NAMESPACE, "Vue4SubApp", appName];
        }
        if (buildTarget === "lib") {
            externals[moduleName] = {
                commonjs: moduleName,
                commonjs2: moduleName,
                amd: moduleName,
                root: rootExternal,
            };
        } else {
            externals[moduleName] = rootExternal;
        }
    });
    return externals;
}

module.exports = {
    exposeGlobalModules,
    getExternalModules,
    generateExposeGlobalModules,
};