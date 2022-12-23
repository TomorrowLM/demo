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
  padding = [
    '#/message/rolling',
    '#/message/slabManage',
    '#/',
    '#/carTerminal',
    '#/work/busManage-one',
    '#/work/busManage-two',
  ].includes(window.location.hash)
    ? '0'
    : '20px';
  // private menuData: Array<object>=[];

  async created() {
    console.log(process.env.NODE_ENV, 'process.env.NODE_ENV', moment(), pageSize);
    // try{
    //   const {
    //     data,
    //     message,
    //     code
    //   } = await fetchMenuList();
    //   console.log(data)
    // }catch(error){
    //   this.$message.error('菜单获取数据失败！');
    // }
    this.$nextTick(() => {
      // ws.initWebsocket();
    });
  }

  get fullScreenStatus() {
    return this.$store.state.fullscreenStatus;
  }
}
</script>
<style lang="scss">
.my_toast {
  position: fixed;
  top: 160px;
  right: 27px;
  display: flex;
  z-index: 999;
  height: 36px;
  // min-width: 100px;
  align-items: center;
  border: 1px solid #f60;
  padding: 0 16px;
  border-radius: 4px;
  background: #fff;
  font-size: 14px;
  color: rgba(34, 34, 34, 0.75);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  // transition: opacity .3s,transform .4s,top .4s;

  .mu_toast_warpper_icon {
    margin-right: 10px;

    &.el-icon-success {
      color: #52c41a;
    }

    &.el-icon-error {
      color: #f33;
    }
  }
}
</style>

<style lang="scss" scoped>
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
