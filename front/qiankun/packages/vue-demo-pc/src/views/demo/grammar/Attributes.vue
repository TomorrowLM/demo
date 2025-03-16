<!-- ChildComponent.vue -->
<template>
  <div>
    <div class="attr-class" v-bind="$attrs" v-on="$listeners">
      <!-- 这里可以渲染一些内容 -->
      attribute属性
      {{ $attrs }} {{$listeners}}
    </div>
  </div>
</template>

<script>
export default {
  props: ['num'], // 只声明了 foo 作为 prop
};
</script>
