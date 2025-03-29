<template>
  <div>
    <div v-if="type === 1">
      子组件：{{ num }}
      <el-button @click="changeNum">changeNum</el-button>
    </div>
    <div v-else-if="type === 2">
      {{ provideData.mainMessage }}
      <el-button @click="changeMainMessage">changeMes</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    num: Number,
    type: {
      type: Number,
      default: 1,
    },
  },
  inject: ['provideData'],
  methods: {
    changeNum() {
      console.log('changeNum');
      this.$emit('update:num', 2);
    },
    changeMainMessage(){
      this.provideData.mainMessage = '子组件修改了mainMessage值';
    }
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
