module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "commonjs": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "html"
    ],
    "rules": {
        "quotes": [1, "double"],
        // 在语句末尾使用分号
        "semi": [1, "always"]
    }
};
