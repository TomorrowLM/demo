<template>
  <div class="emptyComponent">
    <div class="emptyComponent-img">
      <img class="set-img" :src="emptyInfo.imgSrc" />
    </div>

    <div class="emptyComponent-remark">{{ emptyInfo.title }}</div>

    <el-button v-if="!!emptyInfo.btnName" type="primary" @click="toBack()">{{
      emptyInfo.btnName
    }}</el-button>
  </div>
</template>

<script setup lang="ts" name="EmptyComponent">
import { PropType } from 'vue';
defineProps({
  emptyInfo: {
    type: Object as PropType<{ [key: string]: any }>,
    default: () => ({})
  }
});
// emptyInfo参数
// {
//  imgSrc 图片路径
//  title 空状态名称
//  btnName 按钮名称
// }
const emit = defineEmits(['toBack']);

// 返回操作
const toBack = () => {
  emit('toBack');
};
</script>

<style lang="scss" scoped>
.emptyComponent {
  text-align: center;
  &-img {
    margin: 0 auto;
    margin-top: 167px;
    width: 271px;
    height: 270px;
  }
  &-remark {
    margin: 38px 0 20px 0;
    font-size: 14px;
    color: rgba(34, 34, 34, 0.55);
  }
  .set-img {
    height: 270px;
  }
}
</style>
