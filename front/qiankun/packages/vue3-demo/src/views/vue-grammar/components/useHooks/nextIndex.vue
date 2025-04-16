<template>
  <div>
    {{ data }}
  </div>
</template>

<script setup lang="ts">
import { useData } from './useData'
const { data } = useData()
</script>
