<template>
  <div>
    <div class="skin">123</div>
    <el-button @click="change">切换</el-button>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from 'vue-property-decorator';
import permission from '@/directive/permission/index.js'; // 权限判断指令
// import checkPermission from '@/utils/permission' // 权限判断函数
@Component({})
export default class Access extends Vue {
  theme = 'light';
  mounted() {
    // //给应用的顶层元素添加一个主题标识，用于标识当前的主题
    // document .getElementsByTagName("body")[0].setAttribute("data-theme", "light");
    // js 通过声明sass变量的key值，来找到对应变量，并修改其属性值
    (document.querySelector(':root') as any).style.setProperty('--theme-text', 'dark');
  }

  change() {
    if (this.theme === 'light') {
      this.theme = 'dark';
    } else {
      this.theme = 'light';
    }
    console.log(this.theme);
    (document.querySelector(':root') as any).style.setProperty('--theme-text', this.theme);
    this.$forceUpdate()
  }
}
</script>

<style lang="scss" scoped>
.skin {
  color: $text-primary-color;
}
</style>