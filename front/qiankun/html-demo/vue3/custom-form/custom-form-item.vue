<template>
  <div>
    <!-- {{ splitEle }}1 -->
    <!-- {{ splitEle }}
    {{ splitEle[0] }}
    {{ formData }}
    1-{{ splitEle.length }}-2 -->
    <template v-if="splitEle.length === 1">
      <!-- {{ splitEle[0] }} -->
      <!-- {{ formData[splitEle[0]] }} -->
      <el-input v-if="item.type === 'input'" v-model="formData[splitEle[0]]" :placeholder="`请输入${item.label}`" :label-width="item.labelWidth" />
      <el-input-number
        v-if="item.type === 'input-number'"
        v-model="formData[splitEle[0]]"
        controls-position="right"
        :placeholder="`请输入${item.label}`"
        :label-width="item.labelWidth"
      ></el-input-number>
      <el-input v-if="item.type === 'input-suffix'" v-model="formData[splitEle[0]]" :placeholder="`请输入${item.label}`" :label-width="item.labelWidth">
        <template v-slot:append>{{ item.unit }}</template>
      </el-input>
      <el-input v-else-if="item.type === 'textarea'" type="textarea" show-word-limit rows="3" v-model="formData[splitEle[0]]" :placeholder="`请输入${item.label}`" :maxlength="item.maxlength" />
      <el-select v-else-if="item.type === 'select'" v-model="formData[splitEle[0]]" :placeholder="`请选择${item.label}`">
        <el-option v-for="optionItem in item.newOptions || item.options" :key="optionItem.value" :label="optionItem.label" :value="optionItem.value" :placeholder="`请选择${item.label}`" />
      </el-select>
      <div v-else-if="item.type === 'checkbox'">
        <el-checkbox
          v-for="checkItem in item.options"
          :key="checkItem.key"
          :label="checkItem.key"
          :value="checkItem.value"
          :true-label="checkItem.key"
          :false-label="checkItem.key"
          v-model="formData[splitEle[0]]"
        />
      </div>
      <div v-else-if="item.type === 'radio'">
        <el-radio-group v-model="formData[splitEle[0]]">
          <el-radio v-for="option in item.options" :key="option.label" :label="option.value" :value="option.value">{{ option.label }}</el-radio>
        </el-radio-group>
      </div>
      <div v-else-if="item.type === 'dialog-property'">
        <!-- 点选择弹框 -->
        <el-button @click="handle(1)">选择</el-button>
        <DataOrgDetailPropertyPointSelectionDialog v-model="formData[splitEle[0]]" :checkedNodeInfo="item" v-model:showDialog="dialog.property" v-if="dialog.property" />
      </div>
    </template>
    <template v-if="splitEle.length > 1">
      <!-- splitEle.slice 不会改变 -->
      <custom-form-item v-model:formData="formData[splitEle[0]]" :item="item" :splitEle="splitEle.slice(1)"></custom-form-item>
    </template>
  </div>
</template>
<script lang="ts">
export default {
  name: 'cutom-form-item' //给组件命名
};
</script>
<script lang="ts" setup>
import { cloneDeep, isEmpty } from 'lodash';
import { TemplateProps, RuleListProps } from './index.d.ts';
import DataOrgDetailPropertyPointSelectionDialog from '@/components/data-org-detail-property-point-selection-dialog.vue';

const props = defineProps<{
  formData: any;
  item: any;
  splitEle: any;
}>();
const { formData, item, splitEle } = toRefs(props);
const dialog = reactive({
  property: false
});
const handle = (e) => {
  if (e === 1) {
    dialog.property = true;
  }
};
</script>

<style lang="scss" scoped>
// @import './index.module.scss';
</style>
