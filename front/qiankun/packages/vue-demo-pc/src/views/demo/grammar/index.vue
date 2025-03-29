<template>
  <div>
    <!-- v-model和v-bind区别 -->
    <h1>一：v-model和v-bind区别</h1>
    <el-input v-model="inputData" v-bind:aa="inputData"></el-input>
    {{ inputData }}
    <h1>二：通信</h1>
    <h2>1.双向绑定</h2>
    父组件：{{ num }}
    <childCom :type="1" :num.sync="num"></childCom>
    <h2>2.依赖注入</h2>
    <childCom :type="2"></childCom>
    <childComNext :type="2"></childComNext>
    <h1>透传</h1>
    <!-- 透传 -->
    <attributeCom class="parent-class" attr1="1" :num="num" @click="changeAttribute"></attributeCom>
  </div>
</template>

<script>
import { Vue, Component, Watch } from 'vue-property-decorator';
import childCom from './childCom.vue';
import childComNext from './childComNext.vue';
import attributeCom from './Attributes.vue';

export default {
  components: {
    childCom,
    attributeCom,
    childComNext,
  },
  data: () => {
    return {
      num: 1,
      inputData: '',
      provideData: {
        mainMessage:'这是一个从祖先组件提供的信息'
      },
    };
  },
  provide() {
    return {
      // mainMessage: '这是一个从祖先组件提供的信息',
      provideData: this.provideData,
      // changeMes: function() {
      //   console.log('changeMes', this);
      //   this.mainMessage = '123';
      // },
    };
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

<style lang="scss" scoped>
h1 {
  font-size: 24px;
}
h2 {
  font-size: 20px;
}
</style>
