<template>
  <div>
    <a-button v-permission="'新建用户'" @click="newUser()"> 新建用户 </a-button>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";

@Component
export default class Access extends Vue {}
</script>