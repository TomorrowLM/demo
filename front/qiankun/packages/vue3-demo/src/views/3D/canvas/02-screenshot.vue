<template>
  <div class="box">
    <div class="tool-introduce">图片标注小工具</div>
    <div class="img-demo"><img src="@/assets/demo.png" /><img /></div>
    <div class="box-canvas" style="display: none">
      <canvas id="canvas"></canvas>
      <canvas id="canvas1"></canvas>
      <canvas id="canvas2"></canvas>
      <div class="progress"></div>
    </div>
    <div class="tool">
      <div class="tab" style="display: flex">
        <div class="tab-1">
          <p>选择图片</p>
        </div>
        <div class="tab-2">
          <p>编辑流程</p>
        </div>
        <div class="tab-3">
          <p>导出图片</p>
        </div>
      </div>
      <div class="file-box">
        <div class="img-type">
          <span>图片：</span>
          <input type="text" />
          <div class="file">选择文件<input type="file" value="选择图片" /></div>
        </div>
        <div class="img-scale-box">
          <div style="margin-bottom: 20px">
            <span>宽：</span>
            <input type="text" placeholder="更改图像大小" class="img-scale" />
          </div>
          <div>
            <span>高：</span>
            <input type="text" placeholder="更改图像大小" class="img-scale" />
          </div>
          <button class="confirm">确认</button>
        </div>
      </div>
      <div class="change-step-box">
        <span>更改开始步骤：</span>
        <input type="text" placeholder="更改开始步骤" class="step-val" />
        <button class="change-step">确认</button>
        <button id="returnLast">上一步</button>
        <button id="reset">重置</button>
      </div>
      <div class="save-box">
        <div>
          <span>设置图片名称：</span>
          <input type="text" class="file-name" />
        </div>
        <div class="save-clipboard-box">
          <button class="save-clipboard">复制图片</button>
          <button id="save">保存图像</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import '@lm/shared/src/dependencies/canvas/html2canvas.min.js'
import Canvas2Image from '@lm/shared/src/dependencies/canvas/canvas2image.js'
// console.log('BASE_URL', 123, import.meta.url, import.meta.env.BASE_URL)
// const demoImagePath = computed(() => `${import.meta.env.BASE_URL}src/assets/demo.png`)
// const imgSrc = computed(() => new URL('@/assets/demo.png', import.meta.url).href)
// console.log('imgSrc', imgSrc.value)
let canvas,
  ctx,
  canvas1,
  ctx1,
  canvas2,
  ctx2,
  clientRect,
  cw,
  ch,
  imgScale,
  img,
  imgW,
  imgH,
  imgData,
  old,
  spreadX,
  spreadY,
  pixelRatio
onMounted(() => {
  //图像层
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  //矩形框层
  canvas1 = document.getElementById('canvas1')
  ctx1 = canvas1.getContext('2d')
  //蒙版层
  canvas2 = document.getElementById('canvas2')

  ctx2 = canvas2.getContext('2d')
  //画布宽高
  clientRect = canvas.getBoundingClientRect()
  cw = $('canvas').width()
  ch = $('canvas').height()
  //定义图像缩放比例
  imgScale = 2
  //设置图像数据
  img = new Image()
  imgW = 0
  imgH = 0
  //存储图像步骤标识的状
  imgData = []
  //old存储矩形框信息的数组
  //6个参数(x ,y , xStart, yStart, xDistance, yDistance),xStart矩形框左上角x的最小值
  //在创建矩形框的时候，数据还没有完全push，完全push是在mouseup
  old = []
  imgData.push(0)
  //扩展canvas宽高变量
  spreadX = 100
  spreadY = 100
  pixelRatio = getPixelRatio(canvas)
  console.log(pixelRatio, $('.file>input'))

  $('.file>input').change(function () {
    console.log(55)
    reset()
    $('.img-demo').empty()
    var imgFile = $(this)[0].files[0]
    $('.img-type>input').val(imgFile.name)
    if (!/image\/\w+/.test(imgFile.type)) {
      alert('文件必须为图片！')
      return false
    }
    //读取照片第一种
    var objURL = getObjectURL(imgFile)
    //读取照片第二种
    // var reader = new FileReader();
    // reader.readAsDataURL(this.files[0]);
    // reader.onload = function (e) {
    //     console.log(this.result)
    // }
    $('#canvas').append("<img id='img''></img>")
    $('#img').attr('src', objURL)
    img.src = objURL
    $('.box-canvas').show()
    drawImage(objURL)
  })
  //监听鼠标是否移动到矩形框的右下角
  $('canvas').mousemove(throttle(switchCursor, 100))
  //功能区
  //tab
  $('.file-box,.change-step-box,.save-box').addClass('tab-others')
  $('.file-box').removeClass('tab-others')
  $('.tab-1').addClass('tab-active')
  $('.tab>div').on('click', function (e) {
    console.log($(this).index())
    let index = $(this).index()
    switch (index) {
      case 0: {
        $('.file-box,.change-step-box,.save-box').addClass('tab-others')
        $('.file-box').removeClass('tab-others')
        $('.tab>div').removeClass('tab-active')
        $('.tab-1').addClass('tab-active')
        break
      }
      case 1: {
        $('.file-box,.change-step-box,.save-box').addClass('tab-others')
        $('.change-step-box').removeClass('tab-others')
        $('.tab>div').removeClass('tab-active')
        $('.tab-2').addClass('tab-active')
        break
      }
      case 2: {
        $('.file-box,.change-step-box,.save-box').addClass('tab-others')
        $('.save-box').removeClass('tab-others')
        $('.tab>div').removeClass('tab-active')
        $('.tab-3').addClass('tab-active')
        break
      }
    }
  })
  //更改步骤
  $('.change-step').on('click', function () {
    var step = $('.step-val').val()
    step = parseInt(step) - 1
    if (imgData.length == 1) {
      imgData[imgData.length - 1] = step
    } else {
      imgData[imgData.length - 1] = step
    }
  })
  $('#save').on('click', function () {
    $('.progress input').css('border-width', 0)
    fileName = $('.file-name').val()
    downDom($('.box-canvas')[0], 'png', fileName, $('.box-canvas').height())
    imgData.push(0)
    //存储上一个图像的状态
    for (let i = 0; i < imgData.length - 1; i++) {
      imgData[imgData.length - 1] = imgData[i] + old.length
    }
    reset()
  })

  //改变画布大小
  $('.confirm').on('click', function () {
    reset()
    imgW = parseInt($('.img-scale').eq(0).val())
    imgH = parseInt($('.img-scale').eq(1).val())
    cw = imgW + spreadX
    ch = imgH + spreadY
    setCanvasArea(canvas, ctx)
    setCanvasArea(canvas1, ctx1)
    setCanvasArea(canvas2, ctx2)
    $('.box-canvas').width(cw)
    $('.box-canvas').height(ch + 10)
    if (window.innerWidth <= 414) {
      $('.tool').css('margin-top', ch + 30)
    } else {
      // $('.tool').css('margin-left', cw + 30)
    }
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(document.getElementById('img'), spreadX / 2, spreadY / 2, imgW, imgH)
    ctx1.fillStyle = '#9090900f'
    ctx1.fillRect(0, 0, cw, ch)
  })
  //保存到剪切板
  $('.save-clipboard').on('click', function () {
    $('.progress input').css('border-width', 0)
    let scrollTop = $(document).scrollTop()
    let scrollLeft = $(document).scrollLeft()
    //复制图像到剪切板
    async function downClipboard(Dom, picType, picName, downDomH) {
      picName = picName || '下载'
      // 像素比，清晰度
      var opts = {
        pixelRatio,
        logging: true
      }
      window.scroll(0, 0)
      // 调用html2canvas插件
      await html2canvas(Dom, opts).then(function (Dom) {
        var context = Dom.getContext('2d')
        // 【重要】关闭抗锯齿
        context.mozImageSmoothingEnabled = false
        context.webkitImageSmoothingEnabled = false
        context.msImageSmoothingEnabled = false
        context.imageSmoothingEnabled = false
        $('.save-clipboard').after(Canvas2Image.convertToImage(Dom, cw, downDomH, picType))
        const imgClipboard = document.querySelector('.save-clipboard-box img')
        $('.save-clipboard-box img').hide()
        const src = imgClipboard.getAttribute('src')
        console.log(src)
        //将base64转换为blob对象
        function dataURLtoFile(dataurl, filename) {
          var arr = dataurl.split(',')
          var mime = arr[0].match(/:(.*?);/)[1]
          var bstr = atob(arr[1])
          var n = bstr.length
          var u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          //转换成file对象
          //return new File([u8arr], filename, { type: mime });
          //转换成成blob对象
          return new Blob([u8arr], { type: mime })
        }
        var imageBlob = dataURLtoFile(src)
        const item = new ClipboardItem({
          [imageBlob.type]: imageBlob
        })
        async function askWritePermission() {
          try {
            const { state } = await navigator.permissions.query({
              name: 'clipboard-write'
            })
            return state === 'granted'
          } catch (error) {
            return false
          }
        }
        if (askWritePermission()) {
          navigator.clipboard.write([item])
          alert('成功复制到剪切板')
        } else {
          alert('不支持复制')
        }
      })
      await new Promise(() => {
        window.scroll(0, 0)
        $('.save-clipboard-box img').remove()
        $('.progress input').css('border-width', 1)
      })
    }

    downClipboard($('.box-canvas')[0], 'png', fileName, $('.box-canvas').height())
  })
})

//上传图像
function getObjectURL(file) {
  var url = null
  if (window.createObjcectURL != undefined) {
    url = window.createOjcectURL(file)
  } else if (window.URL != undefined) {
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL != undefined) {
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}
if (window.FileReader) {
  var reader = new FileReader()
} else {
  console.log('你的浏览器不支持读取文件')
}

//获取设备像素比
var getPixelRatio = function (context) {
  var backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1
  return (window.devicePixelRatio || 1) / backingStore
}

//设置图层宽高，解决图像模糊
function setCanvasArea(canvas, ctx) {
  canvas.width = Math.floor(cw * pixelRatio)
  canvas.height = Math.floor(ch * pixelRatio)
  // 设置canvas的真实宽高
  canvas.style.width = cw + 'px'
  canvas.style.height = ch + 'px'
  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'
}
//绘制图像
function drawImage(objURL) {
  img.onload = function () {
    var docW = window.innerWidth
    var docH = window.innerHeight
    imgW = img.width
    imgH = img.height
    //设置图像宽高
    if (docH > imgH && docW > imgW) {
      imgScale = 1
    } else {
      if (docW < imgW && docH > imgH) {
        imgScale = imgW / docW
        imgW = (docW * 3) / 4
        imgScale = (imgScale * 4) / 3
        imgH = imgH / imgScale
      } else {
        imgScale = imgH / docH
        imgH = (docH * 3) / 4
        imgScale = (imgScale * 4) / 3
        imgW = imgW / imgScale
      }
    }
    imgW = Math.floor(imgW)
    imgH = Math.floor(imgH)
    $('.img-scale').eq(0).val(imgW)
    $('.img-scale').eq(1).val(imgH)
    //设置画布大小
    cw = imgW + spreadX
    ch = imgH + spreadY
    setCanvasArea(canvas, ctx)
    setCanvasArea(canvas1, ctx1)
    setCanvasArea(canvas2, ctx2)
    $('.box-canvas').width(cw)
    $('.box-canvas').height(ch)
    if (window.innerWidth <= 414) {
      $('.tool').css('margin-top', ch + 30)
    } else {
      //$('.tool').css('margin-left', cw + 30)
    }
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.shadowColor = '#ccc'
    ctx.shadowBlur = 10

    ctx.fillStyle = '#9090900f'
    ctx.fillRect(0, 0, cw, ch)
    ctx1.fillStyle = '#9090900f'
    ctx1.fillRect(0, 0, cw, ch)
    ctx.drawImage(this, spreadX / 2, spreadY / 2, imgW, imgH)
  }
}
//圆角
function strokeRoundRect(
  cxt,
  x,
  y,
  width,
  height,
  radius,
  /*optional*/ lineWidth,
  /*optional*/ strokeColor
) {
  //圆的直径必然要小于矩形的宽高
  if (2 * radius > width || 2 * radius > height) {
    return false
  }
  cxt.save()
  cxt.translate(x, y)
  //绘制圆角矩形的各个边
  drawRoundRectPath(cxt, width, height, radius)
  cxt.lineWidth = lineWidth || 2 //若是给定了值就用给定的值否则给予默认值2
  cxt.strokeStyle = strokeColor || '#000'
  cxt.stroke()
  cxt.restore()
}

function drawRoundRectPath(cxt, width, height, radius) {
  cxt.beginPath(0)
  //从右下角顺时针绘制，弧度从0到1/2PI
  cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2)

  //矩形下边线
  cxt.lineTo(radius, height)

  //左下角圆弧，弧度从1/2PI到PI
  cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI)

  //矩形左边线
  cxt.lineTo(0, radius)

  //左上角圆弧，弧度从PI到3/2PI
  cxt.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2)

  //上边线
  cxt.lineTo(width - radius, 0)

  //右上角圆弧
  cxt.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2)

  //右边线
  cxt.lineTo(width, height - radius)
  cxt.closePath()
}
//标号添加
function labelText(xStart, yStart, i) {
  //绘制圆
  ctx1.beginPath()
  ctx1.fillStyle = 'rgb(36,199,136)'
  ctx1.arc(xStart, yStart, 30 / 2, 0, 2 * Math.PI, false)
  ctx1.fill()
  //绘制文字
  ctx1.beginPath()
  ctx1.font = '25px Arial icon'
  ctx1.fillStyle = 'white'
  ctx1.textAlign = 'center'
  ctx1.fillText(i, xStart, yStart + 9)
}
//放大选中的图像
function fixSelectImg(xStart, yStart, xDistance, yDistance) {
  ctx1.fillStyle = '#fff'
  ctx1.fillRect(xStart, yStart, xDistance, yDistance)
  ctx1.drawImage(
    canvas,
    xStart * pixelRatio + 10,
    yStart * pixelRatio + 10,
    xDistance * pixelRatio - 10,
    yDistance * pixelRatio - 10,
    xStart,
    yStart,
    xDistance,
    yDistance
  )
}
//创建矩形框后，在图像上生成对应的步骤
function progress(index) {
  //设置progress距离canvas为30
  $('.progress').append(
    '<div><span>第</span>' +
      '<span>' +
      index +
      '</span>' +
      '<span>步：</span>' +
      '<input></input></div>'
  )
  $('.progress').width(cw)
  //获取span的宽度
  var spanW = 0
  $('.progress>div:eq(0) span').each(function () {
    spanW = spanW + $(this).width()
  })
  //设置input的宽度
  $('.progress>div input').width(cw - spanW - 30)
  //设置canvas距离顶部
  //$("canvas").css("top", $(".progress").height() + 10);
  $('.progress').css('top', ch + 10)
  $('.box-canvas').height(ch + $('.progress').height() + 20)
}
//创建矩形框时蒙层绘制
function CreateDrawCover(xStart, yStart, xDistance, yDistance) {
  ctx2.clearRect(0, 0, cw, ch)
  ctx2.fillStyle = '#c7c5c56b'
  ctx2.fillRect(0, 0, cw, ch)
  for (let i = 0; i < old.length; i++) {
    ctx2.clearRect(old[i][2], old[i][3], old[i][4], old[i][5])
  }
  ctx2.clearRect(xStart, yStart, xDistance, yDistance)
}
//拖拽矩形框时蒙层绘制
function dragDrawCover(xStart, yStart, xDistance, yDistance, index) {
  ctx2.clearRect(0, 0, cw, ch)
  ctx2.fillStyle = '#c7c5c56b'
  ctx2.fillRect(0, 0, cw, ch)
  for (let i = 0; i < old.length; i++) {
    if (i != index) {
      ctx2.clearRect(old[i][2], old[i][3], old[i][4], old[i][5])
    }
  }
  ctx2.clearRect(xStart, yStart, xDistance, yDistance)
}

//创建矩形框
function CreateReturnOld(xStart, yStart, xDistance, yDistance) {
  //清除图层
  ctx1.clearRect(0, 0, cw, ch)
  //还原矩形框
  for (let i = 0; i < old.length - 1; i++) {
    fixSelectImg(old[i][2], old[i][3], old[i][4], old[i][5])
    strokeRoundRect(ctx1, old[i][2], old[i][3], old[i][4], old[i][5], 7, 2, 'rgb(36,199,136)')
    labelText(old[i][2], old[i][3], imgData[imgData.length - 1] + i + 1)
  }
  //创建当前矩形框
  if (xDistance > 5 || yDistance > 5) {
    fixSelectImg(xStart, yStart, xDistance, yDistance)
    strokeRoundRect(ctx1, xStart, yStart, xDistance, yDistance, 7, 2, 'rgb(36,199,136)')
    CreateDrawCover(xStart, yStart, xDistance, yDistance)
  }
}
//扩展矩形框
function spreadReturnOld(xStart, yStart, xDistance, yDistance, index) {
  //清除图层
  ctx1.clearRect(0, 0, cw, ch)
  //还原矩形框
  for (let i = 0; i < old.length; i++) {
    if (i != index) {
      fixSelectImg(old[i][2], old[i][3], old[i][4], old[i][5])
      strokeRoundRect(ctx1, old[i][2], old[i][3], old[i][4], old[i][5], 7, 2, 'rgb(36,199,136)')
      labelText(old[i][2], old[i][3], imgData[imgData.length - 1] + i + 1)
    }
  }
  //拖拽
  fixSelectImg(xStart, yStart, xDistance, yDistance)
  strokeRoundRect(ctx1, xStart, yStart, xDistance, yDistance, 7, 2, 'rgb(36,199,136)')
  dragDrawCover(xStart, yStart, xDistance, yDistance, index)
}
//拖拽矩形框
function dragReturnOld(xStart, yStart, index) {
  //清除图层
  ctx1.clearRect(0, 0, cw, ch)
  //还原矩形框
  for (let i = 0; i < old.length; i++) {
    if (i != index) {
      fixSelectImg(old[i][2], old[i][3], old[i][4], old[i][5])
      strokeRoundRect(ctx1, old[i][2], old[i][3], old[i][4], old[i][5], 7, 2, 'rgb(36,199,136)')
      labelText(old[i][2], old[i][3], imgData[imgData.length - 1] + i + 1)
    }
  }
  //拖拽
  fixSelectImg(xStart, yStart, old[index][4], old[index][5])
  strokeRoundRect(ctx1, xStart, yStart, old[index][4], old[index][5], 7, 2, 'rgb(36,199,136)')
  dragDrawCover(xStart, yStart, old[index][4], old[index][5], index)
}
//节流
function throttle(func, wait) {
  let previous = 0
  return function (e) {
    let now = Date.now()
    let context = this
    let args = arguments
    if (now - previous > wait) {
      func.apply(context, args)
      previous = now
    }
  }
}
//切换箭头样式
function switchCursor(e) {
  var x = e.offsetX
  var y = e.offsetY
  for (var index = 0; index < old.length; ++index) {
    if (
      old[index][2] + old[index][4] - 10 < x &&
      x < old[index][2] + old[index][4] &&
      old[index][3] + old[index][5] - 10 < y &&
      y < old[index][3] + old[index][5]
    ) {
      $('.box-canvas').addClass('box-canvas-cursor').removeClass('box-canvas-default')
      break
    } else {
      $('.box-canvas').addClass('box-canvas-default').removeClass('box-canvas-cursor')
    }
  }
}

//鼠标事件
$(function () {
  //鼠标按下，将鼠标按下坐标保存在x,y中
  canvas1.onmousedown = function (ev) {
    var e = ev || event
    var x = e.offsetX
    var y = e.offsetY
    //判断鼠标按下的位置是否是之前矩形框存在的位置
    for (let i = 0; i < old.length; i++) {
      if (
        old[i][2] < x &&
        x < old[i][2] + old[i][4] &&
        old[i][3] < y &&
        y < old[i][3] + old[i][5]
      ) {
        if (
          old[i][2] + old[i][4] - 10 < x &&
          x < old[i][2] + old[i][4] &&
          old[i][3] + old[i][5] - 10 < y &&
          y < old[i][3] + old[i][5]
        ) {
          spreadArea(x, y, i)
          return
        } else {
          drag(x, y, i)
          return
        }
      }
    }
    //创建矩形框
    old[old.length] = Array.of(x, y)
    //判断上一个数据长度，等于2，则删除
    if (old.length >= 2) {
      if (old[old.length - 2].length == 2) {
        old.splice(old.length - 2, 1)
      }
    }
    createBox(x, y)
  }
  //拖拽矩形框
  function drag(x, y, i) {
    var index = i
    canvas1.onmousemove = function (ev) {
      var e = ev || event
      var ax = e.offsetX
      var ay = e.offsetY
      // 计算移动距离
      var xDistance = ax - x
      var yDistance = ay - y
      // 取开始点和结束点的最小值
      var xStart = old[i][2] + xDistance
      var yStart = old[i][3] + yDistance
      if (xStart <= 0 || xStart + old[i][4] >= cw || yStart <= 0 || yStart + old[i][5] >= ch) {
        if (xStart <= 0) {
          xStart = 0
          dragReturnOld(xStart, yStart, index)
        }
        if (xStart + old[i][4] >= cw) {
          xStart = cw - old[i][4]
          dragReturnOld(xStart, yStart, index)
        }
        if (yStart <= 0) {
          yStart = 0
          dragReturnOld(xStart, yStart, index)
        }
        if (yStart + old[i][5] >= ch) {
          yStart = ch - old[i][5]
          dragReturnOld(xStart, yStart, index)
        }
      } else {
        dragReturnOld(xStart, yStart, index)
      }
      canvas1.onmouseup = function () {
        old[i][2] = xStart
        old[i][3] = yStart
        canvas1.onmousemove = null
        canvas1.onmouseup = null
        canvas1.onmouseout = null
        $(document).unbind('mousemove')
        $(document).unbind('mouseup')
        labelText(xStart, yStart, imgData[imgData.length - 1] + i + 1)
      }

      var xStartOld = old[i][2]
      var yStartOld = old[i][3]
      canvas1.onmouseout = function () {
        $(document).mousemove(function (e) {
          var docX = e.pageX
          var docY = e.pageY
          var offsetCanvas = $('canvas').offset()
          //点击矩形框的位置距离矩形框顶部的距离
          var yD = y - yStartOld
          //点击矩形框的位置距离矩形框左侧的距离
          var xD = x - xStartOld
        })
        $(document).mouseup(function () {
          old[i][2] = xStart
          old[i][3] = yStart
          labelText(xStart, yStart, imgData[imgData.length - 1] + i + 1)
          canvas1.onmousemove = null
          canvas1.onmouseup = null
          canvas1.onmouseout = null
          $(document).unbind('mousemove')
          $(document).unbind('mouseup')
        })
      }
    }
  }
  //扩展矩形框
  function spreadArea(x, y, index) {
    var xStartSpread = old[index][2]
    var yStartSpread = old[index][3]
    var xDistanceSpread = old[index][4]
    var yDistanceSpread = old[index][5]
    canvas1.onmousemove = function (ev) {
      var e = ev || event
      var ax = e.offsetX
      var ay = e.offsetY
      // 计算矩形框大小
      var xDistance = xDistanceSpread + ax - x
      var yDistance = yDistanceSpread + ay - y
      // 取开始点和结束点的最小值
      var xStart = Math.min(xStartSpread, xStartSpread + xDistance)
      var yStart = Math.min(yStartSpread, yStartSpread + yDistance)
      spreadReturnOld(xStart, yStart, Math.abs(xDistance), Math.abs(yDistance), index)
      old[index][2] = xStart
      old[index][3] = yStart
      old[index][4] = Math.abs(xDistance)
      old[index][5] = Math.abs(yDistance)
      canvas1.onmouseup = function () {
        old[index][2] = xStart
        old[index][3] = yStart
        old[index][4] = Math.abs(xDistance)
        old[index][5] = Math.abs(yDistance)
        labelText(old[index][2], old[index][3], imgData[imgData.length - 1] + index + 1)
        canvas1.onmousemove = null
        canvas1.onmouseup = null
        canvas1.onmouseout = null
        return
      }
      //鼠标移出

      var xStartOld = x
      var yStartOld = y
      canvas1.onmouseout = function (e) {
        $(document).mousemove(function (e) {
          var docX = e.pageX
          var docY = e.pageY
          var offsetCanvas = $('canvas').offset()
          //右
          if (
            docX >= offsetCanvas.left + cw &&
            docY <= offsetCanvas.top + ch &&
            offsetCanvas.top <= docY
          ) {
            xDistance = cw - xStart
            if (old[index][3] <= docY - offsetCanvas.top) {
              yDistance = docY - offsetCanvas.top - yStart
              spreadReturnOld(xStart, yStart, xDistance, yDistance, index)
            } else {
              yStart = docY - offsetCanvas.top
              yDistance = old[index][3] - docY + offsetCanvas.top
              spreadReturnOld(xStart, yStart, xDistance, yDistance, index)
            }
          }
          //上
          if (
            docY <= offsetCanvas.top &&
            docX <= offsetCanvas.left + cw &&
            offsetCanvas.left <= docX
          ) {
            yDistance = yStartSpread
            if (xStartSpread <= docX - offsetCanvas.left) {
              xDistance = docX - offsetCanvas.left - xStart
              spreadReturnOld(xStart, yStart, xDistance, yDistance, index)
            } else {
              xStart = docX - offsetCanvas.left
              xDistance = xStartSpread - docX + offsetCanvas.left
              spreadReturnOld(xStart, yStart, xDistance, yDistance, index)
            }
          }
          //左
          if (
            docX <= offsetCanvas.left &&
            docY <= offsetCanvas.top + ch &&
            offsetCanvas.top <= docY
          ) {
            xDistance = xStartSpread
            if (yStartSpread <= docY - offsetCanvas.top) {
              yDistance = docY - offsetCanvas.top - yStart
              spreadReturnOld(xStart, yStart, xDistance, yDistance, index)
            } else {
              yStart = docY - offsetCanvas.top
              yDistance = yStartSpread - docY + offsetCanvas.top
              spreadReturnOld(xStart, yStart, xDistance, yDistance, index)
            }
          }
          //下
          if (
            docY >= offsetCanvas.top + ch &&
            docX <= offsetCanvas.left + cw &&
            offsetCanvas.left <= docX
          ) {
            yDistance = ch - yStart
            if (xStartSpread <= docX - offsetCanvas.left) {
              xDistance = docX - offsetCanvas.left - xStart
              spreadReturnOld(xStart, yStart, xDistance, yDistance, index)
            } else {
              xStart = docX - offsetCanvas.left
              xDistance = xStartSpread - docX + offsetCanvas.left
              spreadReturnOld(xStart, yStart, xDistance, yDistance, index)
            }
          }
          $(document).mouseup(function () {
            old[index][2] = xStart
            old[index][3] = yStart
            old[index][4] = Math.abs(xDistance)
            old[index][5] = Math.abs(yDistance)
            labelText(old[index][2], old[index][3], imgData[imgData.length - 1] + index + 1)
            canvas1.onmousemove = null
            canvas1.onmouseup = null
            canvas1.onmouseout = null
            $(document).unbind('mousemove')
            $(document).unbind('mouseup')
          })
        })
      }
    }
  }
  //创建矩形框
  function createBox(x, y) {
    canvas1.onmousemove = function (ev) {
      var e = ev || event
      var ax = e.offsetX
      var ay = e.offsetY
      // 取开始点和结束点的最小值
      var xStart = Math.min(x, ax)
      var yStart = Math.min(y, ay)
      // 计算移动距离
      var xDistance = Math.abs(x - ax)
      var yDistance = Math.abs(y - ay)
      CreateReturnOld(xStart, yStart, xDistance, yDistance)
      //鼠标松开
      canvas1.onmouseup = function () {
        //判断创建的大小是否小于5，防止用户误触
        if (xDistance <= 5 || yDistance <= 5) {
          old.pop()
        } else {
          labelText(xStart, yStart, imgData[imgData.length - 1] + old.length)
          progress(imgData[imgData.length - 1] + old.length)
          old[old.length - 1].push(xStart, yStart, xDistance, yDistance)
        }
        canvas1.onmousemove = null
        canvas1.onmouseup = null
        canvas1.onmouseout = null
        return
      }
      //鼠标移出
      var xStartOld = x
      var yStartOld = y
      canvas1.onmouseout = function () {
        $(document).mousemove(function (e) {
          var docX = e.pageX
          var docY = e.pageY
          var offsetCanvas = $('canvas').offset()
          //右
          if (
            docX >= offsetCanvas.left + cw &&
            docY <= offsetCanvas.top + ch &&
            offsetCanvas.top <= docY
          ) {
            xDistance = cw - xStart
            if (yStartOld <= docY - offsetCanvas.top) {
              yStart = yStartOld
              yDistance = docY - offsetCanvas.top - yStartOld
              CreateReturnOld(xStart, yStart, xDistance, yDistance)
            } else {
              yStart = docY - offsetCanvas.top
              yDistance = Math.abs(yStart - yStartOld)
              CreateReturnOld(xStart, yStart, xDistance, yDistance)
            }
          }
          //上
          if (
            docY <= offsetCanvas.top &&
            docX <= offsetCanvas.left + cw &&
            offsetCanvas.left <= docX
          ) {
            yDistance = yStartOld
            if (xStartOld <= docX - offsetCanvas.left) {
              xStart = xStartOld
              xDistance = docX - offsetCanvas.left - xStartOld
              CreateReturnOld(xStart, yStart, xDistance, yDistance)
            } else {
              xStart = docX - offsetCanvas.left
              xDistance = Math.abs(xStart - xStartOld)
              CreateReturnOld(xStart, yStart, xDistance, yDistance)
            }
          }
          //左
          if (
            docX <= offsetCanvas.left &&
            docY <= offsetCanvas.top + ch &&
            offsetCanvas.top <= docY
          ) {
            xDistance = xStartOld
            if (yStartOld <= docY - offsetCanvas.top) {
              yStart = yStartOld
              yDistance = docY - offsetCanvas.top - yStartOld
              CreateReturnOld(xStart, yStart, xDistance, yDistance)
            } else {
              yStart = docY - offsetCanvas.top
              yDistance = Math.abs(yStart - yStartOld)
              CreateReturnOld(xStart, yStart, xDistance, yDistance)
            }
          }
          //下
          if (
            docY >= offsetCanvas.top + ch &&
            docX <= offsetCanvas.left + cw &&
            offsetCanvas.left <= docX
          ) {
            yDistance = ch - yStart
            if (xStartOld <= docX - offsetCanvas.left) {
              xStart = xStartOld
              xDistance = docX - offsetCanvas.left - xStartOld
              CreateReturnOld(xStart, yStart, xDistance, yDistance)
            } else {
              xStart = docX - offsetCanvas.left
              xDistance = Math.abs(xStart - xStartOld)
              CreateReturnOld(xStart, yStart, xDistance, yDistance)
            }
          }
          //右下
          if (docY >= offsetCanvas.top + ch && docX >= offsetCanvas.left + cw) {
            xDistance = cw - xStartOld
            yDistance = ch - yStartOld
            CreateReturnOld(xStart, yStart, xDistance, yDistance)
          }
          //右上
          if (docY <= offsetCanvas.top && docX >= offsetCanvas.left + cw) {
            xStart = xStartOld
            yStart = 0
            xDistance = cw - xStartOld
            yDistance = Math.abs(yStart - yStartOld)
            CreateReturnOld(xStart, yStart, xDistance, yDistance)
          }
          //左上
          if (docY <= offsetCanvas.top && docX <= offsetCanvas.left) {
            xStart = 0
            yStart = 0
            xDistance = xStartOld
            yDistance = yStartOld
            CreateReturnOld(xStart, yStart, xDistance, yDistance)
          }
          //左下
          if (docY >= offsetCanvas.top + ch && docX <= offsetCanvas.left) {
            xStart = 0
            xDistance = xStartOld
            yDistance = ch - yStartOld
            CreateReturnOld(xStart, yStart, xDistance, yDistance)
          }
        })
        $(document).mouseup(function () {
          old[old.length - 1].push(xStart, yStart, xDistance, yDistance)
          labelText(xStart, yStart, imgData[imgData.length - 1] + old.length)
          progress(imgData[imgData.length - 1] + old.length)
          canvas1.onmousemove = null
          canvas1.onmouseup = null
          canvas1.onmouseout = null
          $(document).unbind('mousemove')
          $(document).unbind('mouseup')
        })
      }
      //鼠标重新进入canvas
      canvas1.onmouseover = function () {
        $(document).unbind('mousemove')
        $(document).unbind('mouseup')
      }
    }
    canvas1.onmouseup = function () {
      canvas1.onmousemove = null
      canvas1.onmouseup = null
      canvas1.onmouseout = null
    }
  }
})

//回退上一步
//创建矩形框
function CreateReturnLast() {
  //清除图层
  ctx1.clearRect(0, 0, cw, ch)
  //还原矩形框
  for (let i = 0; i < old.length; i++) {
    fixSelectImg(old[i][2], old[i][3], old[i][4], old[i][5])
    strokeRoundRect(ctx1, old[i][2], old[i][3], old[i][4], old[i][5], 7, 2, 'rgb(36,199,136)')
    labelText(old[i][2], old[i][3], imgData[imgData.length - 1] + i + 1)
  }
  CreateDrawCover()
}
$('#returnLast').on('click', function () {
  old.splice(old.length - 1, 1)
  ctx.clearRect(0, 0, cw, ch)
  ctx.drawImage(document.getElementById('img'), spreadX / 2, spreadY / 2, imgW, imgH)
  CreateReturnLast()
  $('.progress>div:last-of-type').remove()
  $('.box-canvas').height(ch + $('.progress').height() + 20)
})
//重置
function reset() {
  ctx1.clearRect(0, 0, cw, ch)
  ctx2.clearRect(0, 0, cw, ch)

  ctx1.fillStyle = '#9090900f'
  ctx1.fillRect(0, 0, cw, ch)
  old = []
  fileName = []
  $('.box-canvas').height(ch)
  $('.progress').empty()
  $('canvas').css('top', 0)
}
$('#reset').on('click', function () {
  reset()
})

//设置图像名字
var fileName = []
//下载截取的图像,picType 图片要保存的图片类型,picName 图片想要保存的名字
async function downDom(Dom, picType, picName, downDomH) {
  picName = picName || '下载'
  // 像素比，清晰度
  var opts = {
    pixelRatio,
    logging: true
  }
  let scrollTop = $(document).scrollTop()
  let scrollLeft = $(document).scrollLeft()
  window.scroll(0, 0)
  // 调用html2canvas插件
  await html2canvas(Dom, opts).then(function (Dom) {
    var context = Dom.getContext('2d')
    // 【重要】关闭抗锯齿
    context.mozImageSmoothingEnabled = false
    context.webkitImageSmoothingEnabled = false
    context.msImageSmoothingEnabled = false
    context.imageSmoothingEnabled = false
    Canvas2Image.saveAsImage(Dom, cw, downDomH, picType, picName)
  })
  await new Promise(() => {
    window.scroll(0, 0)
  })
}
</script>

<style lang="scss" scoped>
.box {
  display: flex;
}
/* canvas */
.box-canvas {
  position: relative;
  top: 40px;
}
canvas {
  position: absolute;
  /* background: #9090900f; */
  image-rendering: crisp-edges;
}
#canvas {
  -webkit-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  margin: auto;
  z-index: 0;
}
#canvas1 {
  z-index: 2;
}
#canvas2 {
  z-index: 1;
}
.box-canvas-cursor {
  cursor: se-resize !important;
}
.box-canvas-default {
  cursor: default !important;
}
.progress {
  position: absolute;
  width: 850px;
  color: #716f6f;
  font-weight: 700;
}
.progress input {
  color: #8b8888;
  font-weight: 600;
  vertical-align: middle;
  font-size: 15px;
  border: 1px solid #c7c5c5;
  border-radius: 6px;
  height: 28px;
}
.progress div {
  margin: 5px 0;
  font-size: 14px;
  margin-left: 10px;
}
.progress div span:nth-of-type(2) {
  text-align: center;
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  background: rgb(36, 199, 136);
  border-radius: 100px;
  color: #fff;
  vertical-align: middle;
  margin: 0 5px;
}

/*  tab*/
.tab {
  display: flex;
  width: 100%;
  height: 35px;
  background: #a99696;
  justify-items: center;
  margin-bottom: 40px;
}
.tab > div {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  color: white;
}
.tab > div:nth-of-type(2) {
  border: 0;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}
.tab > div > p {
  cursor: default;
  padding: 0;
  margin: 0;
  font-weight: 600;
}
.tab-active {
  background-color: #e8e8e8;
  color: black !important;
}
.tab-others {
  display: none !important;
}
/* file-box */
.img-type > input {
  border-radius: 6px 0 0 6px !important;
}
.img-type > span,
.img-type > input {
  vertical-align: super;
}
.file {
  position: relative;
  display: inline-block;
  padding: 2px 12px;
  padding-bottom: 3px;
  overflow: hidden;
  text-decoration: none;
  text-indent: 0;
  top: 3px;
  left: -5px;
  border-radius: 0 6px 6px 0;
  border: 1px solid #4a4747;
  color: white;
  background: #75d064;
}

.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
  width: 100%;
}
.img-scale-box,
.img-scale-box > div {
  margin-top: 10px;
}
.img-scale-box span {
  width: 38px;
  height: 100%;
  margin-left: 15px;
}
/* .img-scale-box {
        text-align: left;
        margin-left: 50px;
      } */
.confirm {
  margin-left: 91px;
}
/* change-step-box */
#returnLast {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  margin-right: 15px;
  padding: 5px 12px;
  margin-left: 14px;
}
#reset {
  color: #fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
}
.confirm {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
.change-step {
  color: #fff;
  background-color: #49d14f;
  border-color: #49d14f;
  vertical-align: middle;
}
.change-step {
  margin: 0 10px;
}
/* save-box */
.save-clipboard-box {
  margin-left: 110px;
}
.save-clipboard-box button {
  padding: 5px 12px;
}

#save {
  background-color: #409eff;
  border-color: #409eff;
  color: white;
}
.save-clipboard {
  color: #fff;
  background: #75d064;
}
.file-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 50px;
}
.change-step-box,
.save-box {
  text-align: center;
}
/* defalut */
button {
  padding: 5px 20px;
  border-radius: 5px;
  border: 0px;
  color: #5f5f5f;
  margin: 20px 0px;
  font-size: 16px;
  font-weight: 700;
  vertical-align: sub;
}

button:hover,
#save:hover,
#reset:hover,
#returnLast:hover,
.file:hover {
  background: #c3c5c7;
  text-decoration: none;
}
/* tool */
.tool {
  width: 420px;
  margin-top: 40px;
  margin-left: 60px;
}
.tool span {
  background: #5f5f5f;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.tool input {
  border: 1px solid #c7c5c5;
  border-radius: 6px;
  height: 24px;
}

.tool-introduce {
  color: #409eff;
  position: absolute;
}
.img-demo {
  margin-top: 40px;
}
</style>
