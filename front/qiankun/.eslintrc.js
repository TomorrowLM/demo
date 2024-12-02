//因为单应用会访问外部shared文件，所有最外层使用eslint去检测
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
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
    'no-console': process.env.NODE_ENV === 'development' ? 'off' : 'off',
    'no-debugger': process.env.NODE_ENV === 'development' ? 'off' : 'off',
    "no-unused-const": "off",
    'no-unused-vars': 'off',
    "vue/multi-word-component-names": [
      "error",
      {
        "ignores": ["index"]
      }
    ]
  },
  globals: {
    $_clone: 'readonly',
    $_moment: 'readonly'
  },
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
}

