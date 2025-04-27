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

  // 着色器
  //顶点着色器
  //  gl_Position vec4(0.0,0.0,0.0,1.0)  x, y, z, w齐次坐标 (x/w, y/w, z/w)
  const VERTEX_SHADER_SOURCE = `
    // 必须要存在 main 函数
    void main() {
      // 要绘制的点的坐标
      gl_Position = vec4(0.2,0.0,0.0,1.0); // 超出canvas画布将会被剪切。
      // 点的大小
      gl_PointSize = 60.0;
    }
  `
  // 片元着色器
  // gl_FragColor vec4(1.0,0.0,0.0,1.0) r, g, b, a
  const FRAGMENT_SHADER_SOURCE = `
    void main() {
      gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
  `
  const program = initShader(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)
  // 执行绘制
  // 要绘制的图形是什么，从哪个开始，使用几个顶点
  gl.drawArrays(gl.POINTS, 0, 1)
  // gl.drawArrays(gl.LINES, 0, 1) // 最少需要有两个点，
  // gl.drawArrays(gl.TRIANGLES, 0, 1) // 3个点
})
</script>
