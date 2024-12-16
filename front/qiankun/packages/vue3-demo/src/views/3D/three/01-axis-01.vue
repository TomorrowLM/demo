<template>
  <div class="content"></div>
</template>
<script setup>
import * as THREE from 'three'
import { onMounted } from 'vue'

const scene = new THREE.Scene()
const geometry = new THREE.BoxGeometry(100, 100, 100)
//材质对象Material
const material = new THREE.MeshLambertMaterial({
  // color: 0x00ffff, //设置材质颜色
  transparent: true, //开启透明
  opacity: 0.5 //设置透明度
}) //网格漫反射材质
const mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh
//设置网格模型在三维空间中的位置坐标，默认是坐标原点
mesh.position.set(0, 10, 0)

// AxesHelper：辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(150)
scene.add(axesHelper)
scene.add(mesh) //网格模型添加到场景中

// 实例化一个透视投影相机对象
// 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000)
//相机在Three.js三维坐标系中的位置
// 根据需要设置相机位置具体值
camera.position.set(200, 200, 200)
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
renderer.render(scene, camera)

onMounted(() => {
  document.querySelector('.content').appendChild(renderer.domElement)
})
</script>
