<template>
  <div>
    <div class="content"></div>
    点击放大
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import { onMounted } from 'vue'

onMounted(() => {
  const width = 400 // 宽度
  const height = 400 // 高度
  const list = [[{}, {}], [{}]]
  // 实例化一个渲染器对象
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setSize(400, 400) // 设置渲染器（图层）的宽高
  renderer.setClearColor(0x444444, 1) // 设置背景颜色
  document.querySelector('.content').appendChild(renderer.domElement)
  // 实例化一个透视投影相机对象
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000) // width / height配置相机的画布大小
  camera.position.set(0, 1, 10) // 调整相机位置
  camera.lookAt(0, 0, 0) // 相机看向原点
  // 创建3D场景对象Scene
  const scene = new THREE.Scene()
  // 创建GLTF加载器对象
  const loader = new GLTFLoader()
  let draggableObjects = []

  loader.load('../../../../demo.gltf', function (gltf) {
    console.log('控制台查看加载gltf文件返回的对象结构', gltf)
    console.log('gltf对象场景属性', gltf.scene)
    // 遍历所有子对象并修改材质
    // gltf.scene.traverse((child) => {
    //   if (child.isMesh) {
    //     if (child.material.isMaterial) {
    //       child.material = new THREE.MeshStandardMaterial({
    //         map: child.material.map,
    //         roughness: 0.5,
    //         metalness: 0,
    //         side: THREE.DoubleSide
    //       })
    //     } else if (Array.isArray(child.material)) {
    //       child.material = child.material.map((mat) => {
    //         return new THREE.MeshStandardMaterial({
    //           map: mat.map,
    //           roughness: 0.5,
    //           metalness: 0,
    //           side: THREE.DoubleSide
    //         })
    //       })
    //     }
    //     draggableObjects.push(child)
    //   }
    // })
    gltf.scene.position.set(0, 0, 0)
    gltf.scene.scale.set(1, 1, 1)
    gltf.scene.traverse((child) => {
      console.log('遍历子对象', child)
      if (child.isMesh) {
        child.raycast = THREE.Mesh.prototype.raycast // 确保启用射线检测
      }
      draggableObjects.push(child)
    })
    // 返回的场景对象gltf.scene插入到threejs场景中
    // 克隆模型并生成多份
    const originalModel = gltf.scene // 原始模型
    list.forEach((item, index) => {
      item.forEach((item2, index2) => {
        const clonedModel = originalModel.clone() // 克隆模型
        clonedModel.position.set(index * 1.5 - 2, index2 * 2.5 - 2, 0) // 设置克隆模型的位置
        clonedModel.scale.set(1, 1, 1) // 设置克隆模型的缩放
        scene.add(clonedModel) // 添加克隆模型到场景
      })
    })
  })

  // const ambientLight = new THREE.AmbientLight(0xdff, 20) // 环境光
  // scene.add(ambientLight)
  const pointLight = new THREE.PointLight(0xfff, 1.0)
  pointLight.position.set(1, 1, 4) //点光源位置
  pointLight.decay = 0.2 //设置光源不随距离衰减
  scene.add(pointLight) //点光源添加到场景中
let controls = null
  const controlsCreate = () => {
    // 添加一个轨道控制器
    controls = new OrbitControls(camera, renderer.domElement)
    // 设置控制器的中心点
    controls.target.set(0, 0, 0)
    // 设置控制器是否可旋转
    controls.enableRotate = true
    // 设置控制器是否可缩放
    controls.enableZoom = false
    // 设置控制器自动旋转
    controls.autoRotate = true
    // 增加阻尼
    controls.enableDamping = true
    // 设置阻尼系数
    controls.dampingFactor = 0.0001
    controls.update()
    // 添加拖拽控制器
    // const dragControls = new DragControls(draggableObjects, camera, renderer.domElement)
    // dragControls.addEventListener('dragstart', (event) => {
    //   controls.enabled = false
    // })
    // dragControls.addEventListener('dragend', (event) => {
    //   controls.enabled = true
    // })
  }
  // 创建射线检测器
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  // 获取鼠标点击位置的射线与物体相交的函数
  function getIntersects(event) {
    console.log('event', event)
    event.preventDefault() // 阻止默认的点击事件执行,

    //声明 rayCaster 和 mouse 变量
    let rayCaster = new THREE.Raycaster()
    let mouse = new THREE.Vector2()

    //通过鼠标点击位置，计算出raycaster所需点的位置，以屏幕为中心点，范围-1到1
    let getBoundingClientRect = renderer.domElement.getBoundingClientRect()
    mouse.x =
      ((event.clientX - getBoundingClientRect.left) / renderer.domElement.offsetWidth) * 2 - 1
    mouse.y =
      -((event.clientY - getBoundingClientRect.top) / renderer.domElement.offsetHeight) * 2 + 1
    console.log('mouse', mouse, scene)
    //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
    rayCaster.setFromCamera(mouse, camera)

    //获取与射线相交的对象数组， 其中的元素按照距离排序，越近的越靠前。
    //+true，是对其后代进行查找，这个在这里必须加，因为模型是由很多部分组成的，后代非常多。
    let intersects = rayCaster.intersectObjects(scene.children, true)
    console.log('intersects', intersects)
    //返回选中的对象
    return intersects
  }
  const scaleObject = []
  const onMouseClick = (event) => {
    // 检测与场景中的物体相交
    let intersects = getIntersects(event)
    console.log('相交的物体', intersects)
    if (intersects.length > 0) {
      const object = intersects[0].object
      // 点击了物体
      if (object.scale.x === 1.5) {
        // object.scale.set(1, 1, 1) // 放大物体
      } else {
        object.scale.set(1.5, 1.5, 1.5) // 放大物体
        console.log('object', object.scale.x)
        // object.material.emissive = new THREE.Color(0xff0000) // 设置高亮颜色
        scaleObject.push(object) // 将放大的物体添加到数组中
      }
    } else {
      scaleObject.forEach((obj) => {
        obj.scale.set(1, 1, 1) // 缩小物体
      })
      // 点击了空白区域
      // draggableObjects.forEach((obj) => {
      //   obj.scale.set(1, 1, 1) // 缩小物体
      // })
    }
  }

  // 渲染
  function animate() {
    controlsCreate()
    controls.update() // 更新轨道控制器
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()

  renderer.domElement.addEventListener('click', onMouseClick)
})
</script>
