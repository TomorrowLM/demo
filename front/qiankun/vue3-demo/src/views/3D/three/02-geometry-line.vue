<template>
  <div class="content">描述</div>
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
  //create a blue LineBasicMaterial
  //创建材质
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
//带有一些顶点的geometry（几何体）
  const points = []
  points.push(new THREE.Vector3(-10, 0, 0))
  points.push(new THREE.Vector3(0, 20, 0))
  points.push(new THREE.Vector3(10, 0, 0))

  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  const line = new THREE.Line(geometry, material)
  scene.add(line)
  // camera.position.z = 3
  // function animate() {
  //   //循环绘制
  //   requestAnimationFrame(animate)
  //   //旋转立方体
  //   line.rotation.x += 0.01
  //   line.rotation.y += 0.01
  //   renderer.render(scene, camera)
  // }
  // animate()
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
