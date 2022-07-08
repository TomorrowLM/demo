<template>
  <div class="learn">
    <div class="learn_header">
      <hello-world></hello-world>
      <el-button class="tool_btn" @click="drawer = true" type="primary"> 功能 </el-button>
      <el-drawer direction="ltr" title="我是标题" :visible.sync="drawer" :with-header="false">
        <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>实战</span>
            </template>
            <el-menu-item index="1-4-1">
              <router-link :to="{ name: 'jumpApp' }">跳转app</router-link>
            </el-menu-item>
            <el-menu-item index="1-4-1">
              <router-link :to="{ name: 'eCharts' }">跳转app</router-link>
            </el-menu-item>
            <!-- <el-menu-item index="1-3">选项3</el-menu-item> -->
          </el-submenu>
          <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
          </el-menu-item>
        </el-menu>
      </el-drawer>
    </div>
    <div class="learn_body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import HelloWorld from '@/components/global/HelloWorld.vue';
  export default {
    components: { HelloWorld },
    data() {
      return { drawer: false };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .learn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .learn_header {
    height: 10%;
  }
  .learn_body {
    height: 90%;
  }
  .tool_btn {
    display: flex;
    justify-content: center;
    margin: auto;
  }
  .el-button {
    display: flex;
    justify-content: center;
    margin: auto;
  }
  .el-drawer__open .el-drawer.ltr {
    width: 40% !important;
  }
  .el-submenu__title {
    padding-left: 20px;
    text-align: left;
  }
  .el-menu-item {
    padding-left: 20px;
    text-align: left;
  }
  .el-menu-item-group__title {
    text-align: left;
  }
</style>
