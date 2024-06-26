<template>
  <div class="w100 h100 flex-center">
    <div>
      <div>集成aviscript:自动补全,语法校验</div>
      <div class="" id="editor" style="width: 600px; height: 400px"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import MonacoEditor from './index.ts'
import { onMounted } from 'vue'
let editor
onMounted(async () => {
  editor = new MonacoEditor({
    defaultDoc: '',
    languageConfig: {
      name: 'AviatorScript'
    },
    tag: 'editor',
    insideTag: 'insideEditor'
  })
  await editor.init()
  await editor.creatWorker()
  await editor.formatCode()
  editor.initSetValue('const name="liming"')
})
</script>

<style scoped>
canvas {
  border: none !important;
}
.box {
  width: 20%;
  height: 20%;
  background-color: #3f8e50;
  color: #fff;
}
@media (max-width: 1024px) {
  .box {
    width: 100px;
    height: 100px;
    background-color: #3f8e50;
    color: #fff;
  }
}
</style>
