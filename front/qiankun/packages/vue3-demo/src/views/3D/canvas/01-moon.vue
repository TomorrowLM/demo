<template>
  <div class="main-content">
    <canvas id="canvas"></canvas>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const canvas = document.getElementById('canvas')
  // 判断是否支持 canvas
  if (!canvas.getContext) {
    return
  }
  const ctx = canvas.getContext('2d')
  console.log(ctx)
  // 获取画布的宽高
  const width = canvas.width
  const height = canvas.height

  // 掘金logo
  const juejin = new Image()
  juejin.src =
    'data:image/png;base64,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'

  requestAnimationFrame(draw)

  function draw() {
    ctx.clearRect(0, 0, width, height) // 清除画布

    // 签名
    drawSignature()

    // 星星
    drawStar(100, 40, 1)
    drawStar(200, 60, 0.8)
    drawStar(300, 120, 0.6)
    drawStar(350, 300, 0.6)
    drawStar(60, 380, 0.5)
    drawStar(80, 320, 0.3)

    // 保存状态
    ctx.save()
    // 移动坐标系原点至画布中心
    ctx.translate(width / 2, height / 2)

    // 月球
    drawMoon()

    // 卫星轨迹
    drawTrajectory()

    const time = new Date()
    ctx.rotate(
      ((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds()
    )

    // 卫星
    drawSatellite()

    // 恢复状态
    ctx.restore()

    requestAnimationFrame(draw)
  }

  // 绘制月球
  function drawMoon() {
    ctx.beginPath()
    ctx.arc(0, 0, 50, 0, Math.PI * 2)
    ctx.fillStyle = '#FEF1BC'
    ctx.fill()

    // 阴影
    drawShadow(50, '#F9E8A5')

    // 陨石坑
    drawMeteoriteCrater(-20, -30, 10)
    drawMeteoriteCrater(20, -10, 20)
    drawMeteoriteCrater(10, 30, 8)
  }

  // 绘制陨石坑
  function drawMeteoriteCrater(x, y, r) {
    ctx.save()
    ctx.translate(x, y)
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.fillStyle = '#F8E497'
    ctx.fill()
    // 阴影
    drawShadow(r, '#E6CE6F')
    ctx.restore()
  }

  // 绘制阴影
  function drawShadow(r, c) {
    ctx.save()
    ctx.rotate(-(Math.PI / 180) * 10)
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI / 2)
    ctx.bezierCurveTo(0.55 * r, 0.77 * r, 0.88 * r, 0.44 * r, r, 0)
    ctx.fillStyle = c
    ctx.fill()
    ctx.restore()
  }

  // 绘制卫星
  function drawSatellite() {
    ctx.save()
    ctx.translate(66, 0)
    ctx.scale(0.6, 0.6)
    ctx.rotate((Math.PI / 180) * 270)
    // 绘制三角形
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(12, 14)
    ctx.lineTo(-12, 14)
    ctx.fillStyle = '#D8E0E5'
    ctx.fill()
    // 翅膀连接线
    ctx.fillRect(-17, 6, 34, 2)
    // 翅膀
    ctx.fillRect(17, 1, 20, 12)
    ctx.fillRect(-37, 1, 20, 12)
    // 掘金 logo   257 * 200
    ctx.drawImage(juejin, -7.425, 3, 12.85, 10)
    ctx.restore()
  }

  // 绘制签名
  function drawSignature() {
    ctx.font = '16px san-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.fillText('by: 亦黑迷失', 290, 380)
  }

  // 绘制星星
  function drawStar(x, y, r) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = '#FEF1BC'
    ctx.fill()
  }

  // 绘制卫星轨迹
  function drawTrajectory() {
    ctx.beginPath()
    ctx.arc(0, 0, 73, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.setLineDash([4, 4])
    ctx.stroke()
  }
})
</script>

<style scoped>
canvas {
  background-color: darkslateblue;
}
</style>
