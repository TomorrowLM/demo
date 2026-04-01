// 工具函数：递归查找指定 path 的路由对象
export function findRouteByPath(routes, path) {
  for (const route of routes) {
    if (route.path === path) return route;
    if (route.children) {
      const found = findRouteByPath(route.children, path);
      if (found) return found;
    }
  }
  return null;
}
