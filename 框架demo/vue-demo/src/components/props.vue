<template>
  <div>
    <h1>{{ title }}</h1>
    <h1>我是父级：{{ eventBus }}</h1>
    <Propscomponent
      :postTitle="postTitle"
      @titleChanged="updateTitle"
    ></Propscomponent>
  </div>
</template>

<script>
import Propscomponent from "./props-component";
import Event from "../../common/EventBus";
export default {
  components: {
    Propscomponent,
  },
  provide: {
    name: "依赖注入",
  },

  props: {},
  mounted() {
    Event.$on("eventData", (data) => {
      this.eventBus = data;
    });
  },
  data() {
    return {
      eventBus: "EventBus中央事件总线old",
      postTitle: "父向子组件传值",
      title: "传递的是一个值",
    };
  },
  methods: {
    updateTitle(e1) {
      //声明这个函数
      console.log(e1);
      this.title = e1;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
