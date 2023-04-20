<script lang="ts" setup>
import { routes } from "@/router/index";
const menuList: any = routes;
console.log(menuList);
</script>
<template>
  <el-menu>
    <template v-for="item in menuList">
      <el-menu-item
        v-if="
          item.meta.sidebar && (!item.children || item.children.length === 0)
        "
        :key="item.path"
        :index="item.path"
      >
        <router-link :to="item.path">{{ item.meta.title }}</router-link>
      </el-menu-item>
      <el-sub-menu
        v-if="item.children && item.children.length !== 0"
        :key="item.path"
        :index="item.path"
      >
        <template #title>
          <el-icon><location /></el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <el-menu-item-group v-if="item.children">
          <el-menu-item
            v-for="child in item.children"
            :key="`${item.path}/${child.path}`"
            :index="`${item.path}/${child.path}`"
          >
            <!-- {{ `${item.path}/${child.path}` }} -->
            <router-link :to="`${item.path}/${child.path}`">
              {{ child.meta.title }}</router-link
            >
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </template>
  </el-menu>
</template>
