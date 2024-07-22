<template>
  <div class="content"></div>
</template>
<script setup>
import * as THREE from 'three'
import { onMounted } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const geometry = new THREE.BoxGeometry(100, 100, 100)
//材质对象Material:网格漫反射材质
//MeshLambertMaterial受光照影响
const material = new THREE.MeshLambertMaterial()
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh
//设置网格模型在三维空间中的位置坐标，默认是坐标原点
mesh.position.set(0, 10, 0)

// AxesHelper：辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(150)

const pointLight = new THREE.PointLight(0xdfdf, 1.0)
//点光源位置
pointLight.position.set(70, 200, 100) //点光源放在x轴上
pointLight.decay = 0.0 //设置光源不随距离衰减

const scene = new THREE.Scene()
scene.add(axesHelper)
scene.add(mesh) //网格模型添加到场景中
scene.add(pointLight) //点光源添加到场景中

// 平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
directionalLight.position.set(0, 0, 50);
// 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
directionalLight.target = mesh;
scene.add(directionalLight);
// DirectionalLightHelper：可视化平行光
const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5 ,0xff0000);
scene.add(dirLightHelper);

// 实例化一个透视投影相机对象
// 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
const camera = new THREE.PerspectiveCamera(30, width / height, 100, 3000)
//相机在Three.js三维坐标系中的位置
// 根据需要设置相机位置具体值
camera.position.set(300, 800, 800)
//相机观察目标指向Threejs 3D空间中某个位置
// camera.lookAt(0, 0, 0); //坐标原点
// camera.lookAt(0, 10, 0);  //y轴上位置10
camera.lookAt(mesh.position) //指向mesh对应的位置

// 定义相机输出画布的尺寸(单位:像素px)
const width = 500 //宽度
const height = 300 //高度
// 创建渲染器对象
const renderer = new THREE.WebGLRenderer()
//设置three.js渲染区域的尺寸(像素px)
renderer.setSize(width, height)
//执行渲染操作
renderer.render(scene, camera);

// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
controls.addEventListener('change', function () {
    renderer.render(scene, camera); //执行渲染操作
});//监听鼠标、键盘事件
controls.addEventListener('change', function () {
    // 浏览器控制台查看相机位置变化
    console.log('camera.position',camera.position);
});


function animate() {
  //循环绘制
  requestAnimationFrame(animate)
  // //旋转立方体
  // mesh.rotation.x += 0.01
  // mesh.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()
onMounted(() => {
  document.querySelector('.content').appendChild(renderer.domElement)
})
</script>
