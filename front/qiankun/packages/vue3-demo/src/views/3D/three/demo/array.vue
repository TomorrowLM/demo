<template>
  <div class="content"></div>
</template>
<script setup>
import * as THREE from 'three'

onMounted(() => {
  const width = 400 //宽度
  const height = 400 //高度
  // 实例化一个透视投影相机对象
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 8000) // width / height配置相机的画布大小
  // 实例化一个渲染器对象
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2) //设置渲染器（图层）的宽高
  document.querySelector('.content').appendChild(renderer.domElement)
  // 创建3D场景对象Scene
  const scene = new THREE.Scene()
  // 创建一个立方体网格模型对象
  const geometry = new THREE.BoxGeometry(100, 100, 100)
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff, //设置材质颜色
    transparent: true, //开启透明
    opacity: 0.5 //设置透明度
  })
  // 添加网格模型到场景中
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // 创建一个网格模型对象
      const mesh = new THREE.Mesh(geometry, material)
      // 网格模型位置xyz坐标：
      mesh.position.set(i * 100, 0, j * 100)
      scene.add(mesh) //网格模型添加到场景中
    }
  }

  // 相机位置xyz坐标：
  camera.position.set(800, 800, 800)

  //相机对准的位置
  camera.lookAt(0, 0, 0) 
  // 渲染
  renderer.render(scene, camera)
})
</script>
