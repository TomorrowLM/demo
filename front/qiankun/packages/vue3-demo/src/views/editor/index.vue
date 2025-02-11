<template>
  <div class="w100 h100 flex-center">
    <!-- <div>集成aviscript</div> -->
    <el-form :model="form" label-width="50px" label-position="left">
      <el-form-item label="语言">
        <el-select v-model="form.language" placeholder="Select" style="width: 240px">
          <el-option
            v-for="item in options.languages"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="主题">
        <el-select
          @change="change(1)"
          v-model="form.theme"
          placeholder="Select"
          style="width: 240px"
        >
          <el-option
            v-for="item in options.themes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="" id="container" style="width: 600px; height: 400px"></div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import MonacoEditor from './index'
import { onMounted } from 'vue'
import * as monaco from 'monaco-editor'
import { setupLanguage } from './language-service/setup'
let editor: any = null
onMounted(async () => {
  // await setupLanguage({ id: 'AviatorScript' })
  editor = await new MonacoEditor({
    el: 'container',
    defaultDoc: '',
    languageConfig: {
      name: 'AviatorScript'
    }
  })
  await editor.initSetValue('const name="liming"')
})
const form: any = ref({
  language: 'aviatorScript',
  theme: 'vs'
})
const options = ref({
  languages: [
    {
      value: 'aviatorScript',
      label: 'aviatorScript'
    },
    {
      value: 'javascript',
      label: 'JavaScript'
    }
  ],
  themes: [
    {
      value: 'vs',
      label: 'vs'
    },
    {
      value: 'vs-dark',
      label: 'vs-dark'
    },
    {
      value: 'myTheme',
      label: 'myTheme'
    }
  ]
})
const change = (type: number) => {
  if (type === 1) {
    editor.setTheme(form.value.theme)
  }
}
</script>

<style lang="scss" scoped>
canvas {
  border: none !important;
}
.box {
  width: 20%;
  height: 20%;
  // background-color: $box-bg;
  color: #fff;
}
@media (max-width: 1024px) {
  .box {
    width: 100px;
    height: 100px;
    // background-color: $box-bg;
    color: #fff;
  }
}
</style>
