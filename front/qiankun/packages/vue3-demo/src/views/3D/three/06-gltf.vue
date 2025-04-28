<template>
  <div>
    <div class="content" ref="content"></div>
    <div id="WebGL-output" style="font-size: 8px">
      <div class="css_style" id="lableItem">
        <span class="css3dTitleWarning" id="lableTitleWarning">报警信息: 无异常</span>
        <br />
        <span class="css3dTitleWarning" id="lableTitleTemperature">温度: 37℃</span>
      </div>
    </div>
    点击放大
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import {
  CSS3DObject,
  CSS3DSprite,
  CSS3DRenderer
} from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { onMounted } from 'vue'
const width = 400 // 宽度
const height = 400 // 高度
const list = [[{}, {}], [{}]]
// 实例化一个渲染器对象
const renderer = new THREE.WebGLRenderer({
  antialias: true // 抗锯齿，模糊效果，线条会更清晰
})
renderer.setSize(400, 400) // 设置渲染器（图层）的宽高
renderer.setClearColor(0x444444, 1) // 设置背景颜色
// renderer.domElement.style.position = 'absolute'
// renderer.domElement.style.top = 0

// 实例化一个透视投影相机对象
const camera = new THREE.PerspectiveCamera(80, width / height, 1, 400) // width / height配置相机的画布大小
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
      // 为每个物体设置唯一的名称
      child.name = `mesh_${draggableObjects.length}`
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
let controlsLabel = null
const controlsCreate = () => {
  // 添加一个轨道控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controlsLabel = new OrbitControls(camera, labelRenderer.domElement)
  // 设置控制器的中心点
  controls.target.set(0, 0, 0)
  controlsLabel.target.set(0, 0, 0)

  // 设置控制器是否可旋转
  controls.enableRotate = true
  // 设置控制器是否可缩放
  controls.enableZoom = false
  // 设置控制器自动旋转
  controls.autoRotate = false
  // 增加阻尼
  controls.enableDamping = true
  // 设置阻尼系数
  controls.dampingFactor = 0.01

  // 添加拖拽控制器
  // const dragControls = new DragControls(draggableObjects, camera, renderer.domElement)
  // dragControls.addEventListener('dragstart', (event) => {
  //   controls.enabled = false
  // })
  // dragControls.addEventListener('dragend', (event) => {
  //   controls.enabled = true
  // })
}
// 实例化一个CSS3D渲染器对象
const labelRenderer = new CSS3DRenderer()
labelRenderer.setSize(400, 400)
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = 0
labelRenderer.domElement.style.pointerEvents = 'none'
let css3DObject
function addCSS3DLabelToScene() {
  var element = document.getElementById('WebGL-output')
  element.style.pointerEvents = 'none' //避免HTML标签遮挡三维场景的鼠标事件
  console.log('element', element)
  //把生成的CSSDOM对象处理成three的节点对象
  css3DObject = new CSS3DObject(element)
  //设置CSS3DObject对象
  css3DObject.position.x = 2
  css3DObject.position.y = 2
  css3DObject.position.z = 0
  css3DObject.scale.set(0.05, 0.05, 0.05)

  // 把CSS3DObject对象添加到场景中
  scene.add(css3DObject)
  // 默认不显示
  css3DObject.visible = true
}

// 修改文档元素内容与颜色
function modifyDocument(id, color, value) {
  const dom = document.getElementById(id)
  console.log('dom', dom)
  if (!dom) {
    console.error(`Element with id "${id}" not found`)
    return
  }
  dom.style.color = color
  dom.textContent = value
}

// 获取鼠标点击位置的射线与物体相交的函数
function getIntersects(event) {
  console.log('event', event)
  event.preventDefault() // 阻止默认的点击事件执行,

  //声明 rayCaster 和 mouse 变量
  let rayCaster = new THREE.Raycaster() // 创建射线检测器
  let mouse = new THREE.Vector2() // 鼠标点击位置的二维坐标

  //通过鼠标点击位置，计算出raycaster所需点的位置，以屏幕为中心点，范围-1到1
  let getBoundingClientRect = renderer.domElement.getBoundingClientRect()
  mouse.x = ((event.clientX - getBoundingClientRect.left) / renderer.domElement.offsetWidth) * 2 - 1
  mouse.y =
    -((event.clientY - getBoundingClientRect.top) / renderer.domElement.offsetHeight) * 2 + 1
  //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
  rayCaster.setFromCamera(mouse, camera)

  //获取与射线相交的对象数组， 其中的元素按照距离排序，越近的越靠前。
  //+true，是对其后代进行查找，这个在这里必须加，因为模型是由很多部分组成的，后代非常多。
  let intersects = rayCaster.intersectObjects(scene.children, true)
  //返回选中的对象
  return intersects
}
const scaleObject = []
const onMouseClick = (event) => {
  console.log('event', event)
  // 检测与场景中的物体相交
  let intersects = getIntersects(event)
  console.log('相交的物体', intersects)
  if (intersects.length > 0) {
    const object = intersects[0].object
    scaleObject.forEach((obj) => {
      obj.scale.set(1, 1, 1) // 缩小物体
    })
    // 点击了物体
    if (object.scale.x === 1.5) {
      // object.scale.set(1, 1, 1) // 放大物体
    } else {
      object.scale.set(1.5, 1.5, 1.5) // 放大物体
      console.log('object', object.scale.x)
      // object.material.emissive = new THREE.Color(0xff0000) // 设置高亮颜色
      scaleObject.push(object) // 将放大的物体添加到数组中
      modifyDocument('lableTitleWarning', 'red', '报警信息: 温度过高')
      modifyDocument('lableTitleTemperature', 'red', '温度: 120℃')
      // 计算弹框位置
      // const position = object.position.clone() //局部坐标系（相对于父对象）
      var pos = new THREE.Vector3()
      object.getWorldPosition(pos) //全局坐标系（世界坐标系）
      // console.log('obj', object, position, pos)
      // const labelPosition = {
      //   left: ((position.x + 1) * width) / 2,
      //   top: ((-position.y + 1) * height) / 2
      // }
      css3DObject.position.copy(pos) //标签标注在obj世界坐标
      // console.log('labelPosition', labelPosition)
      css3DObject.visible = true // 显示弹框
    }
  } else {
    scaleObject.forEach((obj) => {
      obj.scale.set(1, 1, 1) // 缩小物体
    })
    // 点击了空白区域
    css3DObject.visible = false // 隐藏弹框
    // 点击了空白区域
    // draggableObjects.forEach((obj) => {
    //   obj.scale.set(1, 1, 1) // 缩小物体
    // })
  }
}

controlsCreate()

// 渲染
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  labelRenderer.render(scene, camera) // 渲染CSS3D对象
  controls.update() // 更新轨道控制器
  controlsLabel.update() // 更新轨道控制器
}

const content = ref(null)

onMounted(() => {
  animate()
  content.value.appendChild(renderer.domElement)
  content.value.appendChild(labelRenderer.domElement)

  console.log('renderer.domElement', renderer.domElement)
  addCSS3DLabelToScene() // 确保在DOM加载后创建CSS3DObject
  renderer.domElement.addEventListener('click', onMouseClick)
})
</script>
<style scoped>
.content {
  position: relative;
  width: 400px;
  height: 400px;
}

#WebGL-output {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.css3dTitleWarning {
  font-weight: bold;
}

.css3dTitleTemperature {
  font-size: 14px;
}
</style>
