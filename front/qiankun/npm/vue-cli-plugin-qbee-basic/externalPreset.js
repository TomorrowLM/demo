const appExternalPreset = [
    // vue全家桶
    "vue",
    "vue-router",
    "pinia",
    "vue-i18n",
    "vuex",
    // 工具库
    "lodash",
    "axios",
    "dayjs",
    // 业务组件
    "@qbee/qbee-common-lib",
    "@qbee/business-component",
    "@qbee/fe-qbee-icon",
    "@qbee/fe-vue-contacts",
    "@qbee/theme-adapt",
    // UI组件
    "qt-element-ui",
    "@qbee/fe-eb-components",
];

const libExternalPreset = appExternalPreset.concat([
    "tslib",
    "vue-class-component",
    "vue-property-decorator",
]);

module.exports = {
    appExternalPreset,
    libExternalPreset,
};