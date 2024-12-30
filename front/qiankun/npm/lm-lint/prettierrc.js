module.exports = {
  "printWidth": 120,
  "tabWidth": 4,
  "singleQuote": true,
  "useTabs": false,
  // "semi": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "endOfLine": "auto",
  "arrowParens": "avoid",
  "overrides": [
    {
      "files": ".prettierrc",
      "options": { "parser": "json", "trailingComma": "none" }
    },
    {
      "files": "*.json",
      "options": { "tabWidth": 2, "trailingComma": "none" }
    }
  ]
}