<template>
  <div>
    <div>
      <!-- 循环：面板 -->
      <el-form ref="customRef" :rules="rules" label-position="left" :inline="true" :model="formData">
        <div class="card" v-for="(item, index) in panels" :key="index">
          <!-- title -->
          <div class="card-header mar-b-16" v-if="item.title">
            <div class="bar-icon mr-sm"></div>
            <b>{{ item.title }}</b>
          </div>
          <!-- 表单 -->
          <div class="card-content" v-for="(formItem, formIndex) in Object.keys(item.elements)" :key="formIndex">
            <!--     :style="{ minWidth: item.elements[formItem].style.width }" -->
            <el-form-item :label="`${item.elements[formItem].label}：`" :prop="formItem" :id="formItem" v-if="item.elements[formItem].style ? item.elements[formItem]?.style.visible() : true">
              <template v-slot:label>
                <span>
                  {{ item.elements[formItem].label }}
                  <!-- <el-tooltip class="item" placement="top"> -->
                  <!--  问号的图标   -->
                  <!-- <i class="el-icon-question"></i> -->
                  <!--  提示的内容 -->
                  <!-- <template slot="content"> 内容提示</template> -->
                  <!-- </el-tooltip> -->
                  <span>：</span>
                  <!-- {{ item.elements[formItem].labelWidth }} -->
                </span>
              </template>
              <custom-form-item v-model:formData="formData" :item="item.elements[formItem]" :splitEle="formItem.split('.')"></custom-form-item>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <el-button type="" @click="valid"></el-button>
    <!-- <el-dialog title="提示" v-model:visible="dialogVisible" width="30%">
      <span>{{ dialogMes }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script lang="ts" setup>
import { cloneDeep, isEmpty } from 'lodash';
import { TemplateProps, RuleListProps } from './index.d.ts';
import customFormItem from './custom-form-item.vue';
import { ref, nextTick } from 'vue';
const props = defineProps<{
  config: TemplateProps; //表单项列表
  // formData: any; //默认表单项的值
}>();
const { panels, formData } = toRefs(props.config);
const rules = toRef({});
const customRef = ref();
const setData = async (type?: string) => {
  await panels.value.forEach((valP: any) => {
    Object.keys(valP.elements).forEach((valE: any) => {
      // console.log(valP.elements[valE]);
      valP.elements[valE]['methods'] &&
        valP.elements[valE]['methods'].forEach((valM: any) => {
          // console.log(valE, valM);
          if (!rules.value[valE]) {
            rules.value[valE] = [];
          }
          // console.log(rules.value[valE]);
          if (valM.methodType === 'required') {
            rules.value[valE] = [...rules.value[valE], { required: true, message: valM.message, trigger: valM.trigger }];
          }
          if (valM.methodType === 'visible') {
            rules.value[valE] = [...rules.value[valE], { validator: (rule: any, value: any, callback: any) => valM.handle(rule, value, callback), trigger: valM.trigger }];
          }
        });
    });
  });
  console.log(rules.value, customRef.value);
};

const valid = () => {
  // customRef.value.clearValidate();
  customRef.value.validate((valid) => {
    console.log(valid);
    if (valid) {
      console.log();
    }
  });
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
    console.log(newValue);
    console.log(panels);
  },
  {
    deep: true
  }
);
</script>

<style lang="scss" scoped>
// @import './index.module.scss';
</style>
