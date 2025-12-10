<template>
  <!-- {{ item.options }} -->
  <template v-if="splitEle.length === 1">
    <el-input
      v-if="item.type === 'input'"
      v-model="formData[splitEle[0]]"
      :placeholder="item.placeholder || `请输入${item.label}`"
      style="width: 100%"
      @change="item?.link?.change()"
      type="text"
      v-bind="item"
    />
    <el-input-number
      v-if="item.type === 'input-number'"
      v-model="formData[splitEle[0]]"
      controls-position="right"
      :placeholder="`请输入${item.label}`"
      :label-width="item.labelWidth"
      v-bind="item"
    >
    </el-input-number>
    <el-input
      v-if="item.type === 'input-suffix'"
      :disabled="item.disabled"
      v-model="formData[splitEle[0]]"
      :placeholder="`请输入${item.label}`"
      :label-width="item.labelWidth"
      @change="inputChange()"
    >
      <template v-slot:append>{{ item.unit }}</template>
    </el-input>
    <el-input
      v-else-if="item.type === 'textarea'"
      :disabled="item.disabled"
      show-word-limit
      :rows="3"
      v-model="formData[splitEle[0]]"
      :placeholder="`请输入${item.label}`"
      v-bind="item"
    />
    <el-select
      v-else-if="item.type === 'select'"
      :disabled="item.disabled"
      v-model="formData[splitEle[0]]"
      :placeholder="`请选择${item.label}`"
      style="width: 100%"
      v-bind="item"
      @change="val => changeCheckboxItem(val, item)"
    >
      <el-option
        v-for="optionItem in item.newOptions || item.options"
        :key="optionItem[labelProp]"
        :label="optionItem[labelProp]"
        :value="optionItem[valueProp]"
        :placeholder="`请选择${item.label}`"
      />
    </el-select>
    <div v-else-if="item.type === 'checkbox'">
      <el-checkbox
        v-for="checkItem in item.options"
        :key="checkItem[labelProp]"
        :label="checkItem[labelProp]"
        :value="checkItem[valueProp]"
        :true-label="checkItem[labelProp]"
        :false-label="checkItem[labelProp]"
        :disabled="item.disabled"
        v-model="formData[splitEle[0]]"
      />
    </div>
    <el-checkbox-group
      v-else-if="item.type === 'checkbox-group'"
      v-model="formData[splitEle[0]]"
    >
      <el-checkbox
        v-for="checkItem in item.options"
        :key="checkItem[labelProp]"
        :label="checkItem[labelProp]"
        :value="checkItem[valueProp]"
        :disabled="item.disabled"
        @change="val => changeCheckboxItem(val, item, checkItem)"
      ></el-checkbox>
    </el-checkbox-group>
    <el-radio-group
      v-else-if="item.type === 'radio'"
      v-model="formData[splitEle[0]]"
      :disabled="item.disabled"
    >
      <el-radio
        v-for="checkItem in item.options"
        :key="checkItem[labelProp]"
        :label="checkItem[labelProp]"
        :value="checkItem[valueProp]"
        >{{ checkItem[labelProp] }}</el-radio
      >
    </el-radio-group>
    <div v-else-if="item.type === 'text'">
      <span class="default-form-item-content-font">{{
        formData[splitEle[0]] ? formData[splitEle[0]] : '-'
      }}</span>
    </div>
    <div v-else-if="DatePickerType.includes(item.type as string)">
      <el-date-picker
        v-model="formData[splitEle[0]]"
        placeholder="请选择"
        v-bind="item"
      />
    </div>
    <UploadCom
      v-else-if="item.type === 'file' || item.type === 'img'"
      v-model:bindData="formData[splitEle[0]]"
      :type="item.type"
      :config="item || {}"
    ></UploadCom>

    <ScrollSelect
      ref="formItemComRef"
      v-else-if="item.type === 'scroll-select'"
      :config="item"
      v-model:bindData="formData[splitEle[0]]"
    />
  </template>
  <template v-if="splitEle.length > 1">
    <!-- splitEle.slice 不会改变 -->
    <!-- {{ splitEle.slice(1) }} -->
    <custom-form-item
      v-if="formData && formData.hasOwnProperty(splitEle[0])"
      v-model:formData="formData[splitEle[0]]"
      :item="item"
      :splitEle="splitEle.slice(1)"
      ref="formItemRef"
    ></custom-form-item>
  </template>
</template>
<script lang="ts">
export default {
  name: 'cutom-form-item' //给组件命名
};
</script>
<script lang="ts" setup>
import { reactive, toRefs, ref, onBeforeMount, watch } from 'vue';
import { ElementProps, DatePickerType } from './index.d.ts';
import UploadCom from '@/components/UploadCom/index.vue';
import ScrollSelect from './com/Scroll-select.vue';
const props = defineProps<{
  formData: any;
  item: ElementProps;
  splitEle: any;
}>();
const { formData, item, splitEle } = toRefs(props);
// console.log(item.value, 'item');
const labelProp = ref(item.value?.optionProp?.label || 'label');
const valueProp = ref(item.value?.optionProp?.value || 'value');
const formItemRef = ref();
const formItemComRef = ref();
const getItemRef = (formItemRefArr: any) => {
  if (formItemRefArr.length > 1) {
    return formItemRef.value.getItemRef(formItemRefArr.unshift());
  } else {
    return formItemRef.value;
  }
};
onBeforeMount(() => {
  // console.log(formData, splitEle.value[0]);
  if (!formData.value) {
    // console.log(!isNaN(splitEle.value[0]));
    if (!isNaN(splitEle.value[0])) {
      formData.value = [];
    } else {
      formData.value = {};
    }
  }
  // console.log(formData);
  // if (!formData.value[splitEle.value[0]]) {
  //   formData.value[splitEle.value[0]] = null;
  // }
});
const changeCheckboxItem = (val, item: any, changeItem?: any) => {
  console.log(val);
  if (item.link?.change) {
    item.link?.change({
      renderItem: item,
      changeItem: changeItem ? changeItem : null,
      changeValue: val
    });
  }
};
const setOptions = options => {
  console.log(options);
  item.value.options = options;
};
const loadOptions = queryParams => {
  console.log(formItemComRef.value);
  formItemComRef.value?.loadOptions(queryParams);
};
const getOptions = () => {
  console.log(item)
  return item?.value.options;
};
const setDisabled = status => {
  console.log(status, item.value, 993);
  item.value.disabled = status;
};
defineExpose({ getItemRef, setOptions, loadOptions, setDisabled, getOptions });
</script>

<style lang="scss" scoped>
:deep(.el-select) {
  width: 100%;
}
:deep(.el-date-editor) {
  width: initial !important;
}
</style>
