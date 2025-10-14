<template>
  <div style="height: 100%; width: 100%" class="wrap">
    <div style="display: flex; justify-content: center" v-if="props.loading">
      <img class="rotate" src="@/assets/icon-svg/loading.svg" alt="" />
    </div>
    <div class="wrap" v-else>
      <img
        style="width: 50%; object-fit: contain; margin-left: 10px"
        src="@/assets/img/data_empty.png"
        alt=""
      />
      <div class="no-data">{{ props.title ? props.title : '暂无数据' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
const props = defineProps({
  title: String,
  loading: Boolean
});
console.log(props);
</script>

<style scoped>
.data-empty {
  min-width: none;
}
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .no-data {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(34, 34, 34, 0.55);
    line-height: 14px;
    margin-top: 20px;
  }
}
.rotate {
  animation: rotate-ani 2s linear infinite;
  width: 50%;
  object-fit: contain;
}
@keyframes rotate-ani {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
