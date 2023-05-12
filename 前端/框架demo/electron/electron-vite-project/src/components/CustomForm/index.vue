<template>
  <div v-if="formList.value && formList.value.panels.length">
    <div v-for="(item, index) in formList.value.panels" :key="index">
      <div class="header mar-b-16">
        {{ item.title }}
      </div>
      <div class="form">
        <el-form :inline="true" :model="formData" label-width="120px">
          <el-form-item
            v-for="(formItem, formIndex) in item.elements"
            :key="formIndex"
            :label="`${formItem.label}：`"
            :style="{ width: formItem.width }"
          >
            <el-input
              v-if="formItem.type === 'input'"
              v-model="formData[formItem.key]"
              :placeholder="`请输入${formItem.label}`"
            />
            <el-select
              v-else-if="formItem.type === 'select'"
              v-model="formData[formItem.key]"
              :placeholder="`请选择${formItem.label}`"
            >
              <el-option
                v-for="item in formItem.options"
                :key="item.value"
                :label="item.key"
                :value="item.value"
                :placeholder="`请选择${formItem.label}`"
              />
            </el-select>
            <el-input
              type="textarea"
              autosize
              v-else-if="formItem.type === 'textarea'"
              v-model="formData[formItem.key]"
              :placeholder="`请输入${formItem.label}`"
            />
            <div v-else-if="formItem.type === 'checkbox'">
              <el-checkbox
                v-for="item in formItem.options"
                :key="item.key"
                :label="item.key"
                :value="item.value"
                :true-label="item.key"
                :false-label="item.key"
                v-model="formData[formItem.key]"
              />
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
  <input type="textarea" @change="change" />
</template>

<script lang="ts" setup>
/**
 * 自动化表单
 */
import { reactive, ref, toRefs, watchEffect, watch, defineProps } from "vue";
import { onMounted } from "vue";

const props = defineProps<{
  formList: any;
}>();
const formList = reactive(props.formList || []);

const formData: any = reactive<object>({});
onMounted(() => {
  setData();
});
const setData = () => {
  props.formList.panels &&
    props.formList.panels.forEach((valP: any, indexP: Number) => {
      valP.elements.forEach((valC: any, indexC: Number) => {
        formData[valC.key] = valC.defaultValue;
      });
    });
};
const change = (e:any) => {
  console.log(JSON.parse(e.target.value), formList.value);
};
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-wrap: wrap;
}
.el-form--inline .el-form-item {
  margin-right: 0;
  display: flex;
  align-items: center;
}
</style>
