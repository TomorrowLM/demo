<template>
  <div>
    <div v-if="type === 2">
      这是子组件二：
      {{ provideData.mainMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'childComNext',
  props: {
    num: Number,
    type: {
      type: Number,
      default: 1,
    },
  },
  inject: ['provideData'],
  methods: {
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
