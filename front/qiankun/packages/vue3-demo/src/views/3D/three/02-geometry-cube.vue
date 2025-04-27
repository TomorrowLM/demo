<template>
  <div class="content"></div>
</template>
<script setup>
import * as THREE from 'three'

onMounted(() => {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000) //设置摄像机
  const renderer = new THREE.WebGLRenderer({
    antialias: true //抗锯齿
  })
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

    //**requestAnimationFrame**有很多的优点。最重要的一点或许就是当用户切换到其它的标签页时，它会暂停，因此不会浪费用户宝贵的处理器资源，也不会损耗电池的使用寿命。
    requestAnimationFrame(animate)
    //旋转立方体
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.render(scene, camera)
  }
  // 随机创建大量的模型,测试渲染性能
  // const num = 1000; //控制长方体模型数量
  // for (let i = 0; i < num; i++) {
  //     const geometry = new THREE.BoxGeometry(5, 5, 5);
  //     const material = new THREE.MeshLambertMaterial({
  //         color: 0x00ffff
  //     });
  //     const mesh = new THREE.Mesh(geometry, material);
  //     // 随机生成长方体xyz坐标
  //     const x = (Math.random() - 0.5) * 200
  //     const y = (Math.random() - 0.5) * 200
  //     const z = (Math.random() - 0.5) * 200
  //     mesh.position.set(x, y, z)
  //     scene.add(mesh); // 模型对象插入场景中
  // }
  animate()
})
</script>
