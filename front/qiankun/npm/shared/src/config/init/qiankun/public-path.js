/*
 * 统一控制微前端子应用的资源加载路径
 * - 导出可复用函数供其他场景调用
 * - 默认执行一次，保证副作用与旧实现一致
 */
export function applyQiankunPublicPath(customPublicPath) {
  const injectedPath =
    customPublicPath ||
    (typeof window !== 'undefined' ? window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ : undefined);

  if (typeof injectedPath === 'string' && injectedPath.length > 0) {
    __webpack_public_path__ = injectedPath;
    return injectedPath;
  }

  if (typeof window !== 'undefined' && window.__POWERED_BY_QIANKUN__) {
    console.warn('[qiankun] 未获取到 __INJECTED_PUBLIC_PATH_BY_QIANKUN__，资源路径可能异常');
  }

  return undefined;
}
