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
    <div class="d-flex" style="display: flex">
      <!-- <div class="" id="container1" style="width: 600px; height: 400px"></div>
      <div class="" id="container2" style="width: 600px; height: 400px"></div> -->
      <div class="" id="container3" style="width: 600px; height: 400px"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import MonacoEditor1 from '@/components/monaco/monacoEditor1/index.jss'
import MonacoEditor2 from '@/components/monaco/monacoEditor2/index.js'
import MonacoEditor3 from '@/components/monaco/index.js'

import { onMounted } from 'vue'
import * as monaco from 'monaco-editor'
// import { setupLanguage } from './language-service/setup.js'
let editor1: any = null
let editor2: any = null
let editor3: any = null
onMounted(async () => {
  // await setupLanguage({ id: 'AviatorScript' })
  // editor1 = await new MonacoEditor1({
  //   tag: 'container1',
  //   defaultDoc: '',
  //   languageConfig: {
  //     name: 'AviatorScript'
  //   }
  // })

  // editor2 = await new MonacoEditor2({
  //   tag: 'container2',
  //   defaultDoc: '',
  //   languageConfig: {
  //     name: 'AviatorScript'
  //   }
  // })
  editor3 = await new MonacoEditor3({
    el: 'container3',
    defaultDoc: '',
    languageConfig: {
      name: 'AviatorScript'
    }
  })
  // await editor.initSetValue('const name="liming"')
})
const form: any = ref({
  language: 'AviatorScript',
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
