/* 
git commit rules：
ex: fix: some question
*/
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [0],
    'header-case': [0],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'typo',
        'chore',
        'build',
        'conf'
      ]
    ]
  }
}
