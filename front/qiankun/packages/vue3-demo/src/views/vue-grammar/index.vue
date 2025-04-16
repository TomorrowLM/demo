<template>
  <div>
    <div>
      <h1>生命周期</h1>
      <h1>父子组件双向绑定</h1>
      <h2>prop: 值类型</h2>
      {{ parentNum }}
      <child :type="1" v-model:parentNum="parentNum"></child>
      <div>Set operation on key "parentNum" failed: target is readonly.</div>
      <h2>v-model: 值类型</h2>
      {{ parentNum }}
      <child :type="2" v-model:parentNum="parentNum"></child>
      <h2>prop: 引用类型</h2>
      {{ parentObj.num }}
      <child :type="3" :parentObj="parentObj"></child>
    </div>
    <div>
      <h1>jsx组件</h1>
      <com attr="1">
        <template #default="data">
          <div>default slot</div>
          <div>这是子组件传的值： {{ data }}</div>
        </template>
      </com>
    </div>
    <div>
      <h1>useTableHook</h1>
      <useDataCom></useDataCom>
      <useDataNextCom></useDataNextCom>
      <useTableHook></useTableHook>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import child from './components/child.vue'
import com from './components/com.vue'
import useTableHook from './components/useTableHook.vue'
import useDataCom from './components/useHooks/index.vue'
import useDataNextCom from './components/useHooks/nextIndex.vue'
/**解构 */
const state = ref({ a: 1 })
const { a } = state.value
state.value.a = 2
console.log(state.value, a)

/** ref作为 reactive 对象的属性 */
const count = ref(0)
const otherCount = ref(2)
const state1 = reactive({ count })
console.log(state1.count) // 0
state1.count = 1
console.log(count.value) // 1
state1.count = otherCount
console.log(state1.count) // 2
// 原始 ref 现在已经和 state.count 失去联系
console.log(count.value) // 1

/**
 * reactive
 */
//替换数组
const arr = reactive([1])
//先清空数组再赋值，防止arr中的数据遗留
arr.length = 0
Object.assign(arr, [2])
//替换对象
const originalObj = {
  name: 'John',
  age: 1
}
const reactiveObj = reactive(originalObj)
Object.assign(reactiveObj, {
  name: 'Jane',
  age: 2
})

/**
 * 父子通信
 */
console.log(arr, reactiveObj) // { name: 'Jane', age: 25 }
const parentNum = ref(1)
const parentObj = ref({ num: 1 })
</script>
