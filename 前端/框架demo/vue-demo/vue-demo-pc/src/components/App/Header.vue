<template>
  <div class="header">
    <p>LM-WEB-PC</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator';

@Component
export default class Sidebar extends Vue {
  @PropSync('collapse') isCollapse!: boolean;
}
</script>

<style scoped>
.header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>
