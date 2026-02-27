import type * as React from 'react'

// 覆盖/补充 antd 中 Card 的类型，让 TS 认为它是一个标准的 React 组件
declare module 'antd' {
  // 简化为通用函数组件类型：返回 JSX.Element | null
  // 这样就不会再触发 “返回类型 ReactNode 不是有效 JSX 元素” 的校验错误
  // 如果后面需要精确的 props 类型，可以再细化这里的 any
  // export const Card: React.FC<any>
}
