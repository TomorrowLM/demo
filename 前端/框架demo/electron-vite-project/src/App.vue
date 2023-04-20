<script setup lang="ts">
import SiderBar from "@/components/Layout/SiderBar.vue";
import Header from "@/components/Layout/Header.vue";
import { computed, watch } from "vue";
import { useStore, mapState } from "vuex";

const store = useStore();
const createProject = computed(() => {
  console.log(store.state, 999);
  return store.state.mainProcess.createProject;
});
console.log(createProject);

if (createProject) {
  console.log(1);
} else {
  console.log(2);
}

watch(
  createProject,
  (newValue, oldValue) => {
    console.log(33333);
    if (newValue) {
      console.log(21);
    }
  },
  { immediate: true }
);

const handleClose = () => {
  store.commit("setCreateProject", false);
};
// const store = useStore();
// // 传入数组
// const storeStateFns: any = mapState(["createProject"]);
// const storeState: any = {};
// Object.keys(storeStateFns).forEach((Fnkey) => {
//   console.log(Fnkey);
//   // setup中无this 指向,在 compute中计算state时需要  $store 指向 ,所以使用bind() 绑定 $store
//   const fn = storeStateFns[Fnkey].bind({ $store: store });
//   storeState[Fnkey] = computed(fn);
// });
// const { createProject }: any = { ...storeState };
// console.log(storeState, createProject, 3218);
</script>

<template>
  <div class="app">
    <Header></Header>
    <el-container>
      <el-aside width="200px">
        <sider-bar></sider-bar>
      </el-aside>
      <el-container>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
    <el-dialog
      v-model="createProject"
      title="Tips"
      width="30%"
      :before-close="handleClose"
    >
      <span>createProject</span>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.app {
  height: 100vh;
}

.el-container {
  height: 100%;
}
</style>
