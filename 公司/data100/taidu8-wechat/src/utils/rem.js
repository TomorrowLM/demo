// 设置 rem 函数
function setRem () {
  // 750 默认大小37.5px; 750px = 20rem ;每个元素px基础上/37.5px
  let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
  // 得到html的Dom元素
  let htmlDom = document.getElementsByTagName('html')[0];
  // 设置根元素字体大小
  htmlDom.style.fontSize = (htmlWidth / 20) > 25 ? '25px' : htmlWidth / 20 + 'px';
}

// 初始化
setRem();

// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem()
}
