module.exports = {
  description: 'Vue.js - 渐进式 JavaScript 框架',
  dependencies: {
    core: [{ name: 'vue', version: '^2.6.14' }],
    router: [{ name: 'vue-router', version: '^3.5.1' }],
    state: [{ name: 'vuex', version: '^3.6.2' }],
    ui: [{ name: 'element-ui', version: '^2.15.12' }],
    utils: [{ name: 'axios', version: '^0.27.2' }, { name: 'dayjs', version: '^1.11.0' }]
  },
  devDependencies: {
    build: [
      { name: '@vue/cli-service', version: '~5.0.0' },
      { name: 'vue-template-compiler', version: '^2.6.14' }
    ],
    types: [{ name: '@types/node', version: '^17.0.0' }],
    plugins: [{ name: 'cross-env', version: '^7.0.3' }]
  }
}