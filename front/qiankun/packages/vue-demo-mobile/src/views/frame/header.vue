<template>
  <div class="header-container">
    <i class="el-icon-s-unfold" @click="show = true"></i>
    <el-drawer title="菜单" :visible.sync="show" direction="ltr" size="1.4rem" custom-class="menu">
      <van-sidebar v-model="activeKey">
        <van-sidebar-item title="标签名称" /><van-sidebar-item title="标签名称" /><van-sidebar-item title="标签名称" /><van-sidebar-item title="标签名称" /><van-sidebar-item title="标签名称" /><van-sidebar-item title="标签名称" />
        <van-sidebar-item title="标签名称" />
        <van-sidebar-item title="标签名称" />
      </van-sidebar>
    </el-drawer>
  </div>
</template>

<script>
import service from "@/utils/request";
export default {
  name: "headerCom",
  props: {},
  data() {
    alert(1);
    return {
      activeKey: 0,
      show: false,
      name: "123",
      name11: '123'
    }
  },
  beforeCreate () {
    console.log('beforeCreate', 123)
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.header-container {
  height: 100%;
  display: flex;
  align-items: center;
}

::v-deep(.menu) {

  //height: 3rem;
  .el-drawer__header {
    padding: 0.08rem 0.12rem;
    margin-bottom: 0.08rem;
    font-size: 0.16rem;
    @extend .flex, .flex-center;
  }

  .el-drawer__body {
    padding: 0;

    .van-sidebar {
      width: 100%;
    }
  }
}
</style>
