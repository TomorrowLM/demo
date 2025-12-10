<template>
  <div class="medio">
    <div class="video-list-box">
      <div class="header">
        <i class="btn el-icon-refresh" @click="queryTreeList"> 刷新</i>
      </div>
      <el-tree
        class="video-list"
        highlight-current
        :data="data"
        :props="defaultProps"
        @node-click="handleNodeClick"
      ></el-tree>
    </div>

    <div class="video-content"></div>
  </div>
</template>

<script>
import Hls from "hls.js";
import { treeList } from "@/api/Media";
export default {
  data() {
    return {
      data: [],
      defaultProps: {
        children: "childList",
        label: "name",
      },
      clickNumber: 0,
      videoInstance: [],
    };
  },
  methods: {
    handleNodeClick(data) {
      if (this.clickNumber > 8) {
        this.clickNumber -= 4;
      }
      this.loadVideo(this.clickNumber % 4, data.address);
    },
    /**
     * 初始化视频控件
     */
    initVideoComponent() {
      var medio = document.querySelector(".medio .video-content");
      for (let i = 0; i < 4; i++) {
        const videoItem = document.createElement("div");
        videoItem.classList.add("video-item");

        //视频
        const video = document.createElement("video");
        video.muted = "muted";
        videoItem.appendChild(video);

        //遮罩层
        // const videoFront = document.createElement("div");
        // videoFront.classList.add("video-front");
        // videoItem.appendChild(videoFront);

        //工具栏
        const toolBar = document.createElement("div");
        toolBar.classList.add("video-toolbar");

        //加载图标
        const loadingBtn = document.createElement("i");
        loadingBtn.classList.add("video-loading", "el-icon-loading");
        toolBar.appendChild(loadingBtn);

        //全屏按钮
        const fullscreenBtn = document.createElement("div");
        fullscreenBtn.classList.add("btn", "el-icon-full-screen");
        toolBar.appendChild(fullscreenBtn);

        fullscreenBtn.addEventListener("click", function () {
          video.requestFullscreen();
        });

        videoItem.appendChild(toolBar);

        medio.appendChild(videoItem);

        //保存实例信息
        this.videoInstance.push({
          video,
        });
      }
    },
    initVideo() {
      let initLength = 4;
      const each = (list) => {
        list.forEach((item) => {
          //初始化只获取前4个
          if (initLength < 1) {
            return;
          }

          if (!item.childList.length) {
            const result = this.loadVideo(4 - initLength, item.address);
            if (result) {
              initLength -= 1;
            }
          } else {
            each(item.childList);
          }
        });
      };
      this.data.forEach((item) => {
        each(item.childList);
      });
    },
    /**
     * 加载视频
     */
    loadVideo(index, url) {
      //如果视频已存在，则不再渲染
      const old = this.videoInstance.find((item) => item.url === url);
      if (old) {
        return;
      }

      this.destoryVideo(index);

      const nodes = document.querySelectorAll(".video-item");
      const item = nodes.item(index);
      item.classList.add("loading");

      const video = this.videoInstance[index].video;
      let info = { url, video };

      //挂载Video DOM

      if (Hls.isSupported()) {
        var hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });
        //加载资源
        hls.loadSource(url);
        //挂载媒体到视频标签
        hls.attachMedia(video);

        //监听资源加载成功、开始播放
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          item.classList.remove("loading");
          video.play();
        });
        //视频流错误
        hls.on(Hls.Events.ERROR, function (event, data) {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error(
                  "fatal network error encountered, try to recover"
                );
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error("fatal media error encountered, try to recover");
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          }
        });

        info["hls"] = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        video.addEventListener("loadedmetadata", function () {
          item.classList.remove("loading");
          video.play();
        });
      }

      this.clickNumber += 1;
      this.videoInstance[index] = info;
      return true;
    },
    /**
     * 销毁视频
     */
    destoryVideo(index) {
      const item = this.videoInstance[index];
      item.video.pause();
      if (item.hls) {
        item.hls.destroy();
      }
    },

    queryTreeList() {
      return treeList().then((res) => {
        this.data = res.data || [];
      });
    },
  },
  mounted() {
    this.queryTreeList().finally(() => {
      //初始化视频
      this.initVideoComponent();
      this.initVideo();
    });
  },
};
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

    @extend .flex-row-wrap;
    justify-content: space-evenly;
    align-content: space-evenly;

    ::v-deep {
      .video-item {
        width: 48%;
        height: 40%;
        position: relative;
        @extend .flex-column;
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
