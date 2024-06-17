module.exports = {
  'root': true,
  'env': {
    'node': true
  },
  globals: {
    $_: 'readonly',
    moment: 'readonly',
    pageSize: 'readonly',
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  'parserOptions': {
    'ecmaVersion': 2020
  },
  'rules': {
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["index", '404'], //需要忽略的组件名
      },
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  }
};
