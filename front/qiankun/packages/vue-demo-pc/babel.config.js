module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // style必须使用css
    ['import'] // `style: true` 会加载 less 文件
  ],
  plugins: [['lodash']],
}
