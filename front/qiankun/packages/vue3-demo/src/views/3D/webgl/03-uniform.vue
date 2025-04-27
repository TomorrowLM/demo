<template>
  <div class="main-content">
    <canvas id="webgl"></canvas>
    <!-- <div id="statsId" class="stats-content"></div> -->
  </div>
</template>
<script setup>
import { onMounted } from 'vue'

function initShader(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE) {
  //创建着色器对象
  const vertexShader = gl.createShader(gl.VERTEX_SHADER) // 顶点着色器
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) // 片元着色器

  //指定着色器源码
  gl.shaderSource(vertexShader, VERTEX_SHADER_SOURCE) // 指定顶点着色器的源码
  gl.shaderSource(fragmentShader, FRAGMENT_SHADER_SOURCE) // 指定片元着色器的源码

  // 编译着色器
  gl.compileShader(vertexShader)
  gl.compileShader(fragmentShader)

  // 创建程序对象
  const program = gl.createProgram()

  //附加着色器到程序对象
  gl.attachShader(program, vertexShader) //附加顶点着色器
  gl.attachShader(program, fragmentShader) //附加片元着色器:

  gl.linkProgram(program) //链接程序对象

  gl.useProgram(program)

  return program
}
onMounted(() => {
  const ctx = document.getElementById('webgl')
  console.log(ctx)
  const gl = ctx.getContext('webgl')
  console.log(gl, 12)

  // 创建着色器源码
  // 顶点着色器源码
  const VERTEX_SHADER_SOURCE = `
  uniform vec4 uPosition; // 虽然可以用在定点着色器中，但是他不能传递顶点数据。这个是对所有的顶点都生效的。但是对于顶点来说每个坐标都是不一样的。
  // 只传递顶点数据
  attribute vec4 aPosition; // 默认是高精度
  void main() {
    gl_Position = aPosition; // vec4(0.0,0.0,0.0,1.0)
    gl_PointSize = 10.0;
  }
`
  // 片元着色器源码
  const FRAGMENT_SHADER_SOURCE = `
  precision mediump float; // 告诉编译器在片元着色器中设置浮点数的精度为中等精度
  uniform vec2 uColor; // 这里定义的vec和下面的赋值需要对应。
  void main() {
    gl_FragColor = vec4(uColor.r, uColor.g, 0.0,1.0); // vec4
  }
`

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
