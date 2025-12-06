<template>
  <div>
    <div class="skin">颜色</div>
    <el-button @click="change">
      <span>切换</span>
    </el-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({})

export default class Skin extends Vue {

  theme = 'dark'; 
  // mounted() {
  //   // //给应用的顶层元素添加一个主题标识，用于标识当前的主题
  //   // document .getElementsByTagName("body")[0].setAttribute("data-theme", "light");
  //   // js 通过声明sass变量的key值，来找到对应变量，并修改其属性值
  //   (document.querySelector(':root') as any).style.setProperty('--theme-text', this.theme);
  // }

  change() {
    // console.log(window.localStorage.getItem('skin'));
    this.theme = window.localStorage.getItem('skin') || 'light';
    if (this.theme === 'light') {
      this.theme = 'dark';
      window.localStorage.setItem('skin', 'dark');
    } else {
      this.theme = 'light';
      window.localStorage.setItem('skin', 'light');
    }
    document.documentElement.setAttribute('theme', window.localStorage.getItem('skin') || 'light');
    document.documentElement.style.setProperty('--theme-name', window.localStorage.getItem('skin') || 'light');
    document.documentElement.setAttribute('class', window.localStorage.getItem('skin') || 'light');
    // window.location.reload();
    this.$forceUpdate();
  }
}
</script>

<style lang="scss" scoped>
.skin {
  //@include themify();
  //color: $text;
  //  使用主题
  // @include themify() {
  //   color: themed(text);
  // }
}
::v-deep .el-button {
  // @include themify() {
  //   color: red;
  // }
  //color: $text;
}
</style>