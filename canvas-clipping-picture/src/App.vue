<template>
    <div class="page">
        <div class="operate-btn">
            <a-button @click="handleBtnClick">{{screenshot?"就决定是你了":"开始截图"}}</a-button>
        </div>
        <div class="clip-area">
            <canvas
                    v-show="screenshot"
                    class="clip-canvas"
                    @mousedown="handleDrawStart"
                    @mouseup="handleMouseUp"></canvas>
            <img class="big-img" :style="bigImgStyle" src="./assets/duola.jpg" alt="小图">
            <div class="draw-area" :style="drawAreaStyle" v-show="!screenshot"></div>
        </div>
        <div class="thumb">
            <p style="text-align: center">截图预览</p>
            <img class="thumb-img" :src="clipBase64" v-show="clipBase64" alt="大图">
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                // 是否开始截取图片
                screenshot: false,
                // canvas实例
                canvasElement: null,
                canvasContext: null,
                // 图片实例
                bigImgEle: null,
                // canvas的尺寸
                canvasWidth: 0,
                canvasHeight: 0,
                // 原图的尺寸
                imgOriginalWidth: 0,
                imgOriginalHeight: 0,
                // 图片显示的大小
                imgDisplayWidth: 0,
                imgDisplayHeight: 0,
                // 图片与canvas的偏移量
                imgOffset: {
                    x: 0,
                    y: 0,
                },
                // 绘制矩形的两点
                points: {
                    start: [],
                    end: [],
                },
                clipBase64: "",
            };
        },
        computed: {
            bigImgStyle() {
                return {
                    display: this.imgDisplayWidth ? "block" : "none",
                    width: this.imgDisplayWidth + "px",
                    height: this.imgDisplayHeight + "px",
                };
            },
            drawAreaStyle() {
                return {
                    top: this.formatPointPosition.yStart + "px",
                    left: this.formatPointPosition.xStart + "px",
                    width: this.formatPointPosition.xDistance + "px",
                    height: this.formatPointPosition.yDistance + "px",
                };
            },
            formatPointPosition() {
                // 取开始点和结束点的最小值
                let [x, y] = this.points.start;
                let [x1, y1] = this.points.end;
                let xStart = Math.min(x, x1);
                let yStart = Math.min(y, y1);
                // 计算移动距离
                let xDistance = Math.abs(x - x1);
                let yDistance = Math.abs(y - y1);
                return {
                    yDistance,
                    xDistance,
                    yStart,
                    xStart,
                };
            },
        },
        mounted() {
            this.getDomELe();
            // 监听图片的加载
            this.bigImgEle = document.querySelector(".big-img");
            this.bigImgEle.onload = () => {
                this.getAreaSize();
                this.getImgSize();
                this.setImgContain();
            };
        },
        methods: {
            handleBtnClick() {
                this.screenshot = !this.screenshot;
                if (!this.screenshot && this.formatPointPosition.xDistance && this.formatPointPosition.yDistance) {
                    this.exportBase64();
                }
            },
            exportBase64() {
                // 图片缩放比例
                let scale = this.imgDisplayWidth / this.imgOriginalWidth;
                // 创建一个新的canvas
                let canvasElement = document.createElement("canvas");
                let canvasContext = canvasElement.getContext("2d");
                // 计算框选区域相对于图片的定位
                let startX = (this.formatPointPosition.xStart - this.imgOffset.x) / scale;
                let startY = (this.formatPointPosition.yStart - this.imgOffset.y) / scale;
                canvasElement.width = this.formatPointPosition.xDistance / scale;
                canvasElement.height = this.formatPointPosition.yDistance / scale;
                // 框选区域绘制到canvas里
                canvasContext.drawImage(this.bigImgEle,
                    startX, startY, canvasElement.width, canvasElement.height,
                    0, 0, canvasElement.width, canvasElement.height);
                // 转为base64进行显示
                this.clipBase64 = canvasElement.toDataURL("image/jpeg");
            },
            // 根据开始和结束点来绘制矩形
            drawRect() {
                let {
                    yStart,
                    yDistance,
                    xDistance,
                    xStart,
                } = this.formatPointPosition;
                // 清空画布
                this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                // 开始绘制
                this.canvasContext.strokeRect(xStart, yStart, xDistance, yDistance);
            },
            handleMouseUp() {
                document.removeEventListener("mousemove", this.handleDrawMove);
            },
            // 记录移动的点位
            handleDrawMove(e) {
                this.points.end = this.getRelativePosition(e);
                this.drawRect();
            },
            // 记录在canvas里的开始点-清空画布-监听鼠标移动
            handleDrawStart(e) {
                this.points.start = this.getRelativePosition(e);
                document.addEventListener("mousemove", this.handleDrawMove);
            },
            getRelativePosition(e) {
                let clientRect = this.canvasElement.getBoundingClientRect();
                // 这里必须取整数
                let x = Math.round(e.clientX - clientRect.x);
                let y = Math.round(e.clientY - clientRect.y);
                return [x, y];
            },
            // 获取Dom元素
            getDomELe() {
                this.canvasElement = document.querySelector(".clip-canvas");
                this.bigImgEle = document.querySelector(".big-img");
                this.canvasContext = this.canvasElement.getContext("2d");
            },
            // 获取canvas绘制的尺寸，与外层div大小一致
            getAreaSize() {
                let areaEle = document.querySelector(".clip-area");
                this.canvasElement.width = this.canvasWidth = areaEle.offsetWidth;
                this.canvasElement.height = this.canvasHeight = areaEle.offsetHeight;
                this.canvasContext.strokeStyle = "#ff0000";
                this.canvasContext.lineWidth = 1;
            },
            // 获取原图展示的尺寸
            getImgSize() {
                this.imgOriginalWidth = this.bigImgEle.width;
                this.imgOriginalHeight = this.bigImgEle.height;
            },
            // 将图片尽可能地填满该区域
            setImgContain() {
                // 宽高比例
                let ratio = this.imgOriginalWidth / this.imgOriginalHeight;
                // 如果图片宽小于高，则以容器高为准，按比例还原宽度
                if (this.imgOriginalWidth < this.imgOriginalHeight) {
                    this.imgDisplayHeight = this.canvasHeight;
                    this.imgDisplayWidth = ratio * this.imgDisplayHeight;
                    this.imgOffset = {
                        x: (this.canvasWidth - this.imgDisplayWidth) / 2,
                        y: 0,
                    };
                } else {
                    this.imgDisplayWidth = this.canvasWidth;
                    this.imgDisplayHeight = this.imgDisplayWidth / ratio;
                    this.imgOffset = {
                        x: 0,
                        y: (this.canvasHeight - this.imgDisplayHeight) / 2,
                    };
                }
            },
        },
    };
</script>
<style>
    html, body {
        overflow: hidden;
    }

    .clip-area {
        position: relative;
        overflow: hidden;
        width: 500px;
        height: 500px;
        margin: 10px auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .operate-btn {
        margin-top: 10px;
        text-align: center;
    }

    .clip-canvas {
        position: absolute;
        top: 0;
        bottom: 0;
        cursor: crosshair;
    }

    .draw-area {
        border: 2px solid #ff0000;
        position: absolute;
        z-index: 10;
    }

    .big-img {
    }

    .thumb-img {
        height: 300px;
        display: block;
        margin: 10px auto;
        border: 1px solid red;
    }
</style>
