<template>
  <div class="content"></div>
</template>
<script setup>
import * as THREE from 'three'

onMounted(() => {
  const width = 400 //宽度
  const height = 400 //高度
  // 实例化一个透视投影相机对象
  const camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000) // width / height配置相机的画布大小
  // 实例化一个渲染器对象
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setSize(400, 400) //设置渲染器（图层）的宽高
  document.querySelector('.content').appendChild(renderer.domElement)
  // 创建3D场景对象Scene
  const scene = new THREE.Scene()
  //创建两个网格模型mesh1、mesh2
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const group = new THREE.Group()
  const mesh1 = new THREE.Mesh(geometry, material)
  const mesh2 = new THREE.Mesh(geometry, material)
  mesh2.translateX(5)
  //把mesh1型插入到组group中，mesh1作为group的子对象
  group.add(mesh1)
  //把mesh2型插入到组group中，mesh2作为group的子对象
  group.add(mesh2)

  //把group插入到场景中作为场景子对象
  scene.add(group)

  // 相机位置xyz坐标：
  // camera.position.set(2, 0, 0)
  // camera.position.set(0, 2, 0)
  camera.position.set(0, 5, 5)

  //相机对准的位置
  camera.lookAt(0, 0, 0) //y轴上位置1坐标原点
  // 渲染
  renderer.render(scene, camera)
  group.translateX(4)
  group.scale.set(4, 4, 4)
  group.rotateY(Math.PI / 6)
})
</script>
