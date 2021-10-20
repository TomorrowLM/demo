import Store from "../view/Store/Store";
import Communicate from "../view/Communicate/Communicate";
import OnRef from "../view/Dom/OnRef";
import Dashboard from "../view/DashBoard/Dashboard"
import FindDomDode from "../view/Dom/FindDomDode"
import Ref from "../view/Dom/Ref";
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
];
