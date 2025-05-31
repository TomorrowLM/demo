<template>
  <div>
    <h1>一：v-model和v-bind区别</h1>
    <el-input v-model="inputData" v-bind:aa="inputData"></el-input>
    {{ inputData }}
    <h1>二：通信</h1>
    <h2>1.双向绑定</h2>
    父组件：<br>
    num:{{ num }} <br>
    numObj:{{ numObj }} <br>
    <childCom :type="1" :num.sync="num" :numObj="numObj"></childCom>
    <h2>2.依赖注入</h2>
    <childCom :type="2"></childCom>
    <childComNext :type="2"></childComNext>
    <h1>3.透传</h1>
    <!-- 透传 -->
    <attributeCom class="parent-class" attr1="1" :num="num" @click="changeAttribute"></attributeCom>
    <h1>三：生命周期执行和props，响应式变量</h1>
    请在在控制台查看
    <lifeCycle :type="3" :num.sync="num" :numObj="numObj"></lifeCycle>
  </div>
</template>

<script>
import { Vue, Component, Watch } from 'vue-property-decorator';
import childCom from './childCom.vue';
import childComNext from './childComNext.vue';
import attributeCom from './Attributes.vue';
import lifeCycle from './lifeCycle.vue';

export default {
  components: {
    childCom,
    attributeCom,
    childComNext,
    lifeCycle
  },
  data: () => {
    return {
      num: 1,
      numObj: {
        num: 1,
      },
      inputData: '',
      provideData: {
        mainMessage: '这是一个从祖先组件提供的信息',
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
  watch: {
    num: {
      handler(newVal, oldVal) {
        console.log('这是父组件：watch:num', newVal, oldVal);
      }, 
    },
    numObj: {
      handler(newVal, oldVal) {
        console.log('这是父组件：watch:numObj', newVal, oldVal);
      },
      immediate: true,
      deep: true,
    },
    inputData: {
      handler(newVal, oldVal) {
      },
      immediate: true,
    },
  },
  beforeCreate() {
    console.log('这是父组件：beforeCreate');
  },
  created() {
    console.log('这是父组件：created');
  },
  beforeMount() {
    console.log('这是父组件：beforeMount');
  },
  mounted() {
    console.log('这是父组件：mounted');
    this.$on('update:num', a => {
      console.log(a, 12);
    });
  },
  methods: {
    changeAttribute() {
      console.log('父组件');
    },
  },
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
