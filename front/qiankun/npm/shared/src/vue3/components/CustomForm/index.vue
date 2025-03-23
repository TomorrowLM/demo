<template>
  <!-- 循环：面板 -->
  <el-form
    :label-position="styleConfig.labelPosition"
    ref="customRef"
    :rules="rules"
    :inline="true"
    :model="formData"
    :key="cusFormKey"
    class="w-100"
  >
    <div class="card" v-for="(item, index) in panels" :key="index">
      <!-- title -->
      <div
        class="card-header mar-b-16"
        v-if="
          item.title &&
          (item.hasOwnProperty('visible') ? item?.visible() : true)
        "
      >
        <div class="bar-icon mr-sm"></div>
        <b>{{ item.title }}</b>
      </div>
      <!-- 表单 -->
      <div
        class="card-content"
        v-if="item.hasOwnProperty('visible') ? item?.visible() : true"
      >
        <template
          v-for="(formItem, formIndex) in Object.keys(item.elements)"
          :key="formIndex"
        >
          <template
            v-if="
              item.elements[formItem]?.link?.visible
                ? item.elements[formItem]?.link?.visible()
                : true
            "
          >
            <!-- 不需要label -->
            <el-form-item
              v-if="item.elements[formItem].type.includes('slot-item')"
              :label-width="
                item.elements[formItem]?.labelWidth || styleConfig?.labelWidth
              "
              :style="{
                width: item.elements[formItem]?.width || styleConfig?.width,
                marginBottom: styleConfig.marginBottom || '0px',
                ...item.elements[formItem]?.style
              }"
            >
              <slot :name="item.elements[formItem].type"></slot>
            </el-form-item>
            <el-form-item
              v-else
              :label="`${item.elements[formItem].label}：`"
              :prop="item.elements[formItem].prop"
              :id="formItem"
              :label-width="
                item.elements[formItem]?.labelWidth ||
                item?.labelWidth ||
                styleConfig?.labelWidth
              "
              :style="{
                width: item.elements[formItem]?.width || styleConfig?.width,
                marginBottom: styleConfig.marginBottom || '0px'
              }"
            >
              <template v-slot:label>
                <div v-if="item.elements[formItem].toolTip" class="flex">
                  {{ item.elements[formItem].label }}&nbsp;
                  <el-popover
                    placement="top-start"
                    :width="500"
                    trigger="hover"
                  >
                    <div>
                      <span
                        style="font-size: 12px"
                        v-html="item.elements[formItem].toolTip"
                      >
                      </span>
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
                <span v-else>
                  {{ item.elements[formItem].label
                  }}{{ item.elements[formItem].label ? '：' : '' }}</span
                >
              </template>
              <template v-if="item.elements[formItem].type.includes('slot')">
                <slot
                  :name="item.elements[formItem].type"
                  v-bind="{
                    ...item.elements[formItem]
                  }"
                ></slot>
              </template>
              <template v-else>
                <custom-form-item
                  v-model:formData="formData"
                  :item="item.elements[formItem]"
                  :splitEle="item.elements[formItem].prop.split('.')"
                  :ref="el => setSwipeCellRef(el, item.elements[formItem].prop)"
                ></custom-form-item>
                <!-- :ref="`formItemRef${item.elements[formItem].prop}`" -->
              </template>
            </el-form-item>
          </template>
        </template>
      </div>
    </div>
  </el-form>
</template>

<script lang="ts" setup name="CustomForm">
import { onMounted, toRefs, watch, toRef } from 'vue';
import { cloneDeep, isEmpty } from 'lodash';
import { TemplateProps, RuleListProps, Info } from './index.d.ts';
import customFormItem from './custom-form-item.vue';
import { ref, nextTick } from 'vue';
type Props = {
  formData: any; //表单数据
  config: TemplateProps; //表单项列表
};
const props = withDefaults(defineProps<Props>(), {});
const { formData } = toRefs(props);
const { panels, styleConfig }: any = toRefs(props.config);
const rules = toRef({});
const customRef = ref();
const cusFormKey = ref(1);
const formItemRef: any = ref({});
onMounted(async () => {
  await setData();
  await nextTick();
  setTimeout(() => {
    console.log('customRef.value', customRef.value);
    customRef.value.clearValidate();
  }, 100);
});
const getItemRef = (formItemRefStr: any) => {
  const arr = formItemRefStr.split('.');
  console.log(
    'formItemRef',
    formItemRef.value,
    formItemRef.value[formItemRefStr]
  );
  if (arr.length === 1) {
    return formItemRef.value[formItemRefStr];
  } else {
    formItemRef.value.getItemRef(arr);
  }
};
const setSwipeCellRef = (el, index) => {
  if (el) {
    formItemRef.value[index] = el;
  }
};
//重新渲染
const refresh = () => {
  console.log('refresh');
  cusFormKey.value++;
};
// 执行init初始化
const setInit = async (valE: any) => {
  console.log('valE11');
  !valE.notInit && valE.init && (await valE.init());
  await setLink({ renderItem: valE }); //需要等到init之后再执行联动
};
//初始化联动逻辑
const setLink = (info: Info) => {
  //TODO: 优化visible的逻辑，此处暂时只考虑了visible为函数的情况
  if (
    info?.renderItem?.link &&
    (!info?.renderItem?.link?.visible ||
      (info?.renderItem?.link?.visible && info?.renderItem?.link?.visible())) &&
    info.renderItem.link.change
  ) {
    if (info.renderItem.hasOwnProperty('isRender')) {
      const interval = setInterval(() => {
        if (info.renderItem.hasOwnProperty('isRender')) {
          if (info.renderItem.isRender) {
            info.renderItem.link.change(info);
            clearInterval(interval);
          }
        }
      }, 1000);
    } else {
      info.renderItem.link.change({ ...info, isInit: true });
    }
  }
};
const setData = async (type?: string) => {
  panels.value.forEach(async (valP: any) => {
    await valP.elements.forEach(async (valE: any) => {
      await setValidators(valE);
      await setInit(valE);
      // await setLink({ renderItem: valE });
      // console.log('valE222', valE);
    });
  });
  console.log('customRef.value', customRef.value);
};
const setValidators = valE => {
  valE['validators'] &&
    valE['validators'].forEach((valM: any) => {
      if (valM.notValidate) {
        return;
      } else {
        //TODO: 优化visible的逻辑，此处暂时只考虑了visible为函数的情况
        if (
          valM.methodType === 'required' &&
          (!valE?.link?.visible ||
            (valE?.link?.visible && valE?.link?.visible()))
        ) {
          rules.value[valE.prop] = [
            ...(rules.value[valE.prop] ? rules.value[valE.prop] : []),
            { required: true, message: valM.message, trigger: valM.trigger }
          ];
        }
        if (
          valM.methodType === 'change' &&
          (!valE?.link?.visible ||
            (valE?.link?.visible && valE?.link?.visible()))
        ) {
          rules.value[valE.prop] = [
            ...(rules.value[valE.prop] ? rules.value[valE.prop] : []),
            {
              validator: (rule: any, value: any, callback: any) =>
                valM.validator(rule, value, callback, { renderItem: valE }),
              trigger: valM.trigger
            }
          ];
        }
      }
    });
};
const itemPos = fn => {
  panels.value.forEach((valP: any) => {
    valP.elements.forEach((valE: any) => {
      fn(valE);
    });
  });
};
const setRule = prop => {
  itemPos(valE => {
    if (valE.prop === prop) {
      rules.value[prop] = '';
      setValidators(valE);
      console.log('rules', rules.value);
    }
  });
  setTimeout(() => {
    customRef.value.clearValidate();
  }, 100);
};

const validate = async handle => {
  let result = false;
  await customRef.value.validate(valid => {
    console.log(valid);
    if (valid) {
      result = true;
    } else {
      result = false;
    }
  });
  handle(result);
};
const reset = () => {
  customRef.value.resetFields();
  console.log(formData);
};

const clearValidate = (e?: any) => {
  if (e) {
    customRef.value.clearValidate(e);
  } else {
    customRef.value.clearValidate();
  }
};
const validateField = async e => {
  console.log(e);
  await customRef.value.validateField(e);
};
defineExpose({
  getItemRef,
  validate,
  reset,
  clearValidate,
  validateField,
  setValidators,
  setRule,
  refresh
});
</script>

<style lang="scss" scoped>
@import './index';
</style>
