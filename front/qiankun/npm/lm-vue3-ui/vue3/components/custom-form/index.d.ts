enum ComType {
  'input',
  'textarea',
  'input-number',
  'input-suffix', //带有后缀的input
  'select',
  'Right',
  'radio',
  'slot-point',
  'slot-expression'
}
enum MethodType {
  'required',

}
enum TriggerType {
  'change',
  'blur'
}
// enum RuleType {
//   'reg', //正则判断
//   'bool' //逻辑判断,通过js-eval去执行
// }
// enum ActionsType {
//   'add' //字段新增
// }

export interface RuleListProps {
  methodType: MethodType; //事件规则: required
  message: string,//提示信息
  trigger: string,//触发形式
  validator: (rule: any, value: any, callback: any) => any,//校验规则函数
}

export interface CustomFormProps {
  title: string;
  description: string;
  elements: Array<{
    prop: string; //表单项参数
    type: ComType; //组件类型
    label: string;
    description: string;
    width?: string;
    disabled?: boolean;
    labelWidth?: string;
    options?: Array<{ label: string; value: any }> | { api: string; method: string }; //选项：select,radio,checkbox。string类型为请求的url
    methods: Array<RuleListProps>;
  }>
}

interface StyleConfigProps {
  labelPosition: string,
  minWidth: string
}

export interface TemplateProps {
  panels: Array<CustomFormProps>;
  styleConfig: StyleConfigProps;
}
