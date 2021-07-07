module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    quotes: [
      "warn",
      "double", // 改成字符串必须由单引号括起来而不是双引号，'string'不报错，"string"报错
    ],
    "no-empty": 2,
    "id-length": 2,
    // "no-console": 1,
    "semi": 2, //语句强制分号结尾
  },
};
