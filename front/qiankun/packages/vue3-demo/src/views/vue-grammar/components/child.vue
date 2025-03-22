<template>
  <div>
    <button v-if="type === 1" @click="add1">直接对prop值类型加1</button>
    <button v-if="type === 2" @click="add2">emit触发值类型加1</button>
    <button v-if="type === 3" @click="add3">直接对prop引用类型加1</button>
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
const parentObjProp = computed(() => {
  return parentObj.value
})
const add1 = () => {
  parentNum.value++
}
const add2 = () => {
  emit('update:parentNum', parentNum.value + 1)
}
const add3 = () => {
  props.parentObj.num++
  // parentObj.value.num++
  // parentObjProp.value.num++
}
</script>
