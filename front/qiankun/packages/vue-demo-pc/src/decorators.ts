import { PropSync as RawPropSync } from 'vue-property-decorator';

// 宽松类型的 PropSync，避免 TS 对装饰器签名的严格检查
export const PropSync: any = RawPropSync;
