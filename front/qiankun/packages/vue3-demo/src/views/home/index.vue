<template>
  <div class="content d-center">312
    <div class="box d-center m-12" @click="jump(0)" date-hover="vue-grammar">vue-grammar</div>
    <div class="box d-center m-12" @click="jump(1)" date-hover="3D">3D</div>
    <div class="box d-center m-12" @click="jump(2)" date-hover="editor">editor</div>
    <div class="box d-center m-12" @click="jump(3)" date-hover="media">media</div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const jump = (e) => {
  if (e === 0) {
    router.push('/vue-grammar')
  } else if (e === 1) {
    router.push('/3D')
  } else if (e === 2) {
    router.push('/editor')
  } else if (e === 3) {
    router.push('/media')
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: calc(100% - 48px);
  width: 100%;
  .box {
    width: 10%;
    height: 10%;
    background-color: $box-bg;
    color: $text;
    font-size: 24px;
    @extend .point;
    // background-color: #2195de;
    padding: 0 25px;
    position: relative;
    transform-origin: top;
    transition: all 1s;
    /*span是span::after的父元素，span::after默认是2D来展示*/
    transform-style: preserve-3d;
    box-shadow: 1px 1px 10px rgba(219, 211, 138, 0.5);
    &::after {
      content: attr(date-hover); /*attribute 自定义属性*/
      position: absolute;
      top: 100%;
      left: 0;
      // background-color: #0965a0;
      box-shadow: 1px 1px 10px rgba(219, 211, 138, 0.5);
      width: 100%;
      height: 100%;
      transform: rotateX(-90deg);
      transform-origin: top;
      @extend .d-center;
    }
    &:hover {
      transform: rotateX(90deg) translateY(-50px);
    }
  }
  @media (max-width: 765px) {
    display: flex;
    // justify-content: center;
    // align-items: center;
    flex-direction: column;
    .box {
      width: 100%;
      height: 100px;
      background-color: $box-bg;
      color: $text;
    }
  }
}
</style>
