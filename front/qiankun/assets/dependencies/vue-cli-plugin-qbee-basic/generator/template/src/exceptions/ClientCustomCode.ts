/* tslint:disable */

export const ClientErrorCode = {
  ILLEGAL_WORKBENCH_WIDGET_TYPE: 'C101',
  ILLEGAL_WEBPAGE_WIDGET_TYPE: 'C102',
  VALIDATE_SETTINGS_ERROR: 'C103',
};
export const ClientErrorMessage = {
  [ClientErrorCode.ILLEGAL_WORKBENCH_WIDGET_TYPE]: {
    zh: '工作台首页不支持“顶部功能菜单”和“底部菜单”组件',
    en: '工作台首页不支持“顶部功能菜单”和“底部菜单”组件',
  },
  [ClientErrorCode.ILLEGAL_WEBPAGE_WIDGET_TYPE]: {
    zh: '网页发布方式暂不支持“告警消息”组件',
    en: '网页发布方式暂不支持“告警消息”组件',
  },
  [ClientErrorCode.VALIDATE_SETTINGS_ERROR]: {
    zh: '设置项有误或不完整，请检查右侧面板',
    en: '设置项有误或不完整，请检查右侧面板',
  },
};
