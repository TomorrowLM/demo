/**
 * 
 * 是否是PC端
 */
export const IsPC = () => {
  var userAgentInfo = navigator.userAgent;
  var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
  }
  return flag;
}

import { matchPath, Router } from "react-router"
// 实现react-router-config里的matchRoutes方法
export function matchRoutes(routes, pathname, /*not public API*/ branch = []) {

  routes.some(route => {
    console.log(pathname, matchPath(pathname, route));
    const match = route.path
      ? matchPath(pathname, route)
      : branch.length
        ? branch[branch.length - 1].match // use parent match
        : Router.computeRootMatch(pathname); // use default "root" match

    if (match) {
      branch.push({ route, match });

      if (route.children) {
        matchRoutes(route.children, pathname, branch);
      }
    }
    return match;
  });
  return branch;
}