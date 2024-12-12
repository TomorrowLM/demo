module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    ''
  ],
  plugins: ['vue'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    // "max-lines": ["warn", 80],
    // 'no-console': process.env.NODE_ENV === 'development' ? 'off' : 'off',
    // 'no-debugger': process.env.NODE_ENV === 'development' ? 'off' : 'off',
    // "no-unused-const": "off",
    // 'no-unused-vars': 'off',

    'no-alert': 2,
    "quotes": [1, "single"],
    // "vue/multi-word-component-names": [
    //   "error",
    //   {
    //     "ignores": ["index"]
    //   }
    // ]
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

