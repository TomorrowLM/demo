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
import { Component, Vue, PropSync, Watch } from 'vue-property-decorator';

@Component({})
export default class Sidebar extends Vue {
  @PropSync('collapse') isCollapse!: boolean;
  private state: any = {};
  userInfo: any = {};
  count = 1;
  // get userInfo() {
  //   return this.state.userInfo;
  // }
  //TODO: 嵌套太深，只能watch
  @Watch('state', { immediate: true, deep: true })
  public onMsgChanged(newValue: string, oldValue: string) {
    this.$set(this.userInfo, 'name', this.$store.state.user.userInfo.name);
  }
  mounted() {
    this.state = this.$store.state;
    this.$set(this.userInfo, 'name', this.$store.state.user.userInfo.name);
  }
  out() {
    localStorage.removeItem('token');
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
.el-button{
  padding:0;
}
</style>
