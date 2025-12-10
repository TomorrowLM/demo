<template>
  <template v-if="splitEle.length === 1">
    <el-input
      v-if="item.type === 'input'"
      v-model="formData[splitEle[0]]"
      :placeholder="`请输入${item.label}`"
      style="width: 100%"
    />
    <el-input-number
      v-if="item.type === 'input-number'"
      v-model="formData[splitEle[0]]"
      controls-position="right"
      :placeholder="`请输入${item.label}`"
      :label-width="item.labelWidth"
    ></el-input-number>
    <el-input
      v-if="item.type === 'input-suffix'"
      :disabled="item.disabled"
      v-model="formData[splitEle[0]]"
      :placeholder="`请输入${item.label}`"
      :label-width="item.labelWidth"
    >
      <template v-slot:append>{{ item.unit }}</template>
    </el-input>
    <el-input
      v-else-if="item.type === 'textarea'"
      :disabled="item.disabled"
      type="textarea"
      show-word-limit
      rows="3"
      v-model="formData[splitEle[0]]"
      :placeholder="`请输入${item.label}`"
      :maxlength="item.maxlength"
    />
    <el-select
      v-else-if="item.type === 'select'"
      :disabled="item.disabled"
      v-model="formData[splitEle[0]]"
      :placeholder="`请选择${item.label}`"
      style="width: 100%"
    >
      <el-option
        v-for="optionItem in item.newOptions || item.options"
        :key="optionItem.value"
        :label="optionItem.label"
        :value="optionItem.value"
        :placeholder="`请选择${item.label}`"
      />
    </el-select>
    <div v-else-if="item.type === 'checkbox'">
      <el-checkbox
        v-for="checkItem in item.options"
        :key="checkItem.key"
        :label="checkItem.key"
        :value="checkItem.value"
        :true-label="checkItem.key"
        :false-label="checkItem.key"
        :disabled="item.disabled"
        v-model="formData[splitEle[0]]"
      />
    </div>
    <div v-else-if="item.type === 'radio'">
      <el-radio-group v-model="formData[splitEle[0]]" :disabled="item.disabled">
        <el-radio
          v-for="option in item.options"
          :key="option.label"
          :label="option.value"
          :value="option.value"
          >{{ option.label }}</el-radio
        >
      </el-radio-group>
    </div>
    <div v-else-if="item.type === 'DateTimePicker'">
      <el-date-picker
        format="YYYY-MM-DD HH:mm:ss"
        :disabled="item.disabled"
        v-model="formData[splitEle[0]]"
        type="datetime"
        placeholder="选择日期时间"
      >
      </el-date-picker>
    </div>
  </template>
  <!-- {{ splitEle.length }} -->
  <template v-if="splitEle.length > 1">
    <!-- splitEle.slice 不会改变 -->
    <!-- {{ splitEle.slice(1) }} -->
    <custom-form-item
      v-if="formData && formData.hasOwnProperty(splitEle[0])"
      v-model:formData="formData[splitEle[0]]"
      :item="item"
      :splitEle="splitEle.slice(1)"
    ></custom-form-item>
  </template>
</template>
<script lang="ts">
export default {
  name: "cutom-form-item", //给组件命名
};
</script>
<script lang="ts" setup>
const props = defineProps<{
  formData: any;
  item: any;
  splitEle: any;
}>();
const { formData, item, splitEle } = toRefs(props);

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

const dialog = reactive({
  property: false,
});
const handle = (e) => {
  if (e === 1) {
    dialog.property = true;
  }
};
</script>

<style lang="scss" scoped>
:deep(.el-select) {
  width: 100%;
}
</style>
