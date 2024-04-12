<template>
  <div class="main-content">
    <canvas id="webgl"></canvas>
    <!-- <div id="statsId" class="stats-content"></div> -->
  </div>
</template>
<script setup>
import { onMounted } from 'vue'

function initShader(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE) {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

  gl.shaderSource(vertexShader, VERTEX_SHADER_SOURCE) // 指定顶点着色器的源码
  gl.shaderSource(fragmentShader, FRAGMENT_SHADER_SOURCE) // 指定片元着色器的源码

  // 编译着色器
  gl.compileShader(vertexShader)
  gl.compileShader(fragmentShader)

  // 创建一个程序对象
  const program = gl.createProgram()

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  gl.linkProgram(program)

  gl.useProgram(program)

  return program
}

onMounted(() => {
  const ctx = document.getElementById('webgl')
  console.log(ctx)
  const gl = ctx.getContext('webgl')
  console.log(gl, 12)

  // 创建着色器源码
  const VERTEX_SHADER_SOURCE = `
  uniform vec4 uPosition; // 虽然可以用在定点着色器中，但是他不能传递顶点数据。这个是对所有的顶点都生效的。但是对于顶点来说每个坐标都是不一样的。
  // 只传递顶点数据
  attribute vec4 aPosition; // 默认是高精度
  void main() {
    gl_Position = aPosition; // vec4(0.0,0.0,0.0,1.0)
    gl_PointSize = 10.0;
  }
` // 顶点着色器

  const FRAGMENT_SHADER_SOURCE = `
  precision mediump float; // 必须设置精度
  uniform vec2 uColor; // 这里定义的vec和下面的赋值需要对应。
  void main() {
    gl_FragColor = vec4(uColor.r, uColor.g, 0.0,1.0); // vec4
  }
` // 片元着色器

  const program = initShader(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)

  const aPosition = gl.getAttribLocation(program, 'aPosition')

  const uColor = gl.getUniformLocation(program, 'uColor')

  const points = []
  ctx.onclick = function (ev) {
    // 坐标
    const x = ev.clientX
    const y = ev.clientY

    const domPosition = ev.target.getBoundingClientRect()

    const domx = x - domPosition.left
    const domy = y - domPosition.top

    /*
  0 200 400
  -1 0 1
  -200 0 200
  -1 0 1
  需要先 -200 （当前画布的宽度） 然后再 除以 200
  1 0 -1
  0 200 400
  200 0 -200 / 200
  需要先让 200 减这个数，然后再 / 200
  * */
    const halfWidth = ctx.offsetWidth / 2
    const halfHeight = ctx.offsetHeight / 2

    // [-1, 1]
    const clickX = (domx - halfWidth) / halfWidth
    // [1, -1]
    const clickY = (halfHeight - domy) / halfHeight

    points.push({
      clickX,
      clickY
    })

    for (let i = 0; i < points.length; i++) {
      gl.vertexAttrib2f(aPosition, points[i].clickX, points[i].clickY)

      gl.uniform2f(uColor, points[i].clickX, points[i].clickY)
      gl.drawArrays(gl.POINTS, 0, 1)
    }
  }
})
</script>
