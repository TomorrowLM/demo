<template>
  <div class="hello">
    <div>{{ name }}</div>
    <div class="name">{{ name }}</div>
  </div>
</template>

<script>
import service from "@/utils/request"
export default {
  // name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      name: 'hello,这是全局注册的组价',
    };
  },
  methods: {
    // getUsers(){
    //   console.log(1);
    //   // service("http://tomorrowlm.xyz:3000/users").then((res) => {
    //   //   this.name = res.data.name;
    //   // });
    // },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>

.hello{
  div{
    background-color: red;
    font-size: 16px;
  }
  .name{
    // color: $text;
  }

}
</style>
