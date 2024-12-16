<template>
  <div class="content">文字</div>
</template>
<script setup>
import * as THREE from 'three'

onMounted(() => {
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2) //设置渲染器（图层）的宽高
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
  camera.position.set(0, 0, 100)
  camera.lookAt(0, 10, 0)
  document.querySelector('.content').appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const texture = new THREE.TextureLoader().load('textures/water.jpg')
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  renderer.render(scene, camera)
})
</script>

<style lang="scss">
.content {
  // position: absolute;
  // top: 10px;
  // width: 100%;
  // text-align: center;
  // z-index: 100;
  // display: block;
}
</style>
