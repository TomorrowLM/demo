import Store from "../view/Store/Store";
import Communicate from "../view/Communicate/Communicate";
import OnRef from "../view/Dom/OnRef";
import Dashboard from "../view/DashBoard/Dashboard"
import FindDomDode from "../view/Dom/FindDomDode"
import Ref from "../view/Dom/Ref";
import ClassHooks from "../view/Hooks/ClassHooks";
import FunctionHooks from "../view/Hooks/FunctionHooks";
import ReactSortable from "../view/ReactSortable"
import Router from "../view/Router"
import Second from "../view/Router/second";
import AHooks from "../view/ahooks";
import Hox from "../view/Store/Hox";
export const routes = [
  {
    path: "dashboard",
    component: Dashboard,
    exact: true,
  },
  {
    path: "store",
    component: Store,
    exact: true,
  },
  {
    path: "hox",
    component: Hox,
    exact: true,
  },
  {
    path: "communicate",
    component: Communicate,
    exact: true,
  },
  {
    path: "onRef",
    component: OnRef,
    exact: true,
  },
  {
    path: "findDomDode",
    component: FindDomDode,
    exact: true,
  },
  {
    path: "ref",
    component: Ref,
    exact: true,
  },
  {
    path: "classHooks",
    component: ClassHooks,
    exact: true,
  },
  {
    path: "functionHooks",
    component: FunctionHooks,
    exact: true,
  },
  {
    path: "ahooks",
    component: AHooks,
    exact: true,
  },
  {
    path: "reactSortable",
    component: ReactSortable,
    exact: true,
  },
  {
    path: "router",
    component: Router,
    exact: false,
  },
  // {
  //   path: "authority",
  //   component: Authority,
  //   exact: false,
  //   authority: admin
  // }
];
