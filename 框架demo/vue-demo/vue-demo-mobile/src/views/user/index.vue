<template>
  <div v-bind:style="{ height: '100%' }">
    <div>hello</div>
    <el-button type="success" @click="exit">退出按钮</el-button>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  export default {
    data() {
      return { isCollapse: true };
    },
    created() {
      console.log(11);
      this.$store.dispatch('GetUserCoreInfo');
    },
    mounted() {
      console.log(123);
      console.log(this.$store.state.user.userInfo);
    },
    methods: {
      exit() {
        Vue.ls.set('token', '');
        this.$router.push('/login');
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .el-header {
    background-color: #fff;
    color: #333;
    text-align: center;
  }
  .el-footer {
    background-color: #fff;
    color: #333;
    text-align: center;
    height: initial !important;
  }

  .el-aside {
    color: #333;
    text-align: center;
    line-height: 200px;
    width: 100% !important;
  }

  .el-main {
    background-color: #fff;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
