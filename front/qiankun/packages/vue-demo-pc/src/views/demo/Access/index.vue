<template>
  <div>
    <!-- <el-button @click="changeRole">切换角色</el-button> -->
    <span>当前角色：{{ userInfo.role }}</span>
    <el-button :disabled="false" v-permission="{ type: 'btn:createUser', route: $route }"> 新建用户 </el-button>
    <div>
      <!-- 注意一定要加disabled属性，才能设置它的disabled值 -->
      <el-button :disabled="false" v-permission="{ type: 'btn:editUser', route: $route }"> 编辑用户 </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import permission from '@/directive/permission'; // 权限判断指令
import checkPermission from '@/utils/permission'; // 权限判断函数

@Component({
  directives: {
    permission,
  },
})
export default class Access extends Vue {
  data = 0;
  get userInfo() {
    return this.$store.getters.userInfo;
  }

  mounted() {
    console.log(this.$route, 123);
  }

  updated() {
    console.log('update');
  }
}
</script>

<style lang="scss" scoped>
span {
  color: $primary-color;
}
</style>
