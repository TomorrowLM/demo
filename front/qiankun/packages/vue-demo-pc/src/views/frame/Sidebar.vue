<template>
  <el-menu
    @select="selectSiderBar"
    router
    :default-active="currentRouteInfo.path"
    class="app-menu"
    background-color="#292C45"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <template v-for="item in routeList">
      <el-menu-item
        v-if="item.meta.sidebar && (!item.children || item.children.length === 0)"
        :key="item.path"
        :index="`/${item.path}`"
      >
        <i class="el-icon-menu"></i>
        <span slot="title">{{ item.meta.menuName }}</span>
      </el-menu-item>
      <el-submenu v-if="item.children && item.children.length !== 0" :key="item.path" :index="item.path">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{ item.meta.menuName }}</span>
        </template>
        <el-menu-item-group v-if="item.children">
          <el-menu-item
            v-for="child in item.children"
            :key="`${item.path}/${child.path}`"
            :index="`/${item.path}/${child.path}`"
          >
            {{ child.meta.menuName }}
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </template>
  </el-menu>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Watch } from 'vue-property-decorator';

@Component({
  watch: {
    $route(to: any, from: any) {
      console.log(to,'to')
      window.sessionStorage.setItem('currentRouteInfo', JSON.stringify({ path: to.path, meta: to.meta }));
      this.$store.commit('setRouteInfo');
      this.$store.commit('setTagNav', { path: to.path, meta: to.meta });
    },
  },
  computed: {
    routeList() {
      return this.$store.getters.commonMenu;
    },
  },
})
export default class Sidebar extends Vue {
  @PropSync('collapse') isCollapse!: boolean;
  private readonly name = 'Sidebar';

  get currentRouteInfo() {
    return this.$store.getters.currentRouteInfo;
  }

  selectSiderBar() {
    console.log();
  }
}
</script>

<style scoped>
.el-menu {
  width: 220px;
  border-right: initial;
  height: calc(100% - 60px);
  /* overflow-y: scroll; */
}
.el-menu-item.is-active {
  background: #3f4b99;
}
.el-aside {
  overflow: initial;
}
</style>
