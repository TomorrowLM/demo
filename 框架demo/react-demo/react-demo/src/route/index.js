import Store from "../view/Store.jsx";
import Communicate from "../components/content/Communicate.jsx";
import OnRef from "../components/content/OnRef.jsx";
import Dashboard from "../view/Dashboard"
export const routes = [
  {
    path: "Dashboard",
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
];
