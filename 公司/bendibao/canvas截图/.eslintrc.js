module.exports = {
    root: true,
    "env": {
        "browser": true,
        "es2021": true,
        "commonjs": true,
    },
    "extends": "eslint:recommended",
    "plugins": ["babel"],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": { 
        "semi": 2,    //语句强制分号结尾
        "no-console": 1,
        "quotes": ["error", "double"],
    }
};
