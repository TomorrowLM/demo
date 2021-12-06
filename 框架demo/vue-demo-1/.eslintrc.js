module.exports = {
    root: true,
    env: {
      es6: true,
      node: true
    },
    "parserOptions": {
      "parser": "babel-eslint"
    },
    'extends': [
      'plugin:vue/essential',
      'eslint:recommended'
    ],
    plugins: ['vue'],
    parserOptions: {
      parser: 'babel-eslint'
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'development' ? 'warn' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'development' ? 'warn' : 'warn',
      "no-unused-const": "off"
    },
    globals: {
      $_clone: 'readonly',
      $_moment: 'readonly'
    },

  }
  