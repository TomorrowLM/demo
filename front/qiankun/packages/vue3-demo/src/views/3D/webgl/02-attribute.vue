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
  console.log('g1:', gl)

  // 创建着色器源码
  const VERTEX_SHADER_SOURCE = `
    // 只传递顶点数据
    attribute vec4 aPosition;
    void main() {
      gl_Position = aPosition; // vec4(0.0,0.0,0.0,1.0)
      gl_PointSize = 30.0;
    }
  `

  const FRAGMENT_SHADER_SOURCE = `
    void main() {
      gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
  `

  //创建程序对象
  const program = initShader(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)

  const aPosition = gl.getAttribLocation(program, 'aPosition') //获取属性变量

  // 可以省略默认值
  // gl.vertexAttrib4f(aPosition, 0.5,0.5,0.0,1.0)
  // gl.vertexAttrib3f(aPosition, 0.5,0.5,0.0)
  // gl.vertexAttrib2f(aPosition, 0.5,0.5)

  let x = -1
  setInterval(() => {
    x += 0.1
    if (x > 1.0) {
      x = -1
    }
    gl.vertexAttrib1f(aPosition, x)
    gl.drawArrays(gl.POINTS, 0, 1)
  }, 200)
})
</script>
