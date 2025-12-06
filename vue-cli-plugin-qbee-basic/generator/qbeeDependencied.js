module.exports = {
  dependencies: {
    //
    lodash: "^4.17.15",
    axios: "^0.19.2",
    dayjs: "^1.9.8",
    //
    "vue-i18n": "^8.18.1",
    //
    "@qbee/business-component": "^1.0.15",
    "@qbee/fe-qbee-icon": "^0.0.2",
    "@qbee/fe-vue-contacts": "^0.0.6",
    "@qbee/theme-adapt": "^1.0.0",
    "qt-element-ui": "^1.2.57",
    "@qbee/fe-eb-components": "^0.0.47",
    "@qbee/qbee-common-lib": "^0.0.44",
    "web-security": "^1.2.9",
    loglevel: "^1.8.0",
    //
    qs: "^6.9.4",
    "fe-qbee-bo": "^0.0.2",
    "single-spa-vue": "^1.8.2",
  },
  devDependencies: {
    "@vue/eslint-config-prettier": "^6.0.0",
    "eslint-plugin-prettier": "^3.3.0",
    prettier: "^2.2.1",
    "babel-plugin-component": "^1.1.1",
    "sass-loader": "^8.0.2",
    "lint-staged": "^10.2.11",
    "node-sass": "^4.14.1",
    cors: "^2.8.5",
  },
  scripts: {
    start: "vue-cli-service serve",
    "start:dev": "vue-cli-service serve --mode dev",
    "start:qa": "vue-cli-service serve --mode qa",
    "start:pet": "vue-cli-service serve --mode pet",
    upgradeQbeeLib: "vue-cli-service upgradeQbeeLib",
  },
  gitHooks: {
    "pre-commit": "lint-staged",
  },
  "lint-staged": {
    "*.{js,jsx,vue,ts,tsx}": ["vue-cli-service lint", "git add"],
  },
};
