export interface TreeTag {
  name: string; // 标签文本
  bg?: string; // 标签背景色
  color?: string; // 标签文字颜色
  borderColor?: string; // 标签边框颜色
}

export interface TreeNode {
  name: string | Array<{ name: string; tip?: string; tag?: TreeTag[] }>; // 展示名称，支持多行
  tip?: string; // 节点提示文案
  fontSize?: number; // 文字字号
  symbolSize?: [number, number]; // 期望的宽高
  bg?: string; // 节点背景色
  color?: string; // 节点文字颜色
  tag?: TreeTag[]; // 节点级别标签
  children?: TreeNode[]; // 子节点
  _id?: string; // 内部使用的唯一 id
}
