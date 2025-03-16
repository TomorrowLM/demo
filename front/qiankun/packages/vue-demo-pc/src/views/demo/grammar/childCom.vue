<template>
  <div>
    子组件：{{ num }}
    <el-button @click="changeNum">changeNum</el-button>
  </div>
</template>

<script>
export default {
  props: {
    num: Number,
  },
  methods: {
    changeNum() {
      console.log('changeNum');
      this.$emit('update:num', 2);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
