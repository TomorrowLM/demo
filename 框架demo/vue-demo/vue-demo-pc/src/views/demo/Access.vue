<template>
  <div>
    <a-button v-permission="'btn:access:createUser'"> 新建用户 </a-button>
    <a-button v-permission="'btn:access:editUser'"> 编辑用户 </a-button>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";
import permission from "@/directive/permission/index.js"; // 权限判断指令
// import checkPermission from '@/utils/permission' // 权限判断函数
@Component({
  directives: {
    permission,
  },
})
export default class Access extends Vue {}
</script>