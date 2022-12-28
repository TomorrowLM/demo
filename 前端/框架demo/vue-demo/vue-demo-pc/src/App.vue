<template>
  <div id="app" :class="{ 'has-sidebar': $route.meta.sidebar, 'is-collapsed': isCollapse }">
    <el-container>
      <el-header v-if="!fullScreenStatus">
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside width="220px" style="background: #20243b" v-if="!fullScreenStatus">
          <Sidebar :collapse.sync="isCollapse"></Sidebar>
        </el-aside>
        <div :style="{ width: fullScreenStatus ? '100%' : 'calc(100% - 220px)' }">
          <TagNav v-if="!fullScreenStatus"></TagNav>
          <el-main v-bind:style="{ padding: padding, height: fullScreenStatus ? '100%' : 'calc(100vh - 92px)' }">
            <div
              class="contentContainer"
              :class="{ h100: ['/carTerminal', '/', '/work/rolling'].includes($route.path) }"
            >
              <router-view></router-view>
            </div>
          </el-main>
        </div>
      </el-container>
    </el-container>
    <p class="primary">123</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Sidebar from '@/components/App/Sidebar.vue';
import Header from '@/components/App/Header.vue';
import TagNav from '@/components/App/TagNav.vue';
// import ws from '@/utils/websocket';

@Component({
  components: { Sidebar, Header, TagNav },
})
export default class Layout extends Vue {
  private name = 'Layout';
  private isCollapse = false;
  private ws: any = null;
  padding = '20px';

  async created() {
    console.log(process.env.NODE_ENV, 'process.env.NODE_ENV', moment(), pageSize);
    this.$nextTick(() => {
      // ws.initWebsocket();
    });
  }

  mounted() {
    // //给应用的顶层元素添加一个主题标识，用于标识当前的主题
    // document .getElementsByTagName("body")[0].setAttribute("data-theme", "light");
    // js 通过声明sass变量的key值，来找到对应变量，并修改其属性值
    (document.querySelector(':root') as any).style.setProperty('--theme-text', 'dark');
  }

  get fullScreenStatus() {
    return this.$store.state.fullscreenStatus;
  }
}
</script>


<style lang="scss">
:root {
  // --theme-text: blue;
}
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
}
.el-header {
  box-shadow: 1px 1px 5px #ccc;
}
.el-main {
  height: calc(100vh - 92px);
  overflow-y: auto;
}

.h100 {
  height: 100%;
}
</style>
