<template>
  <div>
    <!-- <router-link to="/Props">props</router-link> -->
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane label="props">
        <Props></Props>
      </el-tab-pane>
      <el-tab-pane label="Transition">
        <Transition></Transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Props from "./props.vue";
import Transition from "./transition.vue";
export default {
  components: {
    Props,
    Transition,
  },
  props: {},
  data() {
    return {
      tabPosition: "left",
    };
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
