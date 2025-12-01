const esLint = {
  js: require('./esLint/javascript'),
  ts: require('./esLint/typescript'),
  react: require('./esLint/react'),
  vue: require('./esLint/vue'),
  vue3: require('./esLint/vue3')
}

module.exports = {
  esLint
}
