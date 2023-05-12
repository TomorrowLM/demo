setTimeout(function () {
  //文件会等5秒后加载，实现懒加载
  // webpackChunkName: "math"：这是webpack动态导入模块命名的方式
  const add = () => import(
    /* webpackChunkName: "dynamicImport" */
    './dynamicImport.js')
  console.log(add(1, 2));
}, 5000)
