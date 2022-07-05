<template>
  <div>
    <Header @child-msg="get" :collapsed="collapsedHeader" />
    <a-layout id="components-layout-demo-custom-trigger">
      <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
        <div class="project-name">物流智能管控应用</div>
        <a-menu
          theme="dark"
          :open-keys.sync="openKeys"
          :default-selected-keys="['1']"
          @click="handleClick"
          mode="inline"
        >
          <a-sub-menu key="sub1" @titleClick="titleClick">
            <span slot="title"
              ><a-icon type="user" /><span></span> 运输任务管理</span
            >
            <a-menu-item key="1">
              <router-link :to="{ name: 'PickupTask' }"
                >接车任务管理</router-link
              >
            </a-menu-item>
            <a-menu-item key="2"> 卸车任务管理 </a-menu-item>
            <a-menu-item key="3"> 装车任务管理 </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title"
              ><a-icon type="user" /><span></span> 调车管理</span
            >
            <a-menu-item key="4"> 编制调车计划 </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <span slot="title"
              ><a-icon type="user" /><span></span> 进出厂管理</span
            >
            <a-menu-item key="5"> 进出厂车皮信息 </a-menu-item>
            <a-menu-item key="6"> 进出厂车皮计量 </a-menu-item>
            <a-menu-item key="7"> 厂内现车信息 </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub4">
            <span slot="title"
              ><a-icon type="user" /><span></span> 列货检查管理</span
            >
            <a-menu-item key="8"> 列货检信息管理 </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <!-- <a-layout-header style="background: #fff; padding: 0">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />
        </a-layout-header> -->
        <a-layout-content
          :style="{
            margin: '24px 16px',
            padding: '24px',
            background: '#fff',
            minHeight: '280px',
          }"
        >
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
<script lang="ts">
// import Component from 'vue-class-component'
import { Vue, Component, Watch } from "vue-property-decorator";
import { ref } from "vue";
import Header from "components/Header.vue";
@Component({
  components: {
    Header,
  },
})
export default class HomeView extends Vue {
  collapsed = false;
  collapsedHeader = false;
  openKeys = ["sub1"];
  // computed
  get(msg: boolean) {
    // console.log(msg)
    this.collapsed = msg;
  }

  // watch
  @Watch("openKeys", { immediate: true })
  onOpenKeysChanged(val: string, oldVal: string) {
    console.log(val, oldVal, 123);
  }

  handleClick(e: any) {
    // this.openKeys = ['sub1', 'sub2']
    console.log("click", e);
  }

  titleClick(e: any) {
    console.log("titleClick", e);
  }
}
</script>
<style>
.project-name {
  font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 16px;
  color: #d7d7d7;
  text-align: center;
  line-height: 24px;
}
#components-layout-demo-custom-trigger {
  height: 100vh;
}
</style>
