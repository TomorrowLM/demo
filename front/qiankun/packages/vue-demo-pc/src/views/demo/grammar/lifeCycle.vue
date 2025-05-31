<template>
  <div>
    这是lifeCycle组件 </br>
    numCopy：{{ numCopy }} 不会监听props.num变化</br>
    numObjCopy：{{ numObjCopy }} 会监听props.numObjCopy变化</br>
    computedNum：{{ computedNum }} 会监听props.num变化</br>
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
  data() {
    return {
      numCopy: this.num, // num会被拷贝
      numObjCopy: this.numObj, //numObj是引用类型
    };
  },
  watch: {
    num:{
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        console.log('这是lifeCycle子组件：watch num',newVal, oldVal);
      }
    },
    numObj: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        console.log('这是lifeCycle子组件：watch numObj',newVal, oldVal);
      }
    },

  },
  computed: {
    computedNum() {
      console.log('computed什么时候使用该变量，就会在该时候之前执行');
      return this.num;
    },
  },
  beforeCreate() {
    console.log('这是lifeCycle子组件：beforeCreate','此时data和methods都不可用');
    console.log('这是lifeCycle子组件：beforeCreate',this.numCopy, this.numObjCopy,this.computedNum);
  },
  created() {
    console.log('这是lifeCycle子组件：created',this.numCopy, this.numObjCopy,this.computedNum);
  },
  beforeMount() {
    console.log('这是lifeCycle子组件：beforeMount');
  },
  mounted() {
    console.log('这是lifeCycle子组件：mounted');
  },
  methods: {

  },

};
</script>

<style lang="scss" scoped></style>
