module.exports = {
  'env': {
    'browser': true,
    'es6': true
  },
  'parser': 'babel-eslint',
  'extends': 'airbnb-base',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'rules': {
    'arrow-parens': [2,
      "as-needed"
    ],
    'no-shadow': 0,
    'semi': ['error', 'never'],
    'global-require': 0,
    'no-param-reassign': 0,
    'class-methods-use-this': 0,
    'max-len': [0, {
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true,
      'ignoreRegExpLiterals': true,
    }],
    'new-cap': 0,
    'no-return-assign': 0,
    'consistent-return': 0,
    'no-empty-pattern': 0,
    'no-restricted-globals': 0,
    'no-await-in-loop': 0,
    'no-restricted-syntax': 0,
    'no-whitespace-before-property': 0,
    'no-unused-expressions': 0,
    'dot-notation': 0,
  },
  'noInlineConfig': true,
}
