<template>
  <!-- 循环：面板 -->
  <el-form :label-position="styleConfig.labelPosition" ref="customRef" :rules="rules" :inline="true" :model="formData">
    <div class="card" v-for="(item, index) in panels" :key="index">
      <!-- title -->
      <div class="card-header mar-b-16" v-if="item.title">
        <div class="bar-icon mr-sm"></div>
        <b>{{ item.title }}</b>
      </div>
      <!-- 表单 -->
      <div class="card-content">
        <div v-for="(formItem, formIndex) in Object.keys(item.elements)" :key="formIndex">
          <div v-if="item.elements[formItem]?.style ? item.elements[formItem]?.style.visible() : true">
            <slot v-if="item.elements[formItem].type.includes('slot-item')" :name="item.elements[formItem].type"></slot>
            <el-form-item
              v-else
              :label="`${item.elements[formItem].label}：`"
              :prop="item.elements[formItem].prop"
              :id="formItem"
              :label-width="styleConfig.minWidth || item.elements[formItem].labelWidth"
            >
              <template v-slot:label>
                <div v-if="item.elements[formItem].toolTip" class="flex">
                  {{ item.elements[formItem].label }}&nbsp;
                  <el-popover placement="top-start" :width="500" trigger="hover">
                    <div>
                      <span style="font-size: 12px" v-html="item.elements[formItem].toolTip"> </span>
                    </div>
                    <template #reference>
                      <div>
                        <svg class="icon" aria-hidden="true">
                          <use href="#icon-tamesicon_help" />
                        </svg>
                      </div>
                    </template>
                  </el-popover>
                  &nbsp;：
                </div>
                <span v-else> {{ item.elements[formItem].label }}：</span>
              </template>
              <template v-if="item.elements[formItem].type.includes('slot')">
                <slot :name="item.elements[formItem].type"></slot>
              </template>
              <template v-else>
                <!-- {{ item.elements[formItem].prop.split('.') }} -->
                <!-- {{ formData.attrPointRefs }} -->
                <!-- {{formData}} -->
                <custom-form-item v-model:formData="formData" :item="item.elements[formItem]" :splitEle="item.elements[formItem].prop.split('.')"></custom-form-item>
              </template>
            </el-form-item>
          </div>
        </div>
      </div>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { cloneDeep, isEmpty } from 'lodash';
import { TemplateProps, RuleListProps } from './index.d.ts';
import customFormItem from './custom-form-item.vue';
import { ref, nextTick } from 'vue';
const props = defineProps<{
  config: TemplateProps; //表单项列表
}>();
const { panels, formData, styleConfig }: any = toRefs(props.config);
const rules = toRef({});
const customRef = ref();
console.log(formData, 123);
const setData = async (type?: string) => {
  await panels.value.forEach((valP: any) => {
    valP.elements.forEach((valE: any) => {
      // console.log(valP.elements[valE]);
      valE['methods'] &&
        valE['methods'].forEach((valM: any) => {
          // console.log(valE, valM);
          // if (!rules.value[valE]) {
          //   rules.value[valE] = [];
          // }
          // console.log(valM.methodType, valM.methodType === 'required', 'valM.methodType');
          if (valM.methodType === 'required') {
            rules.value[valE.prop] = [...(rules.value[valE.prop] ? rules.value[valE.prop] : []), { required: true, message: valM.message, trigger: valM.trigger }];
            // console.log(valM, 8812, rules.value, valE.prop);
          }
          if (valM.methodType === 'change') {
            rules.value[valE.prop] = [
              ...(rules.value[valE.prop] ? rules.value[valE.prop] : []),
              { validator: (rule: any, value: any, callback: any) => valM.validator(rule, value, callback), trigger: valM.trigger }
            ];
          }
        });
    });
  });
  console.log(rules.value, customRef.value);
};

const validate = async () => {
  let result = false;
  await customRef.value.validate((valid) => {
    console.log(valid);
    if (valid) {
      result = true;
    } else {
      result = false;
    }
  });
  return result;
};

const reset = () => {
  customRef.value.resetFields();
  console.log(formData);
};
onMounted(async () => {
  await setData();
  await nextTick();
  setTimeout(() => {
    customRef.value.clearValidate();
  }, 100);
});
watch(panels, (newValue: any, oldValue: any) => {
  // console.log('formListProp变化了', newValue, oldValue);
  // this.formList = cloneDeep(this.formListProp);
  // this.setData('init');
  // this.$nextTick(() => {
  //   this.formList.panels &&
  //     this.formList.panels.forEach((val: any, index: any) => {
  //       (this.$refs[`customRef_${index}`] as any)[0].resetFields();
  //     });
  // });
});
watch(
  formData,
  (newValue: any, oldValue: any) => {
    // console.log(newValue);
    // console.log(panels);
  },
  {
    deep: true
  }
);
const clearValidate = (e) => {
  customRef.value.clearValidate(e);
};
const validateField = async (e) => {
  console.log(e);
  await customRef.value.validateField(e);
};
defineExpose({ validate, reset, clearValidate, validateField });
</script>

<style lang="scss" scoped>
@import './index';

.card {
  width: 100%;
}

.el-form-item {
  width: calc(100% - 16px);
  box-sizing: border-box;
  margin-right: 16px;
}
</style>
