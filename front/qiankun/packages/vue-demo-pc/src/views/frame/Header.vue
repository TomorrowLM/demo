<template>
  <div class="header">
    <p>LM-WEB-PC</p>
    <div class="d-flex align-items-center">
      <!-- <a-input placeholder="搜索"></a-input>
      <div class="d-flex">
        <a-icon class="mr-md" type="question-circle" />
        <a-icon class="mr-md" type="bell" />
        <a-icon class="mr-md" type="setting" />
      </div>
      <div>
        <a-avatar icon="user" />
      </div> -->
      <span style="margin: 0 8px"> {{ userInfo.name }}</span>
      <el-button @click="out" type="text" link>退出登录</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { resetRouter } from '@/router/index';

@Component({
  props: {
    collapse: {
      type: Boolean,
      default: false,
    },
  },
})
export default class Header extends Vue {
  //TODO: 嵌套太深，只能watch

  get isCollapse(): boolean {
    return this.$props.collapse as boolean;
  }

  set isCollapse(value: boolean) {
    this.$emit('update:collapse', value);
  }

  get userInfo() {
    return this.$store.state.globalStore.userInfo;
  }
  mounted() {}
  out() {
    localStorage.removeItem('token');
    resetRouter();
    this.$router.push('/login');
  }
}
</script>

<style scoped>
.header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.el-button {
  padding: 0;
}
</style>
