<template>
  <div>
    <Propscomponent :postTitle="postTitle" @titleChanged="updateTitle"></Propscomponent>
    <h1>我是父级：{{ title }}</h1>
    <h1>{{eventBus}}</h1>
  </div>
</template>

<script>
import Propscomponent from "./props-component";
import Event from "../../common/event"
export default {
  components: {
    Propscomponent
  },
  provide: {
    name: '依赖注入'
  },

  props: {
  },
  mounted(){
    Event.$on('eventData',data => {
      this.eventBus = data
    });
  },
  data() {
    return {
      postTitle: "父向子组件传值",
      title: "传递的是一个值",
      eventBus: "中央事件总线old"
    };
  },
  methods: {
    updateTitle(e) {
      //声明这个函数
      console.log(e);
      this.title = e;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
