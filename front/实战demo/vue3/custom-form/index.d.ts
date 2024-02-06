enum ComType {
  'input',
  'textarea',
  'input-number',
  'input-suffix', //带有后缀的input
  'select',
  'Right',
  'radio'
}
enum MethodType {
  'change',
  'blur'
}
enum RuleType {
  'reg', //正则判断
  'bool' //逻辑判断,通过js-eval去执行
}
enum ActionsType {
  'add' //字段新增
}

export interface RuleListProps {
  methodType: MethodType; //事件规则
  rules: Array<{
    rule: string; //规则
    ruleType: RuleType; //规则类型
    ruleMessage?: string;
    dialogTitle?: string;
    dialogMessage?: string;
    actions: Array<{
      actionType: ActionsType; //操作的类型
      changeKey: string;
      list: Array<any>;
      [propName: string]: any;
    }>;
    options?: Array<any>;
  }>;
}

export interface CustomFormProps {
  title: string;
  description: string;
  elements: {
    [propName: string]: {
      type: ComType; //组件类型
      label: string;
      description: string;
      width?: string;
      labelWidth?: string;
      unit?: string; //后缀的单位
      required?: boolean; //必填
      requiredMessage?: string; //未填信息
      options?: Array<{ label: string; value: any }> | { api: string; method: string }; //选项：select,radio,checkbox。string类型为请求的url
      maxlength: number; //字数
      methods: Array<RuleListProps>;
      paramsInOut: boolean; //参数的放置位置，true为参数放在外部上，false参数放在config
    };
  };
}

export interface TemplateProps {
  panels: Array<CustomFormProps>;
}
