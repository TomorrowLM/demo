<template>
  <div>
    <div id="info">
      使用方向键控制机器人:<br />
      ↑ - 向前移动<br />
      ← → - 左右转向<br />
      <div>
        聊天窗口：
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入内容"
          style="width: 100%; height: 100px"
          v-model="inputValue"
        ></el-input>
        <ElButton @click="sendMessage">发送</ElButton>
      </div>
    </div>
    <div class="content"></div>
    <div id="WebGL-output" style="font-size: 8px">
      <div class="css_style" id="lableItem">
        <span class="css3dTitleWarning" id="lableTitleWarning">{{ robotMes }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import * as THREE from 'three'
import {
  CSS3DObject,
  CSS3DSprite,
  CSS3DRenderer
} from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { userInfoApi } from '@/api'
// 初始化场景、相机和渲染器
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb) // 天空蓝色背景

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true })
// renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setSize(600, 300) //设置渲染器（图层）的宽高
renderer.shadowMap.enabled = true
const robotMes = ref('你好') // 报警信息
// 创建机器人类
class Robot {
  constructor() {
    // 机器人主体
    this.body = new THREE.Group()

    // 躯干
    const torsoGeometry = new THREE.BoxGeometry(2, 3, 1)
    const torsoMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 })
    this.torso = new THREE.Mesh(torsoGeometry, torsoMaterial)
    this.torso.castShadow = true

    // 头部
    const headGeometry = new THREE.SphereGeometry(0.5)
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc })
    this.head = new THREE.Mesh(headGeometry, headMaterial)
    this.head.position.y = 2
    this.head.castShadow = true

    // 眼睛
    const eyeGeometry = new THREE.SphereGeometry(0.1)
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 })
    this.leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    this.rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    this.leftEye.position.set(-0.2, 2, 0.4)
    this.rightEye.position.set(0.2, 2, 0.4)

    // 手臂
    this.leftArm = this.createLimb(0.3, 2)
    this.leftArm.position.set(-1.2, 1, 0)
    this.rightArm = this.createLimb(0.3, 2)
    this.rightArm.position.set(1.2, 1, 0)

    // 腿部
    this.leftLeg = this.createLimb(0.4, 2)
    this.leftLeg.position.set(-0.6, -1.5, 0)
    this.rightLeg = this.createLimb(0.4, 2)
    this.rightLeg.position.set(0.6, -1.5, 0)

    // 组装机器人
    this.body.add(this.torso)
    this.body.add(this.head)
    this.body.add(this.leftEye)
    this.body.add(this.rightEye)
    this.body.add(this.leftArm)
    this.body.add(this.rightArm)
    this.body.add(this.leftLeg)
    this.body.add(this.rightLeg)
  }

  createLimb(width, height) {
    const geometry = new THREE.BoxGeometry(width, height, width)
    const material = new THREE.MeshPhongMaterial({ color: 0x999999 })
    const limb = new THREE.Mesh(geometry, material)
    limb.castShadow = true
    return limb
  }

  walk() {
    // 腿部摆动
    const legRotation = Math.sin(Date.now() * 0.005) * 0.5
    this.leftLeg.rotation.x = legRotation
    this.rightLeg.rotation.x = -legRotation

    // 手臂摆动
    const armRotation = Math.sin(Date.now() * 0.005) * 0.25
    this.leftArm.rotation.x = -armRotation
    this.rightArm.rotation.x = armRotation
  }

  turn(angle) {
    this.body.rotation.y += angle
  }

  moveForward(speed) {
    this.body.position.x += Math.sin(this.body.rotation.y) * speed
    this.body.position.z += Math.cos(this.body.rotation.y) * speed
  }

  addCSS3DLabelToScene() {
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
}

// 创建地面
const groundGeometry = new THREE.PlaneGeometry(100, 100)
const groundMaterial = new THREE.MeshPhongMaterial({
  color: 0x808080,
  side: THREE.DoubleSide
})
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.rotation.x = -Math.PI / 2
ground.position.y = -2.5
ground.receiveShadow = true
scene.add(ground)

// 创建机器人实例
const robot = new Robot()
scene.add(robot.body)

// 添加光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 10, 5)
directionalLight.castShadow = true
directionalLight.shadow.camera.near = 0.1
directionalLight.shadow.camera.far = 100
directionalLight.shadow.camera.left = -50
directionalLight.shadow.camera.right = 50
directionalLight.shadow.camera.top = 50
directionalLight.shadow.camera.bottom = -50
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight(0x404040)
scene.add(ambientLight)

// 设置相机位置
camera.position.set(0, 5, 10)
camera.lookAt(robot.body.position)

// 键盘状态
const keyStates = {}

// 键盘事件监听
document.addEventListener('keydown', (e) => {
  keyStates[e.key] = true
})

document.addEventListener('keyup', (e) => {
  keyStates[e.key] = false
})

// 窗口大小调整
// window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// 动画循环
function animate() {
  requestAnimationFrame(animate)

  // 更新机器人动作
  if (keyStates['ArrowUp']) {
    robot.walk()
    robot.moveForward(0.1)
  }
  if (keyStates['ArrowLeft']) {
    robot.turn(0.05)
  }
  if (keyStates['ArrowRight']) {
    robot.turn(-0.05)
  }

  // 相机跟随
  camera.position.x = robot.body.position.x
  camera.position.z = robot.body.position.z + 10
  camera.lookAt(robot.body.position)

  renderer.render(scene, camera)
}

animate()

const inputValue = ref('') // 聊天窗口输入框的值

const sendMessage = () => {
  console.log('发送消息:', inputValue.value)
  // 在这里处理发送消息的逻辑
  // 例如，可以将消息发送到服务器或在聊天窗口中显示
  userInfoApi({ mes: inputValue.value })
}
onMounted(() => {
  document.querySelector('.content').appendChild(renderer.domElement)
})
</script>

<style scoped>
#info {
  /* position: absolute; */
  top: 10px;
  left: 10px;
  width: 50%;
  color: white;
  font-family: Arial;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
}
</style>
