<template>
  <div>
    <div v-if="type === 1">
      子组件：{{ num }}
      <el-button @click="changeNum">changeNum</el-button>
    </div>
    <div v-else-if="type === 2">
      这是子组件一：
      {{ provideData.mainMessage }}
      <el-button @click="changeMainMessage">子组件changeMes</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    num: Number,
    numObj: Object,
    type: {
      type: Number,
      default: 1,
    },
  },
  inject: ['provideData'],
  methods: {
    changeNum() {
      console.log('这是childCom子组件：changeNum');
      this.$emit('update:num', 2);
      // this.num = 2;
      this.numObj.num = 2; // 修改父组件的numObj对象
    },
    changeMainMessage(){
      this.provideData.mainMessage = '子组件修改了mainMessage值';
    }
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
