<template>
  <div class="learn">
    <div class="learn_header">
      首页
    </div>
    <div class="learn_body">
      <router-view />
    </div>
  </div>
</template>

<script>

export default {
  components: { },
  data () {
    return { drawer: false }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.learn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.learn_header {
  height: 10%;
}

.learn_body {
  height: 90%;
}

.tool_btn {
  display: flex;
  justify-content: center;
  margin: auto;
}

.el-button {
  display: flex;
  justify-content: center;
  margin: auto;
}

.el-drawer__open .el-drawer.ltr {
  width: 40% !important;
}

.el-submenu__title {
  padding-left: 20px;
  text-align: left;
}

.el-menu-item {
  padding-left: 20px;
  text-align: left;
}

.el-menu-item-group__title {
  text-align: left;
}
</style>
