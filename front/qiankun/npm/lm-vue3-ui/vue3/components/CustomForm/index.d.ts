export const DatePickerType = [
  'year',
  'month',
  'date',
  'datetime',
  'week',
  'datetimerange',
  'daterange'
];

enum DatePickerTypeEnum {
  'year',
  'month',
  'date',
  'datetime',
  'week',
  'datetimerange',
  'daterange'
}

enum ComType {
  'input',
  'textarea',
  'input-number',
  'input-suffix', //带有后缀的input
  'select',
  'select-group',
  'Right',
  'radio',
  'DateTimePicker'
}
enum MethodType {
  'required'
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
  message: string; //提示信息
  trigger: string; //触发形式
  notValidate: boolean; //是否不校验
  validator: (rule: any, value: any, callback: any, info: Info) => any; //校验规则函数
}

export interface CustomFormProps {
  title?: string;
  description?: string;
  labelWidth?: string;
  elements?: Array<ElementProps>;
}
interface Info {
  renderItem: any;
  changeItem?: any; //修改下拉框的值，主要为了获取label
  changeValue?: any; //修改某一项的值
  isInit?:boolean; //是否在初始化是执行link
}
interface SelectProps {
  filterable: boolean;
  multiple: boolean;
  fetch: Function
}
export interface ElementProps extends SelectProps {
  prop: string; //表单项参数
  type: ComType | DatePickerTypeEnum | string; //组件类型
  label: string;
  description?: string;
  width?: string;
  isRender?: boolean; //是否渲染完成，主要用于在进入编辑页面时联动表单项的渲染时机
  disabled?: boolean;
  labelWidth?: string;
  placeholder?: string;
  optionProp?: {
    label: string;
    value: string;
  };
  style?: {}; // 样式
  //选项：select,radio,checkbox。string类型为请求的url
  options?:
    | Array<{ label: string; value: any }>
    | { api: string; method: string };
  validators?: Array<RuleListProps>;
  link?: {
    //联动，主要用于联动其他表单项
    visible: () => boolean;
    change: (Info) => void;
  };
  init: () => void; //初始化数据
  notInit?: boolean; //是否初始化过数据
}

interface StyleConfigProps {
  labelPosition?: string;
  minWidth?: string;
  marginBottom?: string;
}

export interface TemplateProps {
  panels: Array<CustomFormProps>;
  styleConfig: StyleConfigProps;
}
