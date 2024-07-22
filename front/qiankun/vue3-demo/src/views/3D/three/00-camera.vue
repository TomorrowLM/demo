<template>
  <div class="content"></div>
</template>
<script setup>
import * as THREE from 'three'

onMounted(() => {
  const width = 800 //宽度
  const height = 400 //高度
  // 实例化一个透视投影相机对象
  const camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 3000) // width / height配置相机的画布大小
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2) //设置渲染器（图层）的宽高
  document.querySelector('.content').appendChild(renderer.domElement)
  //创建立方体
  const scene = new THREE.Scene()
  // 长方体尺寸100, 100, 100
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  // 网格模型位置xyz坐标：
  cube.position.set(1, 1, 0)
  scene.add(cube)
  // 相机位置xyz坐标：
  camera.position.set(2, 2, 3)
  console.log(cube.position)
  //相机对准的位置
  camera.lookAt(0.5, 1.5, 0) //y轴上位置1坐标原点
  // camera.lookAt(cube.position) //指向mesh对应的位置
  function animate() {
    //循环绘制
    requestAnimationFrame(animate)
    //旋转立方体
    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
    renderer.render(scene, camera)
  }
  animate()


})
</script>
