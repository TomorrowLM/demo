import React, { useEffect, useState } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
// import * as Icon from '@ant-design/icons';
export const MyIcon = createFromIconfontCN({
  scriptUrl: require('@/assets/iconfont/iconfont.js'), // 在 iconfont.cn 上生成
});

export const MinusIcon =(props:any)=> <MyIcon {...props} type="icon-shanchuxiang" />//删除
export const PlusIcon =(props:any)=> <MyIcon {...props} type="icon-zengjiaxiang" />//新增 
export const CopyIcon =(props:any)=> <MyIcon {...props} type="icon-fuzhi" />//复制