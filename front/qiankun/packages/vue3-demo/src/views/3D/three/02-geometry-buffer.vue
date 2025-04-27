<template>
  <div class="content"></div>
</template>
<script setup>
import * as THREE from 'three'

onMounted(() => {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000) //设置摄像机
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2) //设置渲染器（图层）的宽高
  document.querySelector('.content').appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const geometry = new THREE.BufferGeometry()
  //类型化数组创建顶点数据
  const vertices = new Float32Array([
    0,
    0,
    0, //顶点1坐标
    50,
    0,
    0, //顶点2坐标
    0,
    100,
    0, //顶点3坐标
    0,
    0,
    10, //顶点4坐标
    0,
    0,
    100, //顶点5坐标
    50,
    0,
    10 //顶点6坐标
  ])

  // 创建属性缓冲区对象
  //3个为一组，表示一个顶点的xyz坐标
  const attribue = new THREE.BufferAttribute(vertices, 3)
  // 设置几何体attributes属性的位置属性
  geometry.attributes.position = attribue
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  camera.position.x = 100
  camera.position.y = 20
  camera.position.z = 200
  function animate() {
    // //循环绘制
    // //**requestAnimationFrame**有很多的优点。最重要的一点或许就是当用户切换到其它的标签页时，它会暂停，因此不会浪费用户宝贵的处理器资源，也不会损耗电池的使用寿命。
    // requestAnimationFrame(animate)
    // //旋转立方体
    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
    renderer.render(scene, camera)
  }

  animate()
})
</script>
