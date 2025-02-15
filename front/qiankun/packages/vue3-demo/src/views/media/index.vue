<template>
  <div class="medio">
    <div class="video-list-box">
      <div class="header">
        <i class="btn el-icon-refresh"> 刷新</i>
      </div>
      <div class="video-list"></div>
    </div>
    <div class="video-content"></div>

    <video style="height: 100px" src="https://www.w3school.com.cn/i/movie.mp4" controls></video>
    <video
      style="height: 100px"
      src="https://media.w3.org/2010/05/sintel/trailer.mp4"
      controls
    ></video>
  </div>
</template>

<script lang="ts" setup>
import Hls from 'hls.js'
// import { treeList } from '@/api/Media';
const state = reactive({
  data: [
    {
      url: 'http://devimages.apple.com/iphone/samples/bipbop/gear3/prog_index.m3u8'
    },
    {
      url: 'http://kbs-dokdo.gscdn.com/dokdo_300/_definst_/dokdo_300.stream/playlist.m3u8'
    },
    {
      url: 'http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8'
    },
    {
      // url: 'http://kbs-dokdo.gscdn.com/dokdo_300/definst/dokdo_300.stream/playlist.m3u8'
    }
  ],
  defaultProps: {
    children: 'childList',
    label: 'name'
  },
  clickNumber: 0,
  videoInstance: []
})
const { data, videoInstance, clickNumber } = toRefs(state)

/**
 * 初始化视频控件
 */
const initVideoComponent = () => {
  var medio = document.querySelector('.medio .video-content')
  for (let i = 0; i < 4; i++) {
    const videoItem = document.createElement('div')
    videoItem.classList.add('video-item')

    //视频
    const video = document.createElement('video')
    video.muted = 'muted'
    videoItem.appendChild(video)

    //遮罩层
    // const videoFront = document.createElement("div");
    // videoFront.classList.add("video-front");
    // videoItem.appendChild(videoFront);

    //工具栏
    const toolBar = document.createElement('div')
    toolBar.classList.add('video-toolbar')

    //加载图标
    const loadingBtn = document.createElement('i')
    loadingBtn.classList.add('video-loading', 'el-icon-loading')
    toolBar.appendChild(loadingBtn)

    //全屏按钮
    const fullscreenBtn = document.createElement('div')
    fullscreenBtn.classList.add('btn', 'el-icon-full-screen')
    toolBar.appendChild(fullscreenBtn)

    fullscreenBtn.addEventListener('click', function () {
      video.requestFullscreen()
    })

    videoItem.appendChild(toolBar)

    medio?.appendChild(videoItem)

    //保存实例信息
    videoInstance.value.push({
      video
    })
  }
}
const initVideo = () => {
  data.value.forEach((item, index) => {
    loadVideo(index, item.url)
  })
}
/**
 * 加载视频
 */
const loadVideo = (index, url) => {
  //如果视频已存在，则不再渲染
  // const old = videoInstance.value.find((item) => item.url === url)
  // if (old) {
  //   return
  // }

  destoryVideo(index)

  const nodes = document.querySelectorAll('.video-item')
  const item = nodes.item(index)
  item.classList.add('loading')

  const video = videoInstance.value[index].video
  let info = { url, video }

  //挂载Video DOM

  if (Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    })
    //加载资源
    hls.loadSource(url)
    //挂载媒体到视频标签
    hls.attachMedia(video)

    //监听资源加载成功、开始播放
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      item.classList.remove('loading')
      video.play()
    })
    //视频流错误
    hls.on(Hls.Events.ERROR, function (event, data) {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.error('fatal network error encountered, try to recover')
            hls.startLoad()
            break
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.error('fatal media error encountered, try to recover')
            hls.recoverMediaError()
            break
          default:
            hls.destroy()
            break
        }
      }
    })

    info['hls'] = hls
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url
    video.addEventListener('loadedmetadata', function () {
      item.classList.remove('loading')
      video.play()
    })
  }

  clickNumber.value += 1
  videoInstance.value[index] = info
  return true
}
/**
 * 销毁视频
 */
const destoryVideo = (index) => {
  const item = videoInstance.value[index]
  item.video.pause()
  if (item.hls) {
    item.hls.destroy()
  }
}

onMounted(() => {
  //初始化视频
  initVideoComponent()
  initVideo()
})
</script>
<style lang="scss" scoped>
.medio {
  width: 100%;
  height: 100%;
  @extend .flex-row;
  // justify-content: space-between;
  .video-list-box {
    min-width: 200px;
    height: 100%;
    border-right: 1px solid #dcdfe6;
    @extend .flex-column;

    .header {
      @extend .flex-row;
      justify-content: flex-end;
      border-bottom: 1px solid #dcdfe6;

      .btn {
        font-size: 16px;
        padding: 10px 10px;
        box-sizing: border-box;
        color: #555555;
        cursor: pointer;
      }
    }

    ::v-deep {
      .el-tree-node {
        .el-tree-node__content {
          .el-tree-node__label {
            font-size: 16px;
          }
        }
      }
    }
  }
  .video-content {
    flex-grow: 1;
    height: 100%;
    display: flex;
    // @extend .flex-row-wrap;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-content: space-evenly;

    ::v-deep {
      .video-item {
        width: 48%;
        height: 40%;
        position: relative;
        // @extend .flex-column;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: #282c34;

        &:hover {
          .video-toolbar {
            display: flex;
          }
        }
        &.loading {
          .btn {
            display: none;
          }
          .video-toolbar {
            display: flex;
            .video-loading {
              display: inline-block;
            }
          }
        }

        .video-front {
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: 2;
          background-color: rgba($color: #282c34, $alpha: 0.5);
        }

        .video-toolbar {
          display: none;
          width: 100%;
          height: 45px;
          padding: 0 20px;
          box-sizing: border-box;
          @extend .flex-row;
          justify-content: flex-end;
          align-items: center;
          position: absolute;
          z-index: 3;
          bottom: 0;
          background-color: rgba($color: #282c34, $alpha: 0.5);
          .btn {
            font-size: 18px;
            color: #ffffff;
          }

          .video-loading {
            display: none;
            width: 1em;
            font-size: 1.5em;
            color: #ffffff;
          }
        }
        video {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
