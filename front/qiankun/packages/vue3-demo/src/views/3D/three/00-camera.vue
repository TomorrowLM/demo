<template>
  <div class="content"></div>
</template>
<script setup>
import * as THREE from 'three'

onMounted(() => {
  const width = 400 //宽度
  const height = 400 //高度
  // 实例化一个透视投影相机对象
  const camera = new THREE.PerspectiveCamera(100, width / height, 1, 100) // width / height配置相机的画布大小
  // 实例化一个渲染器对象
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setSize(window.innerWidth / 3, window.innerHeight / 3) //设置渲染器（图层）的宽高
  document.querySelector('.content').appendChild(renderer.domElement)
  // 创建3D场景对象Scene
  const scene = new THREE.Scene()
  // 创建一个立方体网格模型对象
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  // 创建一个网格模型对象
  const cube = new THREE.Mesh(geometry, material)
  // 网格模型位置xyz坐标：
  cube.position.set(0, 0, 0)
  // 添加网格模型到场景中
  scene.add(cube)
  // 相机位置xyz坐标：
  // camera.position.set(2, 0, 0)
  // camera.position.set(0, 2, 0)
  camera.position.set(0, 2, 2)
  //相机对准的位置
  camera.lookAt(0, 0, 0) //y轴上位置1坐标原点
  // camera.lookAt(cube.position) //指向mesh对应的位置
  // 渲染
  renderer.render(scene, camera)
})
</script>
