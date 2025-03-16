<template>
  <div>
    <!-- v-model和v-bind区别 -->
    <el-input v-model="inputData" v-bind:aa="inputData"></el-input>
    {{ inputData }}
    <!-- 双向绑定 -->
    <h1>双向绑定</h1>
    父组件：{{ num }}
    <childCom :num.sync="num"></childCom>
    <h1>透传</h1>
    <!-- 透传 -->
    <attributeCom class="parent-class" attr1="1" :num="num" @click="changeAttribute"></attributeCom>
  </div>
</template>

<script>
import { Vue, Component, Watch } from 'vue-property-decorator';
import childCom from './childCom.vue';
import attributeCom from './Attributes.vue';

export default {
  data: () => {
    return {
      num: 1,
      inputData: '',
    };
  },
  components: {
    childCom,
    attributeCom,
  },
  mounted() {
    this.$on('update:num', a => {
      console.log(a, 12);
    });
  },
  methods: {
    changeAttribute() {
      console.log('父组件');
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped></style>
