import {
  qiankunWindow,
} from 'vite-plugin-qiankun/dist/helper'
console.log(qiankunWindow.__POWERED_BY_QIANKUN__, 132)
if (qiankunWindow.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = qiankunWindow.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}