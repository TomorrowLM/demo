<template>
  <div>
    <h2>父子组件双向绑定</h2>
    <h3>torefs: 值类型</h3>
    {{ parentNum }}
    <child :type="1" v-model:parentNum="parentNum"></child>
    <div>Set operation on key "parentNum" failed: target is readonly.</div>
    <h3>torefs: 引用类型</h3>
    {{ parentObj.num }}
    <child :type="2" :parentObj="parentObj"></child>
    <h3>v-model:</h3>
    {{ parentNum }}
    <child :type="3" v-model:parentNum="parentNum"></child>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import child from './components/child.vue'
// var str = '2234332244'
// var newStr = [...new Set(str)].join('')
// console.log(newStr)
// let map = new Map([['tom', '男']])
// //添加key和value值
// map.set('Amy', '女')
// console.log(map)
// console.log(ref)

//
const parentNum = ref(1)
const parentObj = ref({ num: 1 })
</script>
