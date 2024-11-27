<template>
  <div class="menu">
    <van-sidebar v-model="activeKey">
      <van-sidebar-item title="标签名称" />
      <van-sidebar-item title="标签名称" />
      <van-sidebar-item title="标签名称" />
    </van-sidebar>
  </div>
</template>

<script>
import service from "@/utils/request"
export default {
  name: 'menu',
  props: {

  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>


<style lang="scss" scoped></style>
