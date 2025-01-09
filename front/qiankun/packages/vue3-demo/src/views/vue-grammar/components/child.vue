<template>
  <div>
    <button v-if="type === 1" @click="add1">对值类型加1</button>
    <button v-if="type === 2" @click="add2">对引用类型加1</button>
    <button v-if="type === 3" @click="add3">emit</button>
  </div>
</template>

<script setup lang="ts" name="child">
import { ref, reactive, defineProps, toRefs } from 'vue'
const props = defineProps({
  parentNum: { type: Number, default: 0 },
  parentObj: {
    type: Object,
    default: () => {
      return { num: 0 }
    }
  },
  type: { type: Number, default: 1 }
})
const { parentNum, parentObj, type } = toRefs(props)
const emit = defineEmits(['update:parentNum'])
const parentObj1 = computed(() => {
  return parentObj.value
})
const add1 = () => {
  parentNum.value++
}
const add2 = () => {
  parentObj1.value.num++
  parentObj.value.num++
}
const add3 = () => {
  emit('update:parentNum', parentNum.value + 1)
}
</script>
