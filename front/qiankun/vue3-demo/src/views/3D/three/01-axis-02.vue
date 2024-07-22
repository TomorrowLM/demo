<template>
  <div class="main-content">
    <div id="statsId" class="stats-content"></div>
    <div id="webgl"></div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
//引入性能监视器stats.js
import Stats from 'three/addons/libs/stats.module.js'
// 引入dat.gui.js的一个类GUI
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted } from 'vue'
console.log('THREE.Scene', THREE.Scene)

// 创建3D场景对象Scene
const scene = new THREE.Scene()

//创建一个长方体几何对象Geometry（长方体）
const geometry = new THREE.BoxGeometry(20, 20, 20)

//创建一个材质对象Material(网格基础材质)
const material = new THREE.MeshBasicMaterial({
  //0xff0000设置材质颜色为红色
  color: 0xff0000,
  //材质是否透明,true表示透明,反之不透明
  transparent: true,
  //材质的透明度,默认为1,不透明
  opacity: 0.5
})
// 创建一个网格模型对象Mesh，将几何体和材质添加到其中
// 两个参数分别为几何体geometry、材质material
const mesh = new THREE.Mesh(geometry, material)

//设置网格模型在三维空间中的位置坐标，默认是坐标原点
mesh.position.set(0, 30, 0)
scene.add(mesh)

// AxesHelper：辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(150)
scene.add(axesHelper)

// 添加一个辅助网格地面
const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444)
scene.add(gridHelper)

// 更改背景色
// scene.background = new THREE.Color(0x666666);

// 添加一个环境光对象
const ambient = new THREE.AmbientLight(0x444444)
scene.add(ambient)

// 添加雾化效果
// 雾的颜色、雾化开始的距离相机的距离、雾化结束距离相机的距离
scene.fog = new THREE.Fog(0xaaf7dc6f, 0.015, 1000)

// 实例化一个透视投影相机对象
// 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000)
//相机在Three.js三维坐标系中的位置
// 根据需要设置相机位置具体值
camera.position.set(200, 200, 200)

//相机观察目标指向Threejs 3D空间中某个位置
//指向mesh对应的位置
camera.lookAt(mesh.position)

// 定义相机输出画布的尺寸(单位:像素px)
const width = 900 //宽度
const height = 700 //高度

// 创建渲染器对象
const renderer = new THREE.WebGLRenderer()
//设置three.js渲染区域的尺寸(像素px)
renderer.setSize(width, height)
//执行渲染操作
renderer.render(scene, camera)

// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器的中心点
controls.target.set(0, 20, 0)
// 设置控制器是否可旋转
controls.enableRotate = true
// 设置控制器是否可缩放
controls.enableZoom = true
// 设置控制器自动旋转
controls.autoRotate = true
// 增加阻尼
controls.enableDamping = true
// 设置阻尼系数
controls.dampingFactor = 0.01

// 旋转
// function animate() {
//   requestAnimationFrame(animate)
//   controls.update()
//   renderer.render(scene, camera)
// }
// animate()

const stats = new Stats()
// 渲染帧率  刷新频率,一秒渲染次数
stats.setMode(0) // 默认模式FPS
// 渲染周期 渲染一帧多长时间
// stats.setMode(1);

// requestAnimationFrame实现周期性循环执行
// requestAnimationFrame默认每秒钟执行60次，但不一定能做到，要看代码的性能
// 渲染循环
const clock = new THREE.Clock()
function render() {
  stats.update()
  controls.update()
  const spt = clock.getDelta() * 1000 //毫秒
  // console.log('两帧渲染时间间隔(毫秒)',spt);
  // console.log('帧率FPS',1000/spt);
  renderer.render(scene, camera) //执行渲染操作
  mesh.rotateY(0.01) //每次绕y轴旋转0.01弧度
  requestAnimationFrame(render) //请求再次执行渲染函数render，渲染下一帧
}
render()
// 随机创建大量的模型,测试渲染性能
// const num = 1000; //控制长方体模型数量
// for (let i = 0; i < num; i++) {
//     const geometry = new THREE.BoxGeometry(5, 5, 5);
//     const material = new THREE.MeshLambertMaterial({
//         color: 0x00ffff
//     });
//     const mesh = new THREE.Mesh(geometry, material);
//     // 随机生成长方体xyz坐标
//     const x = (Math.random() - 0.5) * 200
//     const y = (Math.random() - 0.5) * 200
//     const z = (Math.random() - 0.5) * 200
//     mesh.position.set(x, y, z)
//     scene.add(mesh); // 模型对象插入场景中
// }

// renderer.render(scene, camera); //执行渲染操作

// // 实例化一个gui对象
// const gui = new GUI();
// //改变交互界面style属性
// gui.domElement.style.right = '0px';
// gui.domElement.style.width = '300px';

// const obj = {
//     a: 30,
//     b: 60,
//     c: 300,
// };
// // gui界面上增加交互界面，改变obj对应属性
// gui.add(obj, 'a', 0, 100);
// gui.add(obj, 'b', 0, 50);
// gui.add(obj, 'c', 0, 60);

// // 光照强度属性.intensity
// // console.log('ambient.intensity',ambient.intensity);
// // 通过GUI改变mesh.position对象的xyz属性
// // gui.add(ambient, 'intensity', 0, 2.0);

// gui.add(mesh.position, 'x', 0, 180);
// gui.add(mesh.position, 'y', 0, 180);
// gui.add(mesh.position, 'z', 0, 180);

// const obj1 = {
//     color:0x00ffff,
// };
// // .addColor()生成颜色值改变的交互界面
// gui.addColor(obj1, 'color').onChange(function(value){
//     mesh.material.color.set(value);
// });

// const obj2 = {
//   scale: 0,
// };
// // 参数3数据类型：数组(下拉菜单)
// gui.add(obj2, 'scale', [-100, 0, 100]).name('y坐标').onChange(function (value) {
//     mesh.position.y = value;
// });

// const obj3 = {
//   scale: 0,
// };
// // 参数3数据类型：对象(下拉菜单)
// gui.add(obj3, 'scale', {
//     left: -100,
//     center: 0,
//     right: 100
//     // 左: -100,//可以用中文
//     // 中: 0,
//     // 右: 100
// }).name('位置选择').onChange(function (value) {
//     mesh.position.x = value;
// });

// const obj4 = {
//   bool: false,
// };
// // 改变的obj属性数据类型是布尔值，交互界面是单选框
// gui.add(obj4, 'bool').name('是否旋转');

/********** gui交互界面不分组，只有一个默认的总的菜单 **************/
const gui = new GUI() //创建GUI对象
//创建一个对象，对象属性的值可以被GUI库创建的交互界面改变
const obj = {
  color: 0x00ffff, // 材质颜色
  specular: 0x111111 // 材质高光颜色
}

// 材质颜色color
gui.addColor(obj, 'color').onChange(function (value) {
  material.color.set(value)
})
// 材质高光颜色specular
gui.addColor(obj, 'specular').onChange(function (value) {
  material.specular.set(value)
})

// 环境光强度
// gui.add(ambient, 'intensity',0,2);
// 平行光强度
// gui.add(directionalLight, 'intensity',0,2);
// 平行光位置
// gui.add(directionalLight.position, 'x',-400,400);
// gui.add(directionalLight.position, 'y',-400,400);
// gui.add(directionalLight.position, 'z',-400,400);

onMounted(() => {
  document.getElementById('webgl').appendChild(renderer.domElement)
  document.getElementById('statsId').appendChild(stats.domElement)
})
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.main-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.stats-content {
  width: 200px;
  height: 100px;
  /* position: absolute;
  top: 0;
  left: 50%;
  translate: translateX(-50%); */
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
