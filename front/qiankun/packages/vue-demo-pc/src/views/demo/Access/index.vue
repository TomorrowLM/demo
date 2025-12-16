<template>
  <div>
    <el-button @click="changeRole">切换角色</el-button>
    <span>当前角色：{{ role }}</span>
    <div>
      <!-- 注意一定要加disabled属性，才能设置它的disabled值 -->
      <el-button :disabled="false" v-permission="{ type: 'btn:createUser', route: $route }"> 新建用户 </el-button>
      <el-button :disabled="false" v-permission="{ type: 'btn:editUser', route: $route }"> 编辑用户 </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import permission from '@/directive/permission'; // 权限判断指令
// import checkPermission from '@/utils/permission' // 权限判断函数
@Component({
  directives: {
    permission,
  },
  computed: {
    role() {
      return this.$store.getters.role;
    },
  },
})
export default class Access extends Vue {
  data = 0;
  get role() {
    return this.$store.getters.role;
  }

  mounted() {
    console.log(this.$route, 123);
  }

  updated() {
    console.log('update');
  }

  changeRole() {}
}
</script>

<style lang="scss" scoped>
span {
  color: $primary-color;
}
</style>
