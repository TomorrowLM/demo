<template>
  <div class="content"></div>
</template>
<script setup>
import * as THREE from 'three'

onMounted(() => {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000) //设置摄像机
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2) //设置渲染器（图层）的宽高
  console.log(renderer)
  document.querySelector('.content').appendChild(renderer.domElement)

  //创建立方体
  const scene = new THREE.Scene()
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  camera.position.z = 3
  function animate() {
    //循环绘制
    requestAnimationFrame(animate)
    //旋转立方体
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.render(scene, camera)
  }
  animate()
})
</script>
