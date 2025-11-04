const { description, dependencies, devDependencies } = require('./vue2')
module.exports = {
  description: 'Vue.js - 渐进式 JavaScript 框架',
  dependencies: {
    core: [
      ...dependencies.core,
      { name: "vue-class-component", version: "^7.2.3" },
      { name: "vue-property-decorator", version: "^9.1.2" }
    ],
    router: [...dependencies.router],
    state: [...dependencies.state],
    ui: [...dependencies.ui],
    utils: [...dependencies.utils]
  },
  devDependencies: {
    build: [...devDependencies.build],
    types: [...devDependencies.types],
    plugins: [...devDependencies.plugins]
  }
}