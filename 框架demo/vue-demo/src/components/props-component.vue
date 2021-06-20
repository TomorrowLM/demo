<template>
  <div>
    <!-- 父子通信props-->
    <h1 @click="fixpostTitle()">{{ postTitle }}</h1>
    <!-- 父子通信emit -->
    <h1 @click="changeTitle">{{ title }}</h1>
    <!-- eventBus -->
    <h1 @click="eventBus()">eventBus</h1>
  </div>
</template>

<script>
import Event from "../../common/event"
export default {
  inject: ['name'],
  mounted(){
    console.log(this.name);  // 浪里行舟
  },
  props: {
    postTitle: String,
  },
  data() {
    return {
      show: true,
      title: "子向父组件传值",
    };
  },
  methods: {
    fixpostTitle() {
      //不能直接修改props中的postTitle
      this.postTitle = 2;
    },
    changeTitle() {
      this.$emit("titleChanged", "子向父组件传值"); //自定义事件  传递值“子向父组件传值”
    },
    eventBus(){
      Event.$emit('eventData','中央事件总线new');
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
