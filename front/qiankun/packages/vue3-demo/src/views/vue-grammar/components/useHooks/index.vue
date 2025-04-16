<template>
  <div>
    {{ data }}
    <el-button @click="changeData">点击</el-button>
  </div>
</template>

<script setup lang="ts">
import { useData } from './useData'
const { data, changeData } = useData()
</script>
