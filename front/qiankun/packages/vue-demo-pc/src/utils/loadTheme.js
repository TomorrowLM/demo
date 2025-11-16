import Vue from 'vue'


const DEFAULT_THEME = 'theme_0' // 默认主题

let themeOptions = {
  "theme_0": './styles/themes/light.scss',
  "theme_1": './theme1.scss'
}


export const theme = {
  currentTheme: DEFAULT_THEME,// 当前主题
  themeOption: themeOptions,//当前主题可选项
}


/*------------------------------------
*            设置主题
对外提供一个setup方法，用来修改我们的主题；
由于需要兼容多主题样式，所以这里在body上加入了相应的类名，方便我们做样式定制
------------------------------------*/
export const themeSetup = themeName => {

  // if (!themeName) {
  //   return
  // }

  // themeName = themeName.replace(/\s+/g, "");//去除所有空格
  // // 如果已经添加过这个样式，就不再重复添加
  // if (document.body.classList) {
  //   if (Array.from(document.body.classList).includes('theme-' + themeName)) {
  //     console.log("你已使用该主题")
  //     return
  //   }
  // }

  // // 如果设置没有在可选主题里，则不可修改主题
  // if (!themeOptions[themeName]) {
  //   console.log("没有在可选主题里，不可修改主题")
  //   return
  // }

  // // 如果有主题dom,移除
  // let themeDom = document.querySelectorAll("style[theme]");
  // if (themeDom) {
  //   for (let i = 0; i < themeDom.length; i++) {
  //     document.head.removeChild(themeDom[i])
  //   }
  // }
  console.log(themeName);
  // 给body创建一个主题标记
  Object.keys(themeOptions).forEach(themeName => {
    document.body.classList.remove(`theme-${themeName}`)
  })
  document.body.classList.add(`theme-${themeName}`)
  document.body.setAttribute('theme', themeName)

  theme.currentTheme = themeName;

  require(`${themeOptions[themeName]}`);//引入
  document.head.lastChild.setAttribute('theme', themeName);//给新添加的style设置theme属性
  console.log("修改主题成功")
}

//把切换主题绑定到window上，方便在vue组件以外的文件使用语言包
window.theme = theme
window.themeSetup = themeSetup

