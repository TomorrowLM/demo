<template>
  <div class="content">
    <!-- <img img src="../../../../demo.png" alt="" /> -->
  </div>
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
  const geometry = new THREE.BoxGeometry(2, 2, 2)
  //纹理贴图加载器TextureLoader
  const texLoader = new THREE.TextureLoader()
  // .load()方法加载图像，返回一个纹理对象Texture
  texLoader.load('../../../../texture.webp', (loadedTexture) => {
    const material = new THREE.MeshBasicMaterial({ map: loadedTexture })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    renderer.render(scene, camera) // 确保在纹理加载完成后重新渲染
  })

  // 相机位置xyz坐标：
  camera.position.set(2, 2, 4)

  //相机对准的位置
  camera.lookAt(0, 0, 0) //y轴上位置1坐标原点
})
</script>
