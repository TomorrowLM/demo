<template>
  <div>
    <div v-if="formList" :class="[className ? className : 'page-index', 'common']">
      <div>
        <!-- 循环：面板 -->
        <div class="card" v-for="(item, index) in formList.panels" :key="index">
          <!-- title -->
          <div class="card-header mar-b-16">
            <div class="bar-icon mr-sm"></div>
            <b>{{ item.title }}</b>
          </div>
          <!-- 表单 -->
          <div class="card-content">
            <el-form :ref="`customRef_${index}`" label-position="left" :rules="rules" :inline="true" :model="formData">
              <!-- 循环：表单 -->
              <!-- :required="item.elements[formItem].required" -->
              <el-form-item
                v-for="(formItem, formIndex) in Object.keys(item.elements)"
                :key="formIndex"
                :label="`${item.elements[formItem].label}：`"
                :style="{ minWidth: item.elements[formItem].width }"
                :prop="formItem"
                @click.native="emitInfo(item.elements[formItem])"
              >
                <template slot="label">
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
                <el-input
                  v-if="item.elements[formItem].type === 'input'"
                  v-model="formData[formItem]"
                  :placeholder="`请输入${item.elements[formItem].label}`"
                  :label-width="item.elements[formItem].labelWidth"
                  @blur="validateItem(`customRef_${index}`, formItem)"
                />
                <el-input-number
                  v-if="item.elements[formItem].type === 'input-number'"
                  v-model="formData[formItem]"
                  controls-position="right"
                  :placeholder="`请输入${item.elements[formItem].label}`"
                  :label-width="item.elements[formItem].labelWidth"
                ></el-input-number>
                <el-input
                  v-if="item.elements[formItem].type === 'input-suffix'"
                  v-model="formData[formItem]"
                  :placeholder="`请输入${item.elements[formItem].label}`"
                  :label-width="item.elements[formItem].labelWidth"
                >
                  <template slot="append">{{ item.elements[formItem].unit }}</template>
                </el-input>
                <el-input
                  v-else-if="item.elements[formItem].type === 'textarea'"
                  type="textarea"
                  show-word-limit
                  rows="3"
                  v-model="formData[formItem]"
                  :placeholder="`请输入${item.elements[formItem].label}`"
                  :maxlength="item.elements[formItem].maxlength"
                />
                <el-select
                  @click.native="emitInfo(item.elements[formItem])"
                  v-else-if="item.elements[formItem].type === 'select'"
                  v-model="formData[formItem]"
                  :placeholder="`请选择${item.elements[formItem].label}`"
                >
                  <el-option
                    v-for="optionItem in item.elements[formItem].newOptions || item.elements[formItem].options"
                    :key="optionItem.value"
                    :label="optionItem.label"
                    :value="optionItem.value"
                    :placeholder="`请选择${item.elements[formItem].label}`"
                  />
                </el-select>
                <div v-else-if="item.elements[formItem].type === 'checkbox'">
                  <el-checkbox
                    v-for="checkItem in item.elements[formItem].options"
                    :key="checkItem.key"
                    :label="checkItem.key"
                    :value="checkItem.value"
                    :true-label="checkItem.key"
                    :false-label="checkItem.key"
                    v-model="formData[formItem]"
                  />
                </div>
                <div v-else-if="item.elements[formItem].type === 'radio'">
                  <el-radio-group v-model="formData[formItem]">
                    <el-radio
                      v-for="option in item.elements[formItem].options"
                      :key="option.label"
                      :label="option.value"
                      :value="option.value"
                      >{{ option.label }}</el-radio
                    >
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>{{ dialogMes }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { cloneDeep, isEmpty } from 'lodash';
// import { parse, eval as newEval } from 'expression-eval';
import { TemplateProps, RuleListProps } from '@/model/components/customForm';
import { commonRequest } from '@/api/common';
// import { Form, FormItem } from 'element-ui';
/**
 * 自动化表单
 */
@Component({
  // components: { 'el-form': Form, 'el-form-item': FormItem }
})
export default class CustomForm extends Vue {
  @Prop() formListProp!: TemplateProps; //表单项列表
  @Prop() formDataProp!: any; //默认表单项的值
  @Prop() className!: string; //class名
  @Prop() type!: string; //Edit , New
  formList: any = [];
  formData: any = {};
  // oldFormData1: any = {};
  oldFormData2: any = {};
  outFormData: any = {}; //外置表单数据
  rules: any = {};
  dialogVisible = false;
  dialogMes = '';
  dialogTitle = '';
  isRunValidate = false; //是否执行validate方法
  @Watch('formListProp', { immediate: true, deep: true })
  watchFormListProp(newValue: any, oldValue: any): void {
    console.log('formListProp变化了', newValue, oldValue);
    this.formList = cloneDeep(this.formListProp);
    this.setData('init');
    this.$nextTick(() => {
      this.formList.panels &&
        this.formList.panels.forEach((val: any, index: any) => {
          (this.$refs[`customRef_${index}`] as any)[0].resetFields();
        });
    });
    return;
  }

  //监听formData对象新旧值指向同一个地址，用compute缓存旧值
  get oldFormData1() {
    return JSON.parse(JSON.stringify(this.formData));
  }

  @Watch('oldFormData1', { immediate: true, deep: true })
  watchOldFormData(newValue: any, oldValue: any): void {
    this.oldFormData2 = cloneDeep(oldValue);
  }

  @Watch('formData', { immediate: true, deep: true })
  watchFormDataProp(newValue: any, oldValue: any): void {
    console.log('formData变化了', oldValue, newValue, this.formDataProp);
  }

  //找到对应key的数据
  loopBack(key: string, list: any): any {
    for (let i = 0; i < list.length; i++) {
      const objKeys = Object.keys(list[i].elements);
      for (let j = 0; j < objKeys.length; j++) {
        // console.log(objKeys[j], key);
        if (objKeys[j] === key) {
          return { data: list[i]['elements'][key], panelsIndex: i };
        }
      }
    }
  }

  validateItem(ref: string, formItem: string) {
    console.log(ref, formItem, this.$refs[ref]);
    (this.$refs[ref] as any)[0].validateField(formItem);
  }

  //判断rule规则
  ruleJudge(type: string, rule: any) {
    if (type === 'bool') {
      // console.log(rule, this.formData);
      // const ast = parse(rule);
      // const evalStatus = newEval(ast, this.formData);
      // if (evalStatus) return true;
      // return false;
      return eval(rule);
    }
    return true;
  }

  change(ruleList: RuleListProps, paramName: string) {
    return (rule: any, value: any, callback: any) => {
      ruleList.rules.forEach((ruleItem: any, index: any) => {
        const ruleStatus = this.ruleJudge('bool', ruleItem.rule);
        // console.log(ruleItem, ruleList, 123, paramName, this.formData[paramName], this.oldFormData2[paramName]);
        //当满足bool条件，dialog提示
        //this.type === 'Edit',编辑的时候执行，新增的时候值为空不需要判断
        //!this.isRunValidate，执行form的validate方法时不需要执行校验
        if (
          ruleItem.dialogMessage &&
          ruleStatus &&
          !this.dialogVisible &&
          this.type === 'Edit' &&
          !this.isRunValidate
        ) {
          this.dialogMes = ruleItem.dialogMessage;
          this.dialogTitle = ruleItem.dialogTitle;
          this.dialogVisible = true;
        } else {
          this.dialogVisible = false;
        }
        if (ruleItem.actions) {
          //当条件符合规则，将数据替换，或者添加
          if (ruleItem.ruleType === 'bool' && ruleStatus) {
            ruleItem.actions.forEach((action: any) => {
              //添加变量
              Object.keys(action.list).forEach((actionVal: any) => {
                this.$set(
                  this.loopBack(action.changeKey, this.formList.panels).data,
                  actionVal,
                  action.list[actionVal]
                );
              });
              this.setData();
            });
          }
          //当条件不符合规则，将数据还原
          if (ruleItem.ruleType === 'bool' && !ruleStatus) {
            ruleItem.actions.forEach((action: any) => {
              let { data, panelsIndex } = this.loopBack(action.changeKey, this.formList.panels);
              this.formList.panels[panelsIndex].elements[action.changeKey] = data.defaultList;
            });
            this.setData('init-defaultList');
          }
        }
        // if (ruleItem.ruleType === 'changeFormData' && eval(ruleItem.rule)) {
        //   this.formData[ruleItem.changeKey] = ruleItem.changeVal;
        // }
      });
      callback();
    };
  }

  handleBlur(ruleList: RuleListProps) {
    return (rule: any, value: any, callback: any) => {
      ruleList.rules.forEach((ruleItem: any) => {
        if (ruleItem.ruleType === 'reg') {
          console.log(
            ruleItem.rule,
            new RegExp(ruleItem.rule),
            new RegExp(String.raw`${ruleItem.rule}`),
            new RegExp(String.raw`${ruleItem.rule}`).test(value),
            value,
            45
          );
          if (new RegExp(String.raw`${ruleItem.rule}`).test(value)) {
            callback();
          } else {
            callback(new Error(ruleItem.ruleMessage));
          }
        } else if (ruleItem.ruleType === 'regNum') {
          console.log(parseInt(value), 852);
          if (new RegExp(ruleItem.rule).test(parseInt(value) as any)) {
            callback();
          } else {
            callback(new Error(ruleItem.ruleMessage));
          }
        } else if (ruleItem.ruleType === 'bool') {
          const ruleStatus = this.ruleJudge('bool', ruleItem.rule);
          //当满足bool条件，dialog提示
          //!this.isRunValidate，执行form的validate方法时不需要执行校验
          if (ruleItem.dialogMessage && ruleStatus) {
            this.dialogMes = ruleItem.dialogMessage;
            this.dialogTitle = ruleItem.dialogTitle;
            this.dialogVisible = true;
          } else {
            this.dialogVisible = false;
          }
        }
        callback();
      });
    };
  }

  setData(type?: string) {
    console.log(cloneDeep(this.formList), 123);
    !isEmpty(this.formList) &&
      this.formList.panels.forEach((valP: any) => {
        Object.keys(valP.elements).forEach((valC: any) => {
          // this.rules[valC] = [];
          this.$set(this.rules, valC, []);
          if (type === 'init') {
            if (this.formDataProp[valC] || this.formDataProp[valC] === 0) {
              //编辑返回的默认值
              this.$set(this.formData, valC, this.formDataProp[valC]);
            } else if (!isEmpty(valP.elements[valC].defaultValue) || valP.elements[valC].defaultValue) {
              //设置表单默认值
              this.$set(this.formData, valC, valP.elements[valC].defaultValue);
            } else if (!this.formDataProp.hasOwnProperty.call(valC)) {
              this.$set(this.formData, valC, '');
            }
            //获取放在外面的值
            if (valP.elements[valC]['paramsInOut']) {
              this.$set(this.outFormData, valC, '');
            }
            //保存初始数据
            if (!valP.elements[valC]['defaultList']) {
              this.$set(valP.elements[valC], 'defaultList', cloneDeep(valP.elements[valC]));
            }
            //通过接口获取options的值
            if (valP.elements[valC]['options']) {
              if (valP.elements[valC]['options'].constructor === Object) {
                commonRequest(valP.elements[valC]['options'].api, valP.elements[valC]['options'].method).then((res) => {
                  // valP.elements[valC]['options'] = [{ label: 1, value: 1 }];
                  valP.elements[valC]['options'] = res.data;
                });
              }
            }
          } else if (type === 'init-defaultList') {
            //还原列表默认值,保存初始数据
            if (!valP.elements[valC]['defaultList']) {
              this.$set(valP.elements[valC], 'defaultList', cloneDeep(valP.elements[valC]));
            }
          }
          // 必填校验
          if (valP.elements[valC].required) {
            // this.rules[valC].push({
            //   required: true,
            //   message: valP.elements[valC].requiredMessage,
            //   trigger: 'blur'
            // });
            this.$set(this.rules, valC, [
              ...this.rules[valC],
              {
                required: true,
                message: valP.elements[valC].requiredMessage,
                trigger: 'blur'
              }
            ]);
          }
          // 规则校验
          if (valP.elements[valC].methods) {
            valP.elements[valC].methods.forEach((actionsVal: any) => {
              if (actionsVal.methodType === 'change') {
                // this.rules[valC].push({
                //   trigger: 'change',
                //   validator: this.change(actionsVal)
                // });
                this.$set(this.rules, valC, [
                  ...this.rules[valC],
                  {
                    trigger: 'change',
                    validator: this.change(actionsVal, valC)
                  }
                ]);
              }
              if (actionsVal.methodType === 'blur') {
                // this.rules[valC].push({
                //   trigger: 'blur',
                //   validator: this.blur(actionsVal)
                // });
                this.$set(this.rules, valC, [
                  ...this.rules[valC],
                  {
                    trigger: 'blur',
                    validator: this.handleBlur(actionsVal)
                  }
                ]);
              }
            });
          }
        });
      });
    this.$forceUpdate();
    this.$emit('getOutFormData', this.outFormData);
    console.log(this.rules, 5213, this.formList, this.formData, this.outFormData);
  }

  //回调信息
  emitInfo(info: any) {
    this.$emit('emitInfo', info);
  }

  //父组件：校验调用
  validate() {
    let data = this.formListProp.panels.every((val: any, index: any) => {
      let status = false;
      this.isRunValidate = true;
      (this.$refs[`customRef_${index}`] as any)[0].validate((valid: any) => {
        if (valid) {
          status = true;
          return true;
        } else {
          return false;
        }
      });
      this.isRunValidate = false;
      return status;
    });
    if (data) {
      return this.formData;
    }
    return data;
  }

  cancelDialog() {
    this.formData = cloneDeep(this.oldFormData2);
    this.dialogVisible = false;
  }
}
</script>

<style lang="scss" scoped>
@import './index.module.scss';
</style>
